import { useNavigate } from "react-router-dom";
import { User, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePayslip } from "@/contexts/PayslipContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useApp } from "@/contexts/AppContext";
import { useContract } from "@/contexts/ContractContext";
import { useRequests } from "@/contexts/RequestContext";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  id: string;
  danger?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: User, label: "Min Profil", id: "profile" },
  { icon: HelpCircle, label: "Hjælp & Support", id: "help" },
  { icon: LogOut, label: "Log ud", id: "logout", danger: true },
];

export default function MobileMore() {
  const navigate = useNavigate();
  
  // Import contexts for logout
  const { clearAllData: clearPayslipData } = usePayslip();
  const { clearAllData: clearCalendarData } = useCalendar();
  const { clearAllData: clearAppData } = useApp();
  const { clearAllData: clearContractData } = useContract();
  const { clearAllData: clearRequestData } = useRequests();

  const handleMenuClick = (id: string) => {
    if (id === "profile") {
      navigate("/m/profile");
    } else if (id === "help") {
      navigate("/m/help");
    } else if (id === "logout") {
      // Ryd al app data ved logout
      clearPayslipData();
      clearCalendarData();
      clearAppData();
      clearContractData();
      clearRequestData();
      // Ryd også brugerprofil fra localStorage
      localStorage.removeItem('paytjek_user_profile');
      navigate("/welcome");
    }
  };

  return (
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
  );
}





