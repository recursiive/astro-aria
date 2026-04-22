import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

function getRedisClient() {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const ADJECTIVES = [
  'Silent', 'Swift', 'Bold', 'Brave', 'Calm', 'Dark', 'Fierce', 'Gentle',
  'Hidden', 'Keen', 'Lone', 'Mystic', 'Noble', 'Quiet', 'Rapid', 'Sharp',
  'Sleek', 'Sly', 'Smart', 'Covert', 'Wise', 'Ancient', 'Cyber', 'Digital',
  'Phantom', 'Shadow', 'Midnight', 'Crimson', 'Azure', 'Neon', 'Rogue', 'Stealth',
];

const NOUNS = [
  'Fox', 'Wolf', 'Hawk', 'Bear', 'Owl', 'Raven', 'Lynx', 'Viper',
  'Eagle', 'Cobra', 'Falcon', 'Jaguar', 'Panther', 'Puma', 'Tiger',
  'Badger', 'Ferret', 'Mink', 'Otter', 'Raccoon', 'Cipher', 'Hacker',
  'Wizard', 'Ghost', 'Specter', 'Agent', 'Scout', 'Ranger', 'Warden',
];

function generateUsername(seed: string): string {
  const hash = createHash('md5').update(seed).digest('hex');
  const adjIndex = parseInt(hash.substring(0, 4), 16) % ADJECTIVES.length;
  const nounIndex = parseInt(hash.substring(4, 8), 16) % NOUNS.length;
  const suffix = parseInt(hash.substring(8, 10), 16) % 100;
  return `${ADJECTIVES[adjIndex]}${NOUNS[nounIndex]}${suffix < 10 ? '0' + suffix : suffix}`;
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'aria-comments-salt').digest('hex').substring(0, 16);
}

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return new Response(JSON.stringify({ comments: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = url.searchParams.get('slug');
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawComments = await redis.lrange(`post:comments:${slug}`, 0, -1);
    const comments = rawComments
      .map((c: unknown) => {
        try {
          return typeof c === 'string' ? JSON.parse(c) : c;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: { timestamp: number }, b: { timestamp: number }) => a.timestamp - b.timestamp);

    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return new Response(JSON.stringify({ error: 'Redis not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { slug, content } = body;

    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Comment content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize: strip HTML tags, trim, cap length
    const sanitized = content.replace(/<[^>]*>/g, '').trim().substring(0, 1000);
    if (sanitized.length < 3) {
      return new Response(JSON.stringify({ error: 'Comment is too short (min 3 characters)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting: 5 comments per IP per day
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const hashedIp = hashIp(clientIp);
    const today = new Date().toISOString().split('T')[0];
    const rateLimitKey = `comment:ratelimit:${hashedIp}:${today}`;

    const count = await redis.incr(rateLimitKey);
    if (count === 1) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const ttl = Math.floor((tomorrow.getTime() - Date.now()) / 1000);
      await redis.expire(rateLimitKey, ttl);
    }
    if (count > 5) {
      return new Response(
        JSON.stringify({ error: 'Too many comments today. Please try again tomorrow.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Generate a unique anonymous identity per comment
    const identitySeed = `${hashedIp}-${Date.now()}-${Math.random()}`;
    const username = generateUsername(identitySeed);
    const avatarSeed = createHash('md5').update(identitySeed).digest('hex').substring(0, 12);

    const comment = {
      id: crypto.randomUUID(),
      username,
      avatarSeed,
      content: sanitized,
      timestamp: Date.now(),
    };

    await redis.rpush(`post:comments:${slug}`, JSON.stringify(comment));

    return new Response(JSON.stringify({ success: true, comment }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error posting comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to post comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
