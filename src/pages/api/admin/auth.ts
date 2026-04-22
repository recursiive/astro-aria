import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'crypto';
import { createAdminSession, destroyAdminSession } from '../../../utils/adminAuth';

export const prerender = false;

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function sessionCookie(token: string, maxAge: number, isProduction: boolean): string {
  const parts = [
    `admin_session=${token}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${maxAge}`,
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

// POST — log in
export const POST: APIRoute = async ({ request }) => {
  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response(JSON.stringify({ error: 'Admin access not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let password: string;
  try {
    ({ password } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!password || !safeCompare(password, adminPassword)) {
    // Fixed-time delay to frustrate brute-force
    await new Promise((r) => setTimeout(r, 500));
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = crypto.randomUUID();
  try {
    await createAdminSession(token);
  } catch {
    return new Response(JSON.stringify({ error: 'Session store unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isProduction = import.meta.env.PROD;
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': sessionCookie(token, 86400, isProduction),
    },
  });
};

// DELETE — log out
export const DELETE: APIRoute = async ({ cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (token) {
    await destroyAdminSession(token).catch(() => {});
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
};
