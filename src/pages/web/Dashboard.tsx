import { useNavigate } from "react-router-dom";
import { FileText, CalendarDays, ChevronRight, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EarningsGauge } from "@/components/home/EarningsGauge";
import { PaymentWidget } from "@/components/home/PaymentWidget";
import { EarnedItemsList } from "@/components/home/EarnedItemsList";

export default function WebDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Blue Header Banner - matching mobile */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">
              Hej Kim 👋
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              Dit personlige overblik er klar!
            </p>
          </div>
          
          <Button 
            variant="secondary"
            size="lg" 
            className="gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
            onClick={() => navigate("/app/lontjek")}
          >
            <Upload className="h-4 w-4" />
            Upload lønseddel
          </Button>
        </div>
      </div>

      {/* Action Cards - matching mobile style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card 
          className="bg-accent border-0 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate("/app/lontjek")}
        >
          <CardContent className="p-4 md:p-6 h-28 md:h-32 flex flex-col justify-between">
            <p className="font-bold text-accent-foreground text-sm md:text-base leading-tight">
              Tjek<br />lønseddel
            </p>
            <div className="self-end">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-accent-foreground/70" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-secondary border-0 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate("/app/calendar")}
        >
          <CardContent className="p-4 md:p-6 h-28 md:h-32 flex flex-col justify-between">
            <p className="font-bold text-secondary-foreground text-sm md:text-base leading-tight">
              Se din<br />vagtplan
            </p>
            <div className="self-end">
              <CalendarDays className="h-8 w-8 md:h-10 md:w-10 text-secondary-foreground/70" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-primary/10 border-0 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate("/app/history")}
        >
          <CardContent className="p-4 md:p-6 h-28 md:h-32 flex flex-col justify-between">
            <p className="font-bold text-foreground text-sm md:text-base leading-tight">
              Se<br />historik
            </p>
            <div className="self-end">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary/70" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-muted border-0 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate("/app/help")}
        >
          <CardContent className="p-4 md:p-6 h-28 md:h-32 flex flex-col justify-between">
            <p className="font-bold text-foreground text-sm md:text-base leading-tight">
              Hjælp &<br />Support
            </p>
            <div className="self-end">
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Payment Widget with mobile section header style */}
          <PaymentWidget />

          {/* Earnings Gauge */}
          <EarningsGauge />

          {/* Quick Stats - mobile card style */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Statistik</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Lønsedler</p>
                  <p className="text-2xl font-bold text-foreground">
                    12 <span className="text-base font-medium text-muted-foreground">stk</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Vagter</p>
                  <p className="text-2xl font-bold text-foreground">
                    8 <span className="text-base font-medium text-muted-foreground">stk</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Forventet løn</p>
                  <p className="text-2xl font-bold text-foreground">
                    24.500 <span className="text-base font-medium text-muted-foreground">Kr</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Fejl fundet</p>
                  <p className="text-2xl font-bold text-destructive">
                    2 <span className="text-base font-medium text-muted-foreground">stk</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Earned Items List */}
          <EarnedItemsList />

          {/* Recent Activity with mobile section header style */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Seneste aktivitet</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2">
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Lønseddel analyseret</p>
                    <p className="text-sm text-muted-foreground">December 2024 - Ingen fejl</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Fejl fundet</p>
                    <p className="text-sm text-muted-foreground">November 2024 - 2 fejl</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Kalender synkroniseret</p>
                    <p className="text-sm text-muted-foreground">8 vagter importeret</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tips Card - Primary branded */}
          <Card className="bg-primary border-0">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-primary-foreground mb-2">💡 Vidste du?</h3>
              <p className="text-sm text-primary-foreground/80">
                Du kan spørge Ernest om alt relateret til din løn og arbejdsvilkår. 
                Prøv at klikke på chat-ikonet!
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4 bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                Spørg Ernest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
