import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
import { HomeHeader, CalendarLinkButton } from "@/components/home/HomeHeader";
import { ActionCards } from "@/components/home/ActionCards";
import { PaymentWidget } from "@/components/home/PaymentWidget";
import { EarningsGauge } from "@/components/home/EarningsGauge";
import { EarnedItemsList } from "@/components/home/EarnedItemsList";
import { ErnestFAB } from "@/components/ernest/ErnestFAB";
import { usePayslip } from "@/contexts/PayslipContext";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hjem");
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  
  // 🆕 Hent dashboard-data fra global PayslipContext
  const { getDashboardData, hasActiveAnalysis } = usePayslip();
  const dashboardData = getDashboardData();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "kalender") {
      navigate("/calendar");
    } else if (tab === "historie") {
      navigate("/history");
    } else if (tab === "mere") {
      navigate("/more");
    } else if (tab === "lontjek") {
      setUploadDrawerOpen(true);
    }
  };

  const handleCenterClick = () => {
    setUploadDrawerOpen(true);
  };

  const handleUploadOption = (option: string) => {
    console.log("Selected upload option:", option);
    navigate("/lontjek");
  };

  const handleCheckPayslip = () => {
    setUploadDrawerOpen(true);
  };

  const handleViewSchedule = () => {
    navigate("/calendar");
  };

  return (
    <MobileContainer>
      <AppHeader />
      
      <main className="px-4 py-6 space-y-5 pb-24 animate-fade-in">
        {/* Blue Header */}
        <HomeHeader name="Kim" />

        {/* Calendar Link Button */}
        <div className="flex justify-center -mt-2">
          <CalendarLinkButton />
        </div>

        {/* Action Cards */}
        <ActionCards onCheckPayslip={handleCheckPayslip} onViewSchedule={handleViewSchedule} />

        {/* Payment Widget - viser næste lønudbetaling fra seneste analyse */}
        <PaymentWidget 
          amount={dashboardData.paymentAmount}
          daysLeft={dashboardData.paymentDaysLeft}
          month={dashboardData.paymentMonth}
          onUploadClick={handleCheckPayslip}
        />

        {/* Earnings Gauge - viser optjent vs bruttoløn */}
        <EarningsGauge 
          earned={dashboardData.earned}
          total={dashboardData.total}
          date={dashboardData.earningsDate}
        />

        {/* Earned Items List - viser ferie, pension, skat osv. */}
        <EarnedItemsList 
          items={dashboardData.earnedItems}
          onUploadClick={handleCheckPayslip}
        />
      </main>

      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCenterClick={handleCenterClick}
      />

      <UploadDrawer 
        open={uploadDrawerOpen}
        onOpenChange={setUploadDrawerOpen}
        onOptionSelect={handleUploadOption}
      />

      <ErnestFAB />
    </MobileContainer>
  );
};

export default Index;
