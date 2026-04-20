import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  steps:       string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive    = i === currentStep

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                isCompleted && "bg-accent text-white",
                isActive    && "bg-text-primary text-white",
                !isCompleted && !isActive && "bg-surface border border-border text-text-muted"
              )}>
                {isCompleted ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn(
                "text-xs whitespace-nowrap",
                isActive    && "text-text-primary font-medium",
                isCompleted && "text-accent",
                !isCompleted && !isActive && "text-text-muted"
              )}>
                {step}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className={cn(
                "w-16 h-px mb-5 mx-2 transition-all duration-300",
                isCompleted ? "bg-accent" : "bg-border"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}