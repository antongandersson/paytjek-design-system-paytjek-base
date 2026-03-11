import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordChecklist from "./PasswordChecklist";
import { FeedbackModal, FeedbackModalState } from "@/components/ui/feedback-modal";
import hkLogo from "@/assets/hk-logo.png";

type AuthMode = "signup" | "login";

interface AuthFormProps {
  variant?: "mobile" | "web";
}

const AuthForm = ({ variant = "web" }: AuthFormProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<FeedbackModalState>("loading");
  const [modalMessage, setModalMessage] = useState("");

  // Redirect based on variant
  const getRedirectPath = () => {
    return variant === "mobile" ? "/m/home" : "/app/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading modal
    setModalState("loading");
    setModalMessage(mode === "signup" ? "Opretter konto..." : "Logger ind...");
    setModalOpen(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success
    setModalState("success");
    setModalMessage(mode === "signup" ? "Konto oprettet" : "Logget ind");

    // Navigate after showing success
    setTimeout(() => {
      setModalOpen(false);
      navigate(getRedirectPath());
    }, 1200);
  };

  const handleSocialLogin = async (provider: string) => {
    // Show loading modal
    setModalState("loading");
    setModalMessage(`Logger ind med ${provider}...`);
    setModalOpen(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success
    setModalState("success");
    setModalMessage("Logget ind");

    // Navigate after showing success
    setTimeout(() => {
      setModalOpen(false);
      navigate(getRedirectPath());
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Logo - only visible on mobile variant or when branding is hidden */}
      <div className={variant === "web" ? "lg:hidden mb-6" : "mb-6"}>
        <img src={hkLogo} alt="HK Handel" className="h-16 w-auto mix-blend-multiply" />
      </div>

      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
        {mode === "signup" ? "Opret konto" : "Velkommen tilbage"}
      </h1>

      {/* Toggle Link */}
      <p className="text-muted-foreground mb-6">
        {mode === "signup" ? (
          <>
            Har du allerede en konto?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-primary font-semibold hover:underline"
            >
              Log ind
            </button>
          </>
        ) : (
          <>
            Har du ikke en konto?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="text-primary font-semibold hover:underline"
            >
              Opret konto
            </button>
          </>
        )}
      </p>

      {/* Form Card */}
      <div className="w-full bg-card rounded-3xl p-6 shadow-sm border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eksempel@mail.dk"
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Adgangskode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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

            {/* Password Validation Checklist (Sign Up only) */}
            {mode === "signup" && <PasswordChecklist password={password} />}
          </div>

          {/* Remember Me & Forgot Password (Login only) */}
          {mode === "login" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
                  Husk mig
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary font-medium hover:underline"
              >
                Glemt adgangskode?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-xl" size="lg">
            {mode === "signup" ? "Opret konto" : "Log ind"}
          </Button>
        </form>

        {/* Divider + Social login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                Eller fortsæt med
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              type="button"
              variant="outline" 
              className="h-12 rounded-xl"
              onClick={() => handleSocialLogin("Google")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="h-12 rounded-xl"
              onClick={() => handleSocialLogin("Apple")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        state={modalState}
        message={modalMessage}
      />
    </div>
  );
};

export default AuthForm;
