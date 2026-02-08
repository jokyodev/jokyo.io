import { redis } from "./redis";

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  getter: () => Promise<T>,
): Promise<T> {
  const cached = (await redis.get(key)) as string | null;

  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch (err) {
      // cache bẩn -> xoá
      await redis.del(key);
    }
  }

  const fresh = await getter();
  await redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds });

  return fresh;
}
