import { useState } from "react";
import { FileText, AlertCircle, CheckCircle, Clock, ChevronRight, Download, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const payslips = [
  { 
    id: "1", 
    month: "December 2024", 
    date: "2024-12-15", 
    status: "ok", 
    errors: 0, 
    amount: "24.532 kr",
    employer: "Netto A/S"
  },
  { 
    id: "2", 
    month: "November 2024", 
    date: "2024-11-15", 
    status: "error", 
    errors: 2, 
    amount: "22.145 kr",
    employer: "Netto A/S"
  },
  { 
    id: "3", 
    month: "Oktober 2024", 
    date: "2024-10-15", 
    status: "ok", 
    errors: 0, 
    amount: "23.890 kr",
    employer: "Netto A/S"
  },
  { 
    id: "4", 
    month: "September 2024", 
    date: "2024-09-15", 
    status: "ok", 
    errors: 0, 
    amount: "21.200 kr",
    employer: "Netto A/S"
  },
  { 
    id: "5", 
    month: "August 2024", 
    date: "2024-08-15", 
    status: "error", 
    errors: 1, 
    amount: "25.100 kr",
    employer: "Netto A/S"
  },
];

const requests = [
  {
    id: "1",
    payslip: "November 2024",
    status: "pending",
    date: "2024-11-20",
    description: "Manglende weekendtillæg"
  },
  {
    id: "2",
    payslip: "August 2024",
    status: "resolved",
    date: "2024-09-05",
    description: "Forkert timeantal"
  },
];

export default function WebHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayslips = payslips.filter(p => 
    p.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">Historie</h1>
            <p className="text-primary-foreground/80 mt-1">
              Oversigt over dine analyserede lønsedler og anmodninger
            </p>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm"
            className="gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <Download className="h-4 w-4" />
            Eksporter alle
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{payslips.length}</p>
              <p className="text-xs text-muted-foreground">Lønsedler</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{payslips.filter(p => p.status === "ok").length}</p>
              <p className="text-xs text-muted-foreground">Uden fejl</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{payslips.filter(p => p.status === "error").length}</p>
              <p className="text-xs text-muted-foreground">Med fejl</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Afventende</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payslips" className="space-y-5">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="payslips" className="gap-2 py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4" />
            Lønsedler
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2 py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="h-4 w-4" />
            Anmodninger
            {requests.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {requests.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Payslips Tab */}
        <TabsContent value="payslips" className="space-y-5">
          {/* Search */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søg efter lønseddel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payslips List - Mobile card style */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Lønsedler</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2">
              {filteredPayslips.map((payslip) => (
                <Card key={payslip.id} className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{payslip.month}</p>
                          <p className="text-sm text-muted-foreground">{payslip.employer} • {payslip.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {payslip.status === "ok" ? (
                          <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            OK
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {payslip.errors} fejl
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Sendte anmodninger</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2">
              {requests.map((request) => (
                <Card key={request.id} className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{request.payslip}</p>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === "pending" ? (
                          <Badge className="bg-warning/10 text-warning hover:bg-warning/10 border-0">
                            Igangværende
                          </Badge>
                        ) : (
                          <Badge className="bg-success/10 text-success hover:bg-success/10 border-0">
                            Afsluttet
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
