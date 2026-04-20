"use client"

import { motion } from "framer-motion"
import { formatDate, timeAgo } from "@/lib/utils"
import { IssueCard } from "./IssueCard"
import { ChainVerifyBadge } from "./ChainVerifyBadge"
import { OwnerResponseCard } from "./OwnerResponseCard"
import type { AIFinding } from "@proptruth/shared"

interface Report {
  id:             string
  publishedAt:    string
  moveInDate:     string
  moveOutDate:    string
  tenantNotes:    string | null
  aiFindings:     AIFinding[]
  aiConfidence:   number
  aiMismatchFlag: boolean
  txHash:         string | null
  ipfsCid:        string | null
  ownerResponse:  any | null
}

interface ReportTimelineProps {
  reports: Report[]
}

export function ReportTimeline({ reports }: ReportTimelineProps) {
  if (reports.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-secondary text-sm">
          No verified reports yet for this property.
        </p>
        <p className="text-text-muted text-xs mt-2">
          Be the first tenant to document its condition.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reports.map((report, i) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="card"
        >
          {/* Report header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-text-primary text-sm font-medium">
                  Tenant report
                </span>
                {report.aiMismatchFlag && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-warning font-medium">
                    Claim mismatch flagged
                  </span>
                )}
              </div>
              <p className="text-text-muted text-xs">
                Tenancy: {formatDate(report.moveInDate)} →{" "}
                {formatDate(report.moveOutDate)}
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Published {timeAgo(report.publishedAt)}
              </p>
            </div>

            {/* Overall confidence */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-text-muted text-xs">Avg confidence</span>
              <span className="font-mono text-lg font-medium text-text-primary">
                {(report.aiConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Tenant notes */}
          {report.tenantNotes && (
            <div className="bg-surface rounded-xl p-4 mb-6">
              <p className="text-text-muted text-xs mb-1">Tenant notes</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {report.tenantNotes}
              </p>
            </div>
          )}

          {/* AI Findings */}
          {report.aiFindings.length > 0 && (
            <div className="mb-6">
              <p className="text-text-secondary text-xs font-medium mb-3 uppercase tracking-wide">
                AI findings — {report.aiFindings.length} issue
                {report.aiFindings.length > 1 ? "s" : ""} detected
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {report.aiFindings.map((finding, j) => (
                  <IssueCard key={j} finding={finding} />
                ))}
              </div>
            </div>
          )}

          {/* Chain verification */}
          {report.txHash && report.ipfsCid && (
            <div className="border-t border-border pt-4 mb-4">
              <ChainVerifyBadge
                txHash={report.txHash}
                ipfsCid={report.ipfsCid}
              />
            </div>
          )}

          {/* Owner response */}
          {report.ownerResponse && (
            <div className="border-t border-border pt-4">
              <OwnerResponseCard response={report.ownerResponse} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}