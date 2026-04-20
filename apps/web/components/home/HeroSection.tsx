"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Shield, Zap } from "lucide-react"
import { api } from "@/lib/api"

export function HeroSection() {
  const router   = useRouter()
  const [query,   setQuery]   = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.length < 3) { setResults([]); return }

    setLoading(true)
    try {
      const data = await api.properties.search(value)
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #E8E6DF 1px, transparent 0)`,
          backgroundSize:  "32px 32px",
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-subtle rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-accent-subtle border border-accent/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Shield size={12} className="text-accent" />
          <span className="text-accent text-xs font-medium">
            AI verified · Blockchain anchored
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight mb-6"
        >
          Know the truth
          <br />
          <span className="text-accent">before you sign.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-text-secondary text-lg md:text-xl leading-relaxed mb-12 max-w-xl"
        >
          Search any rental property. See verified condition reports from past tenants — analyzed by AI, permanent on blockchain.
        </motion.p>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-xl relative"
        >
          <div className={`
            flex items-center gap-3 bg-white border-2 rounded-2xl px-5 py-4
            transition-all duration-200 shadow-sm
            ${focused ? "border-accent shadow-md" : "border-border"}
          `}>
            <Search size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by address, area, or pincode..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
            />
            {loading && (
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>

          {/* Search results dropdown */}
          {results.length > 0 && focused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {results.map((property) => (
                <button
                  key={property.id}
                  onClick={() => router.push(`/property/${property.id}`)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors text-left border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-text-primary text-sm font-medium">
                      {property.address}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {property.city}, {property.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {property.propScore !== null && (
                      <span className={`
                        text-xs font-medium px-2.5 py-1 rounded-full
                        ${property.propScore <= 30
                          ? "bg-green-50 text-success"
                          : property.propScore <= 65
                          ? "bg-orange-50 text-warning"
                          : "bg-red-50 text-danger"}
                      `}>
                        {property.propScore?.toFixed(0)} score
                      </span>
                    )}
                    <span className="text-text-muted text-xs">
                      {property.reportCount} reports
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length >= 3 && results.length === 0 && !loading && focused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg p-6 text-center z-50">
              <p className="text-text-secondary text-sm">
                No properties found. Be the first to report this address.
              </p>
              <button
                onClick={() => router.push("/report/submit")}
                className="mt-3 text-accent text-sm font-medium hover:underline"
              >
                Submit a report →
              </button>
            </div>
          )}
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-6 mt-10 text-text-muted text-xs"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-accent" />
            <span>AI analyzed</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-accent" />
            <span>Blockchain verified</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <span>7 day time lock</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}