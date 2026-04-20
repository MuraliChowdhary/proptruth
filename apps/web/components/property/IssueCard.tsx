import type { AIFinding } from "@proptruth/shared"

interface IssueCardProps {
  finding: AIFinding
}

const severityConfig = {
  low: {
    color: "#2D6A4F",
    bg:    "#2D6A4F15",
    label: "Low",
  },
  medium: {
    color: "#B5580A",
    bg:    "#B5580A15",
    label: "Medium",
  },
  high: {
    color: "#8B1A1A",
    bg:    "#8B1A1A15",
    label: "High",
  },
}

export function IssueCard({ finding }: IssueCardProps) {
  const config = severityConfig[finding.severity]

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-border rounded-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-text-primary text-sm font-medium">
            {finding.issue}
          </p>
          <p className="text-text-muted text-xs mt-0.5">
            {finding.location}
          </p>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{ color: config.color, backgroundColor: config.bg }}
        >
          {config.label}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-text-muted text-xs">AI confidence</span>
          <span
            className="text-xs font-medium font-mono"
            style={{ color: config.color }}
          >
            {(finding.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width:           `${finding.confidence * 100}%`,
              backgroundColor: config.color,
            }}
          />
        </div>
      </div>

      <p className="text-text-secondary text-xs leading-relaxed">
        {finding.description}
      </p>
    </div>
  )
}