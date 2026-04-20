import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPropScoreColor(score: number): string {
  if (score <= 30) return "#2D6A4F"
  if (score <= 65) return "#B5580A"
  return "#8B1A1A"
}

export function getPropScoreLabel(score: number): string {
  if (score <= 30) return "Low Risk"
  if (score <= 65) return "Moderate Risk"
  return "High Risk"
}

export function formatAddress(address: string): string {
  return address.length > 40 ? address.slice(0, 40) + "..." : address
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  }).format(new Date(date))
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )
  if (seconds < 60)   return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}