import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Briefcase,
  ShieldCheck,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";
import type { TerminationTimelineStep } from "@/lib/demoUnionConfigs";

const timelineIconMap: Record<TerminationTimelineStep["icon"], React.ElementType> = {
  calendar: Calendar,
  clock: Clock,
  briefcase: Briefcase,
  shield: ShieldCheck,
  banknote: Banknote,
  alert: AlertTriangle,
};

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

function formatMonth(d: Date): string {
  return d.toLocaleDateString("da-DK", { month: "long" });
}

export default function ContractTermination() {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();
  const termination = demoConfig.contractIntelligence?.termination;

  if (!termination) {
    navigate(`${basePath}/contract`);
    return null;
  }

  const today = new Date();
  const start = new Date(termination.anciennityStartDate);
  const anciennityYears = Math.floor(
    (today.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  const endOfNextMonth = getEndOfMonth(addMonths(today, 1));
  const endOfNoticePeriod = getEndOfMonth(
    addMonths(today, termination.employerNoticePeriodMonths)
  );

  const employeeScenario = termination.scenarios[0];
  const employerScenario = termination.scenarios[1];

  return (
    <main className="animate-fade-in min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
            onClick={() => navigate(`${basePath}/contract`)}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Opsigelse & varsel</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-24 pt-4 space-y-4">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            {anciennityYears}+ års anciennitet
          </span>
          {termination.isFunktionaer && (
            <span className="px-2.5 py-1 rounded-lg bg-primary/5 text-xs font-medium text-primary">
              Funktionær
            </span>
          )}
        </div>

        {/* Scenario 1: Du opsiger */}
        {employeeScenario && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-1">{employeeScenario.title}</h3>
            <p className="text-xs text-foreground">{employeeScenario.noticePeriod}</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Opsiger du {formatDate(today)} → sidste dag {formatDate(endOfNextMonth)}
            </p>
          </div>
        )}

        {/* Scenario 2: Du bliver opsagt — accentueret */}
        {employerScenario && (
          <div className="bg-card rounded-2xl border-l-4 border-l-primary border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-1">{employerScenario.title}</h3>
            <p className="text-xs text-foreground">
              {termination.employerNoticePeriodMonths} måneders varsel (din anciennitet)
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Opsiges du i dag → sidste dag {formatDate(endOfNoticePeriod)}
            </p>
          </div>
        )}

        {/* Tidslinje */}
        {employerScenario?.timeline && (
          <div className="pt-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Tidslinje ved opsigelse
            </h3>

            <div className="relative pl-5">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-primary/30" />

              {employerScenario.timeline.map((step, i) => {
                const Icon = timelineIconMap[step.icon] || Clock;
                const isLast = i === employerScenario.timeline!.length - 1;

                let label = step.label;
                if (step.label === "Fratræden" || step.detail.includes("Sidste arbejdsdag")) {
                  label = formatDate(endOfNoticePeriod);
                }

                return (
                  <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                    <div className="absolute left-[-13px] top-1 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center">
                      <Icon className="h-2 w-2 text-primary/60" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-xs font-semibold",
                        isLast ? "text-primary" : "text-foreground"
                      )}>
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-snug">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-[10px] text-muted-foreground/60 italic text-center pt-2">
          Baseret på din kontrakt, overenskomst og funktionærloven
        </p>
      </div>
    </main>
  );
}
