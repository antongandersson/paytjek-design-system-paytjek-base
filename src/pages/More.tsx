import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CreditCard, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { ErnestFAB } from "@/components/ernest/ErnestFAB";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  id: string;
  danger?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: User, label: "Min Profil", id: "profile" },
  { icon: CreditCard, label: "Medlemskab", id: "membership" },
  { icon: Settings, label: "Indstillinger", id: "settings" },
  { icon: HelpCircle, label: "Hjælp & Support", id: "help" },
  { icon: LogOut, label: "Log ud", id: "logout", danger: true },
];

const More = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mere");
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "hjem") {
      navigate("/home");
    } else if (tab === "kalender") {
      navigate("/calendar");
    } else if (tab === "historie") {
      navigate("/history");
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

  const handleMenuClick = (id: string) => {
    if (id === "profile") {
      navigate("/profile");
    } else if (id === "membership") {
      navigate("/membership");
    } else if (id === "settings") {
      navigate("/settings");
    } else if (id === "help") {
      navigate("/help");
    } else if (id === "logout") {
      navigate("/");
    }
  };

  return (
    <MobileContainer>
      <AppHeader />

      <main className="px-4 py-6 pb-24 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">Mere</h1>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50",
                    index !== menuItems.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        item.danger ? "text-destructive" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        item.danger ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  {!item.danger && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>
      </main>

      <ErnestFAB />

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
    </MobileContainer>
  );
};

export default More;
