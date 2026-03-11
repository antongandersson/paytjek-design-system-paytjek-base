import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupWizard from "@/components/auth/SignupWizard";
import ForgotPasswordFlow from "@/components/auth/ForgotPasswordFlow";

type AuthView = "login" | "signup" | "forgot-password";

interface AuthProps {
  variant?: "mobile" | "web";
}

const Auth = ({ variant = "web" }: AuthProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial view from URL param, default to login
  const getInitialView = (): AuthView => {
    const mode = searchParams.get("mode");
    if (mode === "signup") return "signup";
    if (mode === "forgot") return "forgot-password";
    return "login"; // Default to login to protect app
  };

  const [currentView, setCurrentView] = useState<AuthView>(getInitialView());

  const handleViewChange = (view: AuthView) => {
    setCurrentView(view);
    // Update URL to reflect current view
    if (view === "login") {
      setSearchParams({ mode: "login" });
    } else if (view === "forgot-password") {
      setSearchParams({ mode: "forgot" });
    } else {
      setSearchParams({});
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            variant={variant}
            onSwitchToSignup={() => handleViewChange("signup")}
            onForgotPassword={() => handleViewChange("forgot-password")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordFlow
            variant={variant}
            onBack={() => handleViewChange("login")}
            onComplete={() => handleViewChange("login")}
          />
        );
      case "signup":
      default:
        return (
          <SignupWizard
            variant={variant}
            onSwitchToLogin={() => handleViewChange("login")}
          />
        );
    }
  };

  return (
    <AuthLayout showBranding={variant === "web"}>
      {renderView()}
    </AuthLayout>
  );
};

export default Auth;
