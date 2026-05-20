// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  
  // Basis info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  
  // Arbejde
  employer: string;                    // Fx "Region Hovedstaden"
  employerType?: EmployerType;
  workplace?: string;                  // Fx "Bispebjerg Hospital"
  jobTitle?: string;                   // Fx "Butiksassistent", "SOSU-hjælper"
  department?: string;                 // Fx "Lager & Logistik"
  unit?: string;                       // Fx "Team 3, Daghold"
  area?: 1 | 2 | 3 | 4;                // Lønområde (1-4) fra lønseddel
  
  // Uddannelse & Ansættelse
  educationLevel?: string;             // Fx "Erhvervsuddannelse"
  employmentType?: 'permanent' | 'temporary' | 'substitute';  // Fast, midlertidig, vikar
  contractType?: 'fixedSchedule' | 'flexSchedule' | 'hourly'; // Fast plan, fleksibel, timeløn
  
  // Anciennitet
  seniorityDate?: string;              // Anciennitetsdato fra lønseddel (ISO date)
  yearsOfExperience?: number;          // Beregnet antal års anciennitet
  
  // Fagforening
  union: string;                       // Fx "HK", "3F"
  unionFullName: string;               // Fx "HK Privat og HK HANDEL"
  memberNumber: string;
  memberSince: string;
  
  // Arbejdsmønstre (beregnet fra brugerens vagtplan)
  primaryShiftType?: ShiftType | 'mixed';
  avgHoursPerWeek?: number;
  
  // Overenskomst (auto-detekteret eller manuelt sat)
  collectiveAgreement?: string;
  collectiveAgreementId?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Arbejdsgiver-typer til overenskomst-detektion
export type EmployerType = 
  | 'region'           // Regioner
  | 'kommune'          // Kommuner
  | 'privat_hospital'  // Private hospitaler
  | 'plejehjem'        // Plejehjem
  | 'hjemmepleje'      // Hjemmepleje
  | 'daginstitution'   // Daginstitutioner
  | 'handicap'         // Handicapområdet
  | 'other';           // Andet

export interface CollectiveAgreement {
  id: string;
  name: string;
  shortName: string;
  union: string;
  employerTypes: EmployerType[];
  validFrom: string;
  validTo: string;
  documentUrl?: string;
}

// ============================================
// Calendar / Shift Types
// ============================================

export type ShiftType = "day" | "evening" | "night" | "day-off" | "meeting" | "sick";

export interface Shift {
  id: string;
  date: string; // ISO date string
  type: ShiftType;
  label: string;
  time?: string;
  hours?: number;
  location?: string;
  notes?: string;
}

export interface CalendarConnection {
  id: string;
  userId: string;
  source: "ics" | "google" | "optima";
  icsUrl?: string;
  isActive: boolean;
  lastSynced: string | null;
  createdAt: string;
}

export interface CalendarSyncRequest {
  source: "ics" | "google" | "optima";
  icsUrl?: string;
}

export interface CalendarSyncResponse {
  connection: CalendarConnection;
  shifts: Shift[];
  syncedCount: number;
}

export interface CalendarStats {
  workHours: number;
  shifts: number;
  weekendShifts: number;
  nightShifts: number;
}

// ============================================
// Payslip / Lønseddel Types
// ============================================

/**
 * Komplet lønseddel-data fra backend
 */
export interface PayslipData {
  id: string;
  userId: string;
  
  // Periode
  period: {
    month: string;          // "Januar", "Februar", etc.
    year: number;           // 2024
    startDate: string;      // ISO date "2024-01-01"
    endDate: string;        // ISO date "2024-01-31"
  };
  
  // Arbejdsgiver
  employer: {
    name: string;           // "Region Hovedstaden"
    cvr?: string;           // CVR-nummer
    department?: string;    // Afdeling
  };
  
  // Løn komponenter
  salary: SalaryData;
  
  // Tillæg
  supplements: SupplementsData;
  
  // Fradrag
  deductions: DeductionsData;
  
  // Fravær
  absence: AbsenceData;
  
  // Totaler
  totals: {
    bruttolon: number;      // A-indkomst (skattegrundlag inkl. personalegoder)
    nettolon: number;       // Til udbetaling (kontant løn − fradrag)
    totalFradrag: number;   // Samlede fradrag (AM + skat + pension + ATP)
    totalTillaeg: number;   // Samlede tillæg (kontante)
  };

  // Personalegoder (beskattes men udbetales ikke)
  personalegoder?: Array<{ label: string; beloeb: number }>;

  // Kontant løn i alt (grundløn + kontante tillæg, ekskl. personalegoder)
  kontantLon?: number;
  
  // Metadata
  uploadedAt: string;       // ISO datetime
  analyzedAt?: string;      // ISO datetime
}

/**
 * Løn-data med beregnet timeløn
 */
export interface SalaryData {
  // Fast løn
  grundlon: number;             // Månedlig grundløn i kr
  
  // Timeløn
  timelon: number;              // Forventet timeløn fra overenskomst (kr/time)
  normalTimer: number;          // Antal normale timer arbejdet
  
  // Beregnet timeløn (udregnet fra lønseddel) - optional, beregnes på frontend hvis ikke medsendt
  beregnetTimelon?: {
    udenTillaeg: number;        // (bruttoløn - tillæg) / timer
    medTillaeg: number;         // bruttoløn / timer
    afvigelse: number;          // beregnet - forventet (negativ = du får for lidt)
    status: "ok" | "warning" | "error";  // ok hvis afvigelse < 1 kr
  };
}

/**
 * Tillæg med timer, sats og beløb
 */
export interface SupplementEntry {
  timer: number;            // Antal timer med tillæg
  sats: number;             // Sats pr. time i kr
  beloeb: number;           // Samlet beløb (timer × sats)
}

export interface SupplementsData {
  aftentillaeg: SupplementEntry;    // Aftentillæg (typisk 17:00-23:00)
  nattillaeg: SupplementEntry;      // Nattillæg (typisk 23:00-06:00)
  lordagstillaeg?: SupplementEntry; // Lørdagstillæg (typisk lør 06:00-24:00)
  soenHelligdag: SupplementEntry;   // Søn- og helligdagstillæg
  raadighestillaeg?: SupplementEntry; // Rådighedstillæg (AC/fuldmægtige)
}

/**
 * Fradrag med beløb og evt. procent
 */
export interface DeductionEntry {
  beloeb: number;           // Beløb i kr
  procent?: number;         // Procentsats (fx 38% skat)
  grundlag?: number;        // Beregningsgrundlag
}

export interface DeductionsData {
  pension: DeductionEntry;          // Pension
  skat: DeductionEntry;             // A-skat
  atp: DeductionEntry;              // ATP-bidrag
  amBidrag?: DeductionEntry;        // AM-bidrag (arbejdsmarkedsbidrag)
}

/**
 * Fravær med dage og timer
 */
export interface AbsenceEntry {
  dage: number;             // Antal dage
  timer: number;            // Antal timer (dage × daglig arbejdstid)
  beloeb?: number;          // Evt. udbetalt beløb (fx feriepenge)
}

export interface AbsenceData {
  sygdom: AbsenceEntry;             // Sygdom
  ferie: AbsenceEntry;              // Ferie
  afspadsering: AbsenceEntry;       // Afspadsering
  barnsSygdom: AbsenceEntry;        // Barns 1. og 2. sygedag
}

// ============================================
// Lønseddel Validering Types
// ============================================

/**
 * Forventede værdier baseret på vagtplan + overenskomst
 */
export interface ExpectedPayslipData {
  salary: {
    grundlon: number;
    timelon: number;
    normalTimer: number;
  };
  
  supplements: {
    aftentillaeg: SupplementEntry;
    nattillaeg: SupplementEntry;
    soenHelligdag: SupplementEntry;
  };
  
  deductions: {
    pension: DeductionEntry;
    skat: DeductionEntry;
    atp: DeductionEntry;
  };
  
  absence: {
    sygdom: AbsenceEntry;
    ferie: AbsenceEntry;
    afspadsering: AbsenceEntry;
    barnsSygdom: AbsenceEntry;
  };
}

/**
 * Resultat af lønseddel-validering
 */
export interface PayslipValidationResult {
  id: string;
  payslipId: string;
  status: "ok" | "warnings" | "errors";
  
  // Detaljerede afvigelser
  discrepancies: PayslipDiscrepancy[];
  
  // Opsummering
  summary: {
    totalDifference: number;      // Samlet forskel i kr (negativ = du mangler penge)
    issuesCount: number;          // Antal problemer
    warningsCount: number;        // Antal advarsler
  };
  
  validatedAt: string;
}

/**
 * En enkelt afvigelse/fejl på lønsedlen
 */
export interface PayslipDiscrepancy {
  id: string;
  
  category: "salary" | "supplement" | "deduction" | "absence";
  
  field: PayslipField;
  
  severity: "error" | "warning" | "info";
  
  expected: number;           // Forventet værdi
  actual: number;             // Faktisk værdi på lønseddel
  difference: number;         // Forskel (actual - expected)
  
  description: string;        // Menneskevenlig beskrivelse
  calculation?: string;       // Regel og formel brugt til beregning (fra Rule Engine)
  suggestion?: string;        // Forslag til handling
}

export type PayslipField = 
  // Løn
  | "grundlon" 
  | "timelon" 
  | "normalTimer"
  // Tillæg
  | "aftentillaeg" 
  | "nattillaeg"
  | "lordagstillaeg"
  | "soenHelligdag"
  | "raadighestillaeg"
  | "overtid"
  | "ferietillaeg"
  | "saerlig_opsparing"
  // Fradrag  
  | "pension" 
  | "pensionRaadighed"
  | "skat" 
  | "atp"
  // Fravær
  | "sygdom" 
  | "ferie" 
  | "afspadsering" 
  | "barnsSygdom";

// ============================================
// Lønseddel API Request/Response Types
// ============================================

/**
 * Upload og analyser lønseddel request
 */
export interface AnalyzePayslipRequest {
  file?: File;                // PDF/billede upload
  ocrText?: string;           // Alternativt: allerede OCR-behandlet tekst
  month: string;              // "2024-01" ISO month format
}

/**
 * Analyser lønseddel response
 */
export interface AnalyzePayslipResponse {
  payslip: PayslipData;
  expected: ExpectedPayslipData;
  validation: PayslipValidationResult;
}

/**
 * Lønseddel i historik-liste (kompakt version)
 */
export interface PayslipHistoryItem {
  id: string;
  period: string;             // "Januar 2024"
  status: "ok" | "warnings" | "errors";
  issuesCount: number;
  nettolon: number;
  employer: string;
  analyzedAt: string;
}

// ============================================
// Legacy Payslip Types (for backwards compatibility)
// ============================================

/** @deprecated Brug PayslipValidationResult i stedet */
export interface PayslipAnalysis {
  id: string;
  userId: string;
  month: string;
  status: "ok" | "error";
  errors: PayslipError[];
  amount: number;
  createdAt: string;
}

/** @deprecated Brug PayslipDiscrepancy i stedet */
export interface PayslipError {
  id: string;
  type: string;
  description: string;
  expected: number;
  actual: number;
  difference: number;
}

// ============================================
// Earnings Types
// ============================================

export interface EarningsData {
  earned: number;
  total: number;
  date: string;
}

export interface EarnedItem {
  id: string;
  type: "vacation" | "pension" | "time-off" | "tax" | "atp" | "holiday-pay" | "overtime";
  label: string;
  value: string;
  numericValue?: number;
}

// ============================================
// Request Types (for fagforening)
// ============================================

export interface CaseRequest {
  id: string;
  payslipId: string;
  payslipMonth: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  submittedAt: string;
  resolvedAt?: string;
}


