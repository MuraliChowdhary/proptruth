import { openai } from "../lib/openai"
import type { AIAnalysisResult } from "@proptruth/shared"

export class AIService {

  async analyzePhotos(
    photoUrls:   string[],
    tenantNotes: string | null
  ): Promise<AIAnalysisResult> {

    const imageContent = photoUrls.map(url => ({
      type:      "image_url" as const,
      image_url: { url, detail: "high" as const },
    }))

    const response = await openai.chat.completions.create({
      model:      "gpt-4o",
      max_tokens: 1000,
      messages: [
        {
          role:    "system",
          content: `You are a property condition inspector. Analyze the photos and return a JSON object with this exact structure:
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
Only return valid JSON. No markdown. No explanation.`,
        },
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Tenant notes: ${tenantNotes ?? "None provided"}. 
Analyze these property photos for mold, water damage, structural cracks, electrical hazards, and pest evidence. 
If tenant notes claim issues not visible in photos, set mismatchFlag to true.`,
            },
          ],
        },
      ],
    })

    const raw  = response.choices[0]?.message.content ?? "{}"
    const data = JSON.parse(raw) as AIAnalysisResult
    return data
  }
}