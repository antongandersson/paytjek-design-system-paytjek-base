import { useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";

const steps = [
  { id: "upload", label: "Upload" },
  { id: "analyse", label: "Analyse" },
  { id: "rapport", label: "Rapport" },
];

interface UploadScreenProps {
  onFileSelect: (file: File) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

export function UploadScreen({
  onFileSelect,
  onStartAnalysis,
  isAnalyzing,
}: UploadScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onStartAnalysis();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      {/* Step indicator */}
      <div className="pt-8 pb-6">
        <StepIndicator steps={steps} currentStep={0} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Upload din lønseddel
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
          Vi analyserer din lønseddel og tjekker løn, tillæg og fradrag mod din overenskomst automatisk.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          size="lg"
          className="w-full max-w-xs h-14 text-base font-bold rounded-2xl gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {isAnalyzing ? "Starter analyse..." : "Vælg fil"}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          PDF, PNG eller JPEG — maks 10 MB
        </p>
      </div>
    </div>
  );
}
