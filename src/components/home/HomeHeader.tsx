import { Link2, FileText, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContract } from "@/contexts/ContractContext";

interface HomeHeaderProps {
  name?: string | null;
  isLoading?: boolean;
  hasPayslipData?: boolean;  // Om der er lønseddeldata
  hasCalendar?: boolean;     // Om kalender er tilsluttet
  hasContract?: boolean;     // Om kontrakt er uploadet
}

export function HomeHeader({ 
  name, 
  isLoading = false,
  hasPayslipData = false,
  hasCalendar = false,
  hasContract = false,
}: HomeHeaderProps) {
  // Bestem hvilken besked der skal vises
  const getMessage = () => {
    // Har data = overblik er klar
    if (hasPayslipData) {
      return "Din lønseddel er tjekket — her er dit overblik.";
    }

    // Ingen data = onboarding guide
    const missingSteps: string[] = [];
    if (!hasCalendar) missingSteps.push("arbejdskalender");
    if (!hasContract) missingSteps.push("kontrakt");
    if (!hasPayslipData) missingSteps.push("lønseddel");

    if (missingSteps.length === 3) {
      return "Som HK Handel-medlem er du dækket, hvis din løn er forkert. Kom i gang nedenfor.";
    } else if (missingSteps.length > 0) {
      return `Næste skridt: ${missingSteps.join(", ")}`;
    }

    return "Velkommen til PayTjek × HK Handel!";
  };

  return (
    <div className="bg-primary px-4 py-5 -mx-4 -mt-6">
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-32 bg-primary-foreground/20 mb-2" />
          <Skeleton className="h-4 w-48 bg-primary-foreground/20" />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-primary-foreground">
            Hej {name || "Bruger"}
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            {getMessage()}
          </p>
        </>
      )}
    </div>
  );
}

interface CalendarLinkButtonProps {
  isConnected?: boolean;
  shiftCount?: number;
}

export function CalendarLinkButton({ isConnected = false, shiftCount = 0 }: CalendarLinkButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/m/calendar");
  };

  // Hvis kalender er tilsluttet, vis status
  if (isConnected) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-accent/10 border-accent/30 text-accent rounded-full text-xs gap-1.5"
        onClick={handleClick}
      >
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        {shiftCount > 0 ? `${shiftCount} vagter synkroniseret` : 'Kalender tilsluttet'}
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-card border-border text-muted-foreground rounded-full text-xs gap-1.5"
      onClick={handleClick}
    >
      <Link2 className="h-3.5 w-3.5" />
      Arbejdskalender link
    </Button>
  );
}

// Contract Link Button
export function ContractLinkButton() {
  const navigate = useNavigate();
  const { hasDetails } = useContract();

  const handleClick = () => {
    navigate("/m/contract");
  };

  if (hasDetails) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-accent/10 border-accent/30 text-accent rounded-full text-xs gap-1.5"
        onClick={handleClick}
      >
        <Check className="h-3.5 w-3.5" />
        Kontrakt verificeret
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-card border-border text-muted-foreground rounded-full text-xs gap-1.5"
      onClick={handleClick}
    >
      <FileText className="h-3.5 w-3.5" />
      Upload kontrakt
    </Button>
  );
}
