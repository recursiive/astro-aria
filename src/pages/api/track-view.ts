import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

// Initialize Redis client (only if credentials are available)
function getRedisClient() {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return null;
  }
  
  return new Redis({
    url,
    token,
  });
}

export const prerender = false; // This endpoint must run on the server

export const POST: APIRoute = async ({ request }) => {
  try {
    const redis = getRedisClient();
    
    if (!redis) {
      return new Response(
        JSON.stringify({ error: 'Redis not configured', views: 0 }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { slug } = await request.json();

    if (!slug || typeof slug !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid slug' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for basic duplicate detection (optional)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Create a unique key for this view (IP + slug + date)
    const today = new Date().toISOString().split('T')[0];
    const viewKey = `view:${slug}:${clientIp}:${today}`;

    // Check if this view was already recorded today (prevent duplicate counts)
    const alreadyViewed = await redis.get(viewKey);
    
    if (!alreadyViewed) {
      // Mark as viewed (expires at end of day)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const ttl = Math.floor((tomorrow.getTime() - Date.now()) / 1000);
      
      await redis.setex(viewKey, ttl, '1');
      
      // Increment total view count for this post
      await redis.incr(`post:views:${slug}`);
    }

    // Get current view count
    const views = await redis.get(`post:views:${slug}`) || 0;

    return new Response(
      JSON.stringify({ 
        success: true, 
        views: Number(views),
        isNewView: !alreadyViewed 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  } catch (error) {
    console.error('Error tracking view:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to track view', views: 0 }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET endpoint to retrieve view count without tracking
export const GET: APIRoute = async ({ url }) => {
  try {
    const redis = getRedisClient();
    
    if (!redis) {
      return new Response(
        JSON.stringify({ views: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug parameter required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const views = await redis.get(`post:views:${slug}`) || 0;

    return new Response(
      JSON.stringify({ views: Number(views) }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // Cache for 1 minute
        } 
      }
    );
  } catch (error) {
    console.error('Error getting view count:', error);
    return new Response(
      JSON.stringify({ views: 0 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

