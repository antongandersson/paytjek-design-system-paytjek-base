import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Phone,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";
import type { DemoContractClause } from "@/lib/demoUnionConfigs";

export default function ContractCheck() {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();
  const analysis = demoConfig.demoContractAnalysis;

  if (!analysis) {
    navigate(`${basePath}/contract`);
    return null;
  }

  const passed = analysis.clauses.filter(c => c.status === "compliant");
  const warnings = analysis.clauses.filter(c => c.status === "missing");
  const errors = analysis.clauses.filter(c => c.status === "deviation");

  const phoneLabel = demoConfig.supportPhone
    ? `Ring til ${demoConfig.name}: ${demoConfig.supportPhone}`
    : `Ring til ${demoConfig.name}`;

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
          <h1 className="text-lg font-bold text-foreground">Vilkårstjek</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-24 pt-4 space-y-4">
        {/* Summary header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-foreground">
            {analysis.totalClauses} vilkår tjekket
          </h2>
          <div className="flex items-center gap-1.5">
            <Badge variant="ok">{passed.length} OK</Badge>
            {warnings.length > 0 && (
              <Badge variant="warn">{warnings.length} mangler</Badge>
            )}
            {errors.length > 0 && (
              <Badge variant="error">{errors.length} fejl</Badge>
            )}
          </div>
        </div>

        {/* Errors first */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map(check => (
              <CheckItem key={check.clause} clause={check} status="error" phoneLabel={phoneLabel} />
            ))}
          </div>
        )}

        {/* OK items */}
        {passed.length > 0 && (
          <div className="space-y-0">
            {passed.map(check => (
              <CheckItem key={check.clause} clause={check} status="ok" phoneLabel={phoneLabel} />
            ))}
          </div>
        )}

        {/* Warnings last */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map(check => (
              <CheckItem key={check.clause} clause={check} status="warning" phoneLabel={phoneLabel} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Badge({ variant, children }: { variant: "ok" | "warn" | "error"; children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md",
      variant === "ok" && "bg-green-100 text-green-800",
      variant === "warn" && "bg-amber-100 text-amber-800",
      variant === "error" && "bg-red-100 text-red-800",
    )}>
      {children}
    </span>
  );
}

function CheckItem({ clause, status, phoneLabel }: { clause: DemoContractClause; status: "ok" | "warning" | "error"; phoneLabel: string }) {
  const icons = {
    ok: { Icon: CheckCircle2, color: "text-green-600" },
    warning: { Icon: AlertTriangle, color: "text-amber-600" },
    error: { Icon: AlertCircle, color: "text-red-600" },
  };
  const { Icon, color } = icons[status];

  return (
    <div className={cn(
      "flex items-start gap-2.5 py-3 border-b border-border/30",
      status === "error" && "bg-red-50/50 -mx-4 px-4 border-b-0 rounded-xl mb-1",
      status === "warning" && "bg-amber-50/50 -mx-4 px-4 border-b-0 rounded-xl mb-1",
    )}>
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", color)} />
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-snug",
          status !== "ok" ? "font-semibold" : "text-foreground",
          status === "error" && "text-red-800",
          status === "warning" && "text-amber-800",
        )}>
          {clause.clause}
        </p>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
          {clause.detail}
        </p>

        {/* Action buttons for issues */}
        {status === "error" && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            <ActionButton icon={Phone} label={phoneLabel} variant="primary" />
            <ActionButton icon={FileText} label="Bed om nyt ansættelsesbevis" variant="outline" />
          </div>
        )}
        {status === "warning" && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            <ActionButton icon={HelpCircle} label="Hvad gør jeg?" variant="outline" />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  variant: "primary" | "outline";
}) {
  return (
    <button className={cn(
      "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
      variant === "primary" && "bg-primary/10 text-primary hover:bg-primary/15",
      variant === "outline" && "bg-muted text-foreground hover:bg-muted/80",
    )}>
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}
