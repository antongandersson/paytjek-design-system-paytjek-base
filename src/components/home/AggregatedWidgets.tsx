import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";
import {
  CheckCircle2, AlertCircle, Clock, TrendingUp, Banknote,
  Moon, Sun as SunIcon, Briefcase, ShieldCheck, ChevronRight,
  Receipt, Landmark, CalendarDays, FileText, Lock,
} from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import type { AggregatedStats } from "@/contexts/PayslipContext";
import type { ContractDetails } from "@/lib/demoContract";
import type { Shift } from "@/contexts/CalendarContext";
import type { DemoProfile, DemoContractComparison, DemoContractAnalysis } from "@/lib/demoUnionConfigs";
import { runArbejdsmiljoCheck, countArbejdsmiljoIssues } from "@/lib/utils/arbejdsmiljoCheck";

// ─────────────────────────────────────────────
// 1. STATUS HERO — stor bold card (reference style)
// ─────────────────────────────────────────────

interface StatusHeroProps {
  stats: AggregatedStats;
}

export function StatusHero({ stats }: StatusHeroProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  if (stats.payslipsChecked === 0) return null;

  const hasIssues = stats.payslipsWithErrors > 0;
  const amountStr = Math.abs(stats.totalDifferenceOwed)
    .toLocaleString("da-DK", { maximumFractionDigits: 0 });

  if (hasIssues) {
    return (
      <div
        className="rounded-3xl bg-primary px-6 pt-6 pb-5 cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => navigate(`${basePath}/history`)}
      >
        {/* Eyebrow row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-bold text-primary-foreground/50 uppercase tracking-widest">
            Løntjek resultat
          </p>
          <span className="text-[11px] text-primary-foreground/40">
            {stats.payslipsChecked} lønsedler
          </span>
        </div>

        {/* Hero number */}
        <p className="text-6xl font-black text-primary-foreground leading-none tracking-tight tabular-nums">
          −{amountStr}
        </p>
        <p className="text-2xl font-bold text-primary-foreground/60 mt-1">kr</p>

        <p className="text-primary-foreground/70 text-sm mt-3 leading-snug">
          mangler i efterbetaling — klik for at se hvad du kan gøre
        </p>

        {/* Divider + action row */}
        <div className="border-t border-primary-foreground/10 mt-5 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-primary-foreground/40" />
            <span className="text-xs text-primary-foreground/50">
              {stats.payslipsWithErrors} fejl fundet
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary-foreground font-semibold">
            Se detaljer
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // OK state — teal/success card
  return (
    <div className="rounded-3xl px-6 pt-6 pb-5" style={{ background: "hsl(var(--success))" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
          Løntjek resultat
        </p>
        <span className="text-[11px] text-white/40">{stats.payslipsChecked} lønsedler</span>
      </div>

      <p className="text-6xl font-black text-white leading-none tracking-tight">Alt ok</p>
      <p className="text-white/70 text-sm mt-3 leading-snug">
        Ingen fejl fundet — din løn ser rigtig ud
      </p>

      <div className="border-t border-white/10 mt-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-white/40" />
          <span className="text-xs text-white/50">
            {stats.payslipsChecked} lønsed{stats.payslipsChecked === 1 ? "del" : "ler"} tjekket
          </span>
        </div>
        <div
          className="flex items-center gap-1 text-xs text-white font-semibold cursor-pointer"
          onClick={() => navigate(`${basePath}/history`)}
        >
          Se historik <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 1a. CONTRACT STATUS HERO — for contract-only profiles
// ─────────────────────────────────────────────

interface ContractStatusHeroProps {
  analysis: DemoContractAnalysis;
  hasContract: boolean;
  contractDetails: ContractDetails | null;
  onUploadContract: () => void;
}

export function ContractStatusHero({
  analysis,
  hasContract,
  contractDetails,
  onUploadContract,
}: ContractStatusHeroProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();

  // Ingen kontrakt endnu — stor inviterende CTA
  if (!hasContract) {
    return (
      <div
        className="rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 px-6 pt-8 pb-7 cursor-pointer active:scale-[0.99] transition-all hover:border-primary/40 hover:bg-primary/8"
        onClick={onUploadContract}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Upload din ansættelseskontrakt
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
            Vi tjekker automatisk om dine vilkår er korrekte og finder eventuelle afvigelser
          </p>
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold text-sm">
            <FileText className="w-4 h-4" />
            Vælg fil
          </div>
          <p className="text-xs text-muted-foreground mt-3">PDF, Word eller billede</p>
        </div>
      </div>
    );
  }

  const employer = contractDetails?.employer.name ?? "";
  const trinLabel = contractDetails?.salary.trinLabel ?? "";
  const weeklyHours = contractDetails?.employment.weeklyHours;
  const hasDeviation = analysis.deviations > 0;
  const missingCount = analysis.clauses.filter(c => c.status === "missing").length;
  const deviationCount = analysis.clauses.filter(c => c.status === "deviation").length;

  return (
    <div className="space-y-3">
      {/* Kontraktkort */}
      <div
        className="rounded-2xl bg-card border border-border p-4 cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => navigate(`${basePath}/contract`)}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3 w-3" /> Kontrakt
          </p>
          {hasDeviation ? (
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          )}
        </div>
        <p className="text-base font-bold text-foreground">{employer}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {trinLabel} · Fuldtid · {weeklyHours ? `${(weeklyHours * 4.33).toFixed(2).replace(".", ",")} t/md` : "154,12 t/md"}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> {analysis.compliant}/{analysis.totalClauses} OK
          </span>
          {deviationCount > 0 && (
            <span className="text-red-600 font-semibold">{deviationCount} fejl</span>
          )}
          {missingCount > 0 && (
            <span className="text-amber-600 font-semibold">{missingCount} mangler</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold">
          Se detaljer <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Dine Rettigheder highlights */}
      <div
        className="rounded-2xl bg-card border border-border p-4 cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => navigate(`${basePath}/contract`)}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" /> Dine rettigheder
          </p>
        </div>

        <div className="space-y-2">
          <RightsHighlightRow emoji="💰" text={`Grundløn ${trinLabel}: ${contractDetails?.salary.hourlyRate ? (contractDetails.salary.hourlyRate * (weeklyHours ? weeklyHours * 4.33 : 154.12) / (weeklyHours ? weeklyHours * 4.33 : 154.12)).toFixed(2).replace(".", ",") : "200,80"} kr/t`} />
          <RightsHighlightRow emoji="🏥" text="Fuld løn under sygdom" />
          <RightsHighlightRow emoji="🔒" text={`${contractDetails?.employment.noticePeriodMonths ?? 4} mdr. opsigelsesvarsel`} />
          <RightsHighlightRow emoji="📚" text="2 ugers uddannelsesret/år" />
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold">
          Se alle rettigheder <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

function RightsHighlightRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm">{emoji}</span>
      <span className="text-sm text-foreground">{text}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 1b. DASHBOARD CONTEXT ROW — kontrakt + vagtplan
// ─────────────────────────────────────────────

interface DashboardContextRowProps {
  contractDetails: ContractDetails | null;
  shifts: Shift[];
  hasCalendar: boolean;
  hasPayslipData?: boolean;
  demoProfile?: DemoProfile;
  demoContractComparison?: DemoContractComparison;
  demoContractAnalysis?: DemoContractAnalysis;
}

export function DashboardContextRow({
  contractDetails,
  shifts,
  hasCalendar,
  hasPayslipData = false,
  demoProfile = "agreement",
  demoContractComparison,
  demoContractAnalysis,
}: DashboardContextRowProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();

  // Find næste kommende vagt
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextShift = shifts
    .filter((s) => new Date(s.date) >= today && s.type !== "day-off")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const formatShiftDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" });
  };

  const formatKr = (n: number) =>
    n.toLocaleString("da-DK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const hasContractAnalysis = (demoProfile === "contract" || demoProfile === "contract-only") && !!demoContractAnalysis;
  const careerUnlocked = demoProfile === "contract" && !!contractDetails && hasPayslipData;

  if (demoProfile === "contract-only") {
    return (
      <div className="grid grid-cols-1 gap-3">
        <Card
          className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate(`${basePath}/contract`)}
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Kontrakt
              </p>
              {contractDetails && (
                demoContractAnalysis && demoContractAnalysis.deviations > 0
                  ? <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  : <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              )}
            </div>
            {contractDetails ? (
              <>
                <p className="text-sm font-bold text-foreground leading-snug">
                  {contractDetails.employer.name}
                </p>
                {demoContractAnalysis ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {demoContractAnalysis.deviations > 0 ? (
                      <span className="text-amber-600 font-semibold">
                        {demoContractAnalysis.deviations} afvigelse fundet
                      </span>
                    ) : (
                      <span>Alle vilkår OK</span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {contractDetails.salary.hourlyRate.toFixed(0)} kr/t
                    {" · "}
                    {contractDetails.employment.weeklyHours}t/uge
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Upload din kontrakt for at komme i gang</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Kontrakt card — altid til venstre */}
      <Card
        className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => navigate(`${basePath}/contract`)}
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Kontrakt
            </p>
            {contractDetails && (
              hasContractAnalysis && demoContractAnalysis && demoContractAnalysis.deviations > 0
                ? <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                : <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            )}
          </div>
          {contractDetails ? (
            <>
              <p className="text-sm font-bold text-foreground leading-snug">
                {contractDetails.employer.name}
              </p>
              {hasContractAnalysis && demoContractAnalysis ? (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {demoContractAnalysis.deviations > 0 ? (
                    <span className="text-amber-600 font-semibold">
                      {demoContractAnalysis.deviations} afvigelse fundet
                    </span>
                  ) : (
                    <span>Alle vilkår OK</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {contractDetails.salary.hourlyRate.toFixed(0)} kr/t
                  {" · "}
                  {contractDetails.employment.weeklyHours}t/uge
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Ikke uploadet</p>
          )}
        </CardContent>
      </Card>

      {/* Højre card: Karriere (contract-profil) eller Vagtplan (agreement-profil) */}
      {demoProfile === "contract" ? (
        <Card
          className={`border-border/60 transition-colors ${careerUnlocked ? "cursor-pointer hover:border-primary/30" : "opacity-70"}`}
          onClick={careerUnlocked ? () => navigate(`${basePath}/package`) : undefined}
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3 w-3" /> Karriere
              </p>
              {!careerUnlocked && <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />}
            </div>
            {careerUnlocked && contractDetails ? (
              <>
                <p className="text-sm font-bold text-foreground leading-snug">
                  Trin {contractDetails.salary.trin}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contractDetails.employment.weeklyHours}t/uge · {contractDetails.salary.seniorityYears} års anciennitet
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                Upload kontrakt + lønseddel for at se karriereforløb
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card
          className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate(`${basePath}/calendar`)}
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" /> Vagtplan
              </p>
              {hasCalendar && (() => {
                const results = runArbejdsmiljoCheck(shifts.map(s => ({ date: s.date, time: s.time, type: s.type })));
                const issues = countArbejdsmiljoIssues(results);
                return issues > 0
                  ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full leading-none">
                      {issues} advarsel{issues > 1 ? "er" : ""}
                    </span>
                  )
                  : <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />;
              })()}
            </div>
            {hasCalendar && nextShift ? (
              <>
                <p className="text-sm font-bold text-foreground leading-snug">
                  {nextShift.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatShiftDate(nextShift.date)}
                  {nextShift.time ? ` · ${nextShift.time}` : ""}
                </p>
              </>
            ) : hasCalendar ? (
              <>
                <p className="text-sm font-bold text-foreground">Synkroniseret</p>
                <p className="text-xs text-muted-foreground">{shifts.length} vagter</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Ikke tilsluttet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. JOB CARD — kontraktdata på dashboardet
// ─────────────────────────────────────────────

interface JobCardProps {
  contractDetails: ContractDetails | null;
}

export function JobCard({ contractDetails }: JobCardProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  if (!contractDetails) return null;

  const { employer, employment, collectiveAgreement, salary } = contractDetails;

  return (
    <Card
      className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
      onClick={() => navigate(`${basePath}/contract`)}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Din ansættelse
          </h3>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verificeret
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{employer.name}</p>
          <p className="text-sm text-muted-foreground">
            {employment.title} · {collectiveAgreement.unionFullName}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground pt-1">
            <span>{salary.trinLabel}</span>
            <span>{salary.hourlyRate.toFixed(2).replace(".", ",")} kr/t</span>
            <span>{employment.weeklyHours} t/uge</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 3. WORK BREAKDOWN — timer + tillæg per type
// ─────────────────────────────────────────────

interface WorkBreakdownProps {
  stats: AggregatedStats;
  contractWeeklyHours?: number;
}

export function WorkBreakdown({ stats, contractWeeklyHours }: WorkBreakdownProps) {
  if (stats.latestTimer === 0) return null;

  const formatKr = (n: number) =>
    n.toLocaleString("da-DK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const s = stats.latestSupplements;
  const contractMonthly = contractWeeklyHours ? Math.round(contractWeeklyHours * 4.33) : null;

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Denne måned
        </h3>

        {/* Timer row */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">{stats.latestTimer}</span>
            <span className="text-sm text-muted-foreground ml-1">timer</span>
          </div>
          {contractMonthly && (
            <span className="text-xs text-muted-foreground">
              kontrakt: ~{contractMonthly} t/md
            </span>
          )}
        </div>

        {/* Supplement lines */}
        {(s.aftentimer > 0 || s.soenHelligTimer > 0 || s.natTimer > 0) && (
          <div className="space-y-1.5 pt-1 border-t border-border/40">
            {s.aftentimer > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Aftentillæg</span>
                  <span className="text-xs">({s.aftentimer} t × {s.aftenSats.toFixed(2).replace(".", ",")})</span>
                </div>
                <span className="font-semibold text-foreground">{formatKr(s.aftenBeloeb)} kr</span>
              </div>
            )}
            {s.soenHelligTimer > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <SunIcon className="w-3.5 h-3.5" />
                  <span>Søn-/helligdag</span>
                  <span className="text-xs">({s.soenHelligTimer} t × {s.soenHelligSats.toFixed(2).replace(".", ",")})</span>
                </div>
                <span className="font-semibold text-foreground">{formatKr(s.soenHelligBeloeb)} kr</span>
              </div>
            )}
            {s.natTimer > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Nattillæg</span>
                  <span className="text-xs">({s.natTimer} t)</span>
                </div>
                <span className="font-semibold text-foreground">{formatKr(s.natBeloeb)} kr</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm pt-1 border-t border-border/30">
              <span className="text-muted-foreground font-medium">Tillæg i alt</span>
              <span className="font-bold text-primary">{formatKr(s.totalTillaeg)} kr</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 4. PAY TREND CHART — nettoløn over tid
// ─────────────────────────────────────────────

interface PayTrendChartProps {
  stats: AggregatedStats;
}

export function PayTrendChart({ stats }: PayTrendChartProps) {
  if (stats.trend.length < 2) return null;

  const maxVal = Math.max(...stats.trend.map(t => t.nettolon));

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Nettoløn-udvikling
        </h3>

        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.trend} barCategoryGap="25%">
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Bar dataKey="nettolon" radius={[6, 6, 0, 0]}>
                {stats.trend.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.nettolon === maxVal ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Gns. {Math.round(stats.avgNettolon).toLocaleString("da-DK")} kr/md</span>
          <span>{stats.trend.length} måneder</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 5. YTD SUMMARY — "Din opsparing"
// ─────────────────────────────────────────────

interface YtdSummaryProps {
  stats: AggregatedStats;
  pensionProvider?: string;
}

export function YtdSummary({ stats, pensionProvider }: YtdSummaryProps) {
  if (stats.payslipsChecked === 0) return null;

  const formatKr = (n: number) =>
    n.toLocaleString("da-DK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const items = [
    {
      icon: <Banknote className="h-4 w-4" />,
      label: `Pension${pensionProvider ? ` → ${pensionProvider}` : ""}`,
      value: `${formatKr(stats.ytdPension)} kr`,
      color: "text-green-600",
    },
    {
      icon: <Receipt className="h-4 w-4" />,
      label: "Skat betalt",
      value: `${formatKr(stats.ytdSkat)} kr`,
      color: "text-foreground",
    },
    {
      icon: <Moon className="h-4 w-4" />,
      label: "Tillæg optjent",
      value: `${formatKr(stats.ytdTillaeg)} kr`,
      color: "text-blue-600",
    },
    ...(stats.ytdFerieDage > 0
      ? [{
          icon: <SunIcon className="h-4 w-4" />,
          label: "Feriedage afholdt",
          value: `${stats.ytdFerieDage} dage`,
          color: "text-amber-600",
        }]
      : []),
    {
      icon: <Landmark className="h-4 w-4" />,
      label: "Samlet bruttoindkomst",
      value: `${formatKr(stats.ytdBrutto)} kr`,
      color: "text-foreground",
    },
  ];

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Din opsparing · {stats.payslipsChecked} måneder
        </h3>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



