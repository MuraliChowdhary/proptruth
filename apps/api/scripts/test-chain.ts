import "dotenv/config"
import { ChainService } from "../src/services/chain.service"

const service = new ChainService()

async function testChain() {
  console.log("Testing Chain service...")
  console.log("Sending real transaction to Sepolia...")
  console.log("(This may take 20-30 seconds)\n")

  const testAddress  = "123 MG Road, Bangalore, Karnataka 560001"
  const testCid      = "QmZZv7j7VaccK3647vmz2MJCJXEkZF7Lw8vZv2XHCkMvoH"
  const aiConfidence = 0.95
  const mismatch     = false

  // Test 1 — Anchor a report
  const txHash = await service.anchorReport(
    testAddress,
    testCid,
    aiConfidence,
    mismatch
  )
  console.log("✓ Transaction sent")
  console.log("✓ TX Hash:", txHash)
  console.log("✓ View at:", `https://sepolia.etherscan.io/tx/${txHash}`)

  // Test 2 — Read it back
  console.log("\nReading reports from chain...")
  const reports = await service.getReports(testAddress)
  console.log("✓ Reports on chain:", reports.length)
  console.log("✓ First report CID:", reports[0]?.ipfsCid)
  console.log("✓ Confidence:", reports[0]?.aiConfidence.toString())

  console.log("\n✅ Chain service working perfectly")
}

testChain().catch(console.error)