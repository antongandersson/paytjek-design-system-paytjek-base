import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Moon, Globe, Download, Trash2, ChevronRight } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingItem {
  icon: React.ElementType;
  label: string;
  id: string;
  type: "toggle" | "navigate" | "action";
  value?: boolean;
  description?: string;
  danger?: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsItems: SettingItem[] = [
    { 
      icon: Bell, 
      label: "Notifikationer", 
      id: "notifications", 
      type: "toggle", 
      value: notifications,
      description: "Modtag besked om løntjek og opdateringer"
    },
    { 
      icon: Moon, 
      label: "Mørk tilstand", 
      id: "darkMode", 
      type: "toggle", 
      value: darkMode,
      description: "Skift mellem lys og mørk tema"
    },
    { 
      icon: Globe, 
      label: "Sprog", 
      id: "language", 
      type: "navigate",
      description: "Dansk"
    },
    { 
      icon: Download, 
      label: "Eksporter data", 
      id: "export", 
      type: "action",
      description: "Download dine lønsedler og rapporter"
    },
    { 
      icon: Trash2, 
      label: "Slet konto", 
      id: "delete", 
      type: "action",
      danger: true,
      description: "Slet permanent din konto og alle data"
    },
  ];

  const handleToggle = (id: string) => {
    if (id === "notifications") {
      setNotifications(!notifications);
    } else if (id === "darkMode") {
      setDarkMode(!darkMode);
    }
  };

  const handleAction = (id: string) => {
    if (id === "export") {
      // Handle export
      console.log("Exporting data...");
    } else if (id === "delete") {
      // Handle delete account
      console.log("Delete account...");
    } else if (id === "language") {
      // Navigate to language selection
      console.log("Language selection...");
    }
  };

  return (
    <MobileContainer>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Indstillinger</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-8 space-y-6 animate-fade-in">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === "toggle") {
                      handleToggle(item.id);
                    } else {
                      handleAction(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50",
                    index !== settingsItems.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        item.danger ? "text-destructive" : "text-muted-foreground"
                      )}
                    />
                    <div className="text-left">
                      <span
                        className={cn(
                          "font-medium block",
                          item.danger ? "text-destructive" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {item.type === "toggle" ? (
                    <div
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        item.value ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                          item.value ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </div>
                  ) : item.type === "navigate" ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  ) : null}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>PayTjek v1.0.0</p>
          <p className="mt-1">© 2025 PayTjek. Alle rettigheder forbeholdes.</p>
        </div>
      </main>
    </MobileContainer>
  );
};

export default Settings;





