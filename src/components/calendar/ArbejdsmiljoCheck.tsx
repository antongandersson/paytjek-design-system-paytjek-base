import { useState } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  runArbejdsmiljoCheck,
  type ArbejdsmiljoShift,
  type ArbejdsmiljoResult,
} from "@/lib/utils/arbejdsmiljoCheck";

interface ArbejdsmiljoCheckProps {
  shifts: ArbejdsmiljoShift[];
}

function StatusIcon({ status }: { status: ArbejdsmiljoResult["status"] }) {
  if (status === "ok") return <span className="text-base leading-none">✅</span>;
  if (status === "warning") return <span className="text-base leading-none">⚠️</span>;
  return <span className="text-base leading-none">❌</span>;
}

function RuleRow({ result }: { result: ArbejdsmiljoResult }) {
  const [expanded, setExpanded] = useState(false);
  const hasViolations = result.violations.length > 0;

  return (
    <div className="space-y-1">
      <button
        className={cn(
          "w-full flex items-start gap-2.5 text-left",
          hasViolations && "cursor-pointer"
        )}
        onClick={() => hasViolations && setExpanded((v) => !v)}
        disabled={!hasViolations}
      >
        <StatusIcon status={result.status} />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              result.status === "ok" && "text-foreground",
              result.status === "warning" && "text-amber-700",
              result.status === "error" && "text-destructive"
            )}
          >
            {result.rule}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{result.description}</p>
        </div>
        {hasViolations && (
          <span className="text-muted-foreground shrink-0 mt-0.5">
            {expanded
              ? <ChevronUp className="h-3.5 w-3.5" />
              : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        )}
      </button>

      {expanded && hasViolations && (
        <div className="ml-8 space-y-2 animate-fade-in">
          {result.violations.map((v, i) => (
            <div
              key={i}
              className={cn(
                "text-xs rounded-lg px-3 py-2 border-l-2",
                result.status === "warning"
                  ? "bg-amber-50 border-amber-400 text-amber-800"
                  : "bg-red-50 border-red-400 text-red-800"
              )}
            >
              <p className="font-semibold">{v.label}</p>
              <p className="mt-0.5 leading-snug text-[11px] opacity-80">{v.detail}</p>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground italic ml-1">
            Kilde: {result.source}
          </p>
        </div>
      )}
    </div>
  );
}

export function ArbejdsmiljoCheck({ shifts }: ArbejdsmiljoCheckProps) {
  const results = runArbejdsmiljoCheck(shifts);

  if (results.length === 0) return null;

  const issueCount = results.filter((r) => r.status !== "ok").length;
  const okCount = results.length - issueCount;

  return (
    <Card className="border-border/60">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground uppercase tracking-wide">
              Arbejdsmiljøtjek
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              issueCount === 0
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {okCount}/{results.length} OK
          </span>
        </div>

        {/* Regler */}
        <div className="space-y-3 divide-y divide-border/40">
          {results.map((r, i) => (
            <div key={i} className={i > 0 ? "pt-3" : ""}>
              <RuleRow result={r} />
            </div>
          ))}
        </div>

        {/* Footer */}
        {issueCount === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center pt-1">
            Vagtplanen overholder alle arbejdsmiljøregler ✓
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground text-center pt-1">
            Klik på en advarsel for at se detaljer og lovhenvisning
          </p>
        )}
      </CardContent>
    </Card>
  );
}
