import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Check, X, AlertTriangle } from "lucide-react";

export type FeedbackModalState = "loading" | "success" | "warning" | "error";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: FeedbackModalState;
  message: string;
}

const stateConfig = {
  loading: {
    icon: Spinner,
    iconClass: "size-12 text-primary",
  },
  success: {
    icon: Check,
    iconClass: "size-12 text-[hsl(var(--accent))]",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "size-12 text-yellow-500",
  },
  error: {
    icon: X,
    iconClass: "size-12 text-destructive",
  },
};

export function FeedbackModal({ open, onOpenChange, state, message }: FeedbackModalProps) {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[280px] rounded-3xl border-0 shadow-xl p-8 flex flex-col items-center justify-center gap-6 [&>button]:hidden">
        <Icon className={config.iconClass} />
        <p className="text-lg font-medium text-foreground text-center">{message}</p>
      </DialogContent>
    </Dialog>
  );
}
