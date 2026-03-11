import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Shift } from "@/contexts/CalendarContext";
import { cn } from "@/lib/utils";

interface OvertimeCheckSheetProps {
  shift: Shift | null;
  onConfirm: (shiftId: string, extraHours: number, note?: string) => void;
  onSnooze: (shiftId: string) => void;
}

const typeLabels: Record<Shift["type"], string> = {
  day: "Dagvagt",
  evening: "Aftenvagt",
  night: "Nattevagt",
  "day-off": "Fridag",
  meeting: "Møde",
  sick: "Sygdom",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const shiftDay = new Date(d);
  shiftDay.setHours(0, 0, 0, 0);

  if (shiftDay.getTime() === yesterday.getTime()) return "i går";
  if (shiftDay.getTime() === today.getTime()) return "i dag";

  const dayNames = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];
  const monthNames = [
    "jan", "feb", "mar", "apr", "maj", "jun",
    "jul", "aug", "sep", "okt", "nov", "dec",
  ];
  return `${dayNames[d.getDay()]}. d. ${d.getDate()}. ${monthNames[d.getMonth()]}`;
}

export function OvertimeCheckSheet({ shift, onConfirm, onSnooze }: OvertimeCheckSheetProps) {
  const [extraHours, setExtraHours] = useState(0);
  const [extraMinutes, setExtraMinutes] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shift) {
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }
    setVisible(false);
    setExtraHours(0);
    setExtraMinutes(0);
    setExpanded(false);
  }, [shift]);

  if (!shift || !visible) return null;

  const handleNoOvertime = () => {
    onConfirm(shift.id, 0);
  };

  const handleConfirm = () => {
    onConfirm(shift.id, extraHours + extraMinutes / 60);
  };

  const handleSnooze = () => {
    onSnooze(shift.id);
  };

  const totalExtra = extraHours + extraMinutes / 60;

  return (
    <>
      {/* Backdrop - within the mobile container */}
      <div
        className="absolute inset-0 z-40 bg-black/40 animate-in fade-in-0"
        onClick={handleSnooze}
      />

      {/* Card - above bottom nav (bottom-20) */}
      <div className="absolute inset-x-0 bottom-20 z-50 px-3 animate-in slide-in-from-bottom duration-300">
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-3 pb-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground leading-tight">
                {typeLabels[shift.type]} {formatDate(shift.date)}
              </p>
              <p className="text-xs text-muted-foreground">
                {shift.time && shift.time !== "Fri" && shift.time !== "Syg"
                  ? `Kl. ${shift.time}`
                  : ""}
                {shift.hours ? ` · ${shift.hours}t planlagt` : ""}
              </p>
            </div>
            <button
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
              onClick={handleSnooze}
            >
              Senere
            </button>
          </div>

          {/* Actions */}
          <div className="px-4 pb-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl h-9 justify-start gap-2 border-accent/30 hover:bg-accent/5 text-xs"
              onClick={handleNoOvertime}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              Alt som planlagt
            </Button>

            {!expanded ? (
              <button
                className="w-full text-center text-xs text-primary font-medium py-1 hover:underline"
                onClick={() => setExpanded(true)}
              >
                Jeg arbejdede over...
              </button>
            ) : (
              <div className="bg-muted/30 rounded-xl p-3 space-y-2.5 animate-in fade-in-0 duration-200">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xl font-bold w-6 text-center">{extraHours}</span>
                    <button
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      onClick={() => setExtraHours(extraHours + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] text-muted-foreground">t</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      onClick={() => setExtraMinutes(extraMinutes <= 0 ? 45 : extraMinutes - 15)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xl font-bold w-6 text-center">
                      {String(extraMinutes).padStart(2, "0")}
                    </span>
                    <button
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      onClick={() => setExtraMinutes(extraMinutes >= 45 ? 0 : extraMinutes + 15)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] text-muted-foreground">min</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className={cn(
                    "w-full rounded-xl h-8 text-xs font-semibold",
                    totalExtra > 0 ? "bg-primary" : "bg-muted text-muted-foreground"
                  )}
                  disabled={totalExtra <= 0}
                  onClick={handleConfirm}
                >
                  Registrér {extraHours > 0 || extraMinutes > 0
                    ? `${extraHours}t${extraMinutes > 0 ? ` ${extraMinutes}min` : ""}`
                    : ""}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


