import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
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

// Smart redirect component - always defaults to mobile app
function SmartRedirect() {
  // Check user preference from localStorage
  const userPreference = localStorage.getItem('paytjek-app-version');
  
  // If user has explicitly chosen web version, respect that
  if (userPreference === 'web') {
    return <Navigate to="/app/welcome" replace />;
  }
  
  // Default to mobile app (since this is a mobile-first product)
  return <Navigate to="/m/welcome" replace />;
}

// Home redirect - redirects to appropriate home based on current route context
function HomeRedirect({ base }: { base: 'mobile' | 'web' }) {
  return <Navigate to={base === 'mobile' ? "/m/home" : "/app/dashboard"} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <UserProvider>
        <PayslipProvider>
          <NotificationProvider>
            <CalendarProvider>
              <ContractProvider>
                <RequestProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                <Routes>
                  {/* ===== ROOT - Smart Redirect ===== */}
                  <Route path="/" element={<SmartRedirect />} />
                  
                  {/* ===== MOCKUP GENERATOR (for landing page) ===== */}
                  <Route path="/mockups" element={<MockupGenerator />} />
                  
                  {/* ===== MOBILE ROUTES (/m/*) ===== */}
                  {/* Mobile Auth Flow */}
                  <Route path="/m/welcome" element={<Welcome variant="mobile" />} />
                  <Route path="/m/onboarding" element={<Onboarding variant="mobile" />} />
                  <Route path="/m/auth" element={<Auth variant="mobile" />} />
                  
                  {/* Mobile App - Protected */}
                  <Route path="/m" element={<ProtectedRoute variant="mobile"><MobileLayout /></ProtectedRoute>}>
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
                  </Route>

                  {/* ===== WEB ROUTES (/app/*) ===== */}
                  {/* Web Auth Flow */}
                  <Route path="/app/welcome" element={<Welcome variant="web" />} />
                  <Route path="/app/onboarding" element={<Onboarding variant="web" />} />
                  <Route path="/app/auth" element={<Auth variant="web" />} />
                  
                  {/* Web App - Protected */}
                  <Route path="/app" element={<ProtectedRoute variant="web"><WebLayout /></ProtectedRoute>}>
                    <Route index element={<HomeRedirect base="web" />} />
                    <Route path="dashboard" element={<WebDashboard />} />
                    <Route path="calendar" element={<WebCalendar />} />
                    <Route path="lontjek" element={<WebLontjek />} />
                    <Route path="history" element={<WebHistory />} />
                    <Route path="profile" element={<WebProfile />} />
                    <Route path="settings" element={<WebSettings />} />
                    <Route path="help" element={<WebHelp />} />
                    <Route path="membership" element={<WebMembership />} />
                  </Route>

                  {/* ===== LEGACY ROUTES - Redirect to new structure ===== */}
                  {/* These ensure old bookmarks still work */}
                  <Route path="/welcome" element={<SmartRedirect />} />
                  <Route path="/onboarding" element={<SmartRedirect />} />
                  <Route path="/auth" element={<SmartRedirect />} />
                  <Route path="/home" element={<SmartRedirect />} />
                  <Route path="/calendar" element={<Navigate to="/m/calendar" replace />} />
                  <Route path="/lontjek" element={<Navigate to="/m/lontjek" replace />} />
                  <Route path="/history" element={<Navigate to="/m/history" replace />} />
                  <Route path="/more" element={<Navigate to="/m/more" replace />} />
                  <Route path="/profile" element={<Navigate to="/m/profile" replace />} />
                  <Route path="/settings" element={<Navigate to="/m/settings" replace />} />
                  <Route path="/help" element={<Navigate to="/m/help" replace />} />
                  <Route path="/membership" element={<Navigate to="/m/membership" replace />} />

                  {/* ===== 404 - Catch All ===== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
                </TooltipProvider>
              </RequestProvider>
            </ContractProvider>
          </CalendarProvider>
          </NotificationProvider>
        </PayslipProvider>
      </UserProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
