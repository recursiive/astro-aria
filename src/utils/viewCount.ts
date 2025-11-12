/**
 * Utility function to fetch view count for a blog post
 * This can be used in server-side components or API routes
 */
export async function getViewCount(slug: string): Promise<number> {
  try {
    // In production, fetch from the API
    if (typeof window === 'undefined') {
      // Server-side: use Upstash Redis directly
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({
        url: import.meta.env.UPSTASH_REDIS_REST_URL,
        token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
      });
      
      const views = await redis.get(`post:views:${slug}`);
      return Number(views) || 0;
    } else {
      // Client-side: fetch from API
      const response = await fetch(`/api/track-view?slug=${encodeURIComponent(slug)}`);
      const data = await response.json();
      return data.views || 0;
    }
  } catch (error) {
    console.error('Error fetching view count:', error);
    return 0;
  }
}

