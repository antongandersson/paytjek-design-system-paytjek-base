import { useState, useEffect, useRef } from "react";
import { Mail, ArrowLeft, KeyRound, Eye, EyeOff, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PasswordStrengthMeter, { isPasswordValid } from "./PasswordStrengthMeter";
import paytjekLogo from "@/assets/paytjek-logo.svg";

type ForgotPasswordStep = "email" | "code" | "newPassword" | "success";

interface ForgotPasswordFlowProps {
  variant?: "mobile" | "web";
  onBack: () => void;
  onComplete: () => void;
}

const ForgotPasswordFlow = ({
  variant = "web",
  onBack,
  onComplete,
}: ForgotPasswordFlowProps) => {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canResetPassword = isPasswordValid(newPassword) && passwordsMatch;

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Mask email
  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_, start, middle, end) => start + "*".repeat(Math.min(middle.length, 5)) + end
  );

  const handleSendCode = async () => {
    if (!isValidEmail) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("code");
    setResendCooldown(60);
    
    // Focus first OTP input
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      if (newCode.every((d) => d !== "")) {
        handleVerifyCode(newCode.join(""));
      }
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "")) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Demo: any 6-digit code works
    if (codeString.length === 6) {
      setStep("newPassword");
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setResendCooldown(60);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleResetPassword = async () => {
    if (!canResetPassword) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("success");
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Glemt adgangskode?
              </h1>
              <p className="text-muted-foreground">
                Indtast din email, så sender vi en kode
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="space-y-4">
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
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl"
                disabled={!isValidEmail || isLoading}
              >
                {isLoading ? "Sender..." : "Send kode"}
              </Button>
            </form>
          </div>
        );

      case "code":
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbage
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Indtast kode
              </h1>
              <p className="text-muted-foreground">
                Vi har sendt en kode til
              </p>
              <p className="font-medium text-foreground">{maskedEmail}</p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-background transition-all duration-200 focus:outline-none ${
                    digit
                      ? "border-primary bg-primary/5"
                      : "border-border focus:border-primary"
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoading}
                className="gap-2"
              >
                {resendCooldown > 0 ? (
                  `Send igen om ${resendCooldown} sek`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Send kode igen
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "newPassword":
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              type="button"
              onClick={() => setStep("code")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbage
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Ny adgangskode
              </h1>
              <p className="text-muted-foreground">
                Vælg en ny stærk adgangskode
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ny adgangskode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Vælg en stærk adgangskode"
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={newPassword} />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gentag adgangskode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Gentag din adgangskode"
                    className={`w-full h-14 pl-12 pr-4 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                      confirmPassword && !passwordsMatch
                        ? "border-red-300"
                        : confirmPassword && passwordsMatch
                        ? "border-green-300"
                        : "border-border focus:border-primary"
                    }`}
                    autoComplete="new-password"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-500 mt-1.5">Adgangskoderne matcher ikke</p>
                )}
                {passwordsMatch && (
                  <p className="text-sm text-green-600 mt-1.5">✓ Adgangskoderne matcher</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl"
                disabled={!canResetPassword || isLoading}
              >
                {isLoading ? "Opdaterer..." : "Opdater adgangskode"}
              </Button>
            </form>
          </div>
        );

      case "success":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Adgangskode opdateret! 🎉
            </h1>
            <p className="text-muted-foreground mb-8">
              Din adgangskode er nu blevet ændret. Du kan nu logge ind med din nye adgangskode.
            </p>
            <Button
              className="w-full h-14 text-lg font-semibold rounded-xl"
              onClick={onComplete}
            >
              Log ind nu
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Logo */}
      <div className={variant === "web" ? "lg:hidden mb-6" : "mb-6"}>
        <img src={paytjekLogo} alt="PayTjek" className="h-10 w-auto" />
      </div>

      {/* Back to Login - only show on email step */}
      {step === "email" && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbage til login
        </button>
      )}

      {/* Form Container */}
      <div className="w-full bg-card rounded-3xl p-6 shadow-sm border border-border/50">
        {renderStep()}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;


