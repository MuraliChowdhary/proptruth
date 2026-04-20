import "dotenv/config"
import { prisma as db} from "@proptruth/db"
import { ReportService } from "../src/services/report.service"
import { aiQueue, chainQueue } from "../src/queues"
import { aiWorker } from "../src/workers/ai-analysis.worker"
import { chainWorker } from "../src/workers/chain-anchor.worker"

const reportService = new ReportService()

async function testFullFlow() {
  console.log("=== Full End to End Flow Test ===\n")

  // Step 1 — Create test user
  console.log("1. Creating test user...")
  const user = await db.user.create({
    data: {
      clerkId: "test_flow_clerk_001",
      name:    "Arjun Sharma",
      email:   "arjun@flowtest.dev",
      role:    "TENANT",
    },
  })
  console.log("✓ User:", user.id)

  // Step 2 — Create test property
  console.log("\n2. Creating test property...")
  const property = await db.property.create({
    data: {
      googlePlaceId: "test_flow_place_001",
      address:       "123 MG Road, Bangalore, Karnataka 560001",
      city:          "Bangalore",
      state:         "Karnataka",
      pincode:       "560001",
    },
  })
  console.log("✓ Property:", property.id)

  // Step 3 — Submit report
  console.log("\n3. Submitting report...")
  const report = await reportService.createReport(user.id, {
    propertyId:   property.id,
    moveInDate:   "2024-01-01T00:00:00.000Z",
    moveOutDate:  "2024-12-01T00:00:00.000Z",
    agreementUrl: "https://example.com/agreement.pdf",
    tenantNotes:  "Water stains visible on bedroom ceiling",
    photoUrls: [
      "https://res.cloudinary.com/dwvo1c5xo/image/upload/v1775814967/water_damage_bmgudd.jpg"
     ],
  })
  console.log("✓ Report created:", report.id)
  console.log("✓ Status:", report.aiStatus)
  console.log("✓ Publish at:", report.publishAt)

  // Step 4 — Wait for AI worker to process
  console.log("\n4. Waiting for AI analysis...")
  console.log("(This may take 20-30 seconds)")

  await new Promise<void>((resolve) => {
    aiWorker.on("completed", async (job) => {
      if (job.data.reportId === report.id) {
        const updated = await db.report.findUnique({
          where: { id: report.id },
        })
        console.log("✓ AI Status:", updated?.aiStatus)
        console.log("✓ AI Confidence:", updated?.aiConfidence)
        console.log("✓ Mismatch Flag:", updated?.aiMismatchFlag)
        resolve()
      }
    })
  })

  // Step 5 — Wait for chain worker to anchor
  console.log("\n5. Waiting for blockchain anchoring...")
  console.log("(This may take 30-60 seconds)")

  await new Promise<void>((resolve) => {
    chainWorker.on("completed", async (job) => {
      if (job.data.reportId === report.id) {
        const anchored = await db.report.findUnique({
          where: { id: report.id },
        })
        console.log("✓ Anchor Status:", anchored?.anchorStatus)
        console.log("✓ IPFS CID:", anchored?.ipfsCid)
        console.log("✓ TX Hash:", anchored?.txHash)
        console.log(
          "✓ Etherscan:",
          `https://sepolia.etherscan.io/tx/${anchored?.txHash}`
        )
        resolve()
      }
    })
  })

  // Step 6 — Check PropScore updated
  console.log("\n6. Checking PropScore...")
  const scored = await db.property.findUnique({
    where: { id: property.id },
  })
  console.log("✓ PropScore:", scored?.propScore)
  console.log("✓ Report Count:", scored?.reportCount)

  // Step 7 — Cleanup
  console.log("\n7. Cleaning up test data...")
  await db.report.delete({ where: { id: report.id } })
  await db.property.delete({ where: { id: property.id } })
  await db.user.delete({ where: { id: user.id } })
  console.log("✓ Cleanup done")

  console.log("\n=== ✅ Full flow working perfectly ===")
  process.exit(0)
}

testFullFlow().catch((err) => {
  console.error("❌ Flow failed:", err.message)
  process.exit(1)
})