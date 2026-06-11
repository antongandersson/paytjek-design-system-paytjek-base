import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  AlertCircle,
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  // Sparkles, // TEMPORARILY DISABLED (Ernest Tip)
  FileText,
  Calculator,
  // MessageCircle, // TEMPORARILY DISABLED (Spørg Ernest)
  Activity,
  Baby,
  CalendarOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  BadgeCheck,
  ShieldCheck,
  Briefcase,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { ErnestChatSheet } from "@/components/ernest/ErnestChatSheet"; // TEMPORARILY DISABLED
import { Chip } from "@/components/ui/chip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCalendar } from "@/contexts/CalendarContext";
import { SendCaseScreen } from "./SendCaseScreen";
// import ernestAvatar from "@/assets/ernest-avatar.svg"; // TEMPORARILY DISABLED
import { cn } from "@/lib/utils";
import { usePayslip } from "@/contexts/PayslipContext";
import { useContract } from "@/contexts/ContractContext";
import type { 
  PayslipData, 
  PayslipValidationResult, 
  PayslipDiscrepancy,
  PayslipConflictCard,
  PayslipField 
} from "@/lib/api/types";

type TabType = "overview" | "errors";
type ViewType = "report" | "sendCase";

interface ReportScreenProps {
  onGoHome: () => void;
  onBack?: () => void;
  onNewAnalysis?: () => void;
  payslipData?: PayslipData;
  validationResult?: PayslipValidationResult;
}

// Demo data imported from shared module (used as fallback in dev mode)
import { getDemoPayslip } from "@/lib/demoPayslips";
import { useDemo } from "@/contexts/DemoContext";
const _hkFallback = getDemoPayslip("2025-10-30_Lønseddel");

// Helper: Få dansk label for felt
function getFieldLabel(field: PayslipField): string {
  const labels: Record<PayslipField, string> = {
    grundlon: "Grundløn",
    timelon: "Timeløn",
    normalTimer: "Normal timer",
    aftentillaeg: "Manglende aftentillæg",
    nattillaeg: "Manglende nattillæg",
    lordagstillaeg: "Manglende lørdagstillæg",
    soenHelligdag: "Manglende søn/helligdagstillæg",
    raadighestillaeg: "Rådighedstillæg",
    overtid: "Overtid",
    ferietillaeg: "Ferietillæg",
    saerlig_opsparing: "Særlig opsparing",
    pension: "Pension",
    pensionRaadighed: "Pension af råd.tillæg",
    skat: "Skat",
    atp: "ATP",
    sygdom: "Sygdom",
    ferie: "Ferie",
    afspadsering: "Afspadsering",
    barnsSygdom: "Barns sygdom",
  };
  return labels[field] || field;
}

// Helper: Formater beløb til dansk format
function formatKr(amount: number): string {
  return amount.toLocaleString("da-DK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(",", ",") + " kr";
}

// Helper: Tjek om et felt har fejl
function getFieldStatus(
  field: PayslipField, 
  discrepancies: PayslipDiscrepancy[]
): "ok" | "warning" | "error" {
  const discrepancy = discrepancies.find(d => d.field === field);
  if (!discrepancy) return "ok";
  return discrepancy.severity;
}

export function ReportScreen({ 
  onGoHome,
  onBack,
  onNewAnalysis,
  payslipData: propPayslipData,
  validationResult: propValidationResult,
}: ReportScreenProps) {
  // const [isChatOpen, setIsChatOpen] = useState(false); // TEMPORARILY DISABLED
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [currentView, setCurrentView] = useState<ViewType>("report");

  // Hent data fra global context (prioriteret over props)
  const { 
    currentPayslip: contextPayslip, 
    currentValidation: contextValidation,
  } = usePayslip();

  // Demo fallback: brug union-specifik config når ingen rigtig data er tilgængelig
  const { demoConfig, basePath } = useDemo();
  const navigate = useNavigate();
  const handleBooking = () => navigate(`${basePath}/booking`);

  const payslipData = contextPayslip ?? propPayslipData ?? demoConfig.payslip ?? _hkFallback.payslip;
  const validationResult = contextValidation ?? propValidationResult ?? demoConfig.validation ?? _hkFallback.validation;
  
  // Hvis ingen data og ikke dev-mode, vis loading/fejl
  if (!payslipData || !validationResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Ingen lønseddel data</h2>
          <p className="text-muted-foreground text-sm">
            Der opstod en fejl ved hentning af lønseddel-data fra API'et.
          </p>
          <Button variant="outline" onClick={onGoHome}>
            Tilbage til forsiden
          </Button>
        </div>
      </div>
    );
  }
  
  // Tæl både errors og warnings som "issues"
  const errorCount = validationResult.discrepancies.filter(d => d.severity === "error").length;
  const warningCount = validationResult.discrepancies.filter(d => d.severity === "warning").length;
  const issuesCount = errorCount + warningCount;

  const handleErrorChipClick = () => {
    setActiveTab("errors");
  };

  const handleSendToUnion = () => {
    setCurrentView("sendCase");
  };

  // If showing SendCaseScreen
  if (currentView === "sendCase") {
    return (
      <SendCaseScreen 
        onBack={() => setCurrentView("report")} 
        onSuccess={onGoHome}
      />
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted" onClick={onBack ?? onGoHome}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{payslipData.period.month} lønseddel</h1>
          <Chip variant="pdf" className="cursor-pointer">
            PDF
          </Chip>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        
        {/* Hero Card - Skatteguiden Inspired */}
        <div className="mx-4 mt-2 mb-4">
          <div className="bg-primary rounded-[2rem] p-6 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden animate-scale-in">
            
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              {/* Top Row: Month + Status */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-primary-foreground/70 text-sm font-medium mb-1">
                    {payslipData.period.month} {payslipData.period.year}
                  </p>
                  <h2 className="text-4xl font-bold tracking-tight">
                    {formatKr(payslipData.totals.nettolon)}
                  </h2>
                  <p className="text-xs text-primary-foreground/50 font-medium mt-1 uppercase tracking-wider">
                    Til udbetaling
                  </p>
                </div>

                {/* Status Badge */}
                <button 
                  onClick={issuesCount > 0 ? handleErrorChipClick : undefined}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border transition-all",
                    issuesCount > 0 
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer" 
                      : "bg-accent/20 border-accent/30 text-accent cursor-default"
                  )}
                >
                  {issuesCount > 0 ? (
                    <>
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        errorCount > 0 ? "bg-red-400" : "bg-amber-400"
                      )} />
                      {issuesCount} {errorCount > 0 ? "Fejl" : "Advarsler"}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Godkendt
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Row: User Info + Stats */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                    {payslipData.employer.name?.split(" ").map(w => w[0]).join("").slice(0,2) || "EH"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{demoConfig.persona.name}</p>
                    <p className="text-xs text-primary-foreground/60">{payslipData.employer.department || payslipData.employer.name}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-primary-foreground/50 uppercase">Timer</p>
                    <p className="text-sm font-bold">{payslipData.salary.normalTimer}t</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/50 uppercase">Timeløn</p>
                    <p className="text-sm font-bold">{formatKr(payslipData.salary.timelon).replace(" kr", "")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Blue Background like Figma */}
        <div className="mx-4 mt-4 mb-2">
          <div className="flex bg-primary rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300",
                activeTab === "overview"
                  ? "bg-background text-primary shadow-md"
                  : "text-primary-foreground hover:bg-white/10"
              )}
            >
              Lønoverblik
            </button>
            <button
              onClick={() => setActiveTab("errors")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2",
                activeTab === "errors"
                  ? "bg-background text-primary shadow-md"
                  : "text-primary-foreground hover:bg-white/10"
              )}
            >
              {errorCount > 0 ? "Fejl" : warningCount > 0 ? "Advarsler" : "Status"}
              {issuesCount > 0 && (
                <span className={cn(
                  "text-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center",
                  errorCount > 0 ? "bg-destructive text-white" : "bg-warning"
                )}>
                  {issuesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-2 min-h-[300px]">
          {activeTab === "overview" ? (
            <OverviewContent 
              payslipData={payslipData}
              validationResult={validationResult}
              onSeeErrors={() => setActiveTab("errors")} 
            />
          ) : (
            <ErrorsContent 
              payslipData={payslipData}
              validationResult={validationResult}
              onOpenChat={() => {}} /* TEMPORARILY DISABLED - was: () => setIsChatOpen(true) */
              onSendCase={handleSendToUnion}
              onBooking={handleBooking}
            />
          )}
        </div>

      </div>

      {/* Ernest Chat Sheet - TEMPORARILY DISABLED */}
      {/* <ErnestChatSheet open={isChatOpen} onOpenChange={setIsChatOpen} context="analysis" /> */}
    </div>
  );
}

// ----------------------------------------------------------------------
// OVERVIEW CONTENT - Modular Dashboard Design
// ----------------------------------------------------------------------

interface OverviewContentProps {
  payslipData: PayslipData;
  validationResult: PayslipValidationResult;
  onSeeErrors: () => void;
}

function OverviewContent({ payslipData, validationResult, onSeeErrors }: OverviewContentProps) {
  const { salary, supplements, deductions, absence, totals } = payslipData;
  const { discrepancies } = validationResult;

  const hasPersonalegoder = payslipData.personalegoder && payslipData.personalegoder.length > 0;
  const kontantLon = payslipData.kontantLon ?? totals.bruttolon;
  const personalegoderTotal = payslipData.personalegoder?.reduce((s, p) => s + p.beloeb, 0) ?? 0;

  // Tillæg med issues (for non-personalegoder payslips like FOA/HK)
  const supplementsWithIssues = [
    ...(supplements.raadighestillaeg ? [{ field: "raadighestillaeg" as PayslipField, label: "Rådighedstillæg", icon: Briefcase, ...supplements.raadighestillaeg }] : []),
    { field: "aftentillaeg" as PayslipField, label: "Aftentillæg", icon: Moon, ...supplements.aftentillaeg },
    { field: "nattillaeg" as PayslipField, label: "Nattillæg", icon: Moon, ...supplements.nattillaeg },
    ...(supplements.lordagstillaeg ? [{ field: "lordagstillaeg" as PayslipField, label: "Lørdagstillæg", icon: Sun, ...supplements.lordagstillaeg }] : []),
    { field: "soenHelligdag" as PayslipField, label: "Weekend/helligdag", icon: Sun, ...supplements.soenHelligdag },
  ].filter(s => s.beloeb > 0 || getFieldStatus(s.field, discrepancies) !== "ok");

  // Ferietillæg discrepancy
  const ferietillaegStatus = getFieldStatus("ferietillaeg", discrepancies);
  const ferietillaegDiscrepancy = discrepancies.find(d => d.field === "ferietillaeg");

  // Pension discrepancy (for info section)
  const pensionDiscrepancy = discrepancies.find(d => d.field === "pension");

  return (
    <div className="px-4 pb-6 space-y-4 animate-fade-in">

      {/* 1. Salary Receipt Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-muted/30 to-transparent border-b border-dashed border-border/50" />
        
        <div className="p-5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Lønspecifikation
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {payslipData.period.month} {payslipData.period.year}
            </span>
          </div>

          <div className="space-y-3 text-sm">

            {/* ── KONTANT LØN ── */}
            {hasPersonalegoder ? (
              <>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kontant løn</p>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Grundløn</span>
                  <span className="font-semibold">{formatKr(salary.grundlon)}</span>
                </div>

                {/* Kontante tillæg (bonus, ferietillæg, etc.) */}
                {totals.totalTillaeg > 0 && ferietillaegDiscrepancy && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-medium text-red-700">
                        Ferietillæg (1% af grundløn)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-600">
                        {formatKr(totals.totalTillaeg)}
                      </span>
                      <button
                        onClick={onSeeErrors}
                        className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700"
                      >
                        ⚠️
                      </button>
                    </div>
                  </div>
                )}

                {totals.totalTillaeg > 0 && !ferietillaegDiscrepancy && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Bonus</span>
                    <span className="font-semibold">{formatKr(totals.totalTillaeg)}</span>
                  </div>
                )}

                {/* Kontant løn subtotal */}
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-border/60">
                  <span className="font-semibold text-foreground text-xs">Kontant løn i alt</span>
                  <span className="font-bold text-foreground">{formatKr(kontantLon)}</span>
                </div>

                {/* ── SKATTEPLIGTIGE PERSONALEGODER ── */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Skattepligtige personalegoder
                  </p>
                  <p className="text-[10px] text-muted-foreground -mt-1 mb-2">(beskattes men udbetales ikke)</p>
                  <div className="pl-3 border-l-2 border-muted-foreground/20 space-y-1.5">
                    {payslipData.personalegoder!.map((p, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="text-muted-foreground font-medium">{formatKr(p.beloeb)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs mt-2 pt-1.5 border-t border-dashed border-border/40">
                    <span className="text-muted-foreground">Personalegoder i alt</span>
                    <span className="font-medium text-muted-foreground">{formatKr(personalegoderTotal)}</span>
                  </div>
                </div>

                {/* ── A-INDKOMST ── */}
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-border">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    A-indkomst
                  </span>
                  <span className="font-bold text-lg text-foreground">{formatKr(totals.bruttolon)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground -mt-1">(skattegrundlag)</p>
              </>
            ) : (
              <>
                {/* Fallback: gammelt format for FOA/HK/3F etc. */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Grundløn</span>
                    <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">
                      {salary.normalTimer}t
                    </span>
                  </div>
                  <span className="font-semibold">{formatKr(salary.grundlon)}</span>
                </div>

                {supplementsWithIssues.length > 0 && (
                  <div className="pl-3 border-l-2 border-accent/40 space-y-2 py-2 my-2">
                    {supplementsWithIssues.map((supp) => {
                      const status = getFieldStatus(supp.field, discrepancies);
                      const hasIssue = status === "error" || status === "warning";
                      const Icon = supp.icon;
                      const disc = discrepancies.find(d => d.field === supp.field);
                      const showStrike = hasIssue && disc && disc.difference !== 0;
                      
                      return (
                        <div key={supp.field} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Icon className={cn(
                              "w-3.5 h-3.5",
                              hasIssue ? (status === "error" ? "text-red-500" : "text-amber-500") : "text-muted-foreground"
                            )} />
                            <span className={cn(
                              "text-xs",
                              hasIssue ? (status === "error" ? "text-red-600" : "text-amber-600") : "text-muted-foreground"
                            )}>
                              {supp.label}
                              {supp.timer > 0 && <span className="ml-1">({supp.timer}t)</span>}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs font-medium",
                              showStrike
                                ? (status === "error" ? "text-red-600 line-through" : "text-amber-600 line-through")
                                : hasIssue
                                  ? (status === "error" ? "text-red-600" : "text-amber-600")
                                  : "text-accent"
                            )}>
                              +{formatKr(supp.beloeb)}
                            </span>
                            {hasIssue && (
                              <button 
                                onClick={onSeeErrors}
                                className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-bold",
                                  status === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                )}
                              >
                                FEJL
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-dashed border-border">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Bruttoløn
                  </span>
                  <span className="font-bold text-lg text-foreground">{formatKr(totals.bruttolon)}</span>
                </div>
              </>
            )}

            {/* ── FRADRAG ── */}
            <div className="pl-3 border-l-2 border-border/40 space-y-2 py-2 mt-3">
              {[
                ...(deductions.amBidrag ? [{ field: "skat" as PayslipField, label: `AM-bidrag (${deductions.amBidrag.procent}%)`, beloeb: deductions.amBidrag.beloeb, isAm: true }] : []),
                { field: "skat" as PayslipField, label: "A-skat", beloeb: deductions.skat.beloeb, isAm: false },
                { field: "pension" as PayslipField, label: `Egetbidrag pension (${deductions.pension.procent}%)`, beloeb: deductions.pension.beloeb, isAm: false },
                ...(getFieldStatus("pensionRaadighed", discrepancies) !== "ok"
                  ? [{ field: "pensionRaadighed" as PayslipField, label: "Pension af råd.tillæg", beloeb: 0, isAm: false }]
                  : []),
                { field: "atp" as PayslipField, label: "ATP egetbidrag", beloeb: deductions.atp.beloeb, isAm: false },
              ].map((item) => {
                const status = getFieldStatus(item.field, discrepancies);
                const disc = discrepancies.find(d => d.field === item.field);
                const showStrike = (status === "error" || status === "warning") && disc && disc.difference !== 0;
                
                return (
                  <div key={item.isAm ? "am-bidrag" : item.field} className="flex justify-between text-xs">
                    <span className={cn(
                      showStrike ? (status === "error" ? "text-red-600" : "text-amber-600") : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium",
                        showStrike
                          ? (status === "error" ? "text-red-600 line-through" : "text-amber-600 line-through")
                          : "text-muted-foreground"
                      )}>
                        -{formatKr(item.beloeb)}
                      </span>
                      {showStrike && (
                        <button 
                          onClick={onSeeErrors}
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-bold",
                            status === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          )}
                        >
                          FEJL
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Fradrag */}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-muted-foreground" />
                Total fradrag
              </span>
              <span className="font-semibold text-muted-foreground">-{formatKr(totals.totalFradrag)}</span>
            </div>
          </div>

          {/* Netto Result - Til Udbetaling */}
          <div className="mt-4 pt-4 border-t-2 border-accent/30 bg-accent/5 -mx-5 -mb-5 px-5 py-4 rounded-b-3xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-xs text-accent uppercase font-bold tracking-wider">Til Udbetaling</span>
                {hasPersonalegoder && (
                  <span className="text-[10px] text-muted-foreground">
                    kontant løn {formatKr(kontantLon).replace(" kr", "")} − fradrag {formatKr(totals.totalFradrag).replace(" kr", "")}
                  </span>
                )}
                {!hasPersonalegoder && (
                  <span className="text-[10px] text-muted-foreground">Disponibel ultimo {payslipData.period.month.slice(0,3).toLowerCase()}</span>
                )}
              </div>
              <span className="text-2xl font-bold text-foreground">{formatKr(totals.nettolon)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pension-info (vises når pension har warning/fejl) */}
      {pensionDiscrepancy && (
        <div className="bg-card rounded-2xl border border-amber-200 p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Pension
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Indbetales til</span>
              <span className="font-medium text-amber-700 flex items-center gap-1">
                Ikke specificeret <AlertTriangle className="w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pension (15%)</span>
              <span className="font-medium text-foreground">
                {formatKr(deductions.pension.beloeb + (deductions.pension.grundlag ? deductions.pension.grundlag * 0.10 : 0))}
              </span>
            </div>
            <div className="mt-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-[11px] text-amber-800 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>Kontrakten angiver ikke AG/eget-fordeling — lønsedlen viser kun samlet beløb</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fravær Grid */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <CalendarOff className="w-3.5 h-3.5" />
          Fravær & Ferie
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Ferie", value: absence.ferie.dage, icon: Sun },
            { label: "Sygdom", value: absence.sygdom.dage, icon: Activity },
            { label: "Barn syg", value: absence.barnsSygdom.dage, icon: Baby },
            { label: "Afspads.", value: absence.afspadsering.timer, icon: Clock },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center p-2.5 rounded-xl bg-muted/30 border border-border/50"
            >
              <item.icon className="w-4 h-4 text-muted-foreground mb-1.5" />
              <span className="text-lg font-bold text-foreground">{item.value}</span>
              <span className="text-[9px] text-muted-foreground font-medium uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 4. Sikkerhedsbarometer */}
      <AnalysisConfidenceMeter />
    </div>
  );
}

// ----------------------------------------------------------------------
// ERRORS CONTENT - Progressive Disclosure Design
// ----------------------------------------------------------------------

interface ErrorsContentProps {
  payslipData: PayslipData;
  validationResult: PayslipValidationResult;
  onOpenChat: () => void;
  onSendCase: () => void;
  onBooking: () => void;
}

// ----------------------------------------------------------------------
// ISSUE CARD - Accordion med Progressive Disclosure
// ----------------------------------------------------------------------

interface IssueCardProps {
  issue: PayslipDiscrepancy;
  payslipData: PayslipData;
  onOpenChat: () => void;
  onSendCase: () => void;
  onBooking: () => void;
}

// Struktureret konflikt-/info-kort (progressive disclosure) til betingede findings
function ConflictCardBody({
  cc,
  onSendCase,
  onBooking,
  isForward = false,
}: {
  cc: PayslipConflictCard;
  onSendCase: () => void;
  onBooking: () => void;
  isForward?: boolean;
}) {
  const [showCalc, setShowCalc] = useState(false);

  const SectionLabel = ({ children }: { children: ReactNode }) => (
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{children}</p>
  );

  return (
    <div className="space-y-4">
      {cc.problem && (
        <div>
          <SectionLabel>{isForward ? "Hvad sker der?" : "Hvad er problemet?"}</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed">{cc.problem}</p>
        </div>
      )}

      {cc.whatHappened && (
        <div>
          <SectionLabel>{isForward ? "For dig betyder det" : "Hvad skete der?"}</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed">{cc.whatHappened}</p>
        </div>
      )}

      {cc.options && cc.options.length > 0 && (
        <div>
          <SectionLabel>To mulige svar</SectionLabel>
          <div className="space-y-2">
            {cc.options.map((o, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {o.positive
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  : <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />}
                <span className="text-foreground leading-relaxed">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cc.breakdown && cc.breakdown.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-white overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); setShowCalc(v => !v); }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-primary"
          >
            <span className="flex items-center gap-2"><Calculator className="w-3.5 h-3.5" /> Se beregning</span>
            {showCalc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showCalc && (
            <div className="px-4 pb-3 pt-3 space-y-1.5 text-sm border-t border-border/50">
              {cc.breakdown.map((b, i) => (
                <div key={i} className="flex justify-between text-muted-foreground">
                  <span>{b.label}</span>
                  <span className="font-medium text-foreground">{b.amount}</span>
                </div>
              ))}
              {cc.breakdownTotal && (
                <div className="flex justify-between pt-2 mt-1 border-t border-dashed border-border font-bold text-foreground">
                  <span>I alt</span>
                  <span>{cc.breakdownTotal}</span>
                </div>
              )}
              {cc.breakdownNote && (
                <p className="text-xs text-muted-foreground pt-1">{cc.breakdownNote}</p>
              )}
            </div>
          )}
        </div>
      )}

      {cc.action && (
        <div>
          <SectionLabel>Hvad skal du gøre?</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed">{cc.action}</p>
        </div>
      )}

      {cc.ctas && cc.ctas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cc.ctas.map((cta, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (cta.action === "booking") onBooking();
                else onSendCase();
              }}
              className={cn(
                "flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors",
                i === 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10"
              )}
            >
              {cta.label}
            </button>
          ))}
        </div>
      )}

      {cc.footnote && (
        <p className="text-[11px] text-muted-foreground pt-1">{cc.footnote}</p>
      )}
    </div>
  );
}

function IssueCard({ issue, payslipData, onOpenChat, onSendCase, onBooking }: IssueCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const isError = issue.severity === "error";
  const isForward = !!issue.forwardLooking;
  const cc = issue.conflictCard;

  // Farvetone: forward-looking = blå (info), fejl = rød, ellers gul/amber
  const tone = isForward
    ? { border: "border-blue-200", openBg: "bg-blue-50/50", iconBg: "bg-blue-100", icon: "text-blue-600", title: "text-blue-700", pill: "text-blue-500", dot: "bg-blue-500", detailBg: "bg-blue-50/30 border-blue-100", badge: "Kommende hændelse" }
    : isError
    ? { border: "border-red-200", openBg: "bg-red-50/50", iconBg: "bg-red-100", icon: "text-red-600", title: "text-red-700", pill: "text-red-500", dot: "bg-red-500", detailBg: "bg-red-50/30 border-red-100", badge: "Automatisk verificeret" }
    : { border: "border-amber-200", openBg: "bg-amber-50/50", iconBg: "bg-amber-100", icon: "text-amber-600", title: "text-amber-700", pill: "text-amber-500", dot: "bg-amber-500", detailBg: "bg-amber-50/30 border-amber-100", badge: issue.conditional ? "Kræver afklaring" : "Kræver verifikation" };
  
  const parseCalculation = () => {
    if (!issue.calculation) return null;
    
    const ruleMatch = issue.calculation.match(/Rule:\s*([^,|]+)/);
    const fixedRateMatch = issue.calculation.match(/Sats:\s*(\d+[.,]?\d*)\s*kr\/t/);
    const expectedTimerMatch = issue.calculation.match(/Forventet:\s*(\d+)t/);
    const actualTimerMatch = issue.calculation.match(/Faktisk:\s*(\d+)t/);
    const percentMatch = issue.calculation.match(/(\d+\.?\d*)%\s*of\s*(\d+\.?\d*)\s*kr\/hr/);
    
    return {
      rule: ruleMatch?.[1]?.trim(),
      fixedRate: fixedRateMatch ? parseFloat(fixedRateMatch[1].replace(",", ".")) : null,
      expectedTimer: expectedTimerMatch ? parseInt(expectedTimerMatch[1]) : null,
      actualTimer: actualTimerMatch ? parseInt(actualTimerMatch[1]) : null,
      percent: percentMatch?.[1] ?? null,
      hourlyRate: percentMatch?.[2] ?? null,
    };
  };
  
  const calc = parseCalculation();
  
  const missingHours = (calc?.expectedTimer && calc?.actualTimer)
    ? calc.expectedTimer - calc.actualTimer
    : 0;

  return (
    <div className={cn(
      "bg-card border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md",
      tone.border
    )}>
      {/* Header - Altid synlig (klikbar) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 flex items-center justify-between transition-colors",
          isOpen ? tone.openBg : "bg-white hover:bg-muted/20"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            tone.iconBg
          )}>
            {isForward
              ? <Info className={cn("w-5 h-5", tone.icon)} />
              : <AlertCircle className={cn("w-5 h-5", tone.icon)} />}
          </div>
          <div className="text-left">
            <p className={cn("font-semibold", tone.title)}>
              {issue.title ?? getFieldLabel(issue.field)}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {cc?.subtitle
                ? cc.subtitle
                : missingHours > 0 
                ? `${missingHours} timer ikke honoreret`
                : issue.description.slice(0, 50) + "..."}
            </p>
            <span className={cn(
              "inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider",
              tone.pill
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", tone.dot)} />
              {tone.badge}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isForward && issue.difference !== 0 && (
            <span className={cn("font-bold text-lg", tone.icon)}>
              {issue.conditional ? "op til " : ""}{formatKr(Math.abs(issue.difference))}
            </span>
          )}
          {isOpen 
            ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
            : <ChevronDown className="w-5 h-5 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Detaljer - Kun synlig når åben (Progressive Disclosure) */}
      {isOpen && (
        <div className={cn(
          "p-4 border-t space-y-4 animate-in slide-in-from-top-2 duration-200",
          tone.detailBg
        )}>

          {/* Struktureret konflikt-/info-kort */}
          {cc ? (
            <ConflictCardBody cc={cc} onSendCase={onSendCase} onBooking={onBooking} isForward={isForward} />
          ) : (
          <>
          <div className="bg-white rounded-2xl p-3 text-sm text-foreground border border-border/50">
            {issue.description}
          </div>

          {/* Betinget finding (klassifikationskonflikt o.l.) — scenarier i stedet for "du mangler" */}
          {issue.conditional && (
            <>
              {issue.calculation && (
                <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Calculator className="w-3.5 h-3.5" />
                    Hvad betyder det for dig?
                  </div>
                  {issue.calculation.split("\n").filter(Boolean).map((line, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>
                  ))}
                </div>
              )}
              {issue.suggestion && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">{issue.suggestion}</p>
                </div>
              )}
            </>
          )}

          {/* Beregnings-blokken ("Bonnen") — kun for klassiske kr-fejl */}
          {!issue.conditional && (
          <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-primary uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Beregning
            </div>
            
            <div className="space-y-2 text-sm">
              {calc?.fixedRate && (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tillægssats</span>
                    <span className="font-medium">{calc.fixedRate.toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr/t</span>
                  </div>
                  {calc.expectedTimer != null && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Timer iflg. vagtplan</span>
                      <span className="font-medium">{calc.expectedTimer} timer</span>
                    </div>
                  )}
                  {calc.actualTimer != null && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Timer iflg. lønseddel</span>
                      <span className="font-medium">{calc.actualTimer} timer</span>
                    </div>
                  )}
                  {missingHours > 0 && (
                    <div className={cn(
                      "flex justify-between font-medium",
                      isError ? "text-red-600" : "text-amber-600"
                    )}>
                      <span>Manglende timer</span>
                      <span>{missingHours} timer</span>
                    </div>
                  )}
                </>
              )}

              {calc?.percent && calc?.hourlyRate && (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Din timeløn</span>
                    <span>{parseFloat(calc.hourlyRate).toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tillægssats</span>
                    <span className="font-medium">{calc.percent}%</span>
                  </div>
                </>
              )}
              
              <div className="border-t border-dashed border-border my-2 pt-2" />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Burde være udbetalt</span>
                <span className="font-semibold text-foreground">{formatKr(issue.expected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Faktisk udbetalt</span>
                <span className="font-semibold text-foreground">{formatKr(issue.actual)}</span>
              </div>
              
              <div className={cn(
                "flex justify-between p-2 rounded-lg mt-2 font-bold",
                isError ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              )}>
                <span>Du mangler</span>
                <span>{formatKr(Math.abs(issue.difference))}</span>
              </div>
            </div>
          </div>
          )}

          {/* Dokumentation / Referencer */}
          <ContractDocBadge rule={calc?.rule} />
          </>
          )}
        </div>
      )}
    </div>
  );
}

function AnalysisConfidenceMeter() {
  const { hasDetails, contractDetails } = useContract();
  const { isConnected: calendarConnected } = useCalendar();
  const { currentPayslip } = usePayslip();
  const { demoConfig } = useDemo();

  const isContractProfile = demoConfig.demoProfile === "contract";
  const hasLokalaftale = false;

  const sources: Array<{ label: string; ready: boolean; icon: React.ElementType; weight: number }> = [
    { label: "Lønseddel", ready: !!currentPayslip, icon: FileText, weight: 25 },
    { label: "Kontrakt", ready: hasDetails, icon: BadgeCheck, weight: 25 },
    { label: "Overenskomst", ready: true, icon: ShieldCheck, weight: 25 },
    ...(!isContractProfile
      ? [{ label: "Vagtplan", ready: calendarConnected, icon: Clock, weight: 17 }]
      : [{ label: "Lovgivning", ready: true, icon: ShieldCheck, weight: 17 }]),
    { label: "Lokalaftale", ready: hasLokalaftale, icon: Info, weight: 8 },
  ];

  const score = sources.reduce((sum, s) => sum + (s.ready ? s.weight : 0), 0);

  const getBarColor = () => {
    if (score >= 85) return "bg-accent";
    if (score >= 60) return "bg-primary";
    return "bg-amber-400";
  };

  const getLabel = () => {
    if (score >= 85) return "Høj sikkerhed";
    if (score >= 60) return "God sikkerhed";
    return "Begrænset datagrundlag";
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Analysesikkerhed
        </h3>
        <span className="text-sm font-bold text-foreground">{score} %</span>
      </div>

      <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getBarColor())}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">{getLabel()}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {sources.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            {s.ready ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className={cn(
              "text-xs",
              s.ready ? "text-foreground" : "text-muted-foreground"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-accent shrink-0" />
          <p className="text-[10px] text-muted-foreground">Matematisk verificeret (SMT-solver)</p>
        </div>
      </div>
    </div>
  );
}

function ContractDocBadge({ rule }: { rule?: string }) {
  const { hasDetails, contractDetails } = useContract();

  if (!hasDetails && !rule) return null;

  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
      <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div>
        <span className="font-medium text-primary block mb-0.5">
          {hasDetails ? "Baseret på din ansættelseskontrakt" : "Dokumentation"}
        </span>
        {hasDetails && contractDetails ? (
          <p>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-primary/20 text-primary">
              {contractDetails.collectiveAgreement.name}
            </span>
            {" "}— {contractDetails.salary.trinLabel}, {contractDetails.salary.hourlyRate.toFixed(2)} kr/t
          </p>
        ) : rule ? (
          <p>Baseret på <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-primary/20 text-primary">{rule}</span> i overenskomsten.</p>
        ) : null}
      </div>
    </div>
  );
}

function ErrorsContent({ payslipData, validationResult, onOpenChat, onSendCase, onBooking }: ErrorsContentProps) {
  const { discrepancies, summary } = validationResult;
  
  // Vis alle issues (både errors og warnings)
  const allIssues = discrepancies.filter(d => d.severity === "error" || d.severity === "warning");
  
  // Hvis ingen issues, vis success besked
  if (allIssues.length === 0) {
    return (
      <div className="px-4 pb-6 animate-fade-in">
        <div className="bg-accent/10 border border-accent/30 rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Alt ser godt ud! 🎉</h2>
          <p className="text-sm text-muted-foreground">
            Din lønseddel for {payslipData.period.month} matcher dine registrerede vagter.
          </p>
        </div>
      </div>
    );
  }
  
  const hasRealErrors = allIssues.some(i => i.severity === "error");
  const isConditional = allIssues.some(i => i.conditional) && !hasRealErrors;

  // Skel mellem advarsler (kræver afklaring) og fremtidige observationer (kommende hændelser)
  const forwardCount = allIssues.filter(i => i.forwardLooking).length;
  const warningCount = allIssues.length - forwardCount;
  const issueSummaryText = forwardCount > 0
    ? `${warningCount} ${warningCount === 1 ? "advarsel" : "advarsler"} + ${forwardCount} kommende hændelse${forwardCount > 1 ? "r" : ""}`
    : isConditional
    ? `${allIssues.length} forhold fundet`
    : `${allIssues.length} uoverensstemmelse${allIssues.length > 1 ? "r" : ""}`;
  
  return (
    <div className="px-4 pb-6 animate-fade-in">
      {/* Hero Summary Card - Clean Design */}
      <div className={cn(
        "rounded-3xl p-6 mb-6 relative overflow-hidden border",
        hasRealErrors 
          ? "bg-red-50/50 border-red-200" 
          : "bg-amber-50/50 border-amber-200"
      )}>
        <div className="relative">
          <div className={cn(
            "flex items-center gap-2 font-medium mb-2",
            hasRealErrors ? "text-red-600" : "text-amber-600"
          )}>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">
              {isConditional ? "Afklaring nødvendig — " : "Vi har fundet "}{issueSummaryText}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className={cn(
              "text-4xl font-bold",
              hasRealErrors ? "text-red-600" : "text-amber-600"
            )}>{isConditional ? "op til " : ""}{formatKr(Math.abs(summary.totalDifference))}</span>
            <span className="text-sm text-muted-foreground">
              {isConditional ? "afhænger af din ansættelsesform" : "mangler"}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {isConditional
              ? "Klik på hvert forhold nedenfor for at se hvad du kan gøre"
              : "Klik på hver fejl nedenfor for at se beregning og dokumentation"}
          </p>
        </div>
      </div>

      {/* Issue Cards - Accordion Style */}
      <div className="space-y-3 mb-6">
        {allIssues.map((issue) => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            payslipData={payslipData}
            onOpenChat={onOpenChat}
            onSendCase={onSendCase}
            onBooking={onBooking}
          />
        ))}
      </div>

      {/* Action Button */}
      <Button 
        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
        onClick={onSendCase}
      >
        {isConditional ? "Send spørgsmål til arbejdsgiver" : "Send til arbejdsgiver"}
      </Button>
      
      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Vi genererer automatisk en rapport med alle beregninger og referencer
      </p>
    </div>
  );
}
