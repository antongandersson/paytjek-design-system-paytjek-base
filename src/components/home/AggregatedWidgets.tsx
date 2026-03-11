import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, AlertTriangle, Clock, TrendingUp, Banknote,
  Moon, Sun as SunIcon, Briefcase, ShieldCheck, ChevronRight,
  Receipt, Landmark,
} from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import type { AggregatedStats } from "@/contexts/PayslipContext";
import type { ContractDetails } from "@/lib/demoContract";

// ─────────────────────────────────────────────
// 1. STATUS HERO — "Du mangler 253 kr"
// ─────────────────────────────────────────────

interface StatusHeroProps {
  stats: AggregatedStats;
}

export function StatusHero({ stats }: StatusHeroProps) {
  const navigate = useNavigate();
  if (stats.payslipsChecked === 0) return null;

  const hasIssues = stats.payslipsWithErrors > 0;
  const formatKr = (n: number) =>
    Math.abs(n).toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (hasIssues) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Banknote className="h-5.5 w-5.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold text-primary">
                {formatKr(stats.totalDifferenceOwed)} kr til gode
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stats.payslipsWithErrors} uoverensstemmelse{stats.payslipsWithErrors === 1 ? "" : "r"} fundet i {stats.payslipsWithErrors} lønsed{stats.payslipsWithErrors === 1 ? "del" : "ler"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => navigate("/m/history")}
          >
            Se detaljer
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-50/30">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800">
            {stats.payslipsChecked} lønsed{stats.payslipsChecked === 1 ? "del" : "ler"} tjekket — alt korrekt
          </p>
          <p className="text-xs text-green-600/70">
            Ingen fejl fundet i din løn
          </p>
        </div>
      </CardContent>
    </Card>
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
  if (!contractDetails) return null;

  const { employer, employment, collectiveAgreement, salary } = contractDetails;

  return (
    <Card
      className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
      onClick={() => navigate("/m/contract")}
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



