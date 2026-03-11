import { Check, X, AlertTriangle } from "lucide-react";

export const OnboardingPayslipUI = () => (
  <div className="w-64 bg-white rounded-3xl shadow-xl border border-gray-100 p-4 animate-scale-in">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm font-semibold text-primary">Løn overblik</div>
      <div className="text-xs text-muted-foreground">Okt 2025</div>
    </div>
    
    {/* Donut Chart Simulation */}
    <div className="flex justify-center mb-4 relative">
      <div className="w-24 h-24 rounded-full border-[6px] border-primary/20 border-t-primary border-r-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Udbetalt</div>
          <div className="text-sm font-bold text-foreground">20.117</div>
        </div>
      </div>
    </div>

    {/* Checklist */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-green-600" />
        </div>
        <span className="text-muted-foreground">Grundløn tjekket</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
        </div>
        <span className="font-medium text-foreground">Manglende tillæg fundet</span>
      </div>
    </div>
  </div>
);

export const OnboardingCalendarUI = () => (
  <div className="w-64 bg-white rounded-3xl shadow-xl border border-gray-100 p-4 animate-scale-in">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-semibold">Oktober</span>
      <div className="flex gap-1">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">M</div>
        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] text-accent-foreground">D</div>
      </div>
    </div>
    
    <div className="grid grid-cols-7 gap-1.5 mb-2">
      {["M", "T", "O", "T", "F", "L", "S"].map((d, i) => (
        <div key={i} className="text-[10px] text-center text-muted-foreground">{d}</div>
      ))}
      
      {/* Calendar Days Simulation */}
      {Array.from({ length: 21 }).map((_, i) => {
        const hasShift = [2, 5, 8, 9, 12, 15, 16, 19].includes(i);
        const isToday = i === 12;
        return (
          <div 
            key={i} 
            className={`
              h-7 rounded-lg flex items-center justify-center text-xs
              ${isToday ? "bg-primary text-white font-bold" : ""}
              ${hasShift && !isToday ? "bg-accent/30 text-accent-foreground" : ""}
              ${!hasShift && !isToday ? "text-muted-foreground" : ""}
            `}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
    
    <div className="flex items-center gap-2 mt-3 bg-accent/10 p-2 rounded-xl">
      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      <span className="text-xs font-medium">8 kommende vagter</span>
    </div>
  </div>
);

import ernestAvatar from "@/assets/ernest-avatar.svg";

export const OnboardingErnestUI = () => (
  <div className="w-64 space-y-3 animate-scale-in">
    {/* Ernest Message */}
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 p-1 border border-primary/20">
        <img src={ernestAvatar} className="w-full h-full" alt="Ernest" />
      </div>
      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs leading-relaxed">
        <p className="font-medium text-primary mb-1">Hej Kim! 👋</p>
        Jeg har fundet en fejl i dit aftentillæg. Du mangler 455 kr.
      </div>
    </div>

    {/* User Reply */}
    <div className="flex justify-end">
      <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-xs">
        Hvad skal jeg gøre?
      </div>
    </div>

    {/* Ernest Reply */}
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 p-1 border border-primary/20">
        <img src={ernestAvatar} className="w-full h-full" alt="Ernest" />
      </div>
      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs leading-relaxed">
        Du kan sende sagen til din fagforening med ét klik herunder 👇
      </div>
    </div>
  </div>
);

export const OnboardingUnionUI = () => (
  <div className="w-64 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 animate-scale-in flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
      <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
    </div>
    
    <h3 className="text-lg font-bold text-foreground mb-1">Sag oprettet!</h3>
    <p className="text-xs text-muted-foreground mb-4">
      Vi har sendt dokumentationen til din fagforening.
    </p>

    <div className="w-full bg-gray-50 rounded-xl p-3 flex items-center gap-3 text-left">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-primary">
        HK
      </div>
      <div>
        <div className="text-xs font-semibold">Sag #4521</div>
        <div className="text-[10px] text-muted-foreground">Sendt d. 15 okt</div>
      </div>
    </div>
  </div>
);





