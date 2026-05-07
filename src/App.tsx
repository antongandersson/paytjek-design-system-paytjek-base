import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { DemoSwitcher } from "@/components/demo/DemoSwitcher";
import { PayslipProvider } from "@/contexts/PayslipContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { AppProvider } from "@/contexts/AppContext";
import { ContractProvider } from "@/contexts/ContractContext";
import { RequestProvider } from "@/contexts/RequestContext";

// Shared pages (auth, onboarding)
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MockupGenerator from "./pages/MockupGenerator";
import DemoSelector from "./pages/DemoSelector";
import { UnionDashboard } from "../landing-page-materials/components/UnionDashboard";
import AppPreviewPage from "./pages/AppPreviewPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Mobile Layout & Pages
import { MobileLayout } from "./components/mobile/MobileLayout";
import {
  MobileHome,
  MobileCalendar,
  MobileHistory,
  MobileLontjek,
  MobileMore,
  MobileProfile,
  MobileSettings,
  MobileHelp,
  MobileMembership,
  MobileContract,
  MobilePackage,
} from "./pages/mobile";

// Web Layout & Pages
import { WebLayout } from "./components/web/WebLayout";
import {
  WebDashboard,
  WebCalendar,
  WebHistory,
  WebLontjek,
  WebProfile,
  WebSettings,
  WebHelp,
  WebMembership,
} from "./pages/web";

const queryClient = new QueryClient();

// Smart redirect - sends to selector
function SmartRedirect() {
  return <Navigate to="/" replace />;
}

// Home redirect - redirects to home within current union context
function HomeRedirect({ base: _base }: { base: 'mobile' | 'web' }) {
  return <Navigate to="home" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DemoProvider>
            <UserProvider>
              <PayslipProvider>
                <NotificationProvider>
                  <CalendarProvider>
                    <ContractProvider>
                      <RequestProvider>
                        <DemoSwitcher />
                        <Routes>
                          {/* ===== ROOT - Demo Selector ===== */}
                          <Route path="/" element={<DemoSelector />} />
                          
                          {/* ===== MOCKUP GENERATOR (for landing page) ===== */}
                          <Route path="/mockups" element={<MockupGenerator />} />

                          {/* ===== UNION DASHBOARD DEMO (for landing page) ===== */}
                          <Route path="/union-demo" element={<UnionDashboard />} />

                          {/* ===== APP PREVIEW (rigtige screens i phone frames) ===== */}
                          <Route path="/app-preview" element={<AppPreviewPage />} />
                          
                          {/* ===== UNION DEMO ROUTES (/:unionId/*) ===== */}
                          <Route path="/:unionId/welcome" element={<Welcome variant="mobile" />} />
                          <Route path="/:unionId/onboarding" element={<Onboarding variant="mobile" />} />
                          <Route path="/:unionId/auth" element={<Auth variant="mobile" />} />
                          
                          <Route path="/:unionId" element={<ProtectedRoute variant="mobile"><MobileLayout /></ProtectedRoute>}>
                            <Route index element={<HomeRedirect base="mobile" />} />
                            <Route path="home" element={<MobileHome />} />
                            <Route path="calendar" element={<MobileCalendar />} />
                            <Route path="lontjek" element={<MobileLontjek />} />
                            <Route path="history" element={<MobileHistory />} />
                            <Route path="more" element={<MobileMore />} />
                            <Route path="profile" element={<MobileProfile />} />
                            <Route path="settings" element={<MobileSettings />} />
                            <Route path="help" element={<MobileHelp />} />
                            <Route path="membership" element={<MobileMembership />} />
                            <Route path="contract" element={<MobileContract />} />
                            <Route path="package" element={<MobilePackage />} />
                          </Route>

                          {/* ===== LEGACY ROUTES - Redirect to selector ===== */}
                          <Route path="/m/*" element={<Navigate to="/" replace />} />
                          <Route path="/app/*" element={<Navigate to="/" replace />} />

                          {/* ===== 404 - Catch All ===== */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </RequestProvider>
                    </ContractProvider>
                  </CalendarProvider>
                </NotificationProvider>
              </PayslipProvider>
            </UserProvider>
          </DemoProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
