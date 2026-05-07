import { FileText, CalendarDays, GraduationCap, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoProfile } from "@/lib/demoUnionConfigs";

interface QuickActionsProps {
  onCheckPayslip?: () => void;
  onViewSchedule?: () => void;
  onViewPackage?: () => void;
  onUploadContract?: () => void;
  careerUnlocked?: boolean;
  demoProfile?: DemoProfile;
}

export { QuickActions as ActionCards };

export function QuickActions({
  onCheckPayslip,
  onViewSchedule,
  onViewPackage,
  onUploadContract,
  careerUnlocked = false,
  demoProfile = "agreement",
}: QuickActionsProps) {
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

      {demoProfile === "contract" ? (
        careerUnlocked ? (
          <Button
            variant="secondary"
            className="h-12 rounded-2xl gap-2 font-semibold"
            onClick={onViewPackage}
          >
            <GraduationCap className="h-4.5 w-4.5" />
            Se karriere
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="h-12 rounded-2xl gap-2 font-semibold"
            onClick={onUploadContract}
          >
            <Upload className="h-4.5 w-4.5" />
            Upload kontrakt
          </Button>
        )
      ) : (
        <Button
          variant="secondary"
          className="h-12 rounded-2xl gap-2 font-semibold"
          onClick={onViewSchedule}
        >
          <CalendarDays className="h-4.5 w-4.5" />
          Se vagtplan
        </Button>
      )}
    </div>
  );
}
