import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { WebHeader } from "./WebHeader";
// import { ErnestFAB } from "@/components/ernest/ErnestFAB"; // TEMPORARILY DISABLED

export function WebLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar Navigation */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col flex-1">
          <WebHeader />

          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {/* Outlet renders child routes */}
              <Outlet />
            </div>
          </main>
        </SidebarInset>

        {/* Ernest AI FAB - TEMPORARILY DISABLED */}
        {/* <ErnestFAB /> */}
      </div>
    </SidebarProvider>
  );
}





