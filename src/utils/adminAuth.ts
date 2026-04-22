import { Redis } from '@upstash/redis';

function getRedisClient() {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function validateAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || token.length < 10) return false;
  const redis = getRedisClient();
  if (!redis) return false;
  try {
    const value = await redis.get(`admin:session:${token}`);
    // Upstash may deserialize the stored value as number 1 or string '1' — just check existence
    return value !== null && value !== undefined;
  } catch {
    return false;
  }
}

export async function createAdminSession(token: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) throw new Error('Redis not configured');
  await redis.setex(`admin:session:${token}`, 86400, '1'); // 24 h TTL
}

export async function destroyAdminSession(token: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  await redis.del(`admin:session:${token}`);
}
