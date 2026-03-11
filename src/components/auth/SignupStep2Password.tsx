import { useState } from "react";
import { KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordStrengthMeter, { isPasswordValid } from "./PasswordStrengthMeter";

interface SignupStep2PasswordProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onContinue: () => void;
  onBack: () => void;
  email: string;
}

const SignupStep2Password = ({
  password,
  onPasswordChange,
  onContinue,
  onBack,
  email,
}: SignupStep2PasswordProps) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isFocused, setIsFocused] = useState<"password" | "confirm" | null>(null);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid = isPasswordValid(password) && passwordsMatch && acceptTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue();
    }
  };

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Opret din adgangskode 🔐
        </h1>
        <p className="text-muted-foreground text-sm">
          For <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => onPasswordChange(e.target.value)}
              onFocus={() => setIsFocused("password")}
              onBlur={() => setIsFocused(null)}
              placeholder="Vælg en stærk adgangskode"
              className={`w-full h-14 pl-12 pr-12 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
                isFocused === "password"
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
              autoComplete="new-password"
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

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gentag adgangskode
          </label>
          <div className="relative">
            <KeyRound
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                isFocused === "confirm" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setIsFocused("confirm")}
              onBlur={() => setIsFocused(null)}
              placeholder="Gentag din adgangskode"
              className={`w-full h-14 pl-12 pr-12 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
                isFocused === "confirm"
                  ? "border-primary shadow-lg shadow-primary/10"
                  : confirmPassword && !passwordsMatch
                  ? "border-red-300"
                  : confirmPassword && passwordsMatch
                  ? "border-green-300"
                  : "border-border"
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-red-500 mt-1.5 animate-in fade-in duration-200">
              Adgangskoderne matcher ikke
            </p>
          )}
          {passwordsMatch && (
            <p className="text-sm text-green-600 mt-1.5 animate-in fade-in duration-200">
              ✓ Adgangskoderne matcher
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
          >
            Jeg accepterer{" "}
            <button type="button" className="text-primary hover:underline">
              vilkår og betingelser
            </button>{" "}
            samt{" "}
            <button type="button" className="text-primary hover:underline">
              privatlivspolitik
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold rounded-xl gap-2 mt-6"
          disabled={!isValid}
        >
          Opret konto
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default SignupStep2Password;


