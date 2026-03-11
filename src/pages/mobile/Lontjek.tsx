import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UploadScreen } from "@/components/lontjek/UploadScreen";
import { AnalysisScreen } from "@/components/lontjek/AnalysisScreen";
import { ReportScreen } from "@/components/lontjek/ReportScreen";
import type { AnalysisStep } from "@/components/lontjek/AnalysisStepList";
import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";
import { usePayslip } from "@/contexts/PayslipContext";
import { getDemoPayslip } from "@/lib/demoPayslips";

type FlowState = "upload" | "analysis" | "report";

const initialAnalysisSteps: AnalysisStep[] = [
  { id: "read", label: "Læser dokument", status: "pending" },
  { id: "lon", label: "Tjekker grundløn", status: "pending" },
  { id: "tillæg", label: "Analyserer tillæg", status: "pending" },
  { id: "vagter", label: "Sammenligner vagter", status: "pending" },
  { id: "overenskomst", label: "Tjekker overenskomst", status: "pending" },
];

export default function MobileLontjek() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAnalysis, startAnalysis, clearAnalysis, hasActiveAnalysis, currentPayslip, currentValidation } = usePayslip();
  
  const isFreshUpload = (location.state as { fresh?: boolean })?.fresh === true;
  
  // Track if we entered from history (context already has data, but NOT a fresh upload)
  const cameFromHistory = useRef(hasActiveAnalysis && !isFreshUpload);

  const [flowState, setFlowState] = useState<FlowState>(
    () => isFreshUpload ? "upload" : (hasActiveAnalysis ? "report" : "upload")
  );
  const [file, setFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(initialAnalysisSteps);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  
  // Lokal state til API data (også gemt i context)
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [validationResult, setValidationResult] = useState<PayslipValidationResult | null>(null);
  
  // Ref til at holde styr på om analyse-data er hentet
  const dataFetchedRef = useRef(false);

  // Clear old analysis when starting a fresh upload from drawer/nav
  useEffect(() => {
    if (isFreshUpload) {
      clearAnalysis();
      // Clear the fresh flag from location state so back-navigation doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Analysis simulation + load demo data
  useEffect(() => {
    if (flowState === "analysis" && !isAnalysisComplete) {
      const totalSteps = analysisSteps.length;
      const stepDuration = 1500;
      let currentStep = 0;

      // Load demo data once at analysis start
      if (!dataFetchedRef.current && file) {
        dataFetchedRef.current = true;
        const demo = getDemoPayslip(file.name);
        setPayslipData(demo.payslip);
        setValidationResult(demo.validation);
        setAnalysis(demo.payslip, demo.validation);
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

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleStartAnalysis = () => {
    setFlowState("analysis");
    setAnalysisSteps(initialAnalysisSteps);
    setAnalysisProgress(0);
    setIsAnalysisComplete(false);
    dataFetchedRef.current = false;
    startAnalysis(); // 🆕 Sæt global loading state
  };

  const handleViewReport = () => {
    setFlowState("report");
  };

  const handleGoHome = () => {
    navigate("/m/home");
  };

  const handleNewAnalysis = () => {
    clearAnalysis();
    cameFromHistory.current = false;
    setFlowState("upload");
    setFile(null);
    setPayslipData(null);
    setValidationResult(null);
    setAnalysisProgress(0);
    setAnalysisSteps(initialAnalysisSteps);
    setIsAnalysisComplete(false);
    dataFetchedRef.current = false;
  };

  return (
    <main className="animate-fade-in">
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
          onBack={cameFromHistory.current ? () => navigate(-1) : undefined}
          payslipData={payslipData ?? undefined}
          validationResult={validationResult ?? undefined}
        />
      )}
    </main>
  );
}
