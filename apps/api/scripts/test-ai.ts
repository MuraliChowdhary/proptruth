import "dotenv/config"
import { AIService } from "../src/services/ai.service"

const service = new AIService()

async function testAI() {
  console.log("Testing AI service...")
  console.log("Sending real photo to GPT-4o Vision...")
  console.log("(This may take 10-20 seconds)\n")

  // Using a public image of a water damaged wall for testing
  const testPhotoUrls = [
    "https://res.cloudinary.com/dwvo1c5xo/image/upload/v1775814967/water_damage_bmgudd.jpg"
  ]

  const result = await service.analyzePhotos(
    testPhotoUrls,
    "I noticed water stains on the wall"
  )

  console.log("✓ AI response received")
  console.log("\n--- Findings ---")

  result.findings.forEach((f, i) => {
    console.log(`\nFinding ${i + 1}:`)
    console.log(`  Issue:       ${f.issue}`)
    console.log(`  Location:    ${f.location}`)
    console.log(`  Confidence:  ${(f.confidence * 100).toFixed(0)}%`)
    console.log(`  Severity:    ${f.severity}`)
    console.log(`  Description: ${f.description}`)
  })

  console.log("\n--- Summary ---")
  console.log(`Overall score:  ${result.overallScore}`)
  console.log(`Mismatch flag:  ${result.mismatchFlag}`)

  console.log("\n✅ AI service working perfectly")
}

testAI().catch(console.error)