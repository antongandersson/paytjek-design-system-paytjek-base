import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
}

interface AnalysisStepListProps {
  steps: AnalysisStep[];
}

export function AnalysisStepList({ steps }: AnalysisStepListProps) {
  return (
    <div className="w-full space-y-4 px-6">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-3">
          {/* Arrow indicator for active step */}
          <div className="w-5">
            {step.status === "active" && (
              <ChevronRight className="h-5 w-5 text-primary" />
            )}
          </div>
          
          {/* Status icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            {step.status === "completed" ? (
              <Check className="h-5 w-5 text-accent" />
            ) : step.status === "active" ? (
              <Spinner className="h-5 w-5 text-primary" />
            ) : null}
          </div>
          
          {/* Label */}
          <span
            className={cn(
              "text-base font-medium",
              step.status === "completed"
                ? "text-accent"
                : step.status === "active"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
