import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarSyncSetup } from "@/components/calendar/CalendarSyncSetup";
import { useCalendar, type ConnectionSource } from "@/contexts/CalendarContext";
import { useDemo } from "@/contexts/DemoContext";
import type { Shift } from "@/components/calendar/CalendarGrid";

export default function MobileCalendar() {
  const { 
    isConnected, 
    isConnecting, 
    syncError,
    shifts,
    connect,
    disconnect,
  } = useCalendar();
  const { demoConfig } = useDemo();

  // Konverter shifts fra context (string dates) til CalendarView format (Date objects)
  const calendarShifts: Shift[] = shifts.map(s => ({
    ...s,
    date: new Date(s.date),
  }));

  const handleConnect = async (source: string, icsUrlOrFile?: string | File) => {
    await connect(source as ConnectionSource, icsUrlOrFile);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Kalender</h1>

      {syncError && !isConnected && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
          <p className="font-medium">Fejl ved synkronisering</p>
          <p className="text-destructive/80">{syncError}</p>
        </div>
      )}

      {isConnected ? (
        <CalendarView
          shifts={calendarShifts}
          isLoading={false}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <CalendarSyncSetup
          onConnect={handleConnect}
          isConnecting={isConnecting}
          demoIcsUrl={demoConfig.demoIcsUrl}
          demoIcsDisplayUrl={demoConfig.demoIcsDisplayUrl}
        />
      )}
    </main>
  );
}