import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
// import { ErnestFAB } from "@/components/ernest/ErnestFAB"; // TEMPORARILY DISABLED
import { OvertimeCheckSheet } from "@/components/calendar/OvertimeCheckSheet";
import { useCalendar } from "@/contexts/CalendarContext";
import { useContract } from "@/contexts/ContractContext";
import { useDemo } from "@/contexts/DemoContext";
import { usePayslip } from "@/contexts/PayslipContext";

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { basePath } = useDemo();
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const { pendingOvertimeCheck, confirmShift, snoozeOvertimeCheck, isConnected: hasCalendar } = useCalendar();
  const { hasContract } = useContract();
  const { getDashboardData } = usePayslip();

  const isOnCalendarPage = location.pathname.includes('/calendar');
  const isFullyOnboarded = hasContract && hasCalendar && getDashboardData().aggregated.payslipsChecked >= 2;

  // Only show ONE overtime prompt per calendar visit - reset when leaving calendar
  const [overtimeHandled, setOvertimeHandled] = useState(false);
  const wasOnCalendar = useRef(false);

  useEffect(() => {
    if (!isOnCalendarPage && wasOnCalendar.current) {
      setOvertimeHandled(false);
    }
    wasOnCalendar.current = isOnCalendarPage;
  }, [isOnCalendarPage]);

  const showOvertimePrompt = isFullyOnboarded && isOnCalendarPage && !overtimeHandled;

  const handleConfirmShift = useCallback((shiftId: string, extraHours: number, note?: string) => {
    confirmShift(shiftId, extraHours, note);
    setOvertimeHandled(true);
  }, [confirmShift]);

  const handleSnoozeShift = useCallback((shiftId: string) => {
    snoozeOvertimeCheck(shiftId);
    setOvertimeHandled(true);
  }, [snoozeOvertimeCheck]);

  // Determine active tab from current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/calendar")) return "kalender";
    if (path.includes("/contract")) return "kontrakt";
    if (path.includes("/history")) return "historie";
    if (path.includes("/more") || path.includes("/profile") || path.includes("/settings") || path.includes("/help") || path.includes("/membership")) return "mere";
    if (path.includes("/lontjek")) return "lontjek";
    return "hjem";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "hjem") {
      navigate(`${basePath}/home`);
    } else if (tab === "kalender") {
      navigate(`${basePath}/calendar`);
    } else if (tab === "kontrakt") {
      navigate(`${basePath}/contract`);
    } else if (tab === "historie") {
      navigate(`${basePath}/history`);
    } else if (tab === "mere") {
      navigate(`${basePath}/more`);
    } else if (tab === "lontjek") {
      setUploadDrawerOpen(true);
    }
  };

  const handleCenterClick = () => {
    setUploadDrawerOpen(true);
  };

  const handleUploadOption = (option: string) => {
    console.log("Selected upload option:", option);
    navigate(`${basePath}/lontjek`, { state: { fresh: true } });
  };

  return (
    <MobileContainer>
      <AppHeader />

      {/* Outlet renders child routes */}
      <Outlet context={{ setUploadDrawerOpen }} />

      {/* <ErnestFAB /> */}{/* TEMPORARILY DISABLED */}

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

      {showOvertimePrompt && (
        <OvertimeCheckSheet
          shift={pendingOvertimeCheck}
          onConfirm={handleConfirmShift}
          onSnooze={handleSnoozeShift}
        />
      )}
    </MobileContainer>
  );
}





