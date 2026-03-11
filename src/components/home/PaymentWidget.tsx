import { FileText, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PaymentWidgetProps {
  amount?: string | null;
  daysLeft?: number | null;
  month?: string | null;
  isLoading?: boolean;
  onUploadClick?: () => void;
}

export function PaymentWidget({ 
  amount,
  daysLeft,
  month,
  isLoading = false,
  onUploadClick
}: PaymentWidgetProps) {
  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </section>
    );
  }

  // Empty state - no payslip data yet
  if (!amount && !daysLeft) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Seneste lønudbetaling
        </h2>
        <Card className="border-2 border-dashed border-border/50 bg-muted/10">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Ingen løndata endnu
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload din første lønseddel for at se din næste lønudbetaling
            </p>
            {onUploadClick && (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={onUploadClick}>
                Upload lønseddel
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  // Normal state with data
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        Seneste lønudbetaling
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Nettoløn<br />{month || "denne måned"}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {amount} <span className="text-base font-medium text-muted-foreground">kr</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Dage til<br />udbetaling
            </p>
            <p className="text-2xl font-bold text-foreground">
              {daysLeft} <span className="text-base font-medium text-muted-foreground">dage</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
