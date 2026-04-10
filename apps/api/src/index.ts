import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import dotenv from "dotenv"
dotenv.config()
import { propertyRoute } from "./routes/property.route"
import { reportRoute }   from "./routes/report.route"
import { ownerRoute }    from "./routes/owner.route"
import "./workers/ai-analysis.worker"
import "./workers/chain-anchor.worker"
const app = new Hono()

app.use("*", logger())
app.use("*", cors({
  origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
}))

app.get("/health", (c) => c.json({ status: "ok" }))

app.route("/api/properties", propertyRoute)
app.route("/api/reports",    reportRoute)
app.route("/api/owner",      ownerRoute)

export default {
  port:  3001,
  fetch: app.fetch,
}