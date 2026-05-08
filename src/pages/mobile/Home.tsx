import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickActions } from "@/components/home/ActionCards";
import { PaymentWidget } from "@/components/home/PaymentWidget";
import {
  StatusHero,
  DashboardContextRow,
  WorkBreakdown,
  PayTrendChart,
  YtdSummary,
} from "@/components/home/AggregatedWidgets";
import { usePayslip } from "@/contexts/PayslipContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useApp } from "@/contexts/AppContext";
import { useUser } from "@/contexts/UserContext";
import { useContract } from "@/contexts/ContractContext";
import { useDemo } from "@/contexts/DemoContext";
import { Video, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OutletContextType {
  setUploadDrawerOpen: (open: boolean) => void;
}

export default function MobileHome() {
  const navigate = useNavigate();
  const { setUploadDrawerOpen } = useOutletContext<OutletContextType>();

  const { getDashboardData, hasDashboardData, isAnalyzing } = usePayslip();
  const { isConnected: hasCalendar, shifts } = useCalendar();
  const { updateSetupStatus } = useApp();
  const { user } = useUser();
  const { hasContract, contractDetails } = useContract();
  const { demoConfig, basePath, bookedMeeting } = useDemo();

  const dashboardData = getDashboardData();
  const agg = dashboardData.aggregated;

  useEffect(() => {
    updateSetupStatus({
      hasCalendar,
      hasPayslip: hasDashboardData,
      hasProfile: !!user?.firstName,
    });
  }, [hasCalendar, hasDashboardData, user, updateSetupStatus]);

  const handleUploadClick = () => {
    setUploadDrawerOpen(true);
  };

  return (
    <main className="px-4 py-5 space-y-4 pb-24 animate-fade-in">
      {/* 1. Greeting */}
      <HomeHeader
        name={user?.firstName}
        hasPayslipData={hasDashboardData}
        hasCalendar={hasCalendar}
        hasContract={hasContract}
      />

      {/* 2. Løntjek resultat (or empty state) */}
      <StatusHero stats={agg} />

      {/* 3. Status row — Kontrakt + Karriere/Vagtplan side by side */}
      <DashboardContextRow
        contractDetails={contractDetails}
        shifts={shifts}
        hasCalendar={hasCalendar}
        hasPayslipData={hasDashboardData}
        demoProfile={demoConfig.demoProfile}
        demoContractComparison={demoConfig.demoContractComparison}
        demoContractAnalysis={demoConfig.demoContractAnalysis}
      />

      {/* 4. Action buttons */}
      <QuickActions
        onCheckPayslip={handleUploadClick}
        onViewSchedule={() => navigate(`${basePath}/calendar`)}
        onViewPackage={() => navigate(`${basePath}/package`)}
        onUploadContract={() => navigate(`${basePath}/contract`)}
        careerUnlocked={hasContract && hasDashboardData}
        demoProfile={demoConfig.demoProfile}
      />

      {/* 5. Næste møde (vises kun når en booking er foretaget) */}
      {bookedMeeting && (
        <Card
          className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate(`${basePath}/booking`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Næste møde
                </p>
                <p className="text-sm font-bold text-foreground">
                  Lønrådgivning — {bookedMeeting.unionName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">
                    {bookedMeeting.date.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span>· kl. {bookedMeeting.time}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Seneste lønudbetaling */}
      <PaymentWidget
        amount={dashboardData.paymentAmount}
        daysLeft={dashboardData.paymentDaysLeft}
        month={dashboardData.paymentMonth}
        isLoading={isAnalyzing}
        onUploadClick={handleUploadClick}
      />

      {/* Arbejdstid + trend — vises for alle profiler når der er data */}
      <WorkBreakdown
        stats={agg}
        contractWeeklyHours={contractDetails?.employment.weeklyHours}
      />

      <PayTrendChart stats={agg} />

      {agg.payslipsChecked >= 2 && (
        <YtdSummary
          stats={agg}
          pensionProvider={contractDetails?.pension.provider}
        />
      )}
    </main>
  );
}
