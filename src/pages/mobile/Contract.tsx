import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  Briefcase,
  Clock,
  Coins,
  Moon,
  Sun,
  CalendarDays,
  Shield,
  Building2,
  BadgeCheck,
  Loader2,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContract } from "@/contexts/ContractContext";
import { useUser } from "@/contexts/UserContext";
import { useDemo } from "@/contexts/DemoContext";
import { CONTRACT_ANALYSIS_STEPS } from "@/lib/demoContract";
import type { ContractDetails } from "@/lib/demoContract";
import { cn } from "@/lib/utils";
import {
  ContractChecklist,
  TerminationCard,
} from "@/components/home/ContractDashboard";

type ViewState = "upload" | "analyzing" | "overview";

export default function MobileContract() {
  const navigate = useNavigate();
  const {
    contract,
    contractDetails,
    hasContract,
    hasDetails,
    isUploading,
    analysisState,
    analysisProgress,
    uploadContract,
  } = useContract();
  const { updateUser } = useUser();
  const { demoConfig, basePath } = useDemo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileUpdatedRef = useRef(false);

  const isContractProfile = demoConfig.demoProfile === "contract";

  const [view, setView] = useState<ViewState>(() => {
    if (hasDetails) return "overview";
    if (hasContract) return "analyzing";
    return "upload";
  });

  // React to analysis state changes
  useEffect(() => {
    if (analysisState === "analyzing") setView("analyzing");
    if (analysisState === "done" && contractDetails) setView("overview");
  }, [analysisState, contractDetails]);

  // Auto-populate user profile when contract details arrive
  useEffect(() => {
    if (contractDetails && !profileUpdatedRef.current) {
      profileUpdatedRef.current = true;
      updateUser({
        employer: contractDetails.employer.name,
        jobTitle: contractDetails.employment.title,
        department: contractDetails.employer.department,
        employmentType: contractDetails.employment.type,
        seniorityDate: contractDetails.employment.startDate,
        yearsOfExperience: contractDetails.salary.seniorityYears,
        collectiveAgreement: contractDetails.collectiveAgreement.name,
        collectiveAgreementId: contractDetails.collectiveAgreement.id,
        avgHoursPerWeek: contractDetails.employment.weeklyHours,
      });
    }
  }, [contractDetails]);

  const handleFileSelect = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadContract(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="animate-fade-in min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Ansættelseskontrakt</h1>
          <div className="w-10" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      {view === "upload" && (
        <UploadView onSelect={handleFileSelect} isUploading={isUploading} />
      )}
      {view === "analyzing" && (
        <AnalyzingView progress={analysisProgress} isContractProfile={isContractProfile} />
      )}
      {view === "overview" && contractDetails && (
        <OverviewView
          details={contractDetails}
          filename={contract?.filename}
          onGoHome={() => navigate(`${basePath}/home`)}
          demoContractAnalysis={isContractProfile ? demoConfig.demoContractAnalysis : undefined}
          contractIntelligence={isContractProfile ? demoConfig.contractIntelligence : undefined}
        />
      )}
    </main>
  );
}

// ──────────────────────────────────────────────
// UPLOAD VIEW
// ──────────────────────────────────────────────

function UploadView({ onSelect, isUploading }: { onSelect: () => void; isUploading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Upload din kontrakt</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
        Vi analyserer din ansættelseskontrakt og udtrækker lønsatser, overenskomst og vilkår automatisk.
      </p>

      <Button
        size="lg"
        className="w-full max-w-xs h-14 text-base font-bold rounded-2xl gap-2"
        onClick={onSelect}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
        {isUploading ? "Uploader..." : "Vælg fil"}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        PDF, Word eller billede — maks 10 MB
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────
// ANALYZING VIEW
// ──────────────────────────────────────────────

function AnalyzingView({ progress, isContractProfile }: { progress: number; isContractProfile: boolean }) {
  const steps = isContractProfile
    ? [...CONTRACT_ANALYSIS_STEPS, { id: "legal", label: "Tjekker mod gældende lovgivning" }]
    : CONTRACT_ANALYSIS_STEPS;

  const stepIndex = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1
  );

  return (
    <div className="flex flex-col items-center px-6 pt-16 pb-10">
      {/* Progress ring */}
      <div className="relative w-32 h-32 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-muted" />
          <circle
            cx="50" cy="50" r="42" fill="none" strokeWidth="6"
            className="stroke-primary transition-all duration-500"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.64} 264`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-6">Analyserer kontrakt</h2>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => {
          const isComplete = i < stepIndex;
          const isActive = i === stepIndex;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                isComplete && "bg-accent/10",
                isActive && "bg-primary/10",
                !isComplete && !isActive && "opacity-40"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-primary shrink-0 animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isComplete && "text-accent",
                isActive && "text-primary",
                !isComplete && !isActive && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// OVERVIEW VIEW
// ──────────────────────────────────────────────

function OverviewView({
  details,
  filename,
  onGoHome,
  demoContractAnalysis,
  contractIntelligence,
}: {
  details: ContractDetails;
  filename?: string;
  onGoHome: () => void;
  demoContractAnalysis?: import("@/lib/demoUnionConfigs").DemoContractAnalysis;
  contractIntelligence?: import("@/lib/demoUnionConfigs").ContractIntelligence;
}) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="px-4 pb-24 pt-2 space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="bg-primary rounded-[2rem] p-6 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck className="w-5 h-5 text-primary-foreground/70" />
            <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">
              Kontrakt verificeret
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{details.employee.name}</h2>
          <p className="text-primary-foreground/70 text-sm">
            {details.employment.title} — {details.employer.name}
          </p>
          {filename && (
            <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-xs">
              <FileText className="w-3.5 h-3.5" />
              {filename}
            </div>
          )}
        </div>
      </div>

      {/* Overenskomst */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Overenskomst</p>
            <p className="font-bold text-foreground text-sm">{details.collectiveAgreement.name}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {details.collectiveAgreement.unionFullName}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {details.collectiveAgreement.employerOrg}
          </span>
        </div>
      </div>

      {/* Ansættelsesvilkår */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5" />
          Ansættelse
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <InfoCell label="Stilling" value={details.employment.title} />
          <InfoCell label="Ansættelsestype" value={details.employment.type === "permanent" ? "Fast" : "Midlertidig"} />
          <InfoCell label="Ansat siden" value={formatDate(details.employment.startDate)} />
          <InfoCell label="Ugentlige timer" value={`${details.employment.weeklyHours} timer`} />
          <InfoCell label="Prøveperiode" value={`${details.employment.probationMonths} mdr.`} />
          <InfoCell label="Opsigelse" value={`${details.employment.noticePeriodMonths} mdr.`} />
        </div>
      </div>

      {/* Lønsatser */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5" />
          Lønsatser
        </h3>

        {/* Grundløn hero */}
        <div className="bg-primary/5 rounded-xl p-4 mb-3 flex items-center justify-between border border-primary/10">
          <div>
            <p className="text-xs text-muted-foreground">Grundtimeløn</p>
            <p className="text-2xl font-bold text-foreground">{details.salary.hourlyRate.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kr/t</span></p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold">
            {details.salary.trinLabel}
          </span>
        </div>

        {details.salary.fritvalgPercent > 0 && !contractIntelligence && (
          <div className="flex items-center justify-between py-2 px-1 mb-2">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Fritvalgs Lønkonto</p>
            </div>
            <span className="text-sm font-bold text-foreground">{details.salary.fritvalgPercent}%</span>
          </div>
        )}

        {/* Tillæg */}
        <div className="space-y-2">
          {details.supplements.type === 'fixed' ? (
            <>
              <SupplementRow icon={Moon} label={details.supplements.evening.label} rate={details.supplements.evening.rate} hours={details.supplements.evening.hours} />
              <SupplementRow icon={CalendarDays} label={details.supplements.saturday.label} rate={details.supplements.saturday.rate} hours={details.supplements.saturday.hours} />
              <SupplementRow icon={Sun} label={details.supplements.sunday.label} rate={details.supplements.sunday.rate} hours={details.supplements.sunday.hours} />
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-1">{details.supplements.description}</p>
              {details.supplements.rules.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-1">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{r.label}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">{r.rule}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bruttoløn total — only for contract profiles with intel data */}
        {contractIntelligence && (
          <div className="flex items-center justify-between py-3 px-1 mt-2 border-t border-border/40">
            <p className="text-sm font-bold text-foreground">Bruttoløn i alt</p>
            <span className="text-sm font-bold text-primary">
              {contractIntelligence.totalPackage.toLocaleString("da-DK")} kr/md
            </span>
          </div>
        )}
      </div>

      {/* Pension */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" />
          Pension
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-lg font-bold text-foreground">{details.pension.employeePercent}%</p>
            <p className="text-[10px] text-muted-foreground uppercase">Egetbidrag</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-lg font-bold text-foreground">{details.pension.employerPercent}%</p>
            <p className="text-[10px] text-muted-foreground uppercase">Arbejdsgiver</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-lg font-bold text-foreground">{details.pension.employeePercent + details.pension.employerPercent}%</p>
            <p className="text-[10px] text-muted-foreground uppercase">I alt</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{details.pension.provider}</p>

        {/* Fritvalg nudge */}
        {contractIntelligence && contractIntelligence.pension.fritvalgPercent > 0 && (
          <div className="mt-3 rounded-xl bg-primary/5 border border-primary/10 p-3 flex items-start gap-2">
            <Coins className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Fritvalg: ~{contractIntelligence.pension.fritvalgMonthly.toLocaleString("da-DK")} kr/md
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contractIntelligence.pension.fritvalgPercent}%-point over minimumsgrænsen ({contractIntelligence.pension.minimumPercent}%) kan udbetales som løn
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ferie */}
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="font-bold text-foreground">{details.vacation.daysPerYear} feriedage / år</p>
          <p className="text-xs text-muted-foreground">{details.vacation.type}</p>
        </div>
      </div>

      {/* Underskrift dato */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Kontrakt underskrevet {formatDate(details.signedDate)}
      </div>

      {/* Vilkårstjek — contract profiles get the enhanced checklist */}
      {demoContractAnalysis && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <ContractChecklist analysis={demoContractAnalysis} />
        </div>
      )}

      {/* Opsigelse & rettigheder */}
      {contractIntelligence?.termination && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <TerminationCard termination={contractIntelligence.termination} />
        </div>
      )}

      {/* CTA */}
      <Button
        className="w-full h-14 text-base font-bold rounded-2xl"
        onClick={onGoHome}
      >
        Gå til dashboard
      </Button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Small helpers
// ──────────────────────────────────────────────

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-xl px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SupplementRow({
  icon: Icon,
  label,
  rate,
  hours,
}: {
  icon: React.ElementType;
  label: string;
  rate: number;
  hours: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{hours}</p>
        </div>
      </div>
      <span className="text-sm font-bold text-foreground">+{rate.toFixed(2)} kr/t</span>
    </div>
  );
}


