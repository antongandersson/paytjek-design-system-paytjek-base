import { useState, useMemo } from "react";
import { ArrowLeft, FileText, AlertTriangle, Calculator, User, Building2, Send, Mail, Paperclip, Eye, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FeedbackModal, FeedbackModalState } from "@/components/ui/feedback-modal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePayslip } from "@/contexts/PayslipContext";
import { useUser } from "@/contexts/UserContext";
import { useRequests } from "@/contexts/RequestContext";
import { cn } from "@/lib/utils";

interface SendCaseScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

// Helper til at formatere beløb
function formatKr(amount: number): string {
  return amount.toLocaleString("da-DK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(",", ",") + " kr";
}

// Map felt til overenskomst reference
function getAgreementReference(field: string): { ok: string; kontraktRef: string } {
  const references: Record<string, { ok: string; kontraktRef: string }> = {
    overtid: {
      ok: "FO-HVS § 3, pkt. 1 (Overarbejde – betaling)",
      kontraktRef: "Ansættelseskontrakt, pkt. Tillæg",
    },
    soenHelligdag: { 
      ok: "FO-HVS § 3, pkt. 1A (Overarbejde på søn-/helligdage: 100 %)", 
      kontraktRef: "Ansættelseskontrakt, pkt. Tillæg",
    },
    aftentillaeg: { 
      ok: "FO-HVS § 3, stk. 2 (Aftentillæg)", 
      kontraktRef: "Ansættelseskontrakt, pkt. Tillæg",
    },
    nattillaeg: { 
      ok: "FO-HVS § 3, stk. 2 (Nattillæg)", 
      kontraktRef: "Ansættelseskontrakt, pkt. Tillæg",
    },
    pension: { 
      ok: "FO-HVS § 6 (Pension)", 
      kontraktRef: "Ansættelseskontrakt, pkt. Pension (AP Pension, 2 % + 11 %)",
    },
    grundlon: { 
      ok: "FO-HVS § 2 (Løn)", 
      kontraktRef: "Ansættelseskontrakt, pkt. Lønsatser (125,00 kr/t)",
    },
  };
  return references[field] || { ok: "Funktionæroverenskomst for Handel, Viden og Service", kontraktRef: "Ansættelseskontrakt" };
}

// Map felt til dansk label
function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    grundlon: "Grundløn",
    aftentillaeg: "Aftentillæg",
    nattillaeg: "Nattillæg",
    soenHelligdag: "Søn-/helligdagstillæg",
    pension: "Pension",
    skat: "Skat",
    atp: "ATP",
  };
  return labels[field] || field;
}

export function SendCaseScreen({ onBack, onSuccess }: SendCaseScreenProps) {
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<FeedbackModalState>("loading");
  const [reportSheetOpen, setReportSheetOpen] = useState(false);

  // Hent data fra contexts
  const { currentPayslip, currentValidation } = usePayslip();
  const { user } = useUser();
  const { addRequest } = useRequests();

  // Brug mock data hvis ingen context data
  const period = currentPayslip?.period.month || "Oktober";
  const year = currentPayslip?.period.year || 2025;
  const employer = currentPayslip?.employer.name || "Coolshop A/S";
  const department = currentPayslip?.employer.department || "Warehouse";
  const timelon = currentPayslip?.salary.timelon || 125.00;
  const bruttolon = currentPayslip?.totals.bruttolon || 19682.50;
  const normalTimer = currentPayslip?.salary.normalTimer || 156.46;
  
  const discrepancies = currentValidation?.discrepancies.filter(
    d => d.severity === "error" || d.severity === "warning"
  ) || [];
  const totalDifference = currentValidation?.summary.totalDifference || -62.50;
  
  const userName = user ? `${user.firstName} ${user.lastName}` : "Emil Hansen";
  const firstName = user?.firstName || "Emil";
  const jobTitle = user?.jobTitle || "Warehouse Assistant";
  const union = user?.unionFullName || "HK Privat og HK HANDEL";

  // Generer brugervenlig email-tekst
  const defaultMessage = useMemo(() => {
    const issuesList = discrepancies.map(d => 
      `• ${getFieldLabel(d.field)}: ${formatKr(d.difference)}`
    ).join('\n');

    return `Hej,

Jeg har gennemgået min lønseddel for ${period} ${year} og fundet nogle uoverensstemmelser, som jeg gerne vil have jer til at se på.

Der mangler i alt ${formatKr(totalDifference)} i mine tillæg:
${issuesList}

Jeg har vedhæftet den fulde rapport med beregninger og overenskomstreferencer.

Med venlig hilsen,
${firstName}`;
  }, [period, year, totalDifference, discrepancies, firstName]);

  const [message, setMessage] = useState(defaultMessage);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setModalOpen(true);
    setModalState("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Gem anmodningen i RequestContext
    const issues = discrepancies.map(d => {
      const refs = getAgreementReference(d.field);
      return {
        field: d.field,
        label: getFieldLabel(d.field),
        difference: d.difference,
        okReference: refs.ok,
        atReference: refs.kontraktRef,
      };
    });

    addRequest({
      period: `${period} ${year}`,
      employer,
      department,
      totalDifference,
      issuesCount: discrepancies.length,
      issues,
      message,
    });

    setModalState("success");

    // Redirect after success
    setTimeout(() => {
      setModalOpen(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Send til arbejdsgiver</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Email-style Header */}
        <div className="bg-muted/30 px-4 py-4 border-b border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Til</p>
                <p className="font-medium text-foreground">Lønadministrationen, {employer}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fra</p>
                <p className="font-medium text-foreground">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Emne</p>
                <p className="font-medium text-foreground">
                  Lønafvigelse - {period} {year} ({formatKr(totalDifference)})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="px-4 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv din besked her..."
            className="bg-card border-border rounded-xl min-h-[200px] resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Attachment Preview - Clickable */}
        <div className="px-4 pb-4">
          <button 
            onClick={() => setReportSheetOpen(true)}
            className="w-full text-left bg-muted/30 rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Vedhæftet rapport</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                <Eye className="h-3.5 w-3.5" />
                Se fuld rapport
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            
            {/* Mini Report Preview */}
            <div className="bg-card rounded-lg p-3 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Lønafvigelsesrapport</span>
                <span className="text-xs text-muted-foreground">{period} {year}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Samlet difference</span>
                <span className="font-bold text-red-600">{formatKr(totalDifference)}</span>
              </div>

              {/* Issues Summary */}
              <div className="flex flex-wrap gap-1 pt-1">
                {discrepancies.slice(0, 3).map((issue, i) => (
                  <span 
                    key={i}
                    className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"
                  >
                    {getFieldLabel(issue.field)}
                  </span>
                ))}
                {discrepancies.length > 3 && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    +{discrepancies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Triage Classification */}
        <div className="px-4 pb-4">
          <div className="bg-card rounded-xl p-4 border border-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              Sagsklassificering
            </div>
            {discrepancies.filter(d => d.severity === "error").length > 0 && (
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">
                    {discrepancies.filter(d => d.severity === "error").length} verificeret fejl
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1.5">— matematisk bevist</span>
                </div>
              </div>
            )}
            {discrepancies.filter(d => d.severity === "warning").length > 0 && (
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">
                    {discrepancies.filter(d => d.severity === "warning").length} til verifikation
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1.5">— mulig lokalaftale</span>
                </div>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
              Beregningen er baseret på standardoverenskomsten, kontrakt og vagtplan. Der er ikke registreret en lokalaftale for denne arbejdsplads.
            </p>
          </div>
        </div>

        {/* Salary Details (collapsed) */}
        <div className="px-4 pb-4">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              <Calculator className="h-4 w-4" />
              <span>Vis løndetaljer</span>
            </summary>
            <div className="mt-3 bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timeløn</span>
                <span className="font-medium">{formatKr(timelon)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bruttoløn</span>
                <span className="font-medium">{formatKr(bruttolon)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Normal timer</span>
                <span className="font-medium">{normalTimer.toLocaleString("da-DK", { minimumFractionDigits: 2 })} timer</span>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Bottom Section - Now relative, not fixed */}
      <div className="shrink-0 p-4 pb-6 bg-primary border-t border-primary/20">
        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 mb-4">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
            className="mt-0.5 border-primary-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
          <div>
            <label htmlFor="consent" className="text-primary-foreground text-sm cursor-pointer">
              Dine data deles kun med din arbejdsgiver og fagforening.
            </label>
            <p className="text-primary-foreground/70 text-xs underline cursor-pointer">
              Læs privatlivspolitikken
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!consentChecked || isSubmitting}
          className="w-full h-14 text-lg font-bold bg-background text-primary hover:bg-background/90 rounded-2xl shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Sender...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send besked
            </span>
          )}
        </Button>
      </div>

      {/* Full Report Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl max-w-lg mx-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Lønafvigelsesrapport
            </SheetTitle>
          </SheetHeader>
          
          <div className="overflow-y-auto h-full pb-8">
            {/* Report Header */}
            <div className="py-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-foreground">{period} {year}</span>
                <span className="text-2xl font-bold text-red-600">{formatKr(totalDifference)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{employer} • {department}</p>
            </div>

            {/* All Issues */}
            <div className="py-4 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Alle afvigelser ({discrepancies.length})
              </h3>

              {discrepancies.map((issue, i) => {
                const refs = getAgreementReference(issue.field);
                const isError = issue.severity === "error";
                
                // Parse beregning
                const formulaMatch = issue.calculation?.match(/(\d+\.?\d*)%\s*of\s*(\d+\.?\d*)\s*kr\/hr/);
                const resultMatch = issue.calculation?.match(/=\s*(\d+\.?\d*)/);
                const percent = formulaMatch?.[1];
                const hourlyRate = formulaMatch?.[2];
                const expectedRate = resultMatch?.[1];
                
                return (
                  <div 
                    key={i}
                    className={cn(
                      "rounded-xl border p-4",
                      isError ? "border-red-200 bg-red-50/50" : "border-amber-200 bg-amber-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn(
                        "font-semibold",
                        isError ? "text-red-700" : "text-amber-700"
                      )}>
                        {getFieldLabel(issue.field)}
                      </span>
                      <span className={cn(
                        "font-bold",
                        isError ? "text-red-600" : "text-amber-600"
                      )}>
                        {formatKr(issue.difference)}
                      </span>
                    </div>

                    {/* Beregning */}
                    {percent && hourlyRate && expectedRate && (
                      <div className="bg-white/60 rounded-lg p-2 mb-3 text-xs">
                        <p className="text-muted-foreground mb-1">Beregning:</p>
                        <p className="font-mono text-foreground">
                          {parseFloat(hourlyRate).toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr × {percent}% = {parseFloat(expectedRate).toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr/time
                        </p>
                      </div>
                    )}

                    {/* Referencer */}
                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground">
                        📖 <span className="font-medium">Overenskomst:</span> {refs.ok}
                      </p>
                      <p className="text-muted-foreground">
                        📖 <span className="font-medium">Kontrakt:</span> {refs.kontraktRef}
                      </p>
                    </div>

                    {/* Beløb */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Forventet</p>
                        <p className="font-semibold">{formatKr(issue.expected)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Udbetalt</p>
                        <p className="font-semibold">{formatKr(issue.actual)}</p>
                      </div>
                      <div className={cn(
                        "text-center rounded-lg py-1",
                        isError ? "bg-red-100" : "bg-amber-100"
                      )}>
                        <p className={cn(isError ? "text-red-600" : "text-amber-600")}>Difference</p>
                        <p className={cn("font-bold", isError ? "text-red-700" : "text-amber-700")}>
                          {formatKr(issue.difference)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Løndetaljer */}
            <div className="py-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Løndetaljer
              </h3>
              <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeløn</span>
                  <span className="font-medium">{formatKr(timelon)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bruttoløn</span>
                  <span className="font-medium">{formatKr(bruttolon)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Normal timer</span>
                  <span className="font-medium">{normalTimer.toLocaleString("da-DK", { minimumFractionDigits: 2 })} timer</span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Success Modal */}
      <FeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        state={modalState}
        message={modalState === "loading" ? "Sender besked..." : "Besked sendt! Du kan følge status under 'Anmodninger' i historik."}
      />
    </div>
  );
}
