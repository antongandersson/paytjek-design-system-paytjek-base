import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, FileText, Receipt } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { useContract } from "@/contexts/ContractContext";
import { usePayslip } from "@/contexts/PayslipContext";
import { CareerTimeline, NegotiationCard } from "@/components/home/ContractDashboard";

export default function MobilePackage() {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();
  const { hasContract } = useContract();
  const { hasDashboardData } = usePayslip();
  const intel = demoConfig.contractIntelligence;

  const careerUnlocked = hasContract && hasDashboardData && !!intel;

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

      {careerUnlocked ? (
        <div className="px-4 pt-4 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-4">
            <CareerTimeline intel={intel} />
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <NegotiationCard intel={intel} />
          </div>
        </div>
      ) : (
        <div className="px-4 pt-16 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground">
              Karriere er låst
            </h2>
            <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
              Upload kontrakt + lønseddel for at se dit karriereforløb
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[240px] pt-2">
            {!hasContract && (
              <button
                className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                onClick={() => navigate(`${basePath}/contract`)}
              >
                <FileText className="h-4 w-4" /> Upload kontrakt
              </button>
            )}
            {!hasDashboardData && (
              <button
                className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold"
                onClick={() => navigate(`${basePath}/lontjek`)}
              >
                <Receipt className="h-4 w-4" /> Tjek lønseddel
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
