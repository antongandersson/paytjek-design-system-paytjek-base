import { useState } from "react";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialLoginButtons from "./SocialLoginButtons";

interface SignupStep1EmailProps {
  email: string;
  onEmailChange: (email: string) => void;
  onContinue: () => void;
  onSocialLogin: (provider: string) => void;
}

const SignupStep1Email = ({
  email,
  onEmailChange,
  onContinue,
  onSocialLogin,
}: SignupStep1EmailProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail) {
      onContinue();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Kun inviterede brugere
        </h1>
        <p className="text-muted-foreground">
          Kontooprettelse er ikke tilgængelig endnu. Log ind med eksisterende konto.
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Din email
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                isFocused ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="eksempel@mail.dk"
              className={`w-full h-14 pl-12 pr-4 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
                isFocused
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
              autoComplete="email"
              autoFocus
            />
            {email && (
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors ${
                  isValidEmail ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold rounded-xl gap-2"
          disabled={true}
        >
          Kontooprettelse ikke tilgængelig
        </Button>
      </form>

      {/* Privacy Note */}
      <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
        Ved at fortsætte accepterer du vores{" "}
        <button className="text-primary hover:underline">vilkår</button> og{" "}
        <button className="text-primary hover:underline">privatlivspolitik</button>
      </p>
    </div>
  );
};

export default SignupStep1Email;


