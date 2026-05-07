import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileCheck, 
  History, 
  Settings, 
  User, 
  LogOut, 
  HelpCircle,
  CreditCard 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import paytjekLogo from "@/assets/paytjek-logo.svg";

const mainNavItems = [
  { icon: Home, label: "Dashboard", path: "/app/dashboard" },
  { icon: Calendar, label: "Kalender", path: "/app/calendar" },
  { icon: FileCheck, label: "Løntjek", path: "/app/lontjek" },
  { icon: History, label: "Historie", path: "/app/history" },
];

const secondaryNavItems = [
  { icon: User, label: "Profil", path: "/app/profile" },
  { icon: CreditCard, label: "Medlemskab", path: "/app/membership" },
  { icon: Settings, label: "Indstillinger", path: "/app/settings" },
  { icon: HelpCircle, label: "Hjælp & Support", path: "/app/help" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      {/* PayTjek branded header */}
      <SidebarHeader className="bg-white border-b border-border p-5">
        <Link to="/app" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={paytjekLogo} alt="PayTjek" className="h-8 w-auto" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-card">
        <SidebarGroup>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "h-11 rounded-xl transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                        : "hover:bg-primary/10"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Konto
          </p>
          <SidebarMenu>
            {secondaryNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "h-11 rounded-xl transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                        : "hover:bg-primary/10"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-card border-t border-border">
        {/* User info card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 mb-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="" alt="Sara" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              SN
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Sara Nielsen</p>
            <p className="text-xs text-muted-foreground truncate">demo@paytjek.dk</p>
          </div>
        </div>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Link to="/welcome">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Log ud</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
