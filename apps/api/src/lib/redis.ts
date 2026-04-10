import dotenv from "dotenv";
dotenv.config();
import { Redis } from "ioredis"

console.log("Connecting to Redis with URL:", process.env.UPSTASH_REDIS_URL)
console.log("Using Redis token:", process.env.UPSTASH_REDIS_TOKEN ? "Yes" : "No")

export const redis = new Redis(process.env.UPSTASH_REDIS_URL!, {
  password: process.env.UPSTASH_REDIS_TOKEN,
  maxRetriesPerRequest: null,
  tls: { rejectUnauthorized: false },
})