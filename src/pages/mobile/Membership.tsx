import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MobileMembership() {
  const navigate = useNavigate();

  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/m/more")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Medlemskab</h1>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Premium</h2>
              <p className="text-primary-foreground/80 text-sm">Dit nuværende abonnement</p>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/80">
            Fornyes den 1. januar 2025
          </p>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="space-y-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Gratis</h3>
              <span className="font-bold">0 kr/md</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                3 analyser per måned
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Grundlæggende fejlfinding
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-2 ring-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Premium</h3>
                <Badge className="bg-primary">Nuværende</Badge>
              </div>
              <span className="font-bold">49 kr/md</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Ubegrænset analyser
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Avanceret fejlfinding
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Ernest AI (ubegrænset)
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Prioriteret support
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Familie</h3>
              <span className="font-bold">89 kr/md</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Alt i Premium
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Op til 5 brugere
              </li>
            </ul>
            <Button className="w-full mt-4">
              Opgrader
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}





