
import IORedis, { Redis } from "ioredis";

class ClientRedis {
  private static instance: Redis | null = null;

  constructor() {
    throw new Error("Use ClientRedis.getInstance()");
  }

  static getInstance(): Redis {
    if (!ClientRedis.instance) {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        throw new Error("REDIS_URL is not configured");
      }

      ClientRedis.instance = new IORedis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          return Math.min(times * 500, 5000);
        },
      });

      ClientRedis.instance.on("connect", () => {
        console.log("[Redis] Connected successfully");
      });

      ClientRedis.instance.on("error", (error) => {
        console.error("[Redis] Connection error:", error.message);
      });
    }

    return ClientRedis.instance;
  }
}

export default ClientRedis.getInstance();
