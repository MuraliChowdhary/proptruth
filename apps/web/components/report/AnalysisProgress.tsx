"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { CheckCircle, Circle, Loader } from "lucide-react"

interface AnalysisProgressProps {
  reportId: string
  onComplete: () => void
}

type Stage = "ai" | "ipfs" | "chain" | "done"

export function AnalysisProgress({
  reportId,
  onComplete,
}: AnalysisProgressProps) {
  const { getToken }    = useAuth()
  const [stage, setStage] = useState<Stage>("ai")

  const stages = [
    { key: "ai",    label: "AI analyzing photos",         sub: "GPT-4o Vision scanning for issues" },
    { key: "ipfs",  label: "Pinning to IPFS",             sub: "Report being stored permanently"   },
    { key: "chain", label: "Anchoring on blockchain",     sub: "Writing hash to Sepolia"            },
    { key: "done",  label: "Report published",            sub: "Visible to future tenants"          },
  ]

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function poll() {
      try {
        const token = await getToken()
        const res   = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()

        if (data.aiStatus === "PROCESSING") setStage("ai")

        if (data.aiStatus === "COMPLETE" && data.anchorStatus === "PENDING") {
          setStage("ipfs")
        }

        if (data.anchorStatus === "ANCHORED") {
          setStage("done")
          clearInterval(interval)
          setTimeout(onComplete, 1500)
        }
      } catch {
        // keep polling
      }
    }

    poll()
    interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [reportId])

  const stageIndex = stages.findIndex(s => s.key === stage)

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-display text-xl text-text-primary mt-2">
          Processing your report
        </p>
        <p className="text-text-muted text-sm">
          This takes 1–2 minutes. Do not close this tab.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {stages.map((s, i) => {
          const isComplete = i < stageIndex
          const isActive   = i === stageIndex

          return (
            <div key={s.key} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isComplete ? (
                  <CheckCircle size={18} className="text-success" />
                ) : isActive ? (
                  <Loader size={18} className="text-accent animate-spin" />
                ) : (
                  <Circle size={18} className="text-border" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isComplete ? "text-success"
                  : isActive  ? "text-text-primary"
                  : "text-text-muted"
                }`}>
                  {s.label}
                </p>
                <p className="text-text-muted text-xs mt-0.5">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}