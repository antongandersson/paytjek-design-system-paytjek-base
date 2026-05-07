import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useDemo } from "@/contexts/DemoContext";
import {
  Banknote, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle,
  TrendingUp, Lock, Lightbulb, GraduationCap, PiggyBank,
  ShieldCheck, Sparkles, ArrowRight, FileText,
  Scale, Clock, Briefcase, Calendar, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import type {
  ContractIntelligence,
  DemoContractAnalysis,
  TerminationIntelligence,
  TerminationScenario,
} from "@/lib/demoUnionConfigs";
import type { AggregatedStats } from "@/contexts/PayslipContext";

const formatKr = (n: number) =>
  n.toLocaleString("da-DK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ─────────────────────────────────────────────
// 1. PACKAGE HERO — total only, links to /package
// ─────────────────────────────────────────────

interface PackageHeroProps {
  intel: ContractIntelligence;
  analysis?: DemoContractAnalysis;
}

export function PackageHero({ intel, analysis }: PackageHeroProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();

  const hasDeviation = analysis && analysis.deviations > 0;

  return (
    <div
      className="rounded-3xl bg-primary px-6 pt-6 pb-5 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => navigate(`${basePath}/package`)}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-bold text-primary-foreground/50 uppercase tracking-widest">
          Din lønpakke
        </p>
        {analysis && (
          <span className="inline-flex items-center gap-1 text-[11px] text-primary-foreground/50 bg-primary-foreground/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="h-3 w-3" />
            {analysis.compliant}/{analysis.totalClauses} vilkår OK
          </span>
        )}
      </div>

      <p className="text-6xl font-black text-primary-foreground leading-none tracking-tight tabular-nums">
        {formatKr(intel.totalPackage)}
      </p>
      <p className="text-2xl font-bold text-primary-foreground/60 mt-1">kr / måned</p>

      <div className="border-t border-primary-foreground/10 mt-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasDeviation ? (
            <>
              <AlertCircle className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs text-primary-foreground/60">
                {analysis.deviations} kontraktafvigelse
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-green-300" />
              <span className="text-xs text-primary-foreground/60">Alle vilkår OK</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-primary-foreground font-semibold">
          Se detaljer
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. SMART ACTION CARD — context-aware single card
//    Shows løntjek result OR negotiation nudge
// ─────────────────────────────────────────────

interface SmartActionCardProps {
  stats: AggregatedStats;
  intel: ContractIntelligence;
  onUploadClick: () => void;
}

export function SmartActionCard({ stats, intel, onUploadClick }: SmartActionCardProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();

  const hasPayslipResult = stats.payslipsChecked > 0;
  const hasErrors = stats.payslipsWithErrors > 0;

  if (hasPayslipResult && hasErrors) {
    const amountStr = Math.abs(stats.totalDifferenceOwed)
      .toLocaleString("da-DK", { maximumFractionDigits: 0 });

    return (
      <Card
        className="border-border/50 cursor-pointer hover:border-destructive/30 transition-colors overflow-hidden"
        onClick={() => navigate(`${basePath}/history`)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-destructive tabular-nums">−{amountStr} kr</p>
            <p className="text-xs text-muted-foreground">
              {stats.payslipsWithErrors} fejl fundet på {stats.payslipsChecked} lønsed{stats.payslipsChecked === 1 ? "del" : "ler"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </CardContent>
      </Card>
    );
  }

  if (hasPayslipResult && !hasErrors) {
    return (
      <Card
        className="border-border/50 cursor-pointer hover:border-green-500/30 transition-colors"
        onClick={() => navigate(`${basePath}/history`)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Løn ser korrekt ud</p>
            <p className="text-xs text-muted-foreground">
              {stats.payslipsChecked} lønsed{stats.payslipsChecked === 1 ? "del" : "ler"} tjekket — ingen fejl
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </CardContent>
      </Card>
    );
  }

  const potentialPoints = intel.negotiationPoints.filter(p => p.status === "potential");
  if (potentialPoints.length > 0 && potentialPoints[0].benchmark) {
    return (
      <Card
        className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => navigate(`${basePath}/contract`)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Du kan muligvis forhandle mere</p>
            <p className="text-xs text-muted-foreground">
              {potentialPoints[0].label}: {potentialPoints[0].benchmark}
            </p>
            <p className="text-[10px] text-muted-foreground/50 italic mt-0.5">
              Baseret på markedsdata
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onUploadClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Tjek din næste lønseddel</p>
          <p className="text-xs text-muted-foreground">
            Upload og få svar på 30 sekunder
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 3. SALARY BREAKDOWN — full detail (for /package page)
// ─────────────────────────────────────────────

interface SalaryBreakdownProps {
  intel: ContractIntelligence;
}

export function SalaryBreakdown({ intel }: SalaryBreakdownProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Banknote className="w-4 h-4" />
          Lønpakke-detaljer
        </h3>

        <div className="space-y-2">
          {intel.salaryComponents.map((comp) => (
            <div key={comp.label} className="flex items-center justify-between">
              <div>
                <span className="text-sm text-foreground">{comp.label}</span>
                {comp.sublabel && (
                  <span className="text-xs text-muted-foreground ml-1.5">({comp.sublabel})</span>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {formatKr(comp.amount)} kr
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-sm font-bold text-foreground">Bruttoløn i alt</span>
            <span className="text-sm font-bold text-primary tabular-nums">
              {formatKr(intel.totalPackage)} kr
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/30 space-y-1.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Pensionsindbetaling
          </p>
          {intel.pension.components.map((comp) => (
            <div key={comp.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {comp.label} <span className="text-xs">({comp.percent}%)</span>
              </span>
              <span className="font-medium text-foreground tabular-nums">{formatKr(comp.monthly)} kr</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-muted-foreground font-medium">
              Samlet → {intel.pension.provider}
            </span>
            <span className="font-bold text-green-600 tabular-nums">
              {formatKr(intel.pension.components.reduce((s, c) => s + c.monthly, 0))} kr/md
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 4. CONTRACT CHECKLIST — vilkår med checkmarks
// ─────────────────────────────────────────────

interface ContractChecklistProps {
  analysis: DemoContractAnalysis;
}

export function ContractChecklist({ analysis }: ContractChecklistProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Vilkårstjek
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> {analysis.compliant} OK
          </span>
          {analysis.deviations > 0 && (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" /> {analysis.deviations} afvig.
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {analysis.clauses.map((clause) => (
          <div
            key={clause.clause}
            className={`flex items-start gap-2.5 p-3 rounded-xl ${
              clause.status === "deviation" ? "bg-amber-50" : "bg-green-50/50"
            }`}
          >
            {clause.status === "compliant" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0">
              <p className={`text-sm leading-snug ${
                clause.status === "deviation" ? "font-semibold text-amber-700" : "text-foreground"
              }`}>
                {clause.clause}
              </p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {clause.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. PENSION FRITVALG — conversion card (for /package page)
// ─────────────────────────────────────────────

interface PensionFritvalgProps {
  intel: ContractIntelligence;
}

export function PensionFritvalg({ intel }: PensionFritvalgProps) {
  const { pension } = intel;
  if (pension.fritvalgPercent <= 0) return null;

  const totalMonthly = pension.components.reduce((s, c) => s + c.monthly, 0);

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-accent/30">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <PiggyBank className="w-4 h-4" />
          Pension & Fritvalg
        </h3>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">{pension.totalPercent}%</span>
            <span className="text-sm text-muted-foreground ml-1.5">samlet pension</span>
          </div>
          <span className="text-xs text-muted-foreground">→ {pension.provider}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-center p-2 rounded-xl bg-background/60">
            <p className="text-lg font-bold text-foreground">{pension.minimumPercent}%</p>
            <p className="text-[10px] text-muted-foreground">Minimum</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-background/60">
            <p className="text-lg font-bold text-primary">{pension.fritvalgPercent}%</p>
            <p className="text-[10px] text-muted-foreground">Fritvalg</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-background/60">
            <p className="text-lg font-bold text-foreground">{formatKr(totalMonthly)}</p>
            <p className="text-[10px] text-muted-foreground">kr/md total</p>
          </div>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Du kan vælge ~{formatKr(pension.fritvalgMonthly)} kr/md ekstra i løn
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pension.fritvalgPercent}%-point over minimumsgrænsen ({pension.minimumPercent}%)
                kan konverteres fra pension til udbetaling
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 6. CAREER TIMELINE — trin-progression (for contract page)
// ─────────────────────────────────────────────

interface CareerTimelineProps {
  intel: ContractIntelligence;
}

export function CareerTimeline({ intel }: CareerTimelineProps) {
  if (intel.careerSteps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <GraduationCap className="w-4 h-4" />
        Karriereforløb
      </h3>

      <div className="relative pl-5">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        {intel.careerSteps.map((step, i) => (
          <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
            <div className={`absolute left-[-13px] top-1.5 w-3 h-3 rounded-full border-2 ${
              step.isCurrent
                ? "bg-primary border-primary"
                : step.isFuture
                  ? "bg-background border-dashed border-muted-foreground/40"
                  : "bg-background border-muted-foreground/30"
            }`} />

            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-semibold ${
                  step.isCurrent ? "text-primary" : step.isFuture ? "text-muted-foreground" : "text-foreground"
                }`}>
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground">{step.date}</span>
              </div>
              <p className={`text-xs mt-0.5 ${
                step.isFuture ? "text-muted-foreground italic" : "text-muted-foreground"
              }`}>
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. NEGOTIATION CARD — "Hvad kan du forhandle om?" (for contract page)
// ─────────────────────────────────────────────

interface NegotiationCardProps {
  intel: ContractIntelligence;
}

const statusConfig = {
  active: { icon: CheckCircle2, color: "text-green-500", label: "Aktiv" },
  potential: { icon: Lightbulb, color: "text-amber-500", label: "Potentiale" },
  locked: { icon: Lock, color: "text-muted-foreground", label: "Låst" },
} as const;

export function NegotiationCard({ intel }: NegotiationCardProps) {
  if (intel.negotiationPoints.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Forhandlingsmuligheder
      </h3>

      <div className="space-y-2.5">
        {intel.negotiationPoints.map((point) => {
          const cfg = statusConfig[point.status];
          const Icon = cfg.icon;

          return (
            <div key={point.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{point.label}</span>
                  {point.benchmark && (
                    <span className="text-xs font-semibold text-primary whitespace-nowrap">
                      {point.benchmark}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {point.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/60 italic mt-1">
        Beløbsestimater er baseret på markedsdata
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. TERMINATION CARD — opsigelsesscenarier
// ─────────────────────────────────────────────

function computeLastWorkDay(today: Date, noticeMonths: number): Date {
  const endOfNotice = new Date(today.getFullYear(), today.getMonth() + noticeMonths + 1, 0);
  return endOfNotice;
}

function formatDanishDate(d: Date): string {
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

const timelineIconMap = {
  calendar: Calendar,
  clock: Clock,
  briefcase: Briefcase,
  shield: ShieldCheck,
  banknote: Banknote,
  alert: AlertTriangle,
} as const;

const detailStatusStyles = {
  info: "bg-muted/30 text-foreground",
  warning: "bg-amber-50 text-amber-800",
  positive: "bg-green-50 text-green-800",
  future: "bg-primary/5 text-primary",
} as const;

const detailStatusIcons = {
  info: null,
  warning: AlertTriangle,
  positive: CheckCircle2,
  future: Clock,
} as const;

function ScenarioPanel({ scenario, noticeMonths }: { scenario: TerminationScenario; noticeMonths: number }) {
  const [expanded, setExpanded] = useState(false);
  const today = new Date();
  const lastDay = computeLastWorkDay(today, noticeMonths);

  const todayStr = today.toLocaleDateString("da-DK", { day: "numeric", month: "long" });

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-sm font-bold text-foreground">{scenario.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Varsel: {scenario.noticePeriod}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5">
            <p className="text-xs text-primary font-semibold">
              Opsiger du/opsiges du i dag ({todayStr})
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              → Sidste arbejdsdag: {formatDanishDate(lastDay)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {scenario.legalBasis}
            </p>
          </div>

          <div className="space-y-1.5">
            {scenario.details.map((detail) => {
              const StatusIcon = detailStatusIcons[detail.status];
              return (
                <div
                  key={detail.label}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl ${detailStatusStyles[detail.status]}`}
                >
                  {StatusIcon && <StatusIcon className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-70" />}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-snug">{detail.label}</p>
                    <p className="text-xs opacity-80 leading-snug mt-0.5">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {scenario.timeline && scenario.timeline.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Forløb
              </p>
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {scenario.timeline.map((step, i) => {
                  const Icon = timelineIconMap[step.icon];
                  const isLast = i === scenario.timeline!.length - 1;
                  return (
                    <div key={i} className="relative flex items-start gap-3 pb-3 last:pb-0">
                      <div className="absolute left-[-13px] top-1 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center">
                        <Icon className="h-2 w-2 text-primary/60" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold ${isLast ? "text-primary" : "text-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-snug">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TerminationCardProps {
  termination: TerminationIntelligence;
}

export function TerminationCard({ termination }: TerminationCardProps) {
  const today = new Date();
  const start = new Date(termination.anciennityStartDate);
  const anciennityYears = Math.floor((today.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Scale className="w-4 h-4" />
        Opsigelse & Rettigheder
      </h3>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="px-2 py-1 rounded-lg bg-muted/30 font-medium">
          {anciennityYears}+ års anciennitet
        </span>
        {termination.isFunktionaer && (
          <span className="px-2 py-1 rounded-lg bg-primary/5 text-primary font-medium">
            Funktionær
          </span>
        )}
      </div>

      <div className="space-y-2">
        {termination.scenarios.map((scenario, i) => (
          <ScenarioPanel
            key={i}
            scenario={scenario}
            noticeMonths={i === 0 ? termination.employeeNoticePeriodMonths : termination.employerNoticePeriodMonths}
          />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/60 italic">
        Baseret på din kontrakt, overenskomst og funktionærloven
      </p>
    </div>
  );
}
