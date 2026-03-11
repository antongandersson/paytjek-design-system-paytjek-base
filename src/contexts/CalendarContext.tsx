import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { fetchAndParseICS, parseICSFile, normalizeICSUrl } from '@/lib/ics-parser';
import { toast } from 'sonner';

// ============================================
// LOCALSTORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  CONNECTION: 'paytjek_calendar_connection',
  SHIFTS: 'paytjek_calendar_shifts',
  OVERTIME_LOG: 'paytjek_overtime_log',
  SNOOZED_CHECKS: 'paytjek_snoozed_checks',
} as const;

// ============================================
// TYPES
// ============================================

export interface Shift {
  id: string;
  date: string;  // ISO date string for storage
  type: "day" | "evening" | "night" | "day-off" | "meeting" | "sick";
  label: string;
  time?: string;
  hours?: number;
  location?: string;
}

export type ConnectionSource = 'ics' | 'ics-file' | 'google' | 'optima';

export interface OvertimeEntry {
  shiftId: string;
  date: string;        // ISO date of the shift
  extraHours: number;
  note?: string;
  confirmedAt: string;  // ISO timestamp
}

interface SnoozeEntry {
  shiftId: string;
  snoozeUntil: string;  // ISO timestamp - re-show after this time
}

interface CalendarConnection {
  source: ConnectionSource;
  icsUrl?: string;
  connectedAt: string;  // ISO date
}

interface CalendarContextType {
  // Connection state
  isConnected: boolean;
  connection: CalendarConnection | null;
  isConnecting: boolean;
  syncError: string | null;
  
  // Shifts
  shifts: Shift[];
  lastSynced: Date | null;
  
  // Overtime
  overtimeLog: OvertimeEntry[];
  pendingOvertimeCheck: Shift | null;
  confirmShift: (shiftId: string, extraHours: number, note?: string) => void;
  snoozeOvertimeCheck: (shiftId: string) => void;
  getOvertimeForMonth: (year: number, month: number) => OvertimeEntry[];
  
  // Actions
  connect: (source: ConnectionSource, urlOrFile?: string | File) => Promise<void>;
  disconnect: () => void;
  resync: () => Promise<void>;
  clearAllData: () => void;
  
  // Helpers
  getShiftsForMonth: (year: number, month: number) => Shift[];
  getShiftsForDateRange: (startDate: string, endDate: string) => Shift[];
  getTodayShift: () => Shift | null;
  getUpcomingShifts: (count?: number) => Shift[];
  
  // Stats
  getMonthStats: (year: number, month: number) => {
    totalHours: number;
    totalShifts: number;
    dayShifts: number;
    eveningShifts: number;
    nightShifts: number;
    weekendShifts: number;
  };
}

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

function loadFromStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn(`Fejl ved læsning af ${key} fra localStorage:`, e);
    return null;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Fejl ved gemning af ${key} til localStorage:`, e);
  }
}

function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Fejl ved sletning af ${key} fra localStorage:`, e);
  }
}

// ============================================
// CONTEXT
// ============================================

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  // Connection state
  const [connection, setConnection] = useState<CalendarConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Shifts state
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Overtime state
  const [overtimeLog, setOvertimeLog] = useState<OvertimeEntry[]>([]);
  const [snoozedChecks, setSnoozedChecks] = useState<SnoozeEntry[]>([]);

  // ============================================
  // LOAD FROM LOCALSTORAGE ON MOUNT
  // ============================================
  
  useEffect(() => {
    const savedConnection = loadFromStorage<CalendarConnection>(STORAGE_KEYS.CONNECTION);
    const savedShifts = loadFromStorage<Shift[]>(STORAGE_KEYS.SHIFTS);
    const savedOvertime = loadFromStorage<OvertimeEntry[]>(STORAGE_KEYS.OVERTIME_LOG);
    const savedSnoozed = loadFromStorage<SnoozeEntry[]>(STORAGE_KEYS.SNOOZED_CHECKS);
    
    if (savedConnection) {
      setConnection(savedConnection);
      setLastSynced(new Date(savedConnection.connectedAt));
    }
    
    if (savedShifts) {
      setShifts(savedShifts);
    }

    if (savedOvertime) {
      setOvertimeLog(savedOvertime);
    }

    if (savedSnoozed) {
      setSnoozedChecks(savedSnoozed);
    }
  }, []);

  // ============================================
  // SAVE TO LOCALSTORAGE ON CHANGE
  // ============================================
  
  useEffect(() => {
    if (connection) {
      saveToStorage(STORAGE_KEYS.CONNECTION, connection);
    } else {
      removeFromStorage(STORAGE_KEYS.CONNECTION);
    }
  }, [connection]);
  
  useEffect(() => {
    if (shifts.length > 0) {
      saveToStorage(STORAGE_KEYS.SHIFTS, shifts);
    } else {
      removeFromStorage(STORAGE_KEYS.SHIFTS);
    }
  }, [shifts]);

  useEffect(() => {
    if (overtimeLog.length > 0) {
      saveToStorage(STORAGE_KEYS.OVERTIME_LOG, overtimeLog);
    }
  }, [overtimeLog]);

  useEffect(() => {
    if (snoozedChecks.length > 0) {
      saveToStorage(STORAGE_KEYS.SNOOZED_CHECKS, snoozedChecks);
    } else {
      removeFromStorage(STORAGE_KEYS.SNOOZED_CHECKS);
    }
  }, [snoozedChecks]);

  // ============================================
  // OVERTIME: find most recent shift not yet confirmed/snoozed
  // Timing logic (when to show) is handled by MobileLayout,
  // this just identifies which shift to ask about.
  // ============================================

  const pendingOvertimeCheck = useMemo(() => {
    if (shifts.length === 0) return null;
    const now = new Date();

    // Only past shifts (already worked), most recent first
    const candidate = shifts
      .filter(s => s.type !== 'day-off' && s.type !== 'sick')
      .filter(s => new Date(s.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return candidate || null;
  }, [shifts]);

  const confirmShift = useCallback((shiftId: string, extraHours: number, note?: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    setOvertimeLog(prev => [...prev, {
      shiftId,
      date: shift.date,
      extraHours,
      note,
      confirmedAt: new Date().toISOString(),
    }]);

    if (extraHours > 0) {
      // Update the shift in calendar to reflect overtime
      setShifts(prev => prev.map(s => {
        if (s.id !== shiftId) return s;
        const newHours = (s.hours || 0) + extraHours;
        const extraMins = Math.round(extraHours * 60);
        let newTime = s.time;
        if (s.time && s.time.includes('-')) {
          const [start, end] = s.time.split('-');
          const [endH, endM] = end.split(':').map(Number);
          const totalMins = endH * 60 + endM + extraMins;
          const newEndH = Math.floor(totalMins / 60) % 24;
          const newEndM = totalMins % 60;
          newTime = `${start}-${String(newEndH).padStart(2, '0')}:${String(newEndM).padStart(2, '0')}`;
        }
        return { ...s, hours: Math.round(newHours * 10) / 10, time: newTime };
      }));

      toast.success(`${Math.floor(extraHours)}t${extraHours % 1 > 0 ? ` ${Math.round((extraHours % 1) * 60)}min` : ''} overarbejde registreret`);
    } else {
      toast.success('Vagt bekræftet');
    }
  }, [shifts]);

  const snoozeOvertimeCheck = useCallback((shiftId: string) => {
    const snoozeUntil = new Date();
    snoozeUntil.setHours(snoozeUntil.getHours() + 4);
    setSnoozedChecks(prev => [
      ...prev.filter(s => s.shiftId !== shiftId),
      { shiftId, snoozeUntil: snoozeUntil.toISOString() },
    ]);
  }, []);

  const getOvertimeForMonth = useCallback((year: number, month: number): OvertimeEntry[] => {
    return overtimeLog.filter(entry => {
      const d = new Date(entry.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [overtimeLog]);

  // ============================================
  // ACTIONS
  // ============================================

  const connect = useCallback(async (source: ConnectionSource, urlOrFile?: string | File) => {
    setIsConnecting(true);
    setSyncError(null);

    try {
      let parsedShifts: Shift[] = [];

      // Handle file upload
      if (source === "ics-file" && urlOrFile instanceof File) {
        console.log(`📅 Parsing ICS file: ${urlOrFile.name}`);
        const rawShifts = await parseICSFile(urlOrFile);
        parsedShifts = rawShifts.map(s => ({
          ...s,
          date: s.date instanceof Date ? s.date.toISOString() : s.date,
        }));
      }
      // Handle URL
      else if (source === "ics" && typeof urlOrFile === "string") {
        const normalizedUrl = normalizeICSUrl(urlOrFile);
        console.log(`📅 Fetching ICS from: ${normalizedUrl}`);
        const rawShifts = await fetchAndParseICS(normalizedUrl);
        parsedShifts = rawShifts.map(s => ({
          ...s,
          date: s.date instanceof Date ? s.date.toISOString() : s.date,
        }));
      }
      // Other sources (Google, Optima) - placeholder
      else if (source === "google" || source === "optima") {
        toast.info(`${source === 'google' ? 'Google Kalender' : 'Optima'} integration kommer snart...`);
        setIsConnecting(false);
        return;
      }

      console.log(`✅ Parsed ${parsedShifts.length} shifts from ICS`);
      
      // Gem shifts og connection
      setShifts(parsedShifts);
      setConnection({
        source,
        icsUrl: typeof urlOrFile === 'string' ? urlOrFile : undefined,
        connectedAt: new Date().toISOString(),
      });
      setLastSynced(new Date());
      
      toast.success(`Kalender synkroniseret! ${parsedShifts.length} vagter fundet.`);
    } catch (error) {
      console.error("ICS sync error:", error);
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke læse kalender";
      setSyncError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnection(null);
    setShifts([]);
    setLastSynced(null);
    setSyncError(null);
    toast.info("Kalender afbrudt");
  }, []);

  const clearAllData = useCallback(() => {
    setConnection(null);
    setShifts([]);
    setLastSynced(null);
    setSyncError(null);
    setIsConnecting(false);
    setOvertimeLog([]);
    setSnoozedChecks([]);
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }, []);

  const resync = useCallback(async () => {
    if (!connection?.icsUrl) {
      toast.error("Kan ikke synkronisere - ingen URL gemt");
      return;
    }
    
    await connect('ics', connection.icsUrl);
  }, [connection, connect]);

  // ============================================
  // HELPERS
  // ============================================

  const getShiftsForMonth = useCallback((year: number, month: number): Shift[] => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
    });
  }, [shifts]);

  const getShiftsForDateRange = useCallback((startDate: string, endDate: string): Shift[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= start && shiftDate <= end;
    });
  }, [shifts]);

  const getTodayShift = useCallback((): Shift | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return shifts.find(shift => {
      const shiftDate = new Date(shift.date);
      shiftDate.setHours(0, 0, 0, 0);
      return shiftDate.getTime() === today.getTime();
    }) || null;
  }, [shifts]);

  const getUpcomingShifts = useCallback((count: number = 5): Shift[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return shifts
      .filter(shift => new Date(shift.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);
  }, [shifts]);

  const getMonthStats = useCallback((year: number, month: number) => {
    const monthShifts = getShiftsForMonth(year, month);
    
    let totalHours = 0;
    let dayShifts = 0;
    let eveningShifts = 0;
    let nightShifts = 0;
    let weekendShifts = 0;
    
    for (const shift of monthShifts) {
      if (shift.hours) totalHours += shift.hours;
      
      if (shift.type === 'day') dayShifts++;
      else if (shift.type === 'evening') eveningShifts++;
      else if (shift.type === 'night') nightShifts++;
      
      const shiftDate = new Date(shift.date);
      const dayOfWeek = shiftDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) weekendShifts++;
    }
    
    return {
      totalHours,
      totalShifts: monthShifts.filter(s => s.type !== 'day-off').length,
      dayShifts,
      eveningShifts,
      nightShifts,
      weekendShifts,
    };
  }, [getShiftsForMonth]);

  // Computed
  const isConnected = connection !== null;

  return (
    <CalendarContext.Provider value={{
      // Connection state
      isConnected,
      connection,
      isConnecting,
      syncError,
      
      // Shifts
      shifts,
      lastSynced,

      // Overtime
      overtimeLog,
      pendingOvertimeCheck,
      confirmShift,
      snoozeOvertimeCheck,
      getOvertimeForMonth,
      
      // Actions
      connect,
      disconnect,
      resync,
      clearAllData,
      
      // Helpers
      getShiftsForMonth,
      getShiftsForDateRange,
      getTodayShift,
      getUpcomingShifts,
      getMonthStats,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCalendar() {
  const context = useContext(CalendarContext);
  
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  
  return context;
}
