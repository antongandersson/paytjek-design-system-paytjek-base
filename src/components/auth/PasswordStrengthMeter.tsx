import { useMemo } from "react";
import { Check, Circle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  showChecklist?: boolean;
}

interface PasswordCheck {
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

const passwordChecks: PasswordCheck[] = [
  {
    label: "Mindst 8 tegn",
    test: (p) => p.length >= 8,
    weight: 25,
  },
  {
    label: "Både store og små bogstaver",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
    weight: 25,
  },
  {
    label: "Mindst ét tal",
    test: (p) => /[0-9]/.test(p),
    weight: 25,
  },
  {
    label: "Mindst ét specialtegn (!@#$%)",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    weight: 25,
  },
];

const PasswordStrengthMeter = ({
  password,
  showChecklist = true,
}: PasswordStrengthMeterProps) => {
  const { strength, passedChecks } = useMemo(() => {
    let score = 0;
    const passed: boolean[] = [];

    passwordChecks.forEach((check) => {
      const passes = check.test(password);
      passed.push(passes);
      if (passes) {
        score += check.weight;
      }
    });

    // Bonus for length
    if (password.length >= 12) score = Math.min(100, score + 10);
    if (password.length >= 16) score = Math.min(100, score + 10);

    return { strength: score, passedChecks: passed };
  }, [password]);

  const getStrengthInfo = () => {
    if (strength === 0) return { label: "", color: "bg-gray-200", textColor: "text-gray-400", icon: null };
    if (strength < 33) return { label: "Svag", color: "bg-red-500", textColor: "text-red-500", icon: ShieldAlert };
    if (strength < 66) return { label: "Middel", color: "bg-yellow-500", textColor: "text-yellow-600", icon: Shield };
    if (strength < 100) return { label: "Stærk", color: "bg-green-500", textColor: "text-green-600", icon: ShieldCheck };
    return { label: "Meget stærk", color: "bg-green-600", textColor: "text-green-600", icon: ShieldCheck };
  };

  const info = getStrengthInfo();
  const Icon = info.icon;

  return (
    <div className="space-y-3 mt-3">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${info.color}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        {password.length > 0 && (
          <div className={`flex items-center gap-1.5 text-sm ${info.textColor}`}>
            {Icon && <Icon className="w-4 h-4" />}
            <span className="font-medium">{info.label}</span>
          </div>
        )}
      </div>

      {/* Checklist */}
      {showChecklist && (
        <div className="grid grid-cols-2 gap-2">
          {passwordChecks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                passedChecks[index]
                  ? "text-green-600"
                  : password.length > 0
                  ? "text-gray-400"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                  passedChecks[index]
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                {passedChecks[index] ? (
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                ) : (
                  <Circle className="w-2 h-2 fill-current opacity-30" />
                )}
              </div>
              <span className="text-xs">{check.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

// Export utility function for validation
export const isPasswordValid = (password: string): boolean => {
  return passwordChecks.every((check) => check.test(password));
};


