import "dotenv/config"
import { IPFSService } from "../src/services/ipfs.service"

const service = new IPFSService()

async function testIPFS() {
  console.log("Testing IPFS service...")

  const testReport = {
    reportId:   "test-report-123",
    propertyId: "test-property-123",
    address:    "123 MG Road, Bangalore",
    findings: [
      {
        issue:       "Water damage",
        location:    "Bedroom ceiling",
        confidence:  0.95,
        severity:    "high",
        description: "Visible water staining on ceiling",
      },
    ],
    aiConfidence: 0.95,
    mismatchFlag: false,
    timestamp:    new Date().toISOString(),
  }

  const cid = await service.pinReport(testReport)

  console.log("✓ Report pinned to IPFS")
  console.log("✓ CID:", cid)
  console.log("✓ View at:", `https://gateway.pinata.cloud/ipfs/${cid}`)

  console.log("\n✅ IPFS service working perfectly")
}

testIPFS().catch(console.error)