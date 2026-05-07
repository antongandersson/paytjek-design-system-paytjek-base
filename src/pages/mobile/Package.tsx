import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { CareerTimeline, NegotiationCard } from "@/components/home/ContractDashboard";

export default function MobilePackage() {
  const navigate = useNavigate();
  const { demoConfig } = useDemo();
  const intel = demoConfig.contractIntelligence;

  if (!intel) {
    navigate(-1);
    return null;
  }

  return (
    <main className="animate-fade-in min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Karriere</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <CareerTimeline intel={intel} />
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <NegotiationCard intel={intel} />
        </div>
      </div>
    </main>
  );
}
