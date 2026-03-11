import { Check, Crown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Gratis",
    price: "0",
    period: "kr/md",
    description: "Perfekt til at komme i gang",
    features: [
      "3 lønseddel analyser per måned",
      "Grundlæggende fejlfinding",
      "Ernest AI (begrænset)",
      "Kalender synkronisering",
    ],
    current: false,
    color: "bg-muted",
  },
  {
    name: "Premium",
    price: "49",
    period: "kr/md",
    description: "For den aktive bruger",
    features: [
      "Ubegrænset lønseddel analyser",
      "Avanceret fejlfinding",
      "Ernest AI (ubegrænset)",
      "Kalender synkronisering",
      "Prioriteret support",
      "Eksport til PDF",
      "Historik op til 5 år",
    ],
    current: true,
    popular: true,
    color: "bg-primary",
  },
  {
    name: "Familie",
    price: "89",
    period: "kr/md",
    description: "Del med op til 4 familiemedlemmer",
    features: [
      "Alt i Premium",
      "Op til 5 brugere",
      "Delt dashboard",
      "Familie statistikker",
      "Prioriteret telefon support",
    ],
    current: false,
    color: "bg-secondary",
  },
];

export default function WebMembership() {
  return (
    <div className="space-y-5 max-w-5xl">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl text-center">
        <h1 className="text-3xl font-bold text-primary-foreground">Medlemskab</h1>
        <p className="text-primary-foreground/80 mt-1">
          Vælg det abonnement der passer til dine behov
        </p>
      </div>

      {/* Current Plan Banner - Accent colored like mobile action cards */}
      <Card className="bg-accent border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-accent-foreground/10 flex items-center justify-center">
                <Crown className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-accent-foreground">Premium Medlem</h2>
                <p className="text-accent-foreground/80">Dit abonnement fornyes den 1. januar 2025</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/50 hover:bg-white/70 border-0">
              Administrer abonnement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Vælg din plan</h2>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`border-border/50 relative ${plan.current ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0">
                  Mest populær
                </Badge>
              )}
              {plan.current && (
                <Badge className="absolute -top-3 right-4 bg-primary border-0">
                  Dit abonnement
                </Badge>
              )}
              <CardContent className="p-6 pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Nuværende plan" : "Vælg plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Billing History */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Betalingshistorik</h2>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <div className="space-y-2">
          <Card className="border-border/50 hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Premium - December 2024</p>
                <p className="text-sm text-muted-foreground">Betalt 1. december 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">49 <span className="font-normal text-muted-foreground">Kr</span></span>
                <Button variant="ghost" size="sm">Kvittering</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Premium - November 2024</p>
                <p className="text-sm text-muted-foreground">Betalt 1. november 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">49 <span className="font-normal text-muted-foreground">Kr</span></span>
                <Button variant="ghost" size="sm">Kvittering</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Premium - Oktober 2024</p>
                <p className="text-sm text-muted-foreground">Betalt 1. oktober 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">49 <span className="font-normal text-muted-foreground">Kr</span></span>
                <Button variant="ghost" size="sm">Kvittering</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
