import { useState, useEffect, useRef } from "react";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignupStep3VerifyProps {
  email: string;
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
}

const SignupStep3Verify = ({
  email,
  onVerify,
  onBack,
  onResend,
}: SignupStep3VerifyProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    
    // Handle paste
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
      
      // Auto-submit if complete
      if (newCode.every((d) => d !== "")) {
        onVerify(newCode.join(""));
      }
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every((d) => d !== "")) {
      onVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    await onResend();
    setIsResending(false);
    setResendCooldown(60);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Mask email
  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_, start, middle, end) => start + "*".repeat(Math.min(middle.length, 5)) + end
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbage
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 relative">
          <Mail className="w-8 h-8 text-primary" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Tjek din email ✉️
        </h1>
        <p className="text-muted-foreground">
          Vi har sendt en 6-cifret kode til
        </p>
        <p className="font-medium text-foreground">{maskedEmail}</p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-background transition-all duration-200 focus:outline-none ${
              digit
                ? "border-primary bg-primary/5"
                : "border-border focus:border-primary focus:shadow-lg focus:shadow-primary/10"
            }`}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Resend */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Modtog du ikke koden?
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="gap-2"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sender...
            </>
          ) : resendCooldown > 0 ? (
            <>
              Send igen om {resendCooldown} sek
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Send kode igen
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-muted/50 rounded-xl">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          💡 Tip: Tjek også din spam-mappe hvis du ikke kan finde emailen.
          Koden udløber efter 10 minutter.
        </p>
      </div>
    </div>
  );
};

export default SignupStep3Verify;


