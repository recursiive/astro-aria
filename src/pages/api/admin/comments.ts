import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import { validateAdminSession } from '../../../utils/adminAuth';

export const prerender = false;

function getRedisClient() {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function getRawComments(redis: Redis, slug: string): Promise<unknown[]> {
  return redis.lrange(`post:comments:${slug}`, 0, -1);
}

function parseComments(raw: unknown[]): Record<string, unknown>[] {
  return raw
    .map((c) => {
      try {
        return typeof c === 'string' ? JSON.parse(c) : (c as Record<string, unknown>);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Record<string, unknown>[];
}

// GET /api/admin/comments?slug=<slug>
// Returns all comments for a post (admin view, includes full content)
export const GET: APIRoute = async ({ url, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await validateAdminSession(token))) return unauthorized();

  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const redis = getRedisClient();
  if (!redis) {
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const comments = parseComments(await getRawComments(redis, slug)).sort(
    (a, b) => (a.timestamp as number) - (b.timestamp as number),
  );

  return new Response(JSON.stringify({ comments }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

// DELETE /api/admin/comments  body: { slug, commentId }
export const DELETE: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await validateAdminSession(token))) return unauthorized();

  let slug: string;
  let commentId: string;
  try {
    ({ slug, commentId } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!slug || !commentId) {
    return new Response(JSON.stringify({ error: 'slug and commentId are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const redis = getRedisClient();
  if (!redis) {
    return new Response(JSON.stringify({ error: 'Redis not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = `post:comments:${slug}`;
  const all = parseComments(await getRawComments(redis, slug));
  const remaining = all.filter((c) => c.id !== commentId);

  if (remaining.length === all.length) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Atomically rewrite the list
  await redis.del(key);
  if (remaining.length > 0) {
    await redis.rpush(key, ...remaining.map((c) => JSON.stringify(c)));
  }

  return new Response(JSON.stringify({ success: true, remaining: remaining.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
