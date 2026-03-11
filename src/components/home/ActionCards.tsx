import { FileText, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onCheckPayslip?: () => void;
  onViewSchedule?: () => void;
}

export { QuickActions as ActionCards };

export function QuickActions({ onCheckPayslip, onViewSchedule }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="default"
        className="h-12 rounded-2xl gap-2 font-semibold"
        onClick={onCheckPayslip}
      >
        <FileText className="h-4.5 w-4.5" />
        Tjek lønseddel
      </Button>
      <Button
        variant="secondary"
        className="h-12 rounded-2xl gap-2 font-semibold"
        onClick={onViewSchedule}
      >
        <CalendarDays className="h-4.5 w-4.5" />
        Se vagtplan
      </Button>
    </div>
  );
}
