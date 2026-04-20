"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getPropScoreColor, getPropScoreLabel } from "@/lib/utils"

interface PropScoreRingProps {
  score: number
  reportCount: number
}

export function PropScoreRing({ score, reportCount }: PropScoreRingProps) {
  const [displayed, setDisplayed] = useState(0)

  const size        = 200
  const strokeWidth = 12
  const radius      = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset      = circumference - (displayed / 100) * circumference
  const color       = getPropScoreColor(score)
  const label       = getPropScoreLabel(score)

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(score), 300)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8E6DF"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-5xl font-semibold"
            style={{ color }}
          >
            {Math.round(displayed)}
          </motion.span>
          <span className="text-text-muted text-xs mt-1">out of 100</span>
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{
            color,
            backgroundColor: color + "15",
          }}
        >
          {label}
        </span>
        <span className="text-text-muted text-xs">
          Based on {reportCount} {reportCount === 1 ? "report" : "reports"}
        </span>
      </div>
    </div>
  )
}