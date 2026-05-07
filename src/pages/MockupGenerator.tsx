import { useState } from "react";
import { toPng } from "html-to-image";
import { 
  Download, Check, Loader2, ArrowLeft, Upload, FileText, 
  CheckCircle2, ChevronRight, Link2, Sparkles, AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import components for mockups
import { ReportScreen } from "@/components/lontjek/ReportScreen";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { Shift } from "@/components/calendar/CalendarGrid";

// ============================================
// MOCK DATA
// ============================================

const MOCK_SHIFTS: Shift[] = [
  { id: "1", date: new Date(2025, 0, 6), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "2", date: new Date(2025, 0, 7), type: "evening", label: "Aftenvagt", time: "15-23", hours: 8 },
  { id: "3", date: new Date(2025, 0, 9), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "4", date: new Date(2025, 0, 10), type: "night", label: "Nattevagt", time: "23-7", hours: 8 },
  { id: "5", date: new Date(2025, 0, 13), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "6", date: new Date(2025, 0, 14), type: "evening", label: "Aftenvagt", time: "15-23", hours: 8 },
  { id: "7", date: new Date(2025, 0, 15), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "8", date: new Date(2025, 0, 17), type: "sick", label: "Sygdom", time: "Syg", hours: 0 },
  { id: "9", date: new Date(2025, 0, 20), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "10", date: new Date(2025, 0, 21), type: "evening", label: "Aftenvagt", time: "15-23", hours: 8 },
  { id: "11", date: new Date(2025, 0, 23), type: "night", label: "Nattevagt", time: "23-7", hours: 8 },
  { id: "12", date: new Date(2025, 0, 27), type: "day", label: "Dagvagt", time: "7-15", hours: 8 },
  { id: "13", date: new Date(2025, 0, 28), type: "day-off", label: "Fridag", time: "Fri", hours: 0 },
];

// ============================================
// PHONE FRAME COMPONENT
// ============================================

interface PhoneFrameProps {
  children: React.ReactNode;
  id: string;
  title: string;
  bgColor?: string;
}

function PhoneFrame({ children, id, title, bgColor = "#fafafa" }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div
        id={id}
        className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl"
        style={{ width: 280, height: 580 }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50" />
        
        {/* Screen */}
        <div 
          className="w-full h-full rounded-[2.3rem] overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {children}
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

// ============================================
// 1. HOME DASHBOARD PREVIEW
// ============================================

function HomeDashboardPreview() {
  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Blue Header */}
      <div className="bg-[#4F46E5] px-4 py-5 pt-14">
        <h1 className="text-xl font-bold text-white">Hej Kim</h1>
        <p className="text-white/80 text-sm">Dit personlige overblik er klar!</p>
      </div>

      {/* Calendar Link */}
      <div className="flex justify-center -mt-3 mb-4">
        <div className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-500 shadow-sm">
          <Link2 className="h-3 w-3" />
          Arbejdskalender link
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#b1e63e] rounded-2xl p-3 h-24">
          <p className="font-bold text-[#101320] text-sm leading-tight">Tjek<br/>lønsed<br/>del</p>
          <FileText className="h-6 w-6 text-[#101320]/70 mt-1 ml-auto" />
        </div>
        <div className="bg-[#98c6e3] rounded-2xl p-3 h-24">
          <p className="font-bold text-[#101320] text-sm leading-tight">Se din<br/>vagtplan</p>
        </div>
      </div>

      {/* Payment Widget */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-[#4F46E5]">Næste lønudbetaling</h2>
          <ChevronRight className="h-4 w-4 text-[#4F46E5]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Udbetalt løn<br/>december</p>
            <p className="text-xl font-bold text-[#101320] mt-1">20.117 <span className="text-sm text-gray-400">Kr</span></p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Dage til<br/>udbetaling</p>
            <p className="text-xl font-bold text-[#101320] mt-1">12 <span className="text-sm text-gray-400">Dage</span></p>
          </div>
        </div>
      </div>

      {/* Earnings Gauge */}
      <div className="px-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-3">
          <p className="text-xs text-gray-500 mb-2">Optjent til dato: 9. januar</p>
          <div className="flex items-end justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-[#4F46E5]" />
            <p className="text-2xl font-bold text-[#4F46E5]">8.450 <span className="text-sm text-gray-400">Kr</span></p>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">: Samlet hele måneden 20.117Kr</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. UPLOAD SCREEN PREVIEW (Empty state - matches actual app)
// ============================================

function UploadScreenPreview() {
  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Step Indicator */}
      <div className="pt-14 pb-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs font-medium text-[#4F46E5]">Upload</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs text-gray-400">Analyse</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs text-gray-400">Rapport</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6 px-6">
        <h1 className="text-xl font-bold text-[#101320] mb-1">Upload din lønseddel</h1>
        <p className="text-sm text-gray-500">Vi understøtter PDF, PNG og JPEG</p>
      </div>

      {/* Upload Zone */}
      <div className="flex-1 px-6">
        <div className="h-full border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-[#4F46E5]" strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-semibold text-[#101320] mb-1">Tryk for at uploade</h3>
          <p className="text-sm text-gray-500 text-center mb-4">Eller træk din fil herind</p>
          <button className="border border-[#4F46E5] text-[#4F46E5] px-4 py-2 rounded-xl text-sm font-medium">
            Vælg fil
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6">
        <button className="w-full h-12 bg-gray-200 text-gray-400 rounded-2xl font-semibold" disabled>
          Start Løntjek
        </button>
      </div>
    </div>
  );
}

// ============================================
// 3. UPLOAD WITH FILE PREVIEW
// ============================================

function UploadWithFilePreview() {
  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Step Indicator */}
      <div className="pt-14 pb-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs font-medium text-[#4F46E5]">Upload</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs text-gray-400">Analyse</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs text-gray-400">Rapport</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4 px-6">
        <h1 className="text-xl font-bold text-[#101320] mb-1">Upload din lønseddel</h1>
        <p className="text-sm text-gray-500">Vi understøtter PDF, PNG og JPEG</p>
      </div>

      {/* File Card */}
      <div className="flex-1 px-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg relative">
          {/* Remove button */}
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">×</span>
          </div>

          {/* File Preview */}
          <div className="h-36 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>

          {/* File Info */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#101320] text-sm">lonseddel_dec_2024.pdf</h3>
              <p className="text-xs text-gray-500">1.24 MB • PDF</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <CheckCircle2 className="w-3 h-3" />
              KLAR
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Fil scannet</span>
              <span className="font-medium">100%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-[#4F46E5] rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* AI Hints */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3" />
            CVR: 12345678
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3" />
            Periode: Dec 2024
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6">
        <button className="w-full h-12 bg-[#4F46E5] text-white rounded-2xl font-semibold shadow-lg">
          Start Løntjek
        </button>
      </div>
    </div>
  );
}

// ============================================
// 4. ANALYSIS SCREEN PREVIEW
// ============================================

function AnalysisScreenPreview() {
  const steps = [
    { label: "Læser dokument", status: "completed" },
    { label: "Tjekker grundløn", status: "completed" },
    { label: "Analyserer tillæg", status: "active" },
    { label: "Sammenligner vagter", status: "pending" },
    { label: "Tjekker overenskomst", status: "pending" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Step Indicator */}
      <div className="pt-14 pb-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-[#4F46E5]/20 text-[#4F46E5] rounded-full flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-xs text-gray-400">Upload</span>
          </div>
          <div className="w-8 h-0.5 bg-[#4F46E5]" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs font-medium text-[#4F46E5]">Analyse</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs text-gray-400">Rapport</span>
          </div>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#4F46E5" 
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${55 * 2.64} ${100 * 2.64}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#101320]">55%</span>
            <span className="text-xs text-gray-500">Analyserer...</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 space-y-2">
        {steps.map((step, i) => (
          <div 
            key={i}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
              step.status === "active" 
                ? "bg-white border-[#4F46E5] shadow-lg" 
                : step.status === "completed"
                ? "bg-gray-50 border-transparent opacity-60"
                : "opacity-30"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.status === "active" ? "bg-[#4F46E5]/10" : 
              step.status === "completed" ? "bg-[#b1e63e]/20" : "bg-gray-100"
            }`}>
              {step.status === "active" && <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />}
              {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-[#b1e63e]" />}
              {step.status === "pending" && <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
            </div>
            <span className={`text-sm font-medium ${
              step.status === "active" ? "text-[#4F46E5]" : "text-[#101320]"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 5. ERNEST CHAT PREVIEW
// ============================================

function ErnestChatPreview() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#4F46E5] p-4 pt-12 flex items-center gap-3 shrink-0">
        <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <span className="text-white font-bold text-lg">Ernest</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/70 text-xs">AI-assistent</span>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 bg-[#F3F4F6] p-4 space-y-3 overflow-hidden">
        {/* Ernest message */}
        <div className="flex justify-start">
          <div className="max-w-[85%] p-3 bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm">
            <p className="font-medium text-[#4F46E5] mb-1">Hej Kim! 👋</p>
            <p>Jeg har fundet <strong>1 fejl</strong> i din lønseddel for december.</p>
            <p className="mt-2">⚠️ <strong>Manglende aftentillæg:</strong> Du mangler 455,09 kr.</p>
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] p-3 bg-[#4F46E5] text-white rounded-2xl rounded-tr-sm text-sm">
            Hvad skal jeg gøre?
          </div>
        </div>

        {/* Ernest response */}
        <div className="flex justify-start">
          <div className="max-w-[85%] p-3 bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm">
            Du kan sende sagen til din arbejdsgiver med ét klik. Vil du det? 👇
          </div>
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 mt-2">
          <button className="bg-white border border-gray-200 text-slate-700 px-3 py-2 rounded-full text-xs shadow-sm">
            Ja, send sag
          </button>
          <button className="bg-white border border-gray-200 text-slate-700 px-3 py-2 rounded-full text-xs shadow-sm">
            Forklar mere
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-100 shrink-0">
        <div className="bg-gray-100 rounded-full py-3 px-4 text-sm text-gray-400">
          Skriv dit spørgsmål...
        </div>
      </div>
    </div>
  );
}

// ============================================
// 6. SUCCESS SCREEN PREVIEW (Send to ARBEJDSGIVER)
// ============================================

function SuccessPreview() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 pt-14 bg-white border-b border-gray-100">
        <h1 className="text-lg font-bold text-[#101320]">Sag sendt</h1>
      </div>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </div>
        
        <h2 className="text-2xl font-bold text-[#101320] mb-2">Sag sendt!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Vi har sendt dokumentationen til din arbejdsgiver.
        </p>

        {/* Case Card */}
        <div className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-[#4F46E5] text-sm">
            RH
          </div>
          <div>
            <div className="font-semibold text-sm">Region Hovedstaden</div>
            <div className="text-xs text-gray-500">Sag #4521 • Sendt 9. jan</div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 bg-amber-50 rounded-xl p-3 w-full">
          <p className="text-sm text-amber-800">
            📬 Du får besked når arbejdsgiver svarer
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 pb-8">
        <button className="w-full h-12 bg-[#4F46E5] text-white rounded-2xl font-semibold">
          Tilbage til forsiden
        </button>
      </div>
    </div>
  );
}

// ============================================
// 7. REPORT WITH ERROR PREVIEW
// ============================================

function ReportErrorPreview() {
  return (
    <div className="flex flex-col h-full bg-[#fafafa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 pt-12 bg-white/80 border-b border-gray-100">
        <ArrowLeft className="h-5 w-5 text-[#101320]" />
        <h1 className="text-base font-bold text-[#101320]">December lønseddel</h1>
        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">PDF</div>
      </div>

      {/* Blue Card */}
      <div className="mx-4 mt-4 bg-[#4F46E5] rounded-3xl p-5 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-bold">Kim Jørgensen</p>
            <p className="text-sm text-white/70">Psykiatrien</p>
          </div>
          <div className="bg-white/10 px-2 py-1 rounded-full text-xs">147t • 192,41/t</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 text-[#101320]">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Udbetalt Løn</p>
          <p className="text-2xl font-bold">20.117,50 kr</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Status</span>
            <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              1 fejl fundet
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-4">
        <div className="flex bg-[#4F46E5] rounded-2xl p-1">
          <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/70">
            Lønoverblik
          </button>
          <button className="flex-1 py-2.5 bg-white rounded-xl text-sm font-semibold text-[#4F46E5] flex items-center justify-center gap-1">
            Fejl
            <span className="bg-amber-400 text-[#101320] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">1</span>
          </button>
        </div>
      </div>

      {/* Error Card */}
      <div className="mx-4 mt-4 flex-1 overflow-hidden">
        <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-4 text-center mb-3">
          <p className="text-red-600 text-sm font-medium">Du mangler udbetaling for</p>
          <h2 className="text-2xl font-bold text-red-600">-455,09 kr</h2>
        </div>

        <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
          <div className="bg-red-50/50 p-3 border-b border-red-100 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-red-600" />
            </div>
            <span className="font-bold text-red-700 text-sm">Manglende aftentillæg</span>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-600 mb-2">Du har arbejdet 4 timer aften d. 15. december...</p>
            <div className="bg-gray-50 rounded-lg p-2 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Forventet:</span><span>766,09 kr</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Udbetalt:</span><span>311,00 kr</span></div>
              <div className="flex justify-between border-t border-dashed pt-1"><span className="text-red-600 font-bold">Difference:</span><span className="text-red-600 font-bold">-455,09 kr</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 pb-6">
        <button className="w-full h-12 bg-[#b1e63e] text-[#101320] rounded-2xl font-semibold">
          Send til arbejdsgiver
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN MOCKUP GENERATOR PAGE
// ============================================

type DownloadStatus = "idle" | "downloading" | "done";

export default function MockupGenerator() {
  const [downloadStatus, setDownloadStatus] = useState<Record<string, DownloadStatus>>({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const downloadImage = async (id: string, filename: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setDownloadStatus(prev => ({ ...prev, [id]: "downloading" }));

    try {
      const dataUrl = await toPng(element, { 
        pixelRatio: 3,
        backgroundColor: "#1a1a1a",
      });
      
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      
      setDownloadStatus(prev => ({ ...prev, [id]: "done" }));
      
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [id]: "idle" }));
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);
      setDownloadStatus(prev => ({ ...prev, [id]: "idle" }));
    }
  };

  const mockups = [
    { id: "mockup-home", title: "Dashboard", filename: "paytjek-mockup-home" },
    { id: "mockup-upload-empty", title: "Upload (tom)", filename: "paytjek-mockup-upload-empty" },
    { id: "mockup-upload-file", title: "Upload (fil)", filename: "paytjek-mockup-upload-file" },
    { id: "mockup-analysis", title: "AI Analyse", filename: "paytjek-mockup-analysis" },
    { id: "mockup-report", title: "Rapport", filename: "paytjek-mockup-report" },
    { id: "mockup-report-error", title: "Rapport (fejl)", filename: "paytjek-mockup-report-error" },
    { id: "mockup-calendar", title: "Vagtplan", filename: "paytjek-mockup-calendar" },
    { id: "mockup-ernest", title: "Ernest AI", filename: "paytjek-mockup-ernest" },
    { id: "mockup-success", title: "Sag sendt", filename: "paytjek-mockup-success" },
  ];

  const downloadAll = async () => {
    setIsDownloadingAll(true);
    
    for (const mockup of mockups) {
      await downloadImage(mockup.id, mockup.filename);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsDownloadingAll(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Landing Page Mockups</h1>
              <p className="text-sm text-slate-500">{mockups.length} mockups • Generer screenshots til paytjek.io</p>
            </div>
          </div>
          
          <Button
            onClick={downloadAll}
            disabled={isDownloadingAll}
            className="bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white gap-2"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Downloader...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download alle ({mockups.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mockups Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          
          {/* Home Dashboard */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-home" title="Dashboard" bgColor="#fafafa">
              <HomeDashboardPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-home" filename="paytjek-mockup-home" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Upload Empty */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-upload-empty" title="Upload (tom)" bgColor="#fafafa">
              <UploadScreenPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-upload-empty" filename="paytjek-mockup-upload-empty" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Upload with File */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-upload-file" title="Upload (fil)" bgColor="#fafafa">
              <UploadWithFilePreview />
            </PhoneFrame>
            <DownloadButton id="mockup-upload-file" filename="paytjek-mockup-upload-file" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Analysis */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-analysis" title="AI Analyse" bgColor="#fafafa">
              <AnalysisScreenPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-analysis" filename="paytjek-mockup-analysis" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Report (using actual component) */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-report" title="Rapport" bgColor="#fafafa">
              <div className="h-full overflow-hidden">
                <ReportScreen onGoHome={() => {}} />
              </div>
            </PhoneFrame>
            <DownloadButton id="mockup-report" filename="paytjek-mockup-report" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Report Error Tab */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-report-error" title="Rapport (fejl)" bgColor="#fafafa">
              <ReportErrorPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-report-error" filename="paytjek-mockup-report-error" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Calendar */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-calendar" title="Vagtplan" bgColor="#fafafa">
              <div className="h-full overflow-hidden p-4 pt-14">
                <CalendarView shifts={MOCK_SHIFTS} />
              </div>
            </PhoneFrame>
            <DownloadButton id="mockup-calendar" filename="paytjek-mockup-calendar" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Ernest Chat */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-ernest" title="Ernest AI" bgColor="#F3F4F6">
              <ErnestChatPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-ernest" filename="paytjek-mockup-ernest" status={downloadStatus} onDownload={downloadImage} />
          </div>

          {/* Success (Send to Arbejdsgiver) */}
          <div className="flex flex-col items-center">
            <PhoneFrame id="mockup-success" title="Sag sendt" bgColor="#ffffff">
              <SuccessPreview />
            </PhoneFrame>
            <DownloadButton id="mockup-success" filename="paytjek-mockup-success" status={downloadStatus} onDownload={downloadImage} />
          </div>
        </div>

        {/* Color Reference */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🎨 Farve-reference til feature cards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#e8f4fc] border border-slate-200" />
              <div>
                <p className="font-mono text-sm">#e8f4fc</p>
                <p className="text-xs text-slate-500">Løntjek (blå)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#f0fce8] border border-slate-200" />
              <div>
                <p className="font-mono text-sm">#f0fce8</p>
                <p className="text-xs text-slate-500">Kalender (grøn)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#f0e8fc] border border-slate-200" />
              <div>
                <p className="font-mono text-sm">#f0e8fc</p>
                <p className="text-xs text-slate-500">Ernest (lilla)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#fce8f0] border border-slate-200" />
              <div>
                <p className="font-mono text-sm">#fce8f0</p>
                <p className="text-xs text-slate-500">Arbejdsgiver (pink)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Download button component
function DownloadButton({ 
  id, 
  filename, 
  status, 
  onDownload 
}: { 
  id: string; 
  filename: string; 
  status: Record<string, DownloadStatus>; 
  onDownload: (id: string, filename: string) => void;
}) {
  const currentStatus = status[id] || "idle";
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-3 gap-2"
      onClick={() => onDownload(id, filename)}
      disabled={currentStatus === "downloading"}
    >
      {currentStatus === "downloading" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : currentStatus === "done" ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Download
    </Button>
  );
}
