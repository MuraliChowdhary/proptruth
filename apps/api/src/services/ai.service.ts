// aiService.ts

import type { AIAnalysisResult } from "@proptruth/shared"

const OLLAMA_URL = "http://localhost:11434/api/generate"

export class AIService {
  async analyzePhotos(
    photoUrls: string[],
    tenantNotes: string | null
  ): Promise<AIAnalysisResult> {

    try {
      const prompt = `
You are a property condition inspector. Analyze the images and return ONLY valid JSON in this format:

{
  "findings": [
    {
      "issue": "string",
      "location": "string",
      "confidence": 0.0-1.0,
      "severity": "low|medium|high",
      "description": "string"
    }
  ],
  "overallScore": 0-100,
  "mismatchFlag": boolean,
  "rawResponse": "string"
}

Rules:
- Detect: mold, water damage, cracks, electrical hazards, pests
- If tenant notes mention issues NOT visible → mismatchFlag = true
- No explanation, only JSON

Tenant notes: ${tenantNotes ?? "None provided"}
`

      // NOTE: Ollama expects base64 images
      const imagesBase64 = await Promise.all(
        photoUrls.map(async (url) => {
          const res = await fetch(url)
          const buffer = await res.arrayBuffer()
          return Buffer.from(buffer).toString("base64")
        })
      )

      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llava",
          prompt,
          images: imagesBase64,
          stream: false,
        }),
      })

      const result = await response.json()

      const raw = result.response || "{}"

      // Clean JSON (llava sometimes adds text)
      const jsonStart = raw.indexOf("{")
      const jsonEnd = raw.lastIndexOf("}")

      const cleanJson =
        jsonStart !== -1 && jsonEnd !== -1
          ? raw.slice(jsonStart, jsonEnd + 1)
          : "{}"

      const data = JSON.parse(cleanJson) as AIAnalysisResult

      return {
        ...data,
        rawResponse: raw,
      }

    } catch (error) {
      console.error("AI Analysis Error:", error)

      return {
        findings: [],
        overallScore: 0,
        mismatchFlag: false,
        rawResponse: "Error processing AI response",
      }
    }
  }
}