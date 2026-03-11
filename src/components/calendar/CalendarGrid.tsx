import { cn } from "@/lib/utils";

export interface Shift {
  id: string;
  date: Date;
  type: "day" | "evening" | "night" | "day-off" | "meeting" | "sick";
  label: string;
  time?: string;
  hours?: number;
}

interface CalendarGridProps {
  currentDate: Date;
  shifts: Shift[];
  viewMode: "weekly" | "monthly";
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const shiftStyles: Record<Shift["type"], string> = {
  "day": "bg-accent text-accent-foreground",
  "evening": "bg-secondary text-secondary-foreground",
  "night": "bg-primary text-primary-foreground",
  "day-off": "bg-muted text-muted-foreground",
  "meeting": "bg-warning text-warning-foreground",
  "sick": "bg-destructive text-destructive-foreground",
};

const shiftIcons: Record<Shift["type"], string> = {
  "day": "☀️",
  "evening": "🌅",
  "night": "🌙",
  "day-off": "🏠",
  "meeting": "📋",
  "sick": "🤒",
};

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(monday);
    newDate.setDate(monday.getDate() + i);
    dates.push(newDate);
  }
  return dates;
}

function getMonthDates(date: Date): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Adjust first day to Monday (0 = Monday in our system)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add days from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    currentWeek.push(d);
  }
  
  // Add days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(year, month, day));
  }
  
  // Add days from next month
  while (currentWeek.length < 7) {
    const nextMonthDay = currentWeek.length - 6 + lastDay.getDate();
    currentWeek.push(new Date(year, month + 1, currentWeek.length - (7 - (7 - startDay) % 7 - lastDay.getDate()) + 1));
  }
  if (currentWeek.length > 0) {
    // Fix next month days
    const lastDayInWeek = currentWeek[currentWeek.length - 1];
    for (let i = 0; i < currentWeek.length; i++) {
      if (currentWeek[i].getMonth() !== month && currentWeek[i].getMonth() !== month - 1) {
        currentWeek[i] = new Date(year, month + 1, i - (currentWeek.length - (7 - startDay) % 7 - lastDay.getDate()) + 1);
      }
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function ShiftChip({ shift }: { shift: Shift }) {
  return (
    <div className={cn(
      "text-[9px] px-1 py-0.5 rounded font-medium truncate",
      shiftStyles[shift.type]
    )}>
      {shift.time || shift.label}
    </div>
  );
}

export function CalendarGrid({ currentDate, shifts, viewMode, selectedDate, onDateSelect }: CalendarGridProps) {
  const today = new Date();
  
  if (viewMode === "weekly") {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <div className="bg-card rounded-2xl p-3 border border-border">
        {/* Week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Week dates */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDates.map((date, idx) => {
            const isToday = isSameDay(date, today);
            const dayShifts = shifts.filter(s => isSameDay(s.date, date));
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium",
                  isToday && "bg-primary text-primary-foreground"
                )}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Shift rows */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, idx) => {
            const dayShifts = shifts.filter(s => isSameDay(s.date, date));
            return (
              <div key={idx} className="flex flex-col gap-0.5 min-h-[60px]">
                {dayShifts.map((shift) => (
                  <div key={shift.id} className="flex flex-col items-center gap-0.5">
                    <span className="text-sm">{shiftIcons[shift.type]}</span>
                    <ShiftChip shift={shift} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Monthly view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Build weeks array properly
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;
  
  const weeks: Date[][] = [];
  let week: Date[] = [];
  
  // Previous month days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    week.push(new Date(year, month, -i));
  }
  
  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(new Date(year, month, d));
  }
  
  // Next month days
  let nextDay = 1;
  while (week.length < 7) {
    week.push(new Date(year, month + 1, nextDay++));
  }
  weeks.push(week);
  
  return (
    <div className="bg-card rounded-2xl p-3 border border-border">
      {/* Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((weekRow, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {weekRow.map((date, dayIdx) => {
              const isToday = isSameDay(date, today);
              const isCurrentMonth = date.getMonth() === month;
              const dayShifts = shifts.filter(s => isSameDay(s.date, date));
              
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const hasShifts = dayShifts.length > 0;
              
              return (
                <div 
                  key={dayIdx} 
                  className={cn(
                    "min-h-[52px] p-1 rounded-lg cursor-pointer transition-colors",
                    !isCurrentMonth && "opacity-40",
                    hasShifts && "hover:bg-muted/50",
                    isSelected && "bg-primary/10 ring-1 ring-primary"
                  )}
                  onClick={() => onDateSelect?.(date)}
                >
                  <div className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-0.5",
                    isToday && "bg-primary text-primary-foreground"
                  )}>
                    {date.getDate()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayShifts.slice(0, 2).map((shift) => (
                      <ShiftChip key={shift.id} shift={shift} />
                    ))}
                    {dayShifts.length > 2 && (
                      <div className="text-[8px] text-muted-foreground text-center">
                        +{dayShifts.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
