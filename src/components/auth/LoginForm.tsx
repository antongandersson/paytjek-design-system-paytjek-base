import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FeedbackModal, FeedbackModalState } from "@/components/ui/feedback-modal";
import paytjekLogo from "@/assets/paytjek-logo.svg";
import * as demoAuth from "@/lib/demoAuth";
import { useDemo } from "@/contexts/DemoContext";

interface LoginFormProps {
  variant?: "mobile" | "web";
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({
  variant = "web",
  onSwitchToSignup,
  onForgotPassword,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();
  const isDemoMode = demoConfig.id !== "hk";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFocused, setIsFocused] = useState<"email" | "password" | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<FeedbackModalState>("loading");
  const [modalMessage, setModalMessage] = useState("");

  const getRedirectPath = () => {
    return variant === "mobile" ? `${basePath}/home` : "/app/dashboard";
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isValidEmail && password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setModalState("loading");
    setModalMessage("Logger ind...");
    setModalOpen(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Attempt demo login
    const success = demoAuth.login(email, password);

    if (success) {
      setModalState("success");
      setModalMessage("Velkommen tilbage! 👋");

      setTimeout(() => {
        setModalOpen(false);
        navigate(getRedirectPath());
      }, 1200);
    } else {
      setModalState("error");
      setModalMessage("Forkert email eller adgangskode");

      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
      {/* Logo - mobile only or when no branding sidebar */}
      <div className={variant === "web" ? "lg:hidden mb-6" : "mb-6"}>
        <img
          src={isDemoMode ? demoConfig.logo : paytjekLogo}
          alt={isDemoMode ? demoConfig.name : "PayTjek"}
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Log ind
        </h1>
      </div>

      {/* Form Container */}
      <div className="w-full bg-card rounded-3xl p-6 shadow-sm border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                  isFocused === "email" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                placeholder="eksempel@mail.dk"
                className={`w-full h-14 pl-12 pr-4 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
                  isFocused === "email"
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                }`}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Adgangskode
            </label>
            <div className="relative">
              <KeyRound
                className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                  isFocused === "password" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused(null)}
                placeholder="••••••••"
                className={`w-full h-14 pl-12 pr-12 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
                  isFocused === "password"
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-foreground cursor-pointer"
              >
                Husk mig
              </label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary font-medium hover:underline"
            >
              Glemt adgangskode?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold rounded-xl gap-2"
            disabled={!canSubmit}
          >
            <LogIn className="w-5 h-5" />
            Log ind
          </Button>
        </form>

        {/* Social/Biometric login disabled for security */}
      </div>

      {/* Info Text - No Signup */}
      <p className="text-muted-foreground text-xs text-center mt-6">
        Kontakt os for at få adgang til platformen
      </p>

      <FeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        state={modalState}
        message={modalMessage}
      />
    </div>
  );
};

export default LoginForm;


