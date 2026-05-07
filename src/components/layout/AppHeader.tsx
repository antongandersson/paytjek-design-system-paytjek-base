import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import { NotificationSheet } from "@/components/notifications/NotificationSheet";
import { useNotifications } from "@/contexts/NotificationContext";
import paytjekLogo from "@/assets/paytjek-logo.svg";
import { useDemo } from "@/contexts/DemoContext";

interface AppHeaderProps {
  showActions?: boolean;
}

export function AppHeader({ showActions = true }: AppHeaderProps) {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const { demoConfig, basePath } = useDemo();

  const handleLogoClick = () => {
    navigate(`${basePath}/home`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Gå til forsiden"
          >
            <img
              src={demoConfig.id !== "hk" ? demoConfig.logo : paytjekLogo}
              alt={demoConfig.id !== "hk" ? demoConfig.name : "PayTjek"}
              className="h-8 w-auto object-contain"
            />
          </button>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <button 
                className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setNotificationsOpen(true)}
                aria-label="Åbn notifikationer"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
                )}
              </button>
              <button 
                className="p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label="Åbn indstillinger"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </header>

      <NotificationSheet 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </>
  );
}
