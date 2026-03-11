import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full px-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-4 h-4 rounded-full transition-colors",
                index < currentStep
                  ? "bg-primary"
                  : index === currentStep
                  ? "bg-primary"
                  : "bg-secondary"
              )}
            />
            <span
              className={cn(
                "text-sm mt-2 font-medium",
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-24 mx-1 -mt-6",
                index < currentStep ? "bg-primary" : "bg-secondary"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
