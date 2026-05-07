import { useNavigate } from "react-router-dom";
import { FileText, AlertCircle, CheckCircle, Clock, Send, Mail, ExternalLink } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { usePayslip, type PayslipHistoryItem } from "@/contexts/PayslipContext";
import { useRequests, type SalaryRequest, type RequestStatus } from "@/contexts/RequestContext";

// Format beløb
const formatKr = (amount: number) => 
  amount.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kr";

// Status badge component
function RequestStatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
          <Clock className="h-3 w-3" />
          Afventer
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
          <Clock className="h-3 w-3 animate-pulse" />
          Behandles
        </Badge>
      );
    case 'resolved':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
          <CheckCircle className="h-3 w-3" />
          Afsluttet
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
          <AlertCircle className="h-3 w-3" />
          Afvist
        </Badge>
      );
    default:
      return null;
  }
}

export default function MobileHistory() {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  
  // Hent lønseddel-historie fra global context
  const { payslipHistory, loadFromHistory, isAnalyzing } = usePayslip();
  
  // Hent anmodninger fra RequestContext
  const { requests, pendingCount } = useRequests();

  const handleUploadClick = () => {
    navigate(`${basePath}/lontjek`);
  };
  
  const handlePayslipClick = (item: PayslipHistoryItem) => {
    // Load denne lønseddel som aktiv og naviger til rapport
    loadFromHistory(item.id);
    navigate(`${basePath}/lontjek`);
  };

  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Historie</h1>

      <Tabs defaultValue="payslips" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="payslips" className="flex-1 gap-1">
            <FileText className="h-4 w-4" />
            Lønsedler
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex-1 gap-1 relative">
            <Mail className="h-4 w-4" />
            Anmodninger
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Lønsedler Tab */}
        <TabsContent value="payslips" className="space-y-3">
          {isAnalyzing ? (
            // Loading state
            <>
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </>
          ) : payslipHistory.length === 0 ? (
            // Empty state
            <Empty className="min-h-[300px] border-2 border-dashed rounded-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Ingen lønsedler analyseret</EmptyTitle>
                <EmptyDescription>
                  Du har ikke analyseret nogen lønsedler endnu. Start med at uploade din første lønseddel.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={handleUploadClick} className="rounded-xl">
                  Tjek lønseddel
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            // Data state - fra PayslipContext
            payslipHistory.map((item) => (
              <Card 
                key={item.id} 
                className="border-0 shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handlePayslipClick(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.period}</p>
                        <p className="text-sm text-muted-foreground">{formatKr(item.nettolon)}</p>
                      </div>
                    </div>
                    {item.status === "ok" ? (
                      <Badge className="bg-success/10 text-success hover:bg-success/10 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        OK
                      </Badge>
                    ) : item.status === "warnings" ? (
                      <Badge className="bg-warning/10 text-warning hover:bg-warning/10 gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {item.issuesCount} advarsler
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {item.issuesCount} fejl
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Anmodninger Tab */}
        <TabsContent value="requests" className="space-y-3">
          {requests.length === 0 ? (
            // Empty state
            <Empty className="min-h-[300px] border-2 border-dashed rounded-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Send className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Ingen anmodninger</EmptyTitle>
                <EmptyDescription>
                  Du har ikke sendt nogen sager til din arbejdsgiver endnu. Hvis du finder fejl i en lønseddel, kan du sende den videre herfra.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            // Data state - fra RequestContext
            requests.map((request) => (
              <Card key={request.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{request.period}</p>
                        <p className="text-sm text-muted-foreground truncate">{request.employer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString("da-DK", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-xs font-medium text-red-600">
                            {formatKr(request.totalDifference)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <RequestStatusBadge status={request.status} />
                  </div>
                  
                  {/* Issues summary */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      {request.issuesCount} afvigelse{request.issuesCount > 1 ? 'r' : ''} rapporteret
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {request.issues.slice(0, 3).map((issue, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {issue.label}
                        </span>
                      ))}
                      {request.issues.length > 3 && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          +{request.issues.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Status message if any */}
                  {request.statusMessage && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">{request.statusMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
