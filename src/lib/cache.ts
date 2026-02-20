import { redis } from "./redis";

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  getter: () => Promise<T>,
): Promise<T> {
  const cached = (await redis.get(key)) as string | null;

  if (cached) {
    try {
      // Redis đôi khi trả về chuỗi "null" nếu trước đó lỡ set null
      if (cached === "null") {
        await redis.del(key);
      } else {
        return JSON.parse(cached) as T;
      }
    } catch (err) {
      await redis.del(key);
    }
  }

  const fresh = await getter();

  // CHỐT CHẶN: Chỉ set cache nếu dữ liệu tồn tại
  if (fresh !== null && fresh !== undefined) {
    await redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds });
  }

  return fresh;
}
