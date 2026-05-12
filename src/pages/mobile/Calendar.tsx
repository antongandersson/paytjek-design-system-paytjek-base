import { useState, useEffect, useRef } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarSyncSetup } from "@/components/calendar/CalendarSyncSetup";
import { useCalendar, type ConnectionSource } from "@/contexts/CalendarContext";
import { useDemo } from "@/contexts/DemoContext";
import type { Shift } from "@/components/calendar/CalendarGrid";
import type { AnalysisStep } from "@/components/lontjek/AnalysisStepList";
import { AnalysisScreen } from "@/components/lontjek/AnalysisScreen";

type FlowState = "setup" | "analyzing" | "connected";

const calendarAnalysisSteps: AnalysisStep[] = [
  { id: "read",    label: "Læser vagtplan",                    status: "pending" },
  { id: "parse",   label: "Identificerer vagttider og typer",  status: "pending" },
  { id: "rest",    label: "Tjekker hviletider",                status: "pending" },
  { id: "night",   label: "Analyserer nattevagtsmønster",      status: "pending" },
  { id: "env",     label: "Arbejdsmiljøtjek fuldført",         status: "pending" },
];

const STEP_DURATION_MS = 1400;

export default function MobileCalendar() {
  const {
    isConnected,
    isConnecting,
    syncError,
    shifts,
    connect,
    disconnect,
  } = useCalendar();
  const { demoConfig } = useDemo();

  // Start i "connected" hvis der allerede er data i denne session
  const [flowState, setFlowState] = useState<FlowState>(
    isConnected ? "connected" : "setup"
  );
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(calendarAnalysisSteps);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const connectionDoneRef = useRef(false);
  const animationDoneRef = useRef(false);

  // Konverter shifts til CalendarView format (Date objects)
  const calendarShifts: Shift[] = shifts.map(s => ({
    ...s,
    date: new Date(s.date),
  }));

  const handleConnect = async (source: string, icsUrlOrFile?: string | File) => {
    // Start analyse-animation med det samme
    setFlowState("analyzing");
    connectionDoneRef.current = false;
    animationDoneRef.current = false;

    // Start den faktiske ICS-parsing parallelt
    connect(source as ConnectionSource, icsUrlOrFile).then(() => {
      connectionDoneRef.current = true;
      if (animationDoneRef.current) {
        setIsAnalysisComplete(true);
      }
    });
  };

  // Kør skridt-animationen når vi går i "analyzing"
  useEffect(() => {
    if (flowState !== "analyzing") return;

    const totalSteps = calendarAnalysisSteps.length;
    let currentStep = 0;

    setAnalysisSteps(calendarAnalysisSteps.map((s, i) =>
      i === 0 ? { ...s, status: "active" } : s
    ));
    setAnalysisProgress(0);
    setIsAnalysisComplete(false);

    const interval = setInterval(() => {
      currentStep++;

      setAnalysisSteps(prev => prev.map((s, i) => ({
        ...s,
        status:
          i < currentStep  ? "completed"
          : i === currentStep ? "active"
          : "pending",
      })));

      setAnalysisProgress(Math.round((currentStep / totalSteps) * 100));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        animationDoneRef.current = true;
        if (connectionDoneRef.current) {
          setIsAnalysisComplete(true);
        }
      }
    }, STEP_DURATION_MS);

    return () => clearInterval(interval);
  }, [flowState]);

  // Når analyse er fuldført → skift automatisk til connected-view
  useEffect(() => {
    if (isAnalysisComplete) {
      const timer = setTimeout(() => setFlowState("connected"), 900);
      return () => clearTimeout(timer);
    }
  }, [isAnalysisComplete]);

  const handleDisconnect = () => {
    disconnect();
    setFlowState("setup");
    setAnalysisSteps(calendarAnalysisSteps);
    setAnalysisProgress(0);
    setIsAnalysisComplete(false);
    connectionDoneRef.current = false;
    animationDoneRef.current = false;
  };

  // ─── Analyse-skærm ──────────────────────────────────────────────────────────
  if (flowState === "analyzing") {
    return (
      <AnalysisScreen
        progress={analysisProgress}
        analysisSteps={analysisSteps}
        isComplete={isAnalysisComplete}
        onViewReport={() => setFlowState("connected")}
        reportLabel="Se vagtplan"
      />
    );
  }

  // ─── Kalender-visning ────────────────────────────────────────────────────────
  if (flowState === "connected" && isConnected) {
    return (
      <main className="px-4 py-6 pb-24 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">Kalender</h1>
        <CalendarView
          shifts={calendarShifts}
          isLoading={false}
          onDisconnect={handleDisconnect}
        />
      </main>
    );
  }

  // ─── Setup-skærm ────────────────────────────────────────────────────────────
  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Kalender</h1>

      {syncError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
          <p className="font-medium">Fejl ved synkronisering</p>
          <p className="text-destructive/80">{syncError}</p>
        </div>
      )}

      <CalendarSyncSetup
        onConnect={handleConnect}
        isConnecting={isConnecting}
        demoIcsUrl={demoConfig.demoIcsUrl}
        demoIcsDisplayUrl={demoConfig.demoIcsDisplayUrl}
      />
    </main>
  );
}
