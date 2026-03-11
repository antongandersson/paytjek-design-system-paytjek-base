import { Home, Calendar, History, MoreHorizontal, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Hjem", id: "hjem" },
  { icon: Calendar, label: "Kalender", id: "kalender" },
  { icon: FileCheck, label: "Løntjek", id: "lontjek", isCenter: true },
  { icon: History, label: "Historie", id: "historie" },
  { icon: MoreHorizontal, label: "Mere", id: "mere" },
];

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCenterClick?: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onCenterClick }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  onCenterClick?.();
                  onTabChange(item.id);
                }}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 shadow-lg",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary text-primary-foreground hover:scale-105"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center py-2 px-3 transition-all duration-200"
            >
              <Icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium mt-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
