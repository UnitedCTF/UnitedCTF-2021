import * as redis from "redis";

export const exists = async (
  client: redis.RedisClient,
  ...p: any[]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.exists(...p, (err: Error, reply: number) => {
      if (err) reject(err);
      else resolve(!!reply);
    });
  });
};
