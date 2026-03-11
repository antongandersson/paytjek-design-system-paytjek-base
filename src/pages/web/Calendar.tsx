import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarSyncSetup } from "@/components/calendar/CalendarSyncSetup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, RefreshCw, Plus, CalendarDays } from "lucide-react";
import type { Shift } from "@/components/calendar/CalendarGrid";

// Types for sidebar data
interface TodayShift {
  type: string;
  hours: number;
  time: string;
  location: string;
}

interface UpcomingShift {
  date: string;
  time: string;
  type: string;
  hours: number;
}

interface MonthStats {
  workHours: number;
  shifts: number;
  weekendShifts: number;
  nightShifts: number;
}

interface WebCalendarProps {
  // Connection state
  isConnected?: boolean;
  isConnecting?: boolean;
  // Shift data
  shifts?: Shift[] | null;
  isLoadingShifts?: boolean;
  // Sidebar data
  todayShift?: TodayShift | null;
  upcomingShifts?: UpcomingShift[] | null;
  monthStats?: MonthStats | null;
  isLoadingSidebar?: boolean;
  // Callbacks
  onConnect?: (source: string, icsUrlOrFile?: string | File) => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  onAddShift?: () => void;
}

export default function WebCalendar({
  isConnected = false,
  isConnecting = false,
  shifts,
  isLoadingShifts = false,
  todayShift,
  upcomingShifts,
  monthStats,
  isLoadingSidebar = false,
  onConnect,
  onDisconnect,
  onSync,
  onAddShift,
}: WebCalendarProps) {
  // Local state for demo purposes
  const [localConnected, setLocalConnected] = useState(isConnected);
  const [localConnecting, setLocalConnecting] = useState(false);
  const [localShifts, setLocalShifts] = useState<Shift[] | null>(null);

  const effectiveConnected = isConnected || localConnected;
  const effectiveConnecting = isConnecting || localConnecting;
  const effectiveShifts = shifts || localShifts;

  const handleConnect = async (source: string, icsUrlOrFile?: string | File) => {
    if (onConnect) {
      onConnect(source, icsUrlOrFile);
      return;
    }
    
    setLocalConnecting(true);
    
    try {
      const { fetchAndParseICS, parseICSFile, normalizeICSUrl } = await import("@/lib/ics-parser");
      
      // Handle file upload
      if (source === "ics-file" && icsUrlOrFile instanceof File) {
        const parsedShifts = await parseICSFile(icsUrlOrFile);
        setLocalShifts(parsedShifts);
        setLocalConnected(true);
      }
      // Handle URL
      else if (source === "ics" && typeof icsUrlOrFile === "string") {
        const normalizedUrl = normalizeICSUrl(icsUrlOrFile);
        const parsedShifts = await fetchAndParseICS(normalizedUrl);
        setLocalShifts(parsedShifts);
        setLocalConnected(true);
      }
      // Other sources
      else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error("ICS sync error:", error);
      alert(error instanceof Error ? error.message : "Kunne ikke læse kalender");
    } finally {
      setLocalConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    } else {
      setLocalConnected(false);
      setLocalShifts(null);
    }
  };

  if (!effectiveConnected) {
    return (
      <div className="space-y-5">
        {/* Blue Header Banner */}
        <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
          <h1 className="text-3xl font-bold text-primary-foreground">Kalender</h1>
          <p className="text-primary-foreground/80 mt-1">
            Synkroniser din arbejdskalender for at holde styr på dine vagter
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <CalendarSyncSetup onConnect={handleConnect} isConnecting={effectiveConnecting} />
        </div>
      </div>
    );
  }

  const hasNoData = !effectiveShifts || effectiveShifts.length === 0;

  // Calculate sidebar data from shifts (if not provided externally)
  const calculatedTodayShift = (() => {
    if (todayShift) return todayShift;
    if (!effectiveShifts) return null;
    
    const today = new Date();
    const todaysShift = effectiveShifts.find(s => {
      const shiftDate = s.date instanceof Date ? s.date : new Date(s.date);
      return shiftDate.toDateString() === today.toDateString();
    });
    
    if (!todaysShift) return null;
    
    return {
      type: todaysShift.label || "Vagt",
      hours: todaysShift.hours || 0,
      time: todaysShift.time || "",
      location: "",
    };
  })();

  const calculatedUpcomingShifts = (() => {
    if (upcomingShifts) return upcomingShifts;
    if (!effectiveShifts) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = effectiveShifts
      .filter(s => {
        const shiftDate = s.date instanceof Date ? s.date : new Date(s.date);
        return shiftDate > today;
      })
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5)
      .map(s => {
        const shiftDate = s.date instanceof Date ? s.date : new Date(s.date);
        const dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
        const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
        
        return {
          date: `${dayNames[shiftDate.getDay()]} ${shiftDate.getDate()}. ${monthNames[shiftDate.getMonth()]}`,
          time: s.time || "",
          type: s.label || "Vagt",
          hours: s.hours || 0,
        };
      });
    
    return upcoming.length > 0 ? upcoming : null;
  })();

  const calculatedMonthStats = (() => {
    if (monthStats) return monthStats;
    if (!effectiveShifts || effectiveShifts.length === 0) return null;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthShifts = effectiveShifts.filter(s => {
      const shiftDate = s.date instanceof Date ? s.date : new Date(s.date);
      return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
    });
    
    if (thisMonthShifts.length === 0) return null;
    
    const workHours = thisMonthShifts.reduce((sum, s) => sum + (s.hours || 0), 0);
    const weekendShifts = thisMonthShifts.filter(s => {
      const shiftDate = s.date instanceof Date ? s.date : new Date(s.date);
      const day = shiftDate.getDay();
      return day === 0 || day === 6;
    }).length;
    const nightShifts = thisMonthShifts.filter(s => s.type === "night").length;
    
    return {
      workHours: Math.round(workHours),
      shifts: thisMonthShifts.length,
      weekendShifts,
      nightShifts,
    };
  })();

  return (
    <div className="space-y-5">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">Kalender</h1>
            <p className="text-primary-foreground/80 mt-1">
              {hasNoData 
                ? "Din kalender er forbundet, men ingen vagter endnu"
                : "Oversigt over dine vagter og arbejdstider"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              onClick={onSync}
            >
              <RefreshCw className="h-4 w-4" />
              Synkroniser
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              onClick={onAddShift}
            >
              <Plus className="h-4 w-4" />
              Tilføj vagt
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Calendar */}
        <div className="lg:col-span-8">
          <Card className="border-border/50">
            <CardContent className="p-4 md:p-6">
              <CalendarView 
                shifts={effectiveShifts}
                isLoading={isLoadingShifts}
                onDisconnect={handleDisconnect}
                onAddSchedule={onAddShift}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Today's shifts */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">I dag</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            {isLoadingSidebar ? (
              <Skeleton className="h-24 rounded-2xl" />
            ) : calculatedTodayShift ? (
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0">
                      {calculatedTodayShift.type}
                    </Badge>
                    <span className="text-sm font-bold">{calculatedTodayShift.hours} timer</span>
                  </div>
                  <p className="font-bold text-foreground">{calculatedTodayShift.time}</p>
                  {calculatedTodayShift.location && (
                    <p className="text-sm text-muted-foreground">{calculatedTodayShift.location}</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-border/50 bg-muted/10">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ingen vagt i dag
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Upcoming shifts */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Kommende vagter</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            {isLoadingSidebar ? (
              <div className="space-y-2">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
            ) : calculatedUpcomingShifts && calculatedUpcomingShifts.length > 0 ? (
              <div className="space-y-2">
                {calculatedUpcomingShifts.map((shift, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{shift.date}</p>
                      <p className="font-bold text-foreground">{shift.time}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-muted-foreground">{shift.type}</span>
                        <span className="text-sm font-bold">{shift.hours} timer</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-border/50 bg-muted/10">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ingen kommende vagter
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Stats */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Denne måned</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            {isLoadingSidebar ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : calculatedMonthStats ? (
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Arbejdstimer</span>
                    <span className="font-bold">{calculatedMonthStats.workHours} <span className="font-normal text-muted-foreground">timer</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vagter</span>
                    <span className="font-bold">{calculatedMonthStats.shifts} <span className="font-normal text-muted-foreground">stk</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Weekendvagter</span>
                    <span className="font-bold">{calculatedMonthStats.weekendShifts} <span className="font-normal text-muted-foreground">stk</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nattevagter</span>
                    <span className="font-bold">{calculatedMonthStats.nightShifts} <span className="font-normal text-muted-foreground">stk</span></span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-border/50 bg-muted/10">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ingen statistik tilgængelig
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
