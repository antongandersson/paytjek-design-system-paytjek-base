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
  hasContract?: boolean;
}

export { QuickActions as ActionCards };

export function QuickActions({
  onCheckPayslip,
  onViewSchedule,
  onViewPackage,
  onUploadContract,
  careerUnlocked = false,
  demoProfile = "agreement",
  hasContract = false,
}: QuickActionsProps) {
  if (demoProfile === "contract-only") {
    return (
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant={hasContract ? "secondary" : "default"}
          className="h-14 rounded-2xl gap-2 font-semibold text-base"
          onClick={onUploadContract}
        >
          <Upload className="h-5 w-5" />
          {hasContract ? "Upload ny kontrakt" : "Tjek din kontrakt"}
        </Button>
      </div>
    );
  }

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
