import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
import { UploadScreen } from "@/components/lontjek/UploadScreen";
import { AnalysisScreen } from "@/components/lontjek/AnalysisScreen";
import { ReportScreen } from "@/components/lontjek/ReportScreen";
import type { AnalysisStep } from "@/components/lontjek/AnalysisStepList";
import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { usePayslip } from "@/contexts/PayslipContext";
import { useNotifications } from "@/contexts/NotificationContext";

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

const initialAnalysisSteps: AnalysisStep[] = [
  { id: "read", label: "Læser dokument", status: "pending" },
  { id: "lon", label: "Tjekker grundløn", status: "pending" },
  { id: "tillæg", label: "Analyserer tillæg", status: "pending" },
  { id: "vagter", label: "Sammenligner vagter", status: "pending" },
  { id: "overenskomst", label: "Tjekker overenskomst", status: "pending" },
];

export default function Lontjek() {
  const navigate = useNavigate();
  const { setAnalysis } = usePayslip(); // 🆕 Global context for at dele data med dashboard
  const { addNotification } = useNotifications(); // 🆕 For at tilføje notifikationer
  
  const [flowState, setFlowState] = useState<FlowState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(initialAnalysisSteps);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("lontjek");
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  
  // API data til ReportScreen (lokal state)
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [validationResult, setValidationResult] = useState<PayslipValidationResult | null>(null);
  
  // Ref til at holde styr på om API er kaldt
  const apiCalledRef = useRef(false);

  // Analysis Simulation + API Fetch
  useEffect(() => {
    if (flowState === "analysis" && !isAnalysisComplete) {
      const totalSteps = analysisSteps.length;
      const stepDuration = 1500; // 1.5 seconds per step

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
        const payslip = response.data.payslip;
        
        // Hvis validation er null (som 03-2025), opret en "OK" validation
        const validation: PayslipValidationResult = response.data.validation ?? {
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
        };
        
        // Gem til lokal state (til ReportScreen props)
        setPayslipData(payslip);
        setValidationResult(validation);
        
        // 🆕 Gem til GLOBAL context (til Dashboard og andre komponenter)
        setAnalysis(payslip, validation);
        console.log("✅ Lønseddel gemt til global context - dashboard opdateres");
        
        // 🆕 Tilføj notifikation baseret på valideringsresultat
        const monthName = new Date(payslip.period.start).toLocaleDateString('da-DK', { month: 'long', year: 'numeric' });
        const errorCount = validation.discrepancies.filter(d => d.severity === "error").length;
        const warningCount = validation.discrepancies.filter(d => d.severity === "warning").length;
        
        if (errorCount > 0) {
          addNotification({
            title: `Ernest har fundet ${errorCount} fejl`,
            description: `Der er fundet ${errorCount} uoverensstemmelse${errorCount > 1 ? 'r' : ''} i din lønseddel for ${monthName}.`,
            type: "alert",
            time: "",
          });
        } else if (warningCount > 0) {
          addNotification({
            title: `${warningCount} advarsel${warningCount > 1 ? 'er' : ''} fundet`,
            description: `Din lønseddel for ${monthName} har ${warningCount} punkt${warningCount > 1 ? 'er' : ''} der bør tjekkes.`,
            type: "info",
            time: "",
          });
        } else {
          addNotification({
            title: `Din lønseddel for ${monthName} er klar`,
            description: "Ernest fandt ingen fejl i din lønseddel. Alt ser godt ud!",
            type: "new",
            time: "",
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
    navigate("/home");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "hjem") {
      navigate("/home");
    } else if (tab === "kalender") {
      navigate("/calendar");
    } else if (tab === "historie") {
      navigate("/history");
    } else if (tab === "mere") {
      navigate("/more");
    } else if (tab === "lontjek") {
      // Already on lontjek, reset to upload
      setFlowState("upload");
      setFile(null);
      setAnalysisProgress(0);
      setIsAnalysisComplete(false);
      setAnalysisSteps(initialAnalysisSteps);
    }
  };

  const handleCenterClick = () => {
    // Reset to upload state
    setFlowState("upload");
    setFile(null);
    setAnalysisProgress(0);
    setIsAnalysisComplete(false);
    setAnalysisSteps(initialAnalysisSteps);
  };

  const handleUploadOption = (option: string) => {
    // Handle upload option if needed
  };

  return (
    <MobileContainer withBottomNav={false}>
      <div className="pb-20">
        {flowState === "upload" ? (
          <UploadScreen
            onFileSelect={handleFileSelect}
            onStartAnalysis={handleStartAnalysis}
            isAnalyzing={false}
          />
        ) : flowState === "analysis" ? (
          <AnalysisScreen
            progress={analysisProgress}
            analysisSteps={analysisSteps}
            isComplete={isAnalysisComplete}
            onViewReport={handleViewReport}
          />
        ) : (
          <ReportScreen 
            onGoHome={handleGoHome}
            payslipData={payslipData ?? undefined}
            validationResult={validationResult ?? undefined}
          />
        )}
      </div>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCenterClick={handleCenterClick}
      />

      <UploadDrawer
        open={uploadDrawerOpen}
        onOpenChange={setUploadDrawerOpen}
        onOptionSelect={handleUploadOption}
      />
    </MobileContainer>
  );
}
