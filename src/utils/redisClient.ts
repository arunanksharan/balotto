import { Redis } from "@upstash/redis"

export const redisClient = new Redis({
  url: process.env.REDIS_URL as string,
  token: process.env.REDIS_TOKEN as string,
})
