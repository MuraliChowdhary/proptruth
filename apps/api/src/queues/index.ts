import { Queue } from "bullmq"
import { redis } from "../lib/redis"

export const aiQueue = new Queue("ai-analysis", {
  connection: redis,
})

export const chainQueue = new Queue("chain-anchor", {
  connection: redis,
})