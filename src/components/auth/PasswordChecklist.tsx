import { Check, Circle } from "lucide-react";

interface PasswordChecklistProps {
  password: string;
}

const PasswordChecklist = ({ password }: PasswordChecklistProps) => {
  const checks = [
    {
      label: "Mindst 8 tegn",
      valid: password.length >= 8,
    },
    {
      label: "Inkludér bogstaver og tal",
      valid: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
    },
    {
      label: "Tilføj ét specialtegn (!, @, #, $)",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <div className="space-y-2 mt-2">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center gap-2">
          {check.valid ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={`text-sm ${check.valid ? "text-accent" : "text-muted-foreground"}`}>
            {check.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordChecklist;
