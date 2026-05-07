import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";
import foaLogo from "@/assets/foa-logo.png";
import hkLogo from "@/assets/hk-logo.png";
import threeFLogo from "@/assets/3f-logo.png";
import djoefLogo from "@/assets/djoef-logo.png";
import lederneLogo from "@/assets/lederne-logo.png";

// ─── Theme interface ──────────────────────────────────────────────────────────

export interface UnionTheme {
  "--primary": string;
  "--primary-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--border": string;
  "--ring": string;
  "--font-heading": string;
  "--font-body": string;
}

// ─── Demo profile ─────────────────────────────────────────────────────────────

export type DemoProfile = "agreement" | "contract";

export interface DemoContractComparison {
  agreedMonthly: number;
  paidMonthly: number;
  difference: number;
  matchedTerms: number;
  deviations: number;
}

export interface DemoContractClause {
  clause: string;
  status: "compliant" | "deviation";
  detail: string;
}

export interface DemoContractAnalysis {
  totalClauses: number;
  compliant: number;
  deviations: number;
  clauses: DemoContractClause[];
}

// ─── Contract Intelligence (Djøf/Lederne) ────────────────────────────────────

export interface SalaryComponent {
  label: string;
  amount: number;
  sublabel?: string;
}

export interface PensionIntelligence {
  totalPercent: number;
  minimumPercent: number;
  fritvalgPercent: number;
  fritvalgMonthly: number;
  provider: string;
  components: { label: string; percent: number; monthly: number }[];
}

export interface CareerStep {
  date: string;
  label: string;
  detail: string;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export interface NegotiationPoint {
  label: string;
  status: "active" | "potential" | "locked";
  detail: string;
  benchmark?: string;
}

// ─── Termination Intelligence ─────────────────────────────────────────────────

export interface TerminationDetail {
  label: string;
  value: string;
  status: "info" | "warning" | "positive" | "future";
}

export interface TerminationTimelineStep {
  label: string;
  detail: string;
  icon: "calendar" | "clock" | "briefcase" | "shield" | "banknote" | "alert";
}

export interface TerminationScenario {
  title: string;
  noticePeriod: string;
  legalBasis: string;
  details: TerminationDetail[];
  timeline?: TerminationTimelineStep[];
}

export interface TerminationIntelligence {
  isFunktionaer: boolean;
  anciennityStartDate: string;
  employerNoticePeriodMonths: number;
  employeeNoticePeriodMonths: number;
  severanceEligibleAfterYears: number;
  severanceEligibleDate: string;
  scenarios: TerminationScenario[];
  relatedFinding?: string;
}

export interface ContractIntelligence {
  salaryComponents: SalaryComponent[];
  totalPackage: number;
  pension: PensionIntelligence;
  careerSteps: CareerStep[];
  negotiationPoints: NegotiationPoint[];
  termination?: TerminationIntelligence;
}

// ─── Config interface ─────────────────────────────────────────────────────────

export type UnionId = "hk" | "foa" | "djoef" | "3f" | "lederne";

export interface UnionDemoConfig {
  id: UnionId;
  name: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  logo: string;

  // Demo-profil: "agreement" = vagtplan-fokus, "contract" = kontraktpakke-fokus
  demoProfile: DemoProfile;
  demoContractComparison?: DemoContractComparison;
  demoContractAnalysis?: DemoContractAnalysis;
  contractIntelligence?: ContractIntelligence;

  // Welcome / auth side
  welcomeHeadline: string;
  welcomeSub: string;
  welcomeDescription: string;
  ctaQuestion: string;
  authFeatures: [string, string, string];

  // Pitch-side (AppPreviewPage)
  pitchTagline: string;
  pitchSub: string;

  // Demo-persona
  persona: {
    firstName: string;
    name: string;
    jobTitle: string;
    employer: string;
    cvr: string;
  };

  collectiveAgreement: string;

  // ICS demo-vagtplan URL (agreement-profiler)
  demoIcsUrl?: string;
  demoIcsDisplayUrl?: string;

  // Whitelabel tema
  theme: UnionTheme;
  googleFontsImport: string;

  // Al lønseddel-data (single default)
  payslip: PayslipData;
  validation: PayslipValidationResult;

  // Multi-payslip map: filnavn-mønster → data (til filename-baseret demo)
  demoPayslips?: Record<string, { payslip: PayslipData; validation: PayslipValidationResult }>;
}

// ─── HK ──────────────────────────────────────────────────────────────────────

const HK_PAYSLIP: PayslipData = {
  id: "ps-hk-2025-10",
  userId: "demo-hk",
  period: {
    month: "Oktober",
    year: 2025,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
  },
  employer: {
    name: "Nordic Retail A/S",
    cvr: "38147205",
    department: "Lager & Logistik",
  },
  salary: {
    grundlon: 25480.00,
    timelon: 158.68,
    normalTimer: 160.55,
    beregnetTimelon: {
      udenTillaeg: 158.68,
      medTillaeg: 166.42,
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 16, sats: 22.65, beloeb: 362.40 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 8, sats: 45.30, beloeb: 362.40 },  // ← kun 1 søndag betalt, men 2 arbejdet
  },
  deductions: {
    pension: { beloeb: 1070.00, procent: 4.0, grundlag: 26750.00 },
    skat: { beloeb: 7640.00, procent: 36 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 2140.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 0, timer: 0 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 26750.00,
    nettolon: 15801.00,
    totalFradrag: 10949.00,
    totalTillaeg: 724.80,  // kun 1 søndag + aften — mangler 1 søndag (362,40 kr)
  },
  uploadedAt: "2025-11-01T08:00:00Z",
  analyzedAt: "2025-11-01T08:00:04Z",
};

const HK_VALIDATION: PayslipValidationResult = {
  id: "val-hk-2025-10",
  payslipId: "ps-hk-2025-10",
  status: "errors",
  discrepancies: [
    {
      id: "err-hk-1",
      category: "supplement",
      field: "soenHelligdag",
      severity: "error",
      expected: 724.80,
      actual: 362.40,
      difference: -362.40,
      description:
        "Søndagstillæg mangler for d. 19. oktober. Du har arbejdet 2 søndage i oktober, men kun fået tillæg for 1. Manglende tillæg: 8 timer á 45,30 kr.",
      calculation:
        "Regel: HK/DI Butiksoverenskomsten §10, stk. 4 — Søn- og helligdagstillæg. Sats: 45,30 kr/t. Forventet: 2 søndage × 8t × 45,30 kr = 724,80 kr. Faktisk udbetalt: 362,40 kr (1 søndag).",
      suggestion:
        "Kontakt lønadministrationen hos Nordic Retail A/S og henvis til HK/DI Butiksoverenskomsten §10, stk. 4. Søndag d. 19. oktober fremgår af vagtplanen men mangler i tillægsberegningen. Du mangler 362,40 kr.",
    },
  ],
  summary: { totalDifference: -362.40, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-11-01T08:00:04Z",
};

export const HK_CONFIG: UnionDemoConfig = {
  id: "hk",
  name: "HK",
  fullName: "HK – Handel, Transport og Service",
  primaryColor: "#003B73",
  secondaryColor: "#002147",
  bgColor: "#EEF4FA",
  logo: hkLogo,

  demoProfile: "agreement" as DemoProfile,

  welcomeHeadline: "Tjek din løn på 30 sekunder",
  welcomeSub: "Tjek det med PayTjek",
  welcomeDescription:
    "Skræddersyet til dig der arbejder i handel og kontor. Upload din lønseddel og få det tjekket med det samme.",
  ctaQuestion: "Er din løn fra butikken korrekt?",
  authFeatures: [
    "Automatisk tjek af din butiksløn",
    "Synkroniser vagter efter butiksoverenskomsten",
    "AI-rådgivning baseret på din overenskomst",
  ],

  pitchTagline: "Fra lønseddel til svar på 30 sekunder",
  pitchSub:
    "Upload din lønseddel — Ernest tjekker den mod din overenskomst og finder fejl du aldrig ville have set selv.",

  persona: {
    firstName: "Sara",
    name: "Sara Nielsen",
    jobTitle: "Butiksassistent",
    employer: "Nordic Retail A/S",
    cvr: "38147205",
  },

  collectiveAgreement: "HK/DI Butiksoverenskomsten",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700;900&display=swap",
  theme: {
    "--primary": "211 100% 23%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "214 100% 14%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "211 50% 95%",
    "--accent-foreground": "211 100% 20%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "211 30% 97%",
    "--card-foreground": "0 0% 10%",
    "--muted": "211 15% 95%",
    "--muted-foreground": "0 0% 40%",
    "--border": "211 15% 90%",
    "--ring": "211 100% 23%",
    "--font-heading": "'Source Sans 3', sans-serif",
    "--font-body": "'Source Sans 3', sans-serif",
  },

  payslip: HK_PAYSLIP,
  validation: HK_VALIDATION,
};

// ─── FOA ─────────────────────────────────────────────────────────────────────

// Korrekt lønseddel januar 2026 (baseline)
const FOA_JAN_CORRECT: PayslipData = {
  id: "ps-foa-2026-01-ok",
  userId: "demo-foa",
  period: { month: "Januar", year: 2026, startDate: "2026-01-01", endDate: "2026-01-31" },
  employer: { name: "Esbjerg Kommune", cvr: "29764603", department: "Botilbuddet Søndervang" },
  salary: {
    grundlon: 25275.98,
    timelon: 182.28,
    normalTimer: 138.56,
    beregnetTimelon: { udenTillaeg: 182.28, medTillaeg: 192.28, afvigelse: 0, status: "ok" },
  },
  supplements: {
    aftentillaeg: { timer: 27.75, sats: 65.62, beloeb: 1820.96 },
    nattillaeg: { timer: 0, sats: 72.91, beloeb: 0 },
    lordagstillaeg: { timer: 12.00, sats: 58.33, beloeb: 699.96 },
    soenHelligdag: { timer: 7.25, sats: 91.14, beloeb: 660.76 },
  },
  deductions: {
    pension: { beloeb: 1295.36, procent: 14.0, grundlag: 28457.66 },
    skat: { beloeb: 7194.0, procent: 38 },
    atp: { beloeb: 99.0 },
    amBidrag: { beloeb: 2325.0, procent: 8 },
  },
  absence: { sygdom: { dage: 0, timer: 0 }, ferie: { dage: 0, timer: 0 }, afspadsering: { dage: 0, timer: 0 }, barnsSygdom: { dage: 0, timer: 0 } },
  totals: { bruttolon: 29056.84, nettolon: 19537.84, totalFradrag: 9519.0, totalTillaeg: 3181.68 },
  uploadedAt: "2026-02-01T08:00:00Z",
  analyzedAt: "2026-02-01T08:00:04Z",
};

// FEJL 1: Forkert aftentillægssats (35,12% i stedet for 36%)
const FOA_JAN_ERROR1: PayslipData = {
  ...FOA_JAN_CORRECT,
  id: "ps-foa-2026-01-err1",
  supplements: {
    ...FOA_JAN_CORRECT.supplements,
    aftentillaeg: { timer: 27.75, sats: 64.02, beloeb: 1776.55 },
  },
  totals: { bruttolon: 29005.50, nettolon: 19509.50, totalFradrag: 9496.0, totalTillaeg: 3137.27 },
};

const FOA_VAL_ERROR1: PayslipValidationResult = {
  id: "val-foa-err1",
  payslipId: "ps-foa-2026-01-err1",
  status: "errors",
  discrepancies: [{
    id: "err-foa-1",
    category: "supplement",
    field: "aftentillaeg",
    severity: "error",
    expected: 1820.96,
    actual: 1776.55,
    difference: -44.41,
    description: "Aftentillægssatsen er 64,02 kr/t (35,12%) — men den korrekte sats fra 1. januar 2026 er 65,62 kr/t (36%). Gammel 2025-sats er fejlagtigt anvendt.",
    calculation: "Regel: Aftale om arbejdstid for de kommunale døgnområder (79.01) §13, stk. 2 — Aftentillæg kl. 17–23. Sats pr. 01.01.2026: 36% af 182,28 kr/t = 65,62 kr/t. Forventet: 27,75t × 65,62 = 1.820,96 kr. Faktisk: 27,75t × 64,02 = 1.776,55 kr.",
    suggestion: "Kontakt lønadministrationen i Esbjerg Kommune og henvis til 79.01 §13, stk. 2. Aftentillægssatsen blev opdateret 1. januar 2026 fra 35,12% til 36%. KMD Opus har sandsynligvis ikke fået satsopdateringen. Du mangler 44,41 kr i efterbetaling for januar.",
  }],
  summary: { totalDifference: -44.41, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-02-01T08:00:04Z",
};

// FEJL 2: Forkert pensionsprocent (13% i stedet for 14%)
const FOA_FEB_ERROR2: PayslipData = {
  ...FOA_JAN_CORRECT,
  id: "ps-foa-2026-02-err2",
  period: { month: "Februar", year: 2026, startDate: "2026-02-01", endDate: "2026-02-28" },
  deductions: {
    ...FOA_JAN_CORRECT.deductions,
    pension: { beloeb: 1108.75, procent: 13.0, grundlag: 28457.66 },
  },
};

const FOA_VAL_ERROR2: PayslipValidationResult = {
  id: "val-foa-err2",
  payslipId: "ps-foa-2026-02-err2",
  status: "errors",
  discrepancies: [{
    id: "err-foa-2",
    category: "deduction",
    field: "pension",
    severity: "error",
    expected: 1295.36,
    actual: 1108.75,
    difference: -186.61,
    description: "Pensionsprocenten er 13% — men den korrekte sats fra 1. april 2025 er 14% (frit valg). Der indbetales ca. 187 kr/md for lidt til PenSam.",
    calculation: "Regel: Overenskomst for social- og sundhedspersonale (73.01) §11, stk. 1 + §13, stk. 1. Pensionssats pr. 01.04.2025: 15,29% samlet → frit valg = 14,00% til pension + 1,29% kontant. Pensionsgivende løn: 28.457,66 kr. Forventet eget bidrag (1/3 af 14%): 1.295,36 kr. Faktisk (1/3 af 13%): 1.108,75 kr.",
    suggestion: "Kontakt HR i Esbjerg Kommune og henvis til 73.01 §11, stk. 1. Pensionssatsen steg fra 14,29% til 15,29% (heraf frit valg fra 13% til 14%) pr. 1. april 2025. Systemet bruger stadig den gamle sats. PenSam bør også orienteres om det for lave indbetalingsgrundlag.",
  }],
  summary: { totalDifference: -186.61, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-03-01T08:00:04Z",
};

// FEJL 3: Manglende kvalifikationsløn (trin 24 i stedet for trin 30)
const FOA_MAR_ERROR3: PayslipData = {
  ...FOA_JAN_CORRECT,
  id: "ps-foa-2026-03-err3",
  period: { month: "Marts", year: 2026, startDate: "2026-03-01", endDate: "2026-03-31" },
  // Grundløn er stadig trin 24 — burde være trin 30
};

const FOA_VAL_ERROR3: PayslipValidationResult = {
  id: "val-foa-err3",
  payslipId: "ps-foa-2026-03-err3",
  status: "errors",
  discrepancies: [{
    id: "err-foa-3",
    category: "salary",
    field: "grundlon",
    severity: "error",
    expected: 28177.30,
    actual: 25275.98,
    difference: -2901.32,
    description: "Grundlønnen er stadig trin 24 (25.275,98 kr) — men Maria har 4 års anciennitet pr. 1. marts 2026 og skal oprykkes til trin 30 (28.177,30 kr). Manglende kvalifikationsløn.",
    calculation: "Regel: Overenskomst for social- og sundhedspersonale (73.01) §6, stk. 2, B, nr. 1. Anciennitetsdato: 01.03.2022. Pr. marts 2026 = 4 års sammenlagt beskæftigelse som SSA → automatisk oprykning til løntrin 30 + grundlønstillæg. Trin 30 årsløn: 390.960 kr. Månedsløn deltid (32/37): 28.177,30 kr. Nuværende: 25.275,98 kr (trin 24).",
    suggestion: "Kontakt Esbjerg Kommunes lønkontor og henvis til 73.01 §6, stk. 2, B, nr. 1. Maria opfylder kravet om 4 års sammenlagt beskæftigelse som SSA pr. 1. marts 2026 og skal oprykkes fra trin 24 til trin 30. Differencen er 2.901,32 kr/md og skal efterbetales fra marts 2026.",
  }],
  summary: { totalDifference: -2901.32, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-04-01T08:00:04Z",
};

// Korrekt validering (ingen fejl)
const FOA_VAL_OK: PayslipValidationResult = {
  id: "val-foa-ok",
  payslipId: "ps-foa-2026-01-ok",
  status: "ok",
  discrepancies: [],
  summary: { totalDifference: 0, issuesCount: 0, warningsCount: 0 },
  validatedAt: "2026-02-01T08:00:04Z",
};

export const FOA_CONFIG: UnionDemoConfig = {
  id: "foa",
  name: "FOA",
  fullName: "FOA – Fag og Arbejde",
  primaryColor: "#E2001A",
  secondaryColor: "#B3001A",
  bgColor: "#FFF0F1",
  logo: foaLogo,

  demoProfile: "agreement" as DemoProfile,

  welcomeHeadline: "Får du det rigtige tillæg?",
  welcomeSub: "FOA og PayTjek tjekker den for dig",
  welcomeDescription:
    "SOSU'er har Danmarks mest komplicerede lønsedler — nat, aften, weekend og helligdag. PayTjek finder de fejl lønsystemet laver.",
  ctaQuestion: "Er din løn fra kommunen korrekt?",
  authFeatures: [
    "Automatisk tjek af nat-, aften- og weekendtillæg",
    "Synkroniser din vagtplan og find skjulte fejl",
    "AI-rådgivning baseret på KL/FOA-overenskomsten",
  ],

  pitchTagline: "Fra lønseddel til svar på 30 sekunder",
  pitchSub:
    "Upload lønsedlen — Ernest tjekker den mod overenskomsten og finder de fejl der er svære at opdage selv.",

  persona: {
    firstName: "Maria",
    name: "Maria Sørensen",
    jobTitle: "Social- og sundhedsassistent",
    employer: "Esbjerg Kommune",
    cvr: "29764603",
  },

  collectiveAgreement: "Social- og sundhedspersonale (73.01)",

  demoIcsUrl: "/demo/foa-vagter-jan-2026.ics",
  demoIcsDisplayUrl: "https://app.planday.dk/ics/export/soendervang-maria-s.ics",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700;900&display=swap",
  theme: {
    "--primary": "350 100% 44%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "350 100% 35%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "350 100% 95%",
    "--accent-foreground": "350 100% 30%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "350 50% 98%",
    "--card-foreground": "0 0% 10%",
    "--muted": "350 20% 95%",
    "--muted-foreground": "0 0% 40%",
    "--border": "350 20% 90%",
    "--ring": "350 100% 44%",
    "--font-heading": "'Source Sans 3', sans-serif",
    "--font-body": "'Source Sans 3', sans-serif",
  },

  payslip: FOA_JAN_ERROR1,
  validation: FOA_VAL_ERROR1,

  demoPayslips: {
    "jan": { payslip: FOA_JAN_ERROR1, validation: FOA_VAL_ERROR1 },
    "feb": { payslip: FOA_FEB_ERROR2, validation: FOA_VAL_ERROR2 },
    "mar": { payslip: FOA_MAR_ERROR3, validation: FOA_VAL_ERROR3 },
    "korrekt": { payslip: FOA_JAN_CORRECT, validation: FOA_VAL_OK },
  },
};

// ─── 3F ──────────────────────────────────────────────────────────────────────

const THREEF_PAYSLIP: PayslipData = {
  id: "ps-3f-2025-10",
  userId: "demo-3f",
  period: {
    month: "Oktober",
    year: 2025,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
  },
  employer: {
    name: "Scanlog A/S",
    cvr: "25312085",
    department: "Transport",
  },
  salary: {
    grundlon: 32450.00,
    timelon: 196.67,
    normalTimer: 165.00,
    beregnetTimelon: {
      udenTillaeg: 196.67,
      medTillaeg: 210.47,
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 0, sats: 0, beloeb: 0 },
  },
  deductions: {
    pension: { beloeb: 1298.00, procent: 4, grundlag: 32450.00 },
    skat: { beloeb: 9412.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 2596.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 0, timer: 0 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 34725.00,  // grundlon + kørselstillæg 1850 + ulempe 425
    nettolon: 15151.00,
    totalFradrag: 13405.00,
    totalTillaeg: 2275.00, // kørselstillæg + ulempe (overtid MANGLER)
  },
  uploadedAt: "2025-11-01T09:00:00Z",
  analyzedAt: "2025-11-01T09:00:04Z",
};

const THREEF_VALIDATION: PayslipValidationResult = {
  id: "val-3f-2025-10",
  payslipId: "ps-3f-2025-10",
  status: "errors",
  discrepancies: [
    {
      id: "err-3f-1",
      category: "supplement",
      field: "overtid",
      severity: "error",
      expected: 1475.04,
      actual: 0,
      difference: -1475.04,
      description:
        "Uge 42: Tachografen viser 41,5 timers køretid, men der er kun udbetalt løn for 37 timer. 4,5 timers overtid mangler i udbetalingen.",
      calculation:
        "Regel: Transportoverenskomsten (3F Transport/DI) §7, stk. 3 — Overtid ud over 37 t/uge. Første 3t: 196,67 × 1,5 = 295,01 kr/t. Herefter: 196,67 × 2,0 = 393,34 kr/t. Beregning: 3t × 295,01 + 1,5t × 393,34 = 885,03 + 590,01 = 1.475,04 kr. Faktisk: 0 kr.",
      suggestion:
        "Kontakt din kørselsleder hos Scanlog A/S og henvis til Transportoverenskomsten §7, stk. 3. Tachograf-data for uge 42 (13.–17. okt.) dokumenterer 41,5 timers køretid. De 4,5 timers overtid skal aflønnes med 50%/100% tillæg. Du mangler 1.475,04 kr.",
    },
  ],
  summary: { totalDifference: -1475.04, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-11-01T09:00:04Z",
};

export const THREEF_CONFIG: UnionDemoConfig = {
  id: "3f",
  name: "3F",
  fullName: "3F – Fagligt Fælles Forbund",
  primaryColor: "#EC1C24",
  secondaryColor: "#5E0329",
  bgColor: "#FFF5F5",
  logo: threeFLogo,

  demoProfile: "agreement" as DemoProfile,

  welcomeHeadline: "Stemmer din løn med din køreplan?",
  welcomeSub: "3F og PayTjek fanger de timer der forsvinder",
  welcomeDescription:
    "Chauffører og lagerfolk mister penge på overtid der ikke registreres. PayTjek matcher din tachograf og vagtplan mod lønsedlen automatisk.",
  ctaQuestion: "Stemmer din løn med din arbejdstid?",
  authFeatures: [
    "Automatisk tjek af overtid og skiftetillæg",
    "Match tachograf og vagtplan mod lønseddel",
    "AI-rådgivning baseret på Transportoverenskomsten",
  ],

  pitchTagline: "Dine timer skal betales korrekt",
  pitchSub:
    "Tag et billede af lønsedlen — Ernest tjekker den mod Transportoverenskomsten og finder den overtid der ikke er betalt.",

  persona: {
    firstName: "Mads",
    name: "Mads Jensen",
    jobTitle: "Chauffør / Fragtmand",
    employer: "Scanlog A/S",
    cvr: "25312085",
  },

  collectiveAgreement: "Transportoverenskomsten (3F Transport/DI)",

  demoIcsUrl: "/demo/3f-koereplan-okt-2025.ics",
  demoIcsDisplayUrl: "https://fleet.scanlog.dk/calendar/mads-jensen-koereplan.ics",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
  theme: {
    "--primary": "356 80% 52%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "340 94% 18%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "25 77% 70%",
    "--accent-foreground": "340 94% 18%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "20 70% 96%",
    "--card-foreground": "0 0% 10%",
    "--muted": "228 18% 86%",
    "--muted-foreground": "0 0% 35%",
    "--border": "25 40% 90%",
    "--ring": "356 80% 52%",
    "--font-heading": "'DM Sans', sans-serif",
    "--font-body": "'DM Sans', sans-serif",
  },

  payslip: THREEF_PAYSLIP,
  validation: THREEF_VALIDATION,
};

// ─── Djøf ─────────────────────────────────────────────────────────────────────
// Persona: Sofie Kjær Andersen, Fuldmægtig, Justitsministeriet
// AC-overenskomsten (Medst.nr. 067-25) · Nyt lønsystem · P+
// Fejlene eskalerer over Q4 2025:
//   Oktober:  L1-3 + L1-4 (beløbsfejl: forkert råd.trin + ATP sats F)
//   November: L1-1 + L1-2 (pensionsfejl: 17,1% + manglende råd.pension)
//   December: Alle fire fejl aktive samtidigt

// ── Korrekte værdier (ground truth) ──
// Basisløn trin 8:         36.178,01 kr/md
// Rådighedstillæg 4.-6.år:  4.361,53 kr/md
// Bruttoløn:               40.539,54 kr/md
// Pension basisløn 18,07%:  6.537,35 kr (eget: 2.179,12)
// Pension råd.tillæg 12,5%:   545,19 kr (eget:   181,73)
// ATP sats A:                  99,00 kr
// Nettoløn (korrekt):      22.688,53 kr

const ZERO_SUPP = { timer: 0, sats: 0, beloeb: 0 };
const ZERO_ABSENCE = { dage: 0, timer: 0 };
const DJOEF_EMPLOYER = { name: "Justitsministeriet", cvr: "39830000", department: "Departementet" };
const DJOEF_ABSENCE = { sygdom: ZERO_ABSENCE, ferie: ZERO_ABSENCE, afspadsering: ZERO_ABSENCE, barnsSygdom: ZERO_ABSENCE };

// ── Én gennemgående fejl: Rådighedstillæg forkert anciennitetstrin ──
// SLS har ikke opdateret anciennitetstrin da Sofie passerede 4.–6. års grænsen.
// Fejlen gentager sig automatisk hver måned — præcis som det sker i virkeligheden.
const DISC_RAD_TRIN = (id: string): PayslipValidationResult["discrepancies"][0] => ({
  id,
  category: "supplement",
  field: "raadighestillaeg",
  severity: "error",
  expected: 4361.53,
  actual: 3820.23,
  difference: -541.30,
  description:
    "Rådighedstillægget er beregnet med 1.–3. års anciennitet (grundbeløb 36.700 kr. = 3.820,23 kr./md). Sofie har 6+ års anciennitet (ansat 1/9-2019) og skal have 4.–6. års satsen (grundbeløb 41.900 kr. = 4.361,53 kr./md).",
  calculation:
    "Regel: AC-overenskomsten, bilag 6, pkt. 9 — Rådighedstillæg for fuldmægtige. Anciennitet: 1/9-2019 → 6+ år pr. okt. 2025. Korrekt trin: 4.–6. år. Grundbeløb 41.900 kr. × reguleringsprocent 24,9126% = 52.338 kr./år = 4.361,53 kr./md. Faktisk: 36.700 kr. × 24,9126% = 45.843 kr./år = 3.820,23 kr./md.",
  suggestion:
    "Kontakt lønadministrationen i Justitsministeriet og henvis til bilag 6, pkt. 9 i AC-overenskomsten. Rådighedstillæggets anciennitetstrin skal opdateres fra 1.–3. år til 4.–6. år. Differencen er 541,30 kr./md (6.496 kr./år) og skal efterbetales.",
});

// ── Fælles lønseddel-base (Sofie har fast månedsløn, kun perioden ændrer sig) ──
const DJOEF_PAYSLIP_BASE = {
  userId: "demo-djoef",
  employer: DJOEF_EMPLOYER,
  salary: {
    grundlon: 36178.01,
    timelon: 225.68,
    normalTimer: 160.33,
    beregnetTimelon: { udenTillaeg: 225.68, medTillaeg: 249.47, afvigelse: 0, status: "ok" as const },
  },
  supplements: {
    aftentillaeg: ZERO_SUPP,
    nattillaeg: ZERO_SUPP,
    soenHelligdag: ZERO_SUPP,
    raadighestillaeg: { timer: 0, sats: 0, beloeb: 3820.23 },
  },
  deductions: {
    pension: { beloeb: 2338.30, procent: 18.07, grundlag: 36178.01 },
    skat: { beloeb: 12148.00, procent: 37 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 3199.86, procent: 8 },
  },
  absence: DJOEF_ABSENCE,
  totals: { bruttolon: 39998.24, nettolon: 22213.08, totalFradrag: 17785.16, totalTillaeg: 3820.23 },
};

// ── Oktober 2025 ──
const DJOEF_OKT: PayslipData = {
  ...DJOEF_PAYSLIP_BASE,
  id: "ps-djoef-2025-10",
  period: { month: "Oktober", year: 2025, startDate: "2025-10-01", endDate: "2025-10-31" },
  uploadedAt: "2025-10-31T08:00:00Z",
  analyzedAt: "2025-10-31T08:00:04Z",
};

const DJOEF_VAL_OKT: PayslipValidationResult = {
  id: "val-djoef-2025-10",
  payslipId: "ps-djoef-2025-10",
  status: "errors",
  discrepancies: [DISC_RAD_TRIN("err-djoef-okt-1")],
  summary: { totalDifference: -541.30, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-10-31T08:00:04Z",
};

// ── November 2025 ──
const DJOEF_NOV: PayslipData = {
  ...DJOEF_PAYSLIP_BASE,
  id: "ps-djoef-2025-11",
  period: { month: "November", year: 2025, startDate: "2025-11-01", endDate: "2025-11-30" },
  uploadedAt: "2025-11-28T08:00:00Z",
  analyzedAt: "2025-11-28T08:00:04Z",
};

const DJOEF_VAL_NOV: PayslipValidationResult = {
  id: "val-djoef-2025-11",
  payslipId: "ps-djoef-2025-11",
  status: "errors",
  discrepancies: [DISC_RAD_TRIN("err-djoef-nov-1")],
  summary: { totalDifference: -541.30, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-11-28T08:00:04Z",
};

// ── December 2025 ──
const DJOEF_DEC: PayslipData = {
  ...DJOEF_PAYSLIP_BASE,
  id: "ps-djoef-2025-12",
  period: { month: "December", year: 2025, startDate: "2025-12-01", endDate: "2025-12-31" },
  uploadedAt: "2025-12-23T08:00:00Z",
  analyzedAt: "2025-12-23T08:00:04Z",
};

const DJOEF_VAL_DEC: PayslipValidationResult = {
  id: "val-djoef-2025-12",
  payslipId: "ps-djoef-2025-12",
  status: "errors",
  discrepancies: [DISC_RAD_TRIN("err-djoef-dec-1")],
  summary: { totalDifference: -541.30, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-12-23T08:00:04Z",
};

export const DJOEF_CONFIG: UnionDemoConfig = {
  id: "djoef",
  name: "Djøf",
  fullName: "Djøf – Danmarks Jurist- og Økonomforbund",
  primaryColor: "#0054CE",
  secondaryColor: "#06235F",
  bgColor: "#F0F4FF",
  logo: djoefLogo,

  demoProfile: "contract" as DemoProfile,
  demoContractComparison: {
    agreedMonthly: 40540,
    paidMonthly: 0,
    difference: 0,
    matchedTerms: 7,
    deviations: 1,
  },
  demoContractAnalysis: {
    totalClauses: 8,
    compliant: 7,
    deviations: 1,
    clauses: [
      { clause: "Basisløn (trin 8)", status: "compliant", detail: "36.178,01 kr./md — korrekt iht. standardforløbet (4→5→6→8)" },
      { clause: "Rådighedstillæg", status: "compliant", detail: "Angivet iht. bilag 6, pkt. 9" },
      { clause: "Pensionsbidrag", status: "compliant", detail: "Indbetaling til P+ angivet iht. AC-ovk. §10" },
      { clause: "Arbejdstid (37 timer)", status: "compliant", detail: "Korrekt iht. AC-overenskomsten" },
      { clause: "Opsigelsesvarsel (6 mdr.)", status: "compliant", detail: "Korrekt iht. funktionærloven §2 (>8 år og 7 mdr.)" },
      { clause: "Ferie (25 dage + særlige feriedage)", status: "compliant", detail: "Korrekt iht. Ferieaftalen (staten)" },
      { clause: "Uddannelse og kompetenceudvikling", status: "compliant", detail: "Korrekt iht. Kompetenceudviklingsaftalen" },
      { clause: "Pkt. 12: 120-dagesreglen", status: "deviation", detail: "Inkluderet i kontrakten — men eksplicit udelukket for AC-ansatte (AC-ovk. §20, cirk.bem.). Bestemmelsen er ugyldig og skal fjernes." },
    ],
  },

  contractIntelligence: {
    salaryComponents: [
      { label: "Basisløn", amount: 36178, sublabel: "Trin 8, nyt lønsystem" },
      { label: "Rådighedstillæg", amount: 4362, sublabel: "4.–6. års anciennitet" },
    ],
    totalPackage: 40540,
    pension: {
      totalPercent: 18.07,
      minimumPercent: 15.0,
      fritvalgPercent: 3.07,
      fritvalgMonthly: 1245,
      provider: "P+",
      components: [
        { label: "Pension af basisløn", percent: 18.07, monthly: 6537 },
        { label: "Pension af råd.tillæg", percent: 12.5, monthly: 545 },
      ],
    },
    careerSteps: [
      { date: "Sep 2019", label: "Trin 4", detail: "Ansat som fuldmægtig" },
      { date: "Sep 2021", label: "Trin 5", detail: "2 års anciennitet" },
      { date: "Sep 2023", label: "Trin 6", detail: "4 års anciennitet" },
      { date: "Sep 2025", label: "Trin 8 (sluttrin)", detail: "6 års anciennitet · Pension 18,07%", isCurrent: true },
      { date: "Næste MUS", label: "Kvalifikationstillæg?", detail: "Forhandling mulig ved næste MUS", isFuture: true },
    ],
    negotiationPoints: [
      { label: "Kvalifikationstillæg", status: "potential", detail: "0 kr aktuelt — markedsgennemsnit for fuldmægtige med 6+ år", benchmark: "2.000–4.500 kr/md" },
      { label: "Funktionstillæg", status: "potential", detail: "Relevant hvis du varetager særlige funktioner (fx sagsansvar, projektledelse)", benchmark: "1.500–3.000 kr/md" },
      { label: "Pension → fritvalg", status: "active", detail: "3,07%-point over minimumsgrænsen (15%) kan udbetales som løn", benchmark: "~1.245 kr/md" },
      { label: "Ekstra feriedage", status: "locked", detail: "Kræver lokal aftale — 5 særlige feriedage er standard" },
    ],
    termination: {
      isFunktionaer: true,
      anciennityStartDate: "2019-09-01",
      employerNoticePeriodMonths: 6,
      employeeNoticePeriodMonths: 1,
      severanceEligibleAfterYears: 12,
      severanceEligibleDate: "2031-09-01",
      scenarios: [
        {
          title: "Hvis du opsiger",
          noticePeriod: "1 måned til udgangen af en måned",
          legalBasis: "Funktionærloven §2, stk. 6",
          details: [
            { label: "Opsigelsesvarsel", value: "1 måned til udgangen af en måned", status: "info" },
            { label: "Feriepenge", value: "Optjent ferie udbetales ved fratræden", status: "info" },
            { label: "Pension", value: "P+ indbetaling stopper ved fratræden — kontakt P+ om overførsel", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Ingen — kun ved arbejdsgivers opsigelse", status: "warning" },
          ],
        },
        {
          title: "Hvis du bliver opsagt",
          noticePeriod: "6 måneder",
          legalBasis: "Funktionærloven §2, stk. 2 (6+ års anciennitet)",
          details: [
            { label: "Opsigelsesvarsel", value: "6 måneder (6+ års anciennitet)", status: "info" },
            { label: "Fritstilling", value: "Arbejdsgiver kan fritstille dig — du modtager fuld løn i hele opsigelsesperioden", status: "positive" },
            { label: "Modregning ved fritstilling", value: "Ny løn kan modregnes efter 3 måneder (funktionærloven §21)", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Kræver 12 års ansættelse (funktionærloven §2a) — du opnår ret i september 2031", status: "future" },
            { label: "120-dagesreglen", value: "Gælder IKKE for dig — eksplicit udelukket for AC-ansatte (AC-ovk. §20)", status: "positive" },
            { label: "Ferieafregning", value: "Optjent ferie + særlige feriedage afregnes ved fratræden", status: "info" },
          ],
          timeline: [
            { label: "Opsigelse modtaget", detail: "Skriftlig opsigelse fra arbejdsgiver", icon: "calendar" },
            { label: "Opsigelsesperiode (6 mdr.)", detail: "Fuld løn, pension og tillæg fortsætter", icon: "clock" },
            { label: "Evt. fritstilling", detail: "Modregning i ny løn efter 3 mdr.", icon: "briefcase" },
            { label: "Fratræden", detail: "Sidste arbejdsdag", icon: "shield" },
            { label: "Ferieafregning + pension", detail: "Optjent ferie udbetales, P+ opgøres", icon: "banknote" },
          ],
        },
      ],
      relatedFinding: "Pkt. 12: 120-dagesreglen",
    },
  },

  welcomeHeadline: "Er din pension beregnet korrekt?",
  welcomeSub: "Små fejl koster tusindvis hvert år",
  welcomeDescription:
    "AC-overenskomsten har skjult kompleksitet — to pensionssatser, anciennitetstrin på rådighedstillæg og ATP-sats der ofte registreres forkert. PayTjek finder de fejl du aldrig ville opdage selv.",
  ctaQuestion: "Får du den rigtige pensionssats?",
  authFeatures: [
    "Tjek pensionsprocent og rådighedstillæg automatisk",
    "Verificér at din kontrakt matcher AC-overenskomsten",
    "AI-rådgivning baseret på AC-overenskomsten (Medst.nr. 067-25)",
  ],

  pitchTagline: "Fra lønseddel til svar på 30 sekunder",
  pitchSub:
    "Upload lønsedlen — Ernest tjekker pension, rådighedstillæg og ATP mod AC-overenskomsten og finder de skjulte fejl der koster mest over tid.",

  persona: {
    firstName: "Sofie",
    name: "Sofie Kjær Andersen",
    jobTitle: "Fuldmægtig",
    employer: "Justitsministeriet",
    cvr: "39830000",
  },

  collectiveAgreement: "AC-overenskomsten (Medst.nr. 067-25)",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
  theme: {
    "--primary": "216 100% 40%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "220 88% 20%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "30 35% 83%",
    "--accent-foreground": "220 88% 18%",
    "--background": "0 0% 100%",
    "--foreground": "60 3% 11%",
    "--card": "30 25% 96%",
    "--card-foreground": "60 3% 11%",
    "--muted": "30 20% 92%",
    "--muted-foreground": "0 0% 35%",
    "--border": "30 15% 88%",
    "--ring": "216 100% 40%",
    "--font-heading": "'Plus Jakarta Sans', sans-serif",
    "--font-body": "'Plus Jakarta Sans', sans-serif",
  },

  payslip: DJOEF_DEC,
  validation: DJOEF_VAL_DEC,

  demoPayslips: {
    "oktober":  { payslip: DJOEF_OKT, validation: DJOEF_VAL_OKT },
    "november": { payslip: DJOEF_NOV, validation: DJOEF_VAL_NOV },
    "december": { payslip: DJOEF_DEC, validation: DJOEF_VAL_DEC },
  },
};

// ─── Lederne ──────────────────────────────────────────────────────────────────

const LEDERNE_PAYSLIP: PayslipData = {
  id: "ps-lederne-2025-10",
  userId: "demo-lederne",
  period: {
    month: "Oktober",
    year: 2025,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
  },
  employer: {
    name: "Novo Nordisk A/S",
    cvr: "24256790",
    department: "Supply Chain",
  },
  salary: {
    grundlon: 52000.00,
    timelon: 325.00,
    normalTimer: 160.00,
    beregnetTimelon: {
      udenTillaeg: 325.00,
      medTillaeg: 364.00,
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 0, sats: 0, beloeb: 0 },
  },
  deductions: {
    pension: { beloeb: 2920.00, procent: 5, grundlag: 58400.00 },
    skat: { beloeb: 19830.00, procent: 52 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 4672.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 0, timer: 0 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 64840.00, // grundlon 52000 + ledertillæg 4200 + funktionstillæg 2200 + bonus 6240 (forkert)
    nettolon: 22518.00,
    totalFradrag: 27521.00,
    totalTillaeg: 12600.00,
  },
  uploadedAt: "2025-11-01T09:00:00Z",
  analyzedAt: "2025-11-01T09:00:04Z",
};

const LEDERNE_VALIDATION: PayslipValidationResult = {
  id: "val-lederne-2025-10",
  payslipId: "ps-lederne-2025-10",
  status: "errors",
  discrepancies: [
    {
      id: "err-lederne-1",
      category: "salary",
      field: "grundlon",
      severity: "error",
      expected: 7008.00,  // 12% af totalløn 58.400
      actual: 6240.00,    // 12% af grundløn 52.000
      difference: -768.00,
      description:
        "Månedlig bonus beregnet på grundløn (52.000 kr.) i stedet for totalløn inkl. faste tillæg (58.400 kr.). Bonusgrundlaget er forkert.",
      calculation:
        "Regel: Lederkontrakt §4.2 — Bonus beregnes på baggrund af samlet fast løn inkl. faste tillæg. Forventet: 12% × 58.400 kr = 7.008 kr. Faktisk: 12% × 52.000 kr = 6.240 kr. Difference: -768 kr/md = -9.216 kr/år",
      suggestion:
        "Kontakt HR hos Novo Nordisk og henvis til lederkontrakt §4.2. Bonusgrundlaget skal inkludere ledertillæg (4.200 kr.) og funktionstillæg (2.200 kr.) = totalløn 58.400 kr. Du mangler 768 kr/md svarende til 9.216 kr/år.",
    },
  ],
  summary: { totalDifference: -768.00, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2025-11-01T09:00:04Z",
};

export const LEDERNE_CONFIG: UnionDemoConfig = {
  id: "lederne",
  name: "Lederne",
  fullName: "Lederne",
  primaryColor: "#185848",
  secondaryColor: "#2E7D62",
  bgColor: "#F0F7F4",
  logo: lederneLogo,

  demoProfile: "contract" as DemoProfile,
  demoContractComparison: {
    agreedMonthly: 64840,
    paidMonthly: 64072,
    difference: -768,
    matchedTerms: 4,
    deviations: 1,
  },
  demoContractAnalysis: {
    totalClauses: 8,
    compliant: 7,
    deviations: 1,
    clauses: [
      { clause: "Grundløn", status: "compliant", detail: "52.000 kr. — korrekt udbetalt" },
      { clause: "Ledertillæg", status: "compliant", detail: "4.200 kr. — korrekt udbetalt" },
      { clause: "Funktionstillæg", status: "compliant", detail: "2.200 kr. — korrekt udbetalt" },
      { clause: "Bonus (12% af samlet fast løn)", status: "deviation", detail: "Beregnet på grundløn 52.000 i stedet for totalløn 58.400 — mangler 768 kr/md" },
      { clause: "Pension (15% af totalløn)", status: "compliant", detail: "8.760 kr. — korrekt indbetalt" },
      { clause: "Firmabil (beskatningsværdi)", status: "compliant", detail: "Indberettet korrekt" },
      { clause: "Opsigelsesvarsel (12 mdr.)", status: "compliant", detail: "Registreret korrekt" },
      { clause: "Konkurrenceklausul (kompensation)", status: "compliant", detail: "Vilkår opfyldt iht. funktionærloven" },
    ],
  },

  contractIntelligence: {
    salaryComponents: [
      { label: "Grundløn", amount: 52000 },
      { label: "Ledertillæg", amount: 4200 },
      { label: "Funktionstillæg", amount: 2200, sublabel: "Supply Chain" },
      { label: "Bonus (12%)", amount: 7008, sublabel: "Af samlet fast løn" },
    ],
    totalPackage: 65408,
    pension: {
      totalPercent: 15.0,
      minimumPercent: 12.0,
      fritvalgPercent: 3.0,
      fritvalgMonthly: 1752,
      provider: "PFA Pension",
      components: [
        { label: "Pension af totalløn", percent: 15.0, monthly: 8760 },
      ],
    },
    careerSteps: [
      { date: "Jan 2020", label: "Teamleder", detail: "Ansat i Supply Chain" },
      { date: "Mar 2022", label: "Afdelingsleder", detail: "Forfremmet, ledertillæg tilføjet" },
      { date: "Jan 2024", label: "Funktionstillæg", detail: "Ansvar for Nordics-logistik", isCurrent: true },
      { date: "Næste revision", label: "Lønforhandling 2026", detail: "Benchmark: +5–8% for tilsvarende roller", isFuture: true },
    ],
    negotiationPoints: [
      { label: "Bonusgrundlag", status: "active", detail: "Skal beregnes af samlet fast løn (58.400 kr), ikke kun grundløn", benchmark: "Difference: 768 kr/md" },
      { label: "Pensionssats", status: "potential", detail: "15% er standard — ledere i tilsvarende roller har typisk 17–20%", benchmark: "17–20%" },
      { label: "Firmabil-beskatning", status: "active", detail: "Nuværende ordning korrekt indberettet" },
      { label: "Resultatbonus", status: "potential", detail: "Kan forhandles oven i fast bonus ved næste revisionsrunde", benchmark: "5–15% af årsløn" },
    ],
    termination: {
      isFunktionaer: true,
      anciennityStartDate: "2020-01-06",
      employerNoticePeriodMonths: 12,
      employeeNoticePeriodMonths: 1,
      severanceEligibleAfterYears: 12,
      severanceEligibleDate: "2032-01-06",
      scenarios: [
        {
          title: "Hvis du opsiger",
          noticePeriod: "1 måned til udgangen af en måned",
          legalBasis: "Funktionærloven §2, stk. 6",
          details: [
            { label: "Opsigelsesvarsel", value: "1 måned til udgangen af en måned", status: "info" },
            { label: "Konkurrenceklausul", value: "Træder i kraft ved din opsigelse — kompensation iht. funktionærloven §18a", status: "warning" },
            { label: "Firmabil", value: "Skal afleveres ved fratræden — beskatning stopper", status: "info" },
            { label: "Bonus", value: "Forholdsmæssig andel af årlig bonus udbetales", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Ingen — kun ved arbejdsgivers opsigelse", status: "warning" },
          ],
        },
        {
          title: "Hvis du bliver opsagt",
          noticePeriod: "12 måneder",
          legalBasis: "Lederkontrakt §9 (udvidet varsel)",
          details: [
            { label: "Opsigelsesvarsel", value: "12 måneder (individuelt aftalt i lederkontrakt)", status: "info" },
            { label: "Fritstilling", value: "Arbejdsgiver kan fritstille dig — fuld løn inkl. tillæg i hele perioden", status: "positive" },
            { label: "Firmabil", value: "Kan beholdes i opsigelsesperioden (beskatning fortsætter)", status: "info" },
            { label: "Bonus i opsigelsesperioden", value: "Fuld bonus i opsigelsesperioden — forholdsmæssig andel ved fratræden", status: "positive" },
            { label: "Konkurrenceklausul", value: "Gælder også ved arbejdsgivers opsigelse — 50% kompensation i klausulperioden", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Kræver 12 års ansættelse (funktionærloven §2a) — du opnår ret i januar 2032", status: "future" },
            { label: "Pension", value: "PFA-indbetaling fortsætter i hele opsigelsesperioden", status: "positive" },
          ],
          timeline: [
            { label: "Opsigelse modtaget", detail: "Skriftlig opsigelse fra arbejdsgiver", icon: "calendar" },
            { label: "Opsigelsesperiode (12 mdr.)", detail: "Fuld løn, bonus, pension og firmabil fortsætter", icon: "clock" },
            { label: "Evt. fritstilling", detail: "Modregning i ny løn efter 3 mdr.", icon: "briefcase" },
            { label: "Konkurrenceklausul aktiveres", detail: "Kompensation 50% af løn i klausulperioden", icon: "alert" },
            { label: "Fratræden", detail: "Sidste arbejdsdag", icon: "shield" },
            { label: "Slutafregning", detail: "Bonus, ferie, pension opgøres", icon: "banknote" },
          ],
        },
      ],
    },
  },

  welcomeHeadline: "Leverer din arbejdsgiver det aftalte?",
  welcomeSub: "PayTjek er din personlige lønrevisor",
  welcomeDescription:
    "Ledere har komplekse lønpakker med bonus, pension og tillæg. Hvem tjekker at arbejdsgiveren leverer det der blev aftalt?",
  ctaQuestion: "Er din bonus beregnet korrekt?",
  authFeatures: [
    "Verificér at din forhandlede kontrakt overholdes",
    "Tjek bonusgrundlag, pensionssatser og tillæg",
    "AI-rådgivning baseret på din individuelle lederkontrakt",
  ],

  pitchTagline: "Din kontrakt er aftalt — PayTjek tjekker den",
  pitchSub:
    "Upload lønsedlen — Ernest matcher hvert vilkår i din lederkontrakt mod den faktiske udbetaling og finder det der mangler.",

  persona: {
    firstName: "Thomas",
    name: "Thomas Berg",
    jobTitle: "Afdelingsleder, Supply Chain",
    employer: "Novo Nordisk A/S",
    cvr: "24256790",
  },

  collectiveAgreement: "Individuel lederkontrakt (Lederaftalen)",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap",
  theme: {
    "--primary": "160 57% 22%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "160 46% 34%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "150 30% 95%",
    "--accent-foreground": "160 57% 18%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "150 20% 97%",
    "--card-foreground": "0 0% 10%",
    "--muted": "150 10% 94%",
    "--muted-foreground": "0 0% 38%",
    "--border": "150 10% 90%",
    "--ring": "160 57% 22%",
    "--font-heading": "'Outfit', sans-serif",
    "--font-body": "'Outfit', sans-serif",
  },

  payslip: LEDERNE_PAYSLIP,
  validation: LEDERNE_VALIDATION,
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const UNION_CONFIGS: Record<UnionId, UnionDemoConfig> = {
  hk: HK_CONFIG,
  foa: FOA_CONFIG,
  "3f": THREEF_CONFIG,
  djoef: DJOEF_CONFIG,
  lederne: LEDERNE_CONFIG,
};

export function getUnionConfig(id: string): UnionDemoConfig {
  return UNION_CONFIGS[id as UnionId] ?? HK_CONFIG;
}
