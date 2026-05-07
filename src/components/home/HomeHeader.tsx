import { Link2, FileText, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContract } from "@/contexts/ContractContext";

interface HomeHeaderProps {
  name?: string | null;
  isLoading?: boolean;
  hasPayslipData?: boolean;
  hasCalendar?: boolean;
  hasContract?: boolean;
}

export function HomeHeader({
  name,
  isLoading = false,
  hasPayslipData = false,
}: HomeHeaderProps) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 10 ? "God morgen" : hour < 17 ? "Hej" : "God aften";

  if (isLoading) {
    return (
      <div className="pt-2 pb-1 space-y-1">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>
    );
  }

  return (
    <div className="pt-2 pb-1">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        {greeting}, {name || "der"} 👋
      </h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        {hasPayslipData
          ? "Her er dit lønoverblik"
          : "Din løn skal være korrekt"}
      </p>
    </div>
  );
}

interface CalendarLinkButtonProps {
  isConnected?: boolean;
  shiftCount?: number;
}

export function CalendarLinkButton({ isConnected = false, shiftCount = 0 }: CalendarLinkButtonProps) {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  
  const handleClick = () => {
    navigate(`${basePath}/calendar`);
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
  const { basePath } = useDemo();
  const { hasDetails } = useContract();

  const handleClick = () => {
    navigate(`${basePath}/contract`);
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
