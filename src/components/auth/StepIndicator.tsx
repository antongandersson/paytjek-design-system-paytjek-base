interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-500 ease-out ${
            index < currentStep
              ? "bg-primary w-2"
              : index === currentStep
              ? "bg-primary w-8"
              : "bg-gray-200 w-2"
          }`}
          aria-label={`Step ${index + 1} of ${totalSteps}${
            index === currentStep ? " (current)" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;


