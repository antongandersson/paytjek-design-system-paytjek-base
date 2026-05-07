import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadScreen } from "@/components/lontjek/UploadScreen";
import { AnalysisScreen } from "@/components/lontjek/AnalysisScreen";
import { ReportScreen } from "@/components/lontjek/ReportScreen";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Check } from "lucide-react";
import type { AnalysisStep } from "@/components/lontjek/AnalysisStepList";
import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";
import { api } from "@/lib/api/client";

type FlowState = "upload" | "analysis" | "report";

// Udtræk payslip ID fra filnavn (fx "05-2024.pdf" → "05-2024")
function extractPayslipIdFromFilename(filename: string): string {
  // Fjern filendelse og returner
  const withoutExtension = filename.replace(/\.[^/.]+$/, "");
  // Tjek om det matcher MM-YYYY format
  if (/^\d{2}-\d{4}$/.test(withoutExtension)) {
    return withoutExtension;
  }
  // Fallback til default demo
  return "05-2024";
}

const agreementAnalysisSteps: AnalysisStep[] = [
  { id: "read", label: "Læser dokument", status: "pending" },
  { id: "lon", label: "Tjekker grundløn", status: "pending" },
  { id: "tillæg", label: "Analyserer tillæg", status: "pending" },
  { id: "vagter", label: "Sammenligner vagter", status: "pending" },
  { id: "overenskomst", label: "Tjekker overenskomst", status: "pending" },
];

const contractAnalysisSteps: AnalysisStep[] = [
  { id: "read", label: "Læser dokument", status: "pending" },
  { id: "kontrakt", label: "Sammenholder med kontrakt", status: "pending" },
  { id: "overenskomst", label: "Tjekker overenskomst", status: "pending" },
  { id: "lovgivning", label: "Kontrollerer lovgivning", status: "pending" },
  { id: "resultat", label: "Analyserer lønseddel mod data", status: "pending" },
];

const initialAnalysisSteps = agreementAnalysisSteps;

export default function WebLontjek() {
  const navigate = useNavigate();
  const [flowState, setFlowState] = useState<FlowState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(initialAnalysisSteps);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  
  // API data til ReportScreen
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [validationResult, setValidationResult] = useState<PayslipValidationResult | null>(null);
  
  // Ref til at holde styr på om API er kaldt
  const apiCalledRef = useRef(false);

  // Analysis Simulation + API Fetch
  useEffect(() => {
    if (flowState === "analysis" && !isAnalysisComplete) {
      const totalSteps = analysisSteps.length;
      const stepDuration = 1500;

      let currentStep = 0;
      
      // Kald API i baggrunden ved start af analyse
      if (!apiCalledRef.current) {
        apiCalledRef.current = true;
        fetchPayslipData();
      }
      
      const interval = setInterval(() => {
        setAnalysisSteps(prev => prev.map((step, index) => {
          if (index < currentStep) return { ...step, status: "completed" };
          if (index === currentStep) return { ...step, status: "active" };
          return { ...step, status: "pending" };
        }));

        const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100);
        setAnalysisProgress(progress);

        if (currentStep >= totalSteps) {
          setIsAnalysisComplete(true);
          clearInterval(interval);
        } else {
          currentStep++;
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [flowState, isAnalysisComplete]);

  // Hent lønseddel data fra demo API baseret på filnavn
  const fetchPayslipData = async () => {
    if (!file) return;
    
    try {
      // Udtræk payslip ID fra filnavn (fx "05-2024.pdf" → "05-2024")
      const payslipId = extractPayslipIdFromFilename(file.name);
      console.log(`📄 Henter lønseddel: ${payslipId} (fra fil: ${file.name})`);
      
      const response = await api.getDemoPayslip(payslipId);
      
      if (response.success && response.data) {
        setPayslipData(response.data.payslip);
        
        // Hvis validation er null (som 03-2025), opret en "OK" validation
        if (response.data.validation) {
          setValidationResult(response.data.validation);
        } else {
          // Ingen validering = alt er OK
          setValidationResult({
            id: `val-${payslipId}`,
            payslipId: payslipId,
            status: "ok",
            discrepancies: [],
            summary: {
              totalDifference: 0,
              issuesCount: 0,
              warningsCount: 0,
            },
            validatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Fejl ved hentning af lønseddel:", error);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleStartAnalysis = () => {
    setFlowState("analysis");
    setAnalysisSteps(initialAnalysisSteps);
    setAnalysisProgress(0);
    setIsAnalysisComplete(false);
    apiCalledRef.current = false; // Reset så API kan kaldes igen
  };

  const handleViewReport = () => {
    setFlowState("report");
  };

  const handleGoHome = () => {
    navigate("/app/dashboard");
  };

  const getStepStatus = (step: string) => {
    const steps = ["upload", "analysis", "report"];
    const currentIndex = steps.indexOf(flowState);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="space-y-5">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-primary-foreground">Løntjek</h1>
        <p className="text-primary-foreground/80 mt-1">
          Upload din lønseddel og få den tjekket automatisk
        </p>
      </div>

      {/* Steps indicator - mobile style */}
      <div className="flex items-center justify-between max-w-md">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            getStepStatus("upload") === "current" 
              ? "bg-primary text-primary-foreground" 
              : getStepStatus("upload") === "completed"
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
          }`}>
            {getStepStatus("upload") === "completed" ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <span className={`hidden sm:inline font-medium ${
            getStepStatus("upload") !== "pending" ? "text-primary" : "text-muted-foreground"
          }`}>Upload</span>
        </div>
        
        <div className="flex-1 h-1 bg-muted mx-2 rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all ${
            getStepStatus("analysis") !== "pending" ? "w-full" : "w-0"
          }`} />
        </div>
        
        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            getStepStatus("analysis") === "current" 
              ? "bg-primary text-primary-foreground" 
              : getStepStatus("analysis") === "completed"
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
          }`}>
            {getStepStatus("analysis") === "completed" ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <span className={`hidden sm:inline font-medium ${
            getStepStatus("analysis") !== "pending" ? "text-primary" : "text-muted-foreground"
          }`}>Analyse</span>
        </div>
        
        <div className="flex-1 h-1 bg-muted mx-2 rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all ${
            getStepStatus("report") !== "pending" ? "w-full" : "w-0"
          }`} />
        </div>
        
        {/* Step 3 */}
        <div className="flex items-center gap-2">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            getStepStatus("report") === "current"
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          }`}>
            {getStepStatus("report") === "completed" ? <Check className="h-5 w-5" /> : "3"}
          </div>
          <span className={`hidden sm:inline font-medium ${
            getStepStatus("report") !== "pending" ? "text-primary" : "text-muted-foreground"
          }`}>Resultat</span>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <Card className="border-border/50">
            <CardContent className="p-4 md:p-6">
              {flowState === "upload" && (
                <UploadScreen
                  onFileSelect={handleFileSelect}
                  onStartAnalysis={handleStartAnalysis}
                  isAnalyzing={false}
                />
              )}
              {flowState === "analysis" && (
                <AnalysisScreen
                  progress={analysisProgress}
                  analysisSteps={analysisSteps}
                  isComplete={isAnalysisComplete}
                  onViewReport={handleViewReport}
                />
              )}
              {flowState === "report" && (
                <ReportScreen 
                  onGoHome={handleGoHome}
                  payslipData={payslipData ?? undefined}
                  validationResult={validationResult ?? undefined}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Help Card */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Sådan virker det</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-4">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                    <span className="text-sm text-muted-foreground pt-1">Upload din lønseddel som PDF eller billede</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                    <span className="text-sm text-muted-foreground pt-1">Vores AI analyserer alle dine tillæg og timer</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                    <span className="text-sm text-muted-foreground pt-1">Se resultatet og eventuelle fejl</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                    <span className="text-sm text-muted-foreground pt-1">Send sagen til din fagforening med ét klik</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Tips Card */}
          <Card className="bg-accent border-0">
            <CardContent className="p-4">
              <h3 className="font-bold text-accent-foreground mb-2">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-accent-foreground/80">
                <li>• Brug god belysning hvis du tager et billede</li>
                <li>• Sørg for at hele lønsedlen er synlig</li>
                <li>• PDF-filer giver ofte bedst resultat</li>
              </ul>
            </CardContent>
          </Card>

          {/* Recent uploads */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Seneste uploads</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-2">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="font-bold text-foreground">December 2024</p>
                  <p className="text-sm text-muted-foreground">Analyseret i dag</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="font-bold text-foreground">November 2024</p>
                  <p className="text-sm text-destructive">2 fejl fundet</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
