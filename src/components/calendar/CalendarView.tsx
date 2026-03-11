import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Unlink, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid, Shift } from "./CalendarGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  shifts?: Shift[] | null;
  isLoading?: boolean;
  onAddSchedule?: () => void;
  onDisconnect?: () => void;
}

const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function ShiftDetailCard({ shift }: { shift: Shift }) {
  const typeLabels: Record<Shift["type"], string> = {
    "day": "Dagvagt",
    "evening": "Aftenvagt", 
    "night": "Nattevagt",
    "day-off": "Fridag",
    "meeting": "Møde",
    "sick": "Sygdom",
  };

  const typeStyles: Record<Shift["type"], string> = {
    "day": "bg-accent/20 border-accent",
    "evening": "bg-secondary/20 border-secondary",
    "night": "bg-primary/20 border-primary",
    "day-off": "bg-muted border-muted-foreground/30",
    "meeting": "bg-warning/20 border-warning",
    "sick": "bg-destructive/20 border-destructive",
  };

  return (
    <div className={cn(
      "p-3 rounded-xl border-l-4",
      typeStyles[shift.type]
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{typeLabels[shift.type]}</p>
          <p className="text-sm text-muted-foreground">
            {shift.time !== "Syg" && shift.time !== "Fri" ? `Kl. ${shift.time}` : shift.time}
          </p>
        </div>
        {shift.hours && shift.hours > 0 && (
          <div className="text-right">
            <p className="font-bold text-foreground">{shift.hours} timer</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarView({ 
  shifts, 
  isLoading = false, 
  onAddSchedule,
  onDisconnect 
}: CalendarViewProps) {
  // Start with current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigateMonth = (direction: -1 | 1) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: -1 | 1) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const effectiveShifts = shifts || [];
  const selectedShifts = selectedDate 
    ? effectiveShifts.filter(s => isSameDay(s.date, selectedDate))
    : [];

  const formatSelectedDate = (date: Date) => {
    return `${date.getDate()}. ${monthNames[date.getMonth()]}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  // Empty state - connected but no shifts
  const hasNoShifts = !shifts || shifts.length === 0;

  return (
    <div className="space-y-4">
      {/* Header with Disconnect Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Din vagtplan
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onAddSchedule}
          >
            <Plus className="h-5 w-5" />
          </Button>
          {onDisconnect && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={onDisconnect}
              title="Fjern forbindelse"
            >
              <Unlink className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {hasNoShifts 
          ? "Din kalender er forbundet, men der er ingen vagter at vise for denne periode."
          : "Din arbejdskalender er synkroniseret. Vagterne vises herunder."
        }
      </p>

      {/* Month/Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => viewMode === "weekly" ? navigateWeek(-1) : navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-[120px] text-center">
            {viewMode === "weekly" 
              ? `Uge ${getWeekNumber(currentDate)}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => viewMode === "weekly" ? navigateWeek(1) : navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-muted rounded-full p-1">
          <button
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all",
              viewMode === "weekly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
            onClick={() => setViewMode("weekly")}
          >
            Ugentlig
          </button>
          <button
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all",
              viewMode === "monthly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
            onClick={() => setViewMode("monthly")}
          >
            Månedlig
          </button>
        </div>
      </div>

      {/* Empty State or Calendar Grid */}
      {hasNoShifts ? (
        <Card className="border-2 border-dashed border-border/50 bg-muted/10">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Ingen vagter i denne periode
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Prøv at navigere til en anden måned, eller tjek om din vagtplan er opdateret.
            </p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={onAddSchedule}>
              Tilføj vagt manuelt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Calendar Grid */}
          <CalendarGrid 
            currentDate={currentDate}
            shifts={effectiveShifts}
            viewMode={viewMode}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="font-semibold text-foreground">
                {formatSelectedDate(selectedDate)}
              </h3>
              {selectedShifts.length > 0 ? (
                <div className="space-y-2">
                  {selectedShifts.map((shift) => (
                    <ShiftDetailCard key={shift.id} shift={shift} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-3 text-center bg-muted/30 rounded-xl">
                  Ingen vagter på denne dato
                </p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">☀️</span>
              <span className="text-xs text-muted-foreground">Dagvagt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🌅</span>
              <span className="text-xs text-muted-foreground">Aftenvagt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🌙</span>
              <span className="text-xs text-muted-foreground">Nattevagt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🤒</span>
              <span className="text-xs text-muted-foreground">Sygdom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🏠</span>
              <span className="text-xs text-muted-foreground">Fridag</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
