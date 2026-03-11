import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { PayslipData, PayslipValidationResult } from '@/lib/api/types';
import type { PayslipAnalysisContext } from '@/lib/ernestClient';
import { Sun, Heart, Clock, Receipt, Landmark, Timer } from "lucide-react";
import React from 'react';
import { api } from '@/lib/api/client';

// ============================================
// LOCALSTORAGE KEYS
// ============================================

const PAYSLIP_STORAGE_VERSION = 'v2-coolshop';
const PAYSLIP_VERSION_KEY = 'paytjek_storage_version';

const STORAGE_KEYS = {
  CURRENT_PAYSLIP: 'paytjek_current_payslip',
  CURRENT_VALIDATION: 'paytjek_current_validation',
  PAYSLIP_HISTORY: 'paytjek_payslip_history',
} as const;

// ============================================
// TYPES
// ============================================

// Dashboard earned item type
export interface DashboardEarnedItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}

// Monthly trend data point
export interface MonthlyTrendPoint {
  month: string;
  nettolon: number;
  bruttolon: number;
  timer: number;
}

// Latest month supplement breakdown
export interface SupplementBreakdown {
  aftentimer: number;
  aftenBeloeb: number;
  aftenSats: number;
  soenHelligTimer: number;
  soenHelligBeloeb: number;
  soenHelligSats: number;
  natTimer: number;
  natBeloeb: number;
  totalTillaeg: number;
}

// Aggregated stats across all history
export interface AggregatedStats {
  payslipsChecked: number;
  payslipsWithErrors: number;
  totalDifferenceOwed: number;
  ytdBrutto: number;
  ytdNetto: number;
  ytdPension: number;
  ytdSkat: number;
  ytdTillaeg: number;
  ytdAftentillaeg: number;
  ytdSoenHelligdag: number;
  ytdFerieDage: number;
  avgNettolon: number;
  avgTimer: number;
  latestTimer: number;
  latestTimelon: number;
  latestSupplements: SupplementBreakdown;
  latestPensionBeloeb: number;
  latestPensionProcent: number;
  trend: MonthlyTrendPoint[];
}

// Dashboard data bundle
export interface DashboardData {
  // Payment widget
  paymentAmount: string | null;
  paymentDaysLeft: number | null;
  paymentMonth: string | null;
  
  // Earnings gauge
  earned: number | null;
  total: number | null;
  earningsDate: string | null;
  
  // Earned items list
  earnedItems: DashboardEarnedItem[];

  // Aggregated from all history
  aggregated: AggregatedStats;
}

// Historie item (kompakt version til liste)
export interface PayslipHistoryItem {
  id: string;
  period: string;              // "Januar 2024"
  status: "ok" | "warnings" | "errors";
  issuesCount: number;
  nettolon: number;
  employer: string;
  analyzedAt: string;          // ISO date
}

// Fuld historie entry (med alt data)
interface PayslipHistoryEntry {
  item: PayslipHistoryItem;
  payslip: PayslipData;
  validation: PayslipValidationResult;
}

interface PayslipContextType {
  // Current analysis data
  currentPayslip: PayslipData | null;
  currentValidation: PayslipValidationResult | null;
  isAnalyzing: boolean;
  
  // History
  payslipHistory: PayslipHistoryItem[];
  
  // Actions
  setAnalysis: (payslip: PayslipData, validation: PayslipValidationResult) => void;
  startAnalysis: () => void;
  clearAnalysis: () => void;
  clearHistory: () => void;
  clearAllData: () => void;  // 🆕 Til logout - ryder alt inkl. localStorage
  
  // History helpers
  getHistoryEntry: (id: string) => { payslip: PayslipData; validation: PayslipValidationResult } | null;
  loadFromHistory: (id: string) => void;
  
  // Helper til Ernest
  getErnestPayslipContext: () => PayslipAnalysisContext | undefined;
  
  // Helper til Dashboard
  getDashboardData: () => DashboardData;
  
  // Status helpers (computed)
  hasActiveAnalysis: boolean;
  hasDashboardData: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  totalDifference: number;
}

// ============================================
// HELPER: Konverter til Ernest format
// ============================================

function toErnestContext(
  payslip: PayslipData, 
  validation: PayslipValidationResult
): PayslipAnalysisContext {
  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      grundlon: "Grundløn",
      timelon: "Timeløn",
      normalTimer: "Normal timer",
      aftentillaeg: "Manglende aftentillæg",
      nattillaeg: "Manglende nattillæg",
      soenHelligdag: "Manglende søn/helligdagstillæg",
      pension: "Pension",
      skat: "Skat",
      atp: "ATP",
      sygdom: "Sygdom",
      ferie: "Ferie",
      afspadsering: "Afspadsering",
      barnsSygdom: "Barns sygdom",
    };
    return labels[field] || field;
  };

  const ded = payslip.deductions;
  const abs = payslip.absence;

  return {
    period: `${payslip.period.month} ${payslip.period.year}`,
    employer: payslip.employer.name,
    grossSalary: payslip.totals.bruttolon,
    netSalary: payslip.totals.nettolon,
    deductions: payslip.totals.totalFradrag,
    status: validation.status === "ok" ? "ok" : "errors_found",

    hourlyRate: payslip.salary.timelon,
    normalHours: payslip.salary.normalTimer,

    supplements: {
      grundlon: payslip.salary.grundlon,
      aftentillaeg: payslip.supplements.aftentillaeg.beloeb,
      nattillaeg: payslip.supplements.nattillaeg.beloeb,
      weekendtillaeg: payslip.supplements.soenHelligdag.beloeb,
    },

    tax: ded.skat.procent
      ? { percent: ded.skat.procent, amount: ded.skat.beloeb }
      : undefined,
    pension: ded.pension.procent
      ? { percent: ded.pension.procent, amount: ded.pension.beloeb }
      : undefined,
    atp: ded.atp.beloeb || undefined,
    amBidrag: ded.amBidrag?.procent
      ? { percent: ded.amBidrag.procent, amount: ded.amBidrag.beloeb }
      : undefined,

    absence: (abs.ferie.dage || abs.sygdom.dage || abs.barnsSygdom.dage || abs.afspadsering.timer)
      ? {
          ferieDage: abs.ferie.dage || undefined,
          sygdomDage: abs.sygdom.dage || undefined,
          barnsSygdomDage: abs.barnsSygdom.dage || undefined,
          afspadseringTimer: abs.afspadsering.timer || undefined,
        }
      : undefined,

    errors: validation.discrepancies
      .filter(d => d.severity === "error" || d.severity === "warning")
      .map(d => ({
        type: getFieldLabel(d.field),
        description: d.description,
        expectedAmount: d.expected,
        actualAmount: d.actual,
        difference: d.difference,
      })),
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

const PayslipContext = createContext<PayslipContextType | undefined>(undefined);

export function PayslipProvider({ children }: { children: ReactNode }) {
  // Current analysis state
  const [currentPayslip, setCurrentPayslip] = useState<PayslipData | null>(null);
  const [currentValidation, setCurrentValidation] = useState<PayslipValidationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // History state
  const [historyEntries, setHistoryEntries] = useState<PayslipHistoryEntry[]>([]);
  
  // ============================================
  // LOAD FROM LOCALSTORAGE ON MOUNT
  // ============================================
  
  useEffect(() => {
    const storedVersion = localStorage.getItem(PAYSLIP_VERSION_KEY);
    if (storedVersion !== PAYSLIP_STORAGE_VERSION) {
      removeFromStorage(STORAGE_KEYS.CURRENT_PAYSLIP);
      removeFromStorage(STORAGE_KEYS.CURRENT_VALIDATION);
      removeFromStorage(STORAGE_KEYS.PAYSLIP_HISTORY);
      localStorage.setItem(PAYSLIP_VERSION_KEY, PAYSLIP_STORAGE_VERSION);
      return;
    }

    const savedPayslip = loadFromStorage<PayslipData>(STORAGE_KEYS.CURRENT_PAYSLIP);
    const savedValidation = loadFromStorage<PayslipValidationResult>(STORAGE_KEYS.CURRENT_VALIDATION);
    
    if (savedPayslip && savedValidation) {
      setCurrentPayslip(savedPayslip);
      setCurrentValidation(savedValidation);
    }
    
    const savedHistory = loadFromStorage<PayslipHistoryEntry[]>(STORAGE_KEYS.PAYSLIP_HISTORY);
    if (savedHistory) {
      setHistoryEntries(savedHistory);
    }
  }, []);
  
  // ============================================
  // SAVE TO LOCALSTORAGE ON CHANGE
  // ============================================
  
  useEffect(() => {
    if (currentPayslip) {
      saveToStorage(STORAGE_KEYS.CURRENT_PAYSLIP, currentPayslip);
    } else {
      removeFromStorage(STORAGE_KEYS.CURRENT_PAYSLIP);
    }
  }, [currentPayslip]);
  
  useEffect(() => {
    if (currentValidation) {
      saveToStorage(STORAGE_KEYS.CURRENT_VALIDATION, currentValidation);
    } else {
      removeFromStorage(STORAGE_KEYS.CURRENT_VALIDATION);
    }
  }, [currentValidation]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAYSLIP_HISTORY, historyEntries);
  }, [historyEntries]);

  // ============================================
  // ACTIONS
  // ============================================

  // Start analyse (loading state)
  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  // Gem resultat af analyse + tilføj til historie + send til backend
  const setAnalysis = useCallback((payslip: PayslipData, validation: PayslipValidationResult) => {
    setCurrentPayslip(payslip);
    setCurrentValidation(validation);
    setIsAnalyzing(false);
    
    // Opret historie-entry
    const historyItem: PayslipHistoryItem = {
      id: `${payslip.period.year}-${payslip.period.month}-${Date.now()}`,
      period: `${payslip.period.month} ${payslip.period.year}`,
      status: validation.status,
      issuesCount: validation.summary.issuesCount,
      nettolon: payslip.totals.nettolon,
      employer: payslip.employer.name,
      analyzedAt: new Date().toISOString(),
    };
    
    const entry: PayslipHistoryEntry = {
      item: historyItem,
      payslip,
      validation,
    };
    
    // Tilføj til historie (nyeste først, undgå dubletter baseret på periode)
    setHistoryEntries(prev => {
      // Fjern eksisterende entry med samme periode
      const filtered = prev.filter(e => 
        e.item.period !== historyItem.period
      );
      return [entry, ...filtered].slice(0, 12); // Max 12 måneder
    });
    
    // 🆕 Send analyse til backend (asynkront, fejler stille)
    api.submitPayslipAnalysis({
      userId: payslip.userId,
      payslip,
      validation,
    }).then(result => {
      if (result.success) {
        console.log('[PayslipContext] Analyse sendt til backend:', result.data?.id);
      } else {
        console.warn('[PayslipContext] Kunne ikke sende analyse til backend:', result.error);
      }
    }).catch(err => {
      console.warn('[PayslipContext] Fejl ved afsendelse til backend:', err);
    });
  }, []);

  // Ryd nuværende analyse (men behold historie)
  const clearAnalysis = useCallback(() => {
    setCurrentPayslip(null);
    setCurrentValidation(null);
    setIsAnalyzing(false);
  }, []);
  
  // Ryd al historie
  const clearHistory = useCallback(() => {
    setHistoryEntries([]);
    setCurrentPayslip(null);
    setCurrentValidation(null);
  }, []);
  
  // 🆕 Ryd ALT data inkl. localStorage (til logout)
  const clearAllData = useCallback(() => {
    setHistoryEntries([]);
    setCurrentPayslip(null);
    setCurrentValidation(null);
    setIsAnalyzing(false);
    // Ryd localStorage
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PAYSLIP);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_VALIDATION);
    localStorage.removeItem(STORAGE_KEYS.PAYSLIP_HISTORY);
  }, []);
  
  // ============================================
  // HISTORY HELPERS
  // ============================================
  
  // Hent fuld entry fra historie
  const getHistoryEntry = useCallback((id: string): { payslip: PayslipData; validation: PayslipValidationResult } | null => {
    const entry = historyEntries.find(e => e.item.id === id);
    if (!entry) return null;
    return { payslip: entry.payslip, validation: entry.validation };
  }, [historyEntries]);
  
  // Load en historisk analyse som current
  const loadFromHistory = useCallback((id: string) => {
    const entry = historyEntries.find(e => e.item.id === id);
    if (entry) {
      setCurrentPayslip(entry.payslip);
      setCurrentValidation(entry.validation);
    }
  }, [historyEntries]);
  
  // Computed: Kompakt historie-liste til UI
  const payslipHistory = historyEntries.map(e => e.item);

  // Konverter til Ernest format
  const getErnestPayslipContext = useCallback((): PayslipAnalysisContext | undefined => {
    if (!currentPayslip || !currentValidation) return undefined;
    return toErnestContext(currentPayslip, currentValidation);
  }, [currentPayslip, currentValidation]);

  // Konverter til Dashboard format (med akkumulerede data fra historik)
  const getDashboardData = useCallback((): DashboardData => {
    const payslip = currentPayslip ?? historyEntries[0]?.payslip ?? null;
    
    const emptySupplements: SupplementBreakdown = {
      aftentimer: 0, aftenBeloeb: 0, aftenSats: 0,
      soenHelligTimer: 0, soenHelligBeloeb: 0, soenHelligSats: 0,
      natTimer: 0, natBeloeb: 0, totalTillaeg: 0,
    };
    const emptyAggregated: AggregatedStats = {
      payslipsChecked: 0, payslipsWithErrors: 0, totalDifferenceOwed: 0,
      ytdBrutto: 0, ytdNetto: 0, ytdPension: 0, ytdSkat: 0,
      ytdTillaeg: 0, ytdAftentillaeg: 0, ytdSoenHelligdag: 0, ytdFerieDage: 0,
      avgNettolon: 0, avgTimer: 0, latestTimer: 0, latestTimelon: 0,
      latestSupplements: emptySupplements, latestPensionBeloeb: 0, latestPensionProcent: 0,
      trend: [],
    };

    if (!payslip) {
      return {
        paymentAmount: null, paymentDaysLeft: null, paymentMonth: null,
        earned: null, total: null, earningsDate: null,
        earnedItems: [], aggregated: emptyAggregated,
      };
    }
    
    const { period, totals, deductions, supplements, absence } = payslip;
    
    const now = new Date();
    const currentDay = now.getDate();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = lastDayOfMonth - currentDay;
    
    const formatKr = (amount: number) => 
      amount.toLocaleString("da-DK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    // --- Earned items (seneste lønseddel) ---
    const earnedItems: DashboardEarnedItem[] = [];
    
    if (absence.ferie.dage > 0 || absence.afspadsering.timer > 0) {
      earnedItems.push({
        id: "ferie",
        icon: React.createElement(Sun, { className: "h-5 w-5" }),
        label: "Ferie",
        value: `${absence.ferie.dage} dage`,
      });
    }
    if (deductions.pension.beloeb > 0) {
      earnedItems.push({
        id: "pension",
        icon: React.createElement(Heart, { className: "h-5 w-5" }),
        label: "Pension",
        value: `+ ${formatKr(deductions.pension.beloeb)} kr`,
      });
    }
    if (absence.afspadsering.timer > 0) {
      earnedItems.push({
        id: "afspadsering",
        icon: React.createElement(Clock, { className: "h-5 w-5" }),
        label: "Afspadsering",
        value: `${absence.afspadsering.timer} timer`,
      });
    }
    if (deductions.skat.beloeb > 0) {
      earnedItems.push({
        id: "skat",
        icon: React.createElement(Receipt, { className: "h-5 w-5" }),
        label: "Skat",
        value: `- ${formatKr(deductions.skat.beloeb)} kr`,
      });
    }
    if (deductions.atp.beloeb > 0) {
      earnedItems.push({
        id: "atp",
        icon: React.createElement(Landmark, { className: "h-5 w-5" }),
        label: "ATP",
        value: `+ ${formatKr(deductions.atp.beloeb)} kr`,
      });
    }
    const totalTillaeg = 
      supplements.aftentillaeg.beloeb + 
      supplements.nattillaeg.beloeb + 
      supplements.soenHelligdag.beloeb;
    if (totalTillaeg > 0) {
      earnedItems.push({
        id: "tillaeg",
        icon: React.createElement(Timer, { className: "h-5 w-5" }),
        label: "Tillæg i alt",
        value: `+ ${formatKr(totalTillaeg)} kr`,
      });
    }
    
    // --- Aggregated stats from all history entries ---
    const entries = historyEntries;
    const n = entries.length;
    
    let ytdBrutto = 0, ytdNetto = 0, ytdPension = 0, ytdSkat = 0;
    let ytdTillaeg = 0, ytdAftentillaeg = 0, ytdSoenHelligdag = 0, ytdFerieDage = 0;
    let totalTimer = 0, errCount = 0, totalDiff = 0;
    const trend: MonthlyTrendPoint[] = [];

    for (const e of entries) {
      const p = e.payslip;
      const v = e.validation;
      ytdBrutto += p.totals.bruttolon;
      ytdNetto += p.totals.nettolon;
      ytdPension += p.deductions.pension.beloeb;
      ytdSkat += p.deductions.skat.beloeb;
      ytdAftentillaeg += p.supplements.aftentillaeg.beloeb;
      ytdSoenHelligdag += p.supplements.soenHelligdag.beloeb;
      ytdTillaeg += p.totals.totalTillaeg;
      ytdFerieDage += p.absence.ferie.dage;
      totalTimer += p.salary.normalTimer;
      if (v.status === "errors") errCount++;
      totalDiff += v.summary.totalDifference;
      
      trend.push({
        month: p.period.month.slice(0, 3),
        nettolon: p.totals.nettolon,
        bruttolon: p.totals.bruttolon,
        timer: p.salary.normalTimer,
      });
    }

    // Sort trend chronologically by period month index
    const monthOrder: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, Maj: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Okt: 9, Nov: 10, Dec: 11,
    };
    trend.sort((a, b) => (monthOrder[a.month] ?? 0) - (monthOrder[b.month] ?? 0));

    const latestSupplements: SupplementBreakdown = {
      aftentimer: supplements.aftentillaeg.timer,
      aftenBeloeb: supplements.aftentillaeg.beloeb,
      aftenSats: supplements.aftentillaeg.sats,
      soenHelligTimer: supplements.soenHelligdag.timer,
      soenHelligBeloeb: supplements.soenHelligdag.beloeb,
      soenHelligSats: supplements.soenHelligdag.sats,
      natTimer: supplements.nattillaeg.timer,
      natBeloeb: supplements.nattillaeg.beloeb,
      totalTillaeg: totals.totalTillaeg,
    };

    const aggregated: AggregatedStats = {
      payslipsChecked: n,
      payslipsWithErrors: errCount,
      totalDifferenceOwed: totalDiff,
      ytdBrutto, ytdNetto, ytdPension, ytdSkat,
      ytdTillaeg, ytdAftentillaeg, ytdSoenHelligdag, ytdFerieDage,
      avgNettolon: n > 0 ? ytdNetto / n : 0,
      avgTimer: n > 0 ? totalTimer / n : 0,
      latestTimer: payslip.salary.normalTimer,
      latestTimelon: payslip.salary.timelon,
      latestSupplements,
      latestPensionBeloeb: deductions.pension.beloeb,
      latestPensionProcent: deductions.pension.procent ?? 0,
      trend,
    };

    return {
      paymentAmount: formatKr(totals.nettolon),
      paymentDaysLeft: daysLeft,
      paymentMonth: period.month,
      earned: totals.nettolon,
      total: totals.bruttolon,
      earningsDate: `${period.month} ${period.year}`,
      earnedItems,
      aggregated,
    };
  }, [currentPayslip, historyEntries]);

  // Computed values
  const hasActiveAnalysis = currentPayslip !== null && currentValidation !== null;
  const hasDashboardData = hasActiveAnalysis || historyEntries.length > 0;
  
  const errorCount = currentValidation?.discrepancies.filter(d => d.severity === "error").length ?? 0;
  const warningCount = currentValidation?.discrepancies.filter(d => d.severity === "warning").length ?? 0;
  
  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;
  
  const totalDifference = currentValidation?.summary.totalDifference ?? 0;

  return (
    <PayslipContext.Provider value={{ 
      // Current analysis data
      currentPayslip,
      currentValidation,
      isAnalyzing,
      
      // History
      payslipHistory,
      
      // Actions
      setAnalysis,
      startAnalysis,
      clearAnalysis,
      clearHistory,
      clearAllData,
      
      // History helpers
      getHistoryEntry,
      loadFromHistory,
      
      // Helpers
      getErnestPayslipContext,
      getDashboardData,
      
      // Computed
      hasActiveAnalysis,
      hasDashboardData,
      hasErrors,
      hasWarnings,
      errorCount,
      warningCount,
      totalDifference,
    }}>
      {children}
    </PayslipContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function usePayslip() {
  const context = useContext(PayslipContext);
  
  if (context === undefined) {
    throw new Error('usePayslip must be used within a PayslipProvider');
  }
  
  return context;
}
