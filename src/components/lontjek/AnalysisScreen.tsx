import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { AnalysisStep } from "./AnalysisStepList";
import { cn } from "@/lib/utils";

const steps = [
  { id: "upload", label: "Upload" },
  { id: "analyse", label: "Analyse" },
  { id: "rapport", label: "Rapport" },
];

interface AnalysisScreenProps {
  progress: number;
  analysisSteps: AnalysisStep[];
  isComplete: boolean;
  onViewReport: () => void;
}

export function AnalysisScreen({
  progress,
  analysisSteps,
  isComplete,
  onViewReport,
}: AnalysisScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      {/* Step indicator */}
      <div className="pt-8 pb-6">
        <StepIndicator steps={steps} currentStep={1} />
      </div>

      <div className="flex-1 px-6 flex flex-col items-center">
        {/* Main Circular Progress */}
        <div className="relative w-48 h-48 mb-10 mt-4 flex items-center justify-center">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          
          {/* Animated Progress Circle (using conic-gradient for simplicity) */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent transition-all duration-500 ease-out"
            style={{
              background: `conic-gradient(var(--primary) ${progress}%, transparent 0)`,
              maskImage: 'radial-gradient(transparent 65%, black 66%)',
              WebkitMaskImage: 'radial-gradient(transparent 65%, black 66%)'
            }}
          />

          {/* Inner Content */}
          <div className="flex flex-col items-center z-10">
            <span className="text-4xl font-bold text-foreground tabular-nums">
              {Math.round(progress)}%
            </span>
            <span className="text-sm text-muted-foreground font-medium mt-1">
              {isComplete ? "Færdig!" : "Analyserer..."}
            </span>
          </div>

          {/* Pulsing Ring Effect when analyzing */}
          {!isComplete && (
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping-slow" />
          )}
        </div>

        {/* Dynamic Analysis Steps */}
        <div className="w-full max-w-sm space-y-3">
          {analysisSteps.map((step, index) => {
            const isActive = step.status === "active";
            const isCompleted = step.status === "completed";
            const isPending = step.status === "pending";

            if (isPending && index > analysisSteps.findIndex(s => s.status === "active") + 1) return null;

            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500",
                  isActive 
                    ? "bg-white border-primary shadow-lg scale-105 z-10" 
                    : isCompleted 
                    ? "bg-gray-50 border-transparent opacity-60" 
                    : "bg-transparent border-transparent opacity-40 translate-y-2"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive ? "bg-primary/10" : isCompleted ? "bg-accent/20" : "bg-gray-100"
                )}>
                  {isActive && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-accent" />}
                  {isPending && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                
                <div className="flex-1">
                  <p className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-muted-foreground animate-pulse">
                      Behandler data...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Action */}
      <div className={cn(
        "p-6 transition-all duration-500 transform",
        isComplete ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}>
        <Button
          variant="accent"
          className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg shadow-accent/30"
          onClick={onViewReport}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Se Resultat
        </Button>
      </div>
    </div>
  );
}
