import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
import { CalendarSyncSetup } from "@/components/calendar/CalendarSyncSetup";
import { CalendarView } from "@/components/calendar/CalendarView";
import { ErnestFAB } from "@/components/ernest/ErnestFAB";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Calendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kalender");
  const [isConnected, setIsConnected] = useState(true); // Start connected to show calendar with data
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "hjem") {
      navigate("/home");
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
    navigate("/lontjek");
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <MobileContainer>
      <AppHeader />

      <main className="px-4 py-6 pb-24 animate-fade-in">
        {isConnected ? (
          <CalendarView onAddSchedule={() => setShowAddSheet(true)} />
        ) : (
          <CalendarSyncSetup onConnect={handleConnect} />
        )}
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

      {/* Add Schedule Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Vælg din vagtplan-kilde</SheetTitle>
          </SheetHeader>
          <CalendarSyncSetup onConnect={() => setShowAddSheet(false)} />
        </SheetContent>
      </Sheet>

      <ErnestFAB />
    </MobileContainer>
  );
};

export default Calendar;
