export type AIFinding = {
  issue:       string   // e.g. "Mold", "Water damage", "Electrical hazard"
  location:    string   // e.g. "Bedroom ceiling", "Kitchen wall"
  confidence:  number   // 0 to 1
  severity:    "low" | "medium" | "high"
  description: string
}

export type AIAnalysisResult = {
  findings:        AIFinding[]
  overallScore:    number        // 0-100, higher = more issues
  mismatchFlag:    boolean       // tenant claim vs photo mismatch
  rawResponse:     string
}

export type PropScoreBreakdown = {
  score:           number
  reportCount:     number
  avgConfidence:   number
  lastReportDate:  string | null
  topIssues:       string[]
}

export type ChainAnchorPayload = {
  reportId:      string
  ipfsCid:       string
  propertyId:    string
  aiConfidence:  number
  mismatchFlag:  boolean
}