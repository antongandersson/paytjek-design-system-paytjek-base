import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Video, MapPin, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useDemo } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";
import { da } from "react-day-picker/locale";

interface TimeSlot {
  time: string;
  available: boolean;
}

function generateSlots(date: Date): TimeSlot[] {
  const day = date.getDay();
  if (day === 0 || day === 6) return [];

  const seed = date.getDate() + date.getMonth() * 31;
  const base: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
  ];

  return base.map((s, i) => ({
    ...s,
    available: (seed + i * 7) % 3 !== 0,
  }));
}

export default function MobileBooking() {
  const navigate = useNavigate();
  const { demoConfig, setBookedMeeting } = useDemo();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 2);

  const slots = useMemo(
    () => (selectedDate ? generateSlots(selectedDate) : []),
    [selectedDate],
  );
  const availableSlots = slots.filter((s) => s.available);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setBookedMeeting({ date: selectedDate, time: selectedTime, unionName: demoConfig.name });
    }
    setBooked(true);
  };

  if (booked && selectedDate && selectedTime) {
    return (
      <main className="animate-fade-in min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Bekræftelse</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-4 pt-12 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">Tid booket!</h2>
            <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
              Din rådgivning med {demoConfig.name} er bekræftet
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 w-full max-w-sm space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold text-foreground capitalize">
                  {formatDate(selectedDate)}
                </p>
                <p className="text-muted-foreground">
                  kl. {selectedTime} — 30 min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-foreground">Videomøde (link sendes på e-mail)</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground max-w-[260px]">
            Du modtager en bekræftelse og mødelink på din e-mail
          </p>

          <button
            className="w-full max-w-sm px-4 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-transform mt-4"
            onClick={() => navigate(-1)}
          >
            Færdig
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="animate-fade-in min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            Book rådgivning
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Meeting type */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Lønrådgivning — {demoConfig.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 30 min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Videomøde
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-2xl border border-border p-3 flex justify-center">
          <Calendar
            mode="single"
            locale={da}
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d);
              setSelectedTime(null);
            }}
            disabled={[
              { before: today },
              { after: maxDate },
              { dayOfWeek: [0, 6] },
            ]}
          />
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              Ledige tider — {formatDate(selectedDate)}
            </p>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1">
                Ingen ledige tider denne dag
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all",
                      selectedTime === slot.time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40",
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Book button */}
        {selectedDate && selectedTime && (
          <button
            className="w-full px-4 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-transform"
            onClick={handleBook}
          >
            Book kl. {selectedTime} — {formatDate(selectedDate)}
          </button>
        )}
      </div>
    </main>
  );
}
