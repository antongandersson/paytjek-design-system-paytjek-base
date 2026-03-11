import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { HomeHeader, CalendarLinkButton, ContractLinkButton } from "@/components/home/HomeHeader";
import { QuickActions } from "@/components/home/ActionCards";
import { PaymentWidget } from "@/components/home/PaymentWidget";
import {
  StatusHero,
  JobCard,
  WorkBreakdown,
  PayTrendChart,
  YtdSummary,
} from "@/components/home/AggregatedWidgets";
import { usePayslip } from "@/contexts/PayslipContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useApp } from "@/contexts/AppContext";
import { useUser } from "@/contexts/UserContext";
import { useContract } from "@/contexts/ContractContext";

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
    <main className="px-4 py-6 space-y-5 pb-24 animate-fade-in">
      {/* 1. Header */}
      <HomeHeader
        name={user?.firstName}
        hasPayslipData={hasDashboardData}
        hasCalendar={hasCalendar}
        hasContract={hasContract}
      />

      {/* 2. Quick link pills */}
      <div className="flex justify-center gap-2 -mt-2 flex-wrap">
        <CalendarLinkButton
          isConnected={hasCalendar}
          shiftCount={shifts.length}
        />
        <ContractLinkButton />
      </div>

      {/* 3. Status hero — "Du mangler 253 kr" / "Alt korrekt" */}
      <StatusHero stats={agg} />

      {/* 4. Seneste løn */}
      <PaymentWidget
        amount={dashboardData.paymentAmount}
        daysLeft={dashboardData.paymentDaysLeft}
        month={dashboardData.paymentMonth}
        isLoading={isAnalyzing}
        onUploadClick={handleUploadClick}
      />

      {/* 5. Din ansættelse (fra kontrakt) */}
      <JobCard contractDetails={contractDetails} />

      {/* 6. Denne måneds arbejde — timer + tillæg breakdown */}
      <WorkBreakdown
        stats={agg}
        contractWeeklyHours={contractDetails?.employment.weeklyHours}
      />

      {/* 7. Quick actions */}
      <QuickActions onCheckPayslip={handleUploadClick} onViewSchedule={() => navigate("/m/calendar")} />

      {/* 8. Løn-trend (2+ lønsedler) */}
      <PayTrendChart stats={agg} />

      {/* 9. Din opsparing (2+ lønsedler) */}
      {agg.payslipsChecked >= 2 && (
        <YtdSummary
          stats={agg}
          pensionProvider={contractDetails?.pension.provider}
        />
      )}
    </main>
  );
}
