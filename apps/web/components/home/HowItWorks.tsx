"use client"

import { motion } from "framer-motion"
import { Upload, Cpu, Link } from "lucide-react"

const steps = [
  {
    icon:        Upload,
    number:      "01",
    title:       "Tenant submits report",
    description: "Moving out? Upload photos of the property condition. Our system verifies you actually lived there via your rental agreement.",
  },
  {
    icon:        Cpu,
    number:      "02",
    title:       "AI analyzes everything",
    description: "GPT-4o Vision scans every photo for mold, water damage, cracks, and hazards. Each finding gets a confidence score. Mismatched claims are flagged.",
  },
  {
    icon:        Link,
    number:      "03",
    title:       "Anchored on blockchain",
    description: "The verified report is pinned to IPFS and its hash is written permanently to the blockchain. No one — including us — can delete or modify it.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-surface border-t border-border">
      <div className="section">

        <div className="text-center mb-16">
          <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2 className="font-display text-4xl text-text-primary">
            Truth that outlives the platform
          </h2>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Even if PropTruth shuts down tomorrow, every report ever submitted remains permanently readable on the blockchain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border z-0 -translate-x-8" />
              )}

              <div className="card relative z-10 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center">
                    <step.icon size={18} className="text-accent" />
                  </div>
                  <span className="font-mono text-2xl font-medium text-border">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}