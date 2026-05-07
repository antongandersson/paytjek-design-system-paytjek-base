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
  const { demoConfig, basePath } = useDemo();

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

      {/* 2. Status row — Kontrakt + Lønpakke/Vagtplan side by side */}
      <DashboardContextRow
        contractDetails={contractDetails}
        shifts={shifts}
        hasCalendar={hasCalendar}
        demoProfile={demoConfig.demoProfile}
        demoContractComparison={demoConfig.demoContractComparison}
        demoContractAnalysis={demoConfig.demoContractAnalysis}
      />

      {/* 3. Action buttons */}
      <QuickActions
        onCheckPayslip={handleUploadClick}
        onViewSchedule={() => navigate(`${basePath}/calendar`)}
        onViewPackage={() => navigate(`${basePath}/package`)}
        demoProfile={demoConfig.demoProfile}
      />

      {/* 4. Løntjek resultat (or empty state) */}
      <StatusHero stats={agg} />

      {/* 5. Seneste lønudbetaling */}
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
