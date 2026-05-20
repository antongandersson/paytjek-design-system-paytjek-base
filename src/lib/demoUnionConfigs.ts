import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";
import foaLogo from "@/assets/foa-logo.png";
import hkLogo from "@/assets/hk-logo.png";
import threeFLogo from "@/assets/3f-logo.png";
import djoefLogo from "@/assets/djoef-logo.png";
import lederneLogo from "@/assets/lederne-logo.png";
import sefLogo from "@/assets/sef-logo.png";

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

export type DemoProfile = "agreement" | "contract" | "contract-only";

export interface DemoContractComparison {
  agreedMonthly: number;
  paidMonthly: number;
  difference: number;
  matchedTerms: number;
  deviations: number;
}

export interface DemoContractClause {
  clause: string;
  status: "compliant" | "deviation" | "missing";
  detail: string;
}

export interface DemoContractAnalysis {
  totalClauses: number;
  compliant: number;
  deviations: number;
  clauses: DemoContractClause[];
}

// ─── Dine Rettigheder ────────────────────────────────────────────────────────

export interface RightsItem {
  text: string;
  reference?: string;
}

export interface RightsSection {
  title: string;
  icon: "money" | "health" | "vacation" | "education" | "protection" | "conditions";
  items: RightsItem[];
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
  rights?: RightsSection[];
}

// ─── Config interface ─────────────────────────────────────────────────────────

export type UnionId = "hk" | "foa" | "djoef" | "3f" | "lederne" | "sef" | "sef-kontrakt";

export interface UnionDemoConfig {
  id: UnionId;
  name: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  logo: string;
  supportPhone?: string;

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
      { date: "Sep 2019", label: "Trin 4", detail: "Ansat som fuldmægtig (to-årigt trin)" },
      { date: "Sep 2021", label: "Trin 5", detail: "2 års anciennitet" },
      { date: "Sep 2022", label: "Trin 6", detail: "3 års anciennitet" },
      { date: "Sep 2023", label: "Trin 8 (sluttrin)", detail: "4 års anciennitet · Pension 18,07%", isCurrent: true },
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
    "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800;900&display=swap",
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
    "--font-heading": "'Source Sans 3', sans-serif",
    "--font-body": "'Source Sans 3', sans-serif",
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
// Persona: Thomas Vestergaard, Produktionschef, NordicSteel A/S
// Lederaftalen (DA + Ledernes Hovedorganisation), 3. udgave, 1. feb 2007
// Funktionærkontrakt for ledere/betroede medarbejdere (Lederne-skabelon)
// Fejlene:
//   K-1: Pension uden AG/eget-split og uden PFA Lederpension (transparensfejl, 0 kr)
//   K-3: Ferietillæg 1% af grundløn i stedet for 2% af ferieberettiget løn (tab 9.792 kr/år)
//   K-7: Konkurrenceklausul uden kompensation (ugyldig, potentielt 326.400 kr)
// Lønsedler marts–maj 2025:
//   Marts: Bonus-måned (A-indkomst 159.660) + pension-split mangler
//   April: Normal måned (A-indkomst 78.060) + pension-split mangler
//   Maj:   Ferietillæg forkert (8.160 vs. 17.952) + pension-split mangler
// Ferieberettiget løn = grundløn + bonus = 897.600 kr/år (personalegoder indgår IKKE)

const LEDERNE_EMPLOYER = { name: "NordicSteel A/S", cvr: "31456789", department: "Produktion" };
const LEDERNE_ABSENCE = { sygdom: { dage: 0, timer: 0 }, ferie: { dage: 0, timer: 0 }, afspadsering: { dage: 0, timer: 0 }, barnsSygdom: { dage: 0, timer: 0 } };
const LEDERNE_ZERO_SUPP = { timer: 0, sats: 0, beloeb: 0 };

// ── Marts 2025 (bonus-måned, A-indkomst 159.660 kr) ──
const LEDERNE_MARTS: PayslipData = {
  id: "ps-lederne-2025-03",
  userId: "demo-lederne",
  period: { month: "Marts", year: 2025, startDate: "2025-03-01", endDate: "2025-03-31" },
  employer: LEDERNE_EMPLOYER,
  salary: {
    grundlon: 68000.00,
    timelon: 425.00,
    normalTimer: 160.00,
    beregnetTimelon: { udenTillaeg: 425.00, medTillaeg: 997.88, afvigelse: 0, status: "ok" as const },
  },
  supplements: {
    aftentillaeg: LEDERNE_ZERO_SUPP,
    nattillaeg: LEDERNE_ZERO_SUPP,
    soenHelligdag: LEDERNE_ZERO_SUPP,
  },
  deductions: {
    pension: { beloeb: 3400.00, procent: 5, grundlag: 68000.00 },
    skat: { beloeb: 55797.00, procent: 38 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 12772.80, procent: 8 },
  },
  absence: LEDERNE_ABSENCE,
  totals: {
    bruttolon: 159660.00, // A-indkomst: kontant løn 149.600 + personalegoder 10.060
    nettolon: 77531.20, // Kontant løn 149.600 - fradrag 72.068,80
    totalFradrag: 72068.80, // AM 12.772,80 + skat 55.797 + pension 3.400 + ATP 99
    totalTillaeg: 81600.00, // bonus 81.600
  },
  personalegoder: [
    { label: "Fri bil (BMW 330e)", beloeb: 9760.00 },
    { label: "Fri telefon", beloeb: 300.00 },
  ],
  kontantLon: 149600.00, // grundløn 68.000 + bonus 81.600
  uploadedAt: "2025-04-01T08:00:00Z",
  analyzedAt: "2025-04-01T08:00:04Z",
};

const LEDERNE_VAL_MARTS: PayslipValidationResult = {
  id: "val-lederne-2025-03",
  payslipId: "ps-lederne-2025-03",
  status: "warnings",
  discrepancies: [{
    id: "err-lederne-mar-1",
    category: "deduction",
    field: "pension",
    severity: "warning",
    expected: 3400.00,
    actual: 3400.00,
    difference: 0,
    description: "Pension vist som ét samlet beløb \"15%\" — kontrakten mangler AG/eget-fordeling (10%/5%) og pensionskasse (PFA Lederpension). Lederaftalen §5 stk. 1, §7 stk. 5 og stk. 7.",
    calculation: "Regel: Lederaftalen §5 stk. 1 (aftalen skal tage stilling til pensionsordning) + §7 stk. 5 (skal fremgå af aftalen) + §7 stk. 7 (PFA Lederpension som default). Korrekt: AG 10% = 6.800 kr. + eget 5% = 3.400 kr. = samlet 10.200 kr. til PFA Lederpension. Faktisk vist: 'Pension 15% = 10.200 kr.' uden specifikation.",
    suggestion: "Kontakt lønadministrationen hos NordicSteel A/S og bed om at lønsedlen viser pension-split (10% AG / 5% eget) samt angiver PFA Lederpension som modtager. Beløbet er korrekt — det er transparensen der mangler.",
  }],
  summary: { totalDifference: 0, issuesCount: 0, warningsCount: 1 },
  validatedAt: "2025-04-01T08:00:04Z",
};

// ── April 2025 (normal måned, A-indkomst 78.060 kr) ──
const LEDERNE_APRIL: PayslipData = {
  id: "ps-lederne-2025-04",
  userId: "demo-lederne",
  period: { month: "April", year: 2025, startDate: "2025-04-01", endDate: "2025-04-30" },
  employer: LEDERNE_EMPLOYER,
  salary: {
    grundlon: 68000.00,
    timelon: 425.00,
    normalTimer: 160.00,
    beregnetTimelon: { udenTillaeg: 425.00, medTillaeg: 487.88, afvigelse: 0, status: "ok" as const },
  },
  supplements: {
    aftentillaeg: LEDERNE_ZERO_SUPP,
    nattillaeg: LEDERNE_ZERO_SUPP,
    soenHelligdag: LEDERNE_ZERO_SUPP,
  },
  deductions: {
    pension: { beloeb: 3400.00, procent: 5, grundlag: 68000.00 },
    skat: { beloeb: 22190.00, procent: 38 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 6244.80, procent: 8 },
  },
  absence: LEDERNE_ABSENCE,
  totals: {
    bruttolon: 78060.00, // A-indkomst: kontant løn 68.000 + personalegoder 10.060
    nettolon: 36066.20, // Kontant løn 68.000 - fradrag 31.933,80
    totalFradrag: 31933.80, // AM 6.244,80 + skat 22.190 + pension 3.400 + ATP 99
    totalTillaeg: 0, // ingen kontante tillæg i april
  },
  personalegoder: [
    { label: "Fri bil (BMW 330e)", beloeb: 9760.00 },
    { label: "Fri telefon", beloeb: 300.00 },
  ],
  kontantLon: 68000.00, // kun grundløn
  uploadedAt: "2025-05-01T08:00:00Z",
  analyzedAt: "2025-05-01T08:00:04Z",
};

const LEDERNE_VAL_APRIL: PayslipValidationResult = {
  id: "val-lederne-2025-04",
  payslipId: "ps-lederne-2025-04",
  status: "warnings",
  discrepancies: [{
    id: "err-lederne-apr-1",
    category: "deduction",
    field: "pension",
    severity: "warning",
    expected: 3400.00,
    actual: 3400.00,
    difference: 0,
    description: "Pension vist som ét samlet beløb \"15%\" — kontrakten mangler AG/eget-fordeling (10%/5%) og pensionskasse (PFA Lederpension). Lederaftalen §5 stk. 1, §7 stk. 5 og stk. 7.",
    calculation: "Regel: Lederaftalen §5 stk. 1 (aftalen skal tage stilling til pensionsordning) + §7 stk. 5 (skal fremgå af aftalen) + §7 stk. 7 (PFA Lederpension som default). Korrekt: AG 10% = 6.800 kr. + eget 5% = 3.400 kr. = samlet 10.200 kr. til PFA Lederpension.",
    suggestion: "Kontakt lønadministrationen hos NordicSteel A/S og bed om at lønsedlen viser pension-split (10% AG / 5% eget) samt angiver PFA Lederpension som modtager.",
  }],
  summary: { totalDifference: 0, issuesCount: 0, warningsCount: 1 },
  validatedAt: "2025-05-01T08:00:04Z",
};

// ── Maj 2025 (ferietillæg-måned — ERROR: 1% af grundløn i stedet for 2% af ferieberettiget) ──
const LEDERNE_MAJ: PayslipData = {
  id: "ps-lederne-2025-05",
  userId: "demo-lederne",
  period: { month: "Maj", year: 2025, startDate: "2025-05-01", endDate: "2025-05-31" },
  employer: LEDERNE_EMPLOYER,
  salary: {
    grundlon: 68000.00,
    timelon: 425.00,
    normalTimer: 160.00,
    beregnetTimelon: { udenTillaeg: 425.00, medTillaeg: 538.88, afvigelse: 0, status: "ok" as const },
  },
  supplements: {
    aftentillaeg: LEDERNE_ZERO_SUPP,
    nattillaeg: LEDERNE_ZERO_SUPP,
    soenHelligdag: LEDERNE_ZERO_SUPP,
  },
  deductions: {
    pension: { beloeb: 3400.00, procent: 5, grundlag: 68000.00 },
    skat: { beloeb: 22063.40, procent: 38 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 6897.60, procent: 8 },
  },
  absence: LEDERNE_ABSENCE,
  totals: {
    bruttolon: 86220.00, // A-indkomst: kontant løn 76.160 + personalegoder 10.060
    nettolon: 43700.00, // Kontant løn 76.160 - fradrag 32.460
    totalFradrag: 32460.00, // AM 6.897,60 + skat 22.063,40 + pension 3.400 + ATP 99
    totalTillaeg: 8160.00, // ferietillæg 8.160 (FORKERT — skulle være 17.952)
  },
  personalegoder: [
    { label: "Fri bil (BMW 330e)", beloeb: 9760.00 },
    { label: "Fri telefon", beloeb: 300.00 },
  ],
  kontantLon: 76160.00, // grundløn 68.000 + ferietillæg 8.160
  uploadedAt: "2025-06-01T08:00:00Z",
  analyzedAt: "2025-06-01T08:00:04Z",
};

const LEDERNE_VAL_MAJ: PayslipValidationResult = {
  id: "val-lederne-2025-05",
  payslipId: "ps-lederne-2025-05",
  status: "errors",
  discrepancies: [
    {
      id: "err-lederne-maj-1",
      category: "deduction",
      field: "pension",
      severity: "warning",
      expected: 3400.00,
      actual: 3400.00,
      difference: 0,
      description: "Pension vist som ét samlet beløb \"15%\" — kontrakten mangler AG/eget-fordeling (10%/5%) og pensionskasse (PFA Lederpension). Lederaftalen §5 stk. 1, §7 stk. 5 og stk. 7.",
      calculation: "Korrekt: AG 10% = 6.800 kr. + eget 5% = 3.400 kr. = samlet 10.200 kr. til PFA Lederpension.",
      suggestion: "Bed lønadministrationen om at vise pension-split og angive PFA Lederpension som modtager.",
    },
    {
      id: "err-lederne-maj-2",
      category: "supplement",
      field: "ferietillaeg",
      severity: "error",
      expected: 17952.00,
      actual: 8160.00,
      difference: -9792.00,
      description: "Ferietillæg — udbetalingsfejl. Kontrakten lover 2% af ferieberettiget løn (17.952 kr./år). Lønsedlen udbetaler kun 1% af grundløn (8.160 kr.). Difference: 9.792 kr.",
      calculation: "Reference: Kontraktens pkt. 7.1. Ferieberettiget løn: grundløn 816.000 + realiseret bonus 81.600 = 897.600 kr./år. Korrekt: 2% × 897.600 = 17.952 kr. Faktisk udbetalt: 1% × 816.000 = 8.160 kr. Ferieloven §16 + §18 stk. 2.",
      suggestion: "Kontakt lønadministrationen hos NordicSteel A/S og henvis til kontraktens pkt. 7.1. Ferietillægget skal beregnes som 2% af den ferieberettigede løn (grundløn + bonus). Du mangler 9.792 kr. i efterbetaling.",
    },
  ],
  summary: { totalDifference: -9792.00, issuesCount: 1, warningsCount: 1 },
  validatedAt: "2025-06-01T08:00:04Z",
};

export const LEDERNE_CONFIG: UnionDemoConfig = {
  id: "lederne",
  name: "Lederne",
  fullName: "Lederne",
  primaryColor: "#185848",
  secondaryColor: "#2E7D62",
  bgColor: "#F0F7F4",
  logo: lederneLogo,
  supportPhone: "32 83 32 83",

  demoProfile: "contract" as DemoProfile,
  demoContractComparison: {
    agreedMonthly: 78060,
    paidMonthly: 78060,
    difference: 0,
    matchedTerms: 8,
    deviations: 2,
  },
  demoContractAnalysis: {
    totalClauses: 10,
    compliant: 8,
    deviations: 2,
    clauses: [
      { clause: "Grundløn 68.000 kr./md", status: "compliant", detail: "Korrekt udbetalt" },
      { clause: "Bonus (op til 15% af grundløn)", status: "compliant", detail: "10% realiseret = 81.600 kr./år — korrekt udbetalt i marts" },
      { clause: "Pension (15% samlet)", status: "deviation", detail: "Beløb korrekt, men kontrakten angiver ikke AG/eget-fordeling (10%/5%) og nævner ikke PFA Lederpension — jf. Lederaftalen §5 stk. 1, §7 stk. 5 og stk. 7" },
      { clause: "Personalegoder (fri bil + telefon)", status: "compliant", detail: "BMW 330e + fri telefon — beskatningsværdi korrekt indberettet" },
      { clause: "Arbejdstid (37 timer/uge)", status: "compliant", detail: "Korrekt iht. kontrakten" },
      { clause: "Ferie (5 uger med løn)", status: "compliant", detail: "Korrekt iht. ferieloven" },
      { clause: "Ferietillæg", status: "compliant", detail: "2% af ferieberettiget løn jf. kontraktens pkt. 7.1 — kontraktsvilkår overholder ferielovens §18 stk. 2 (min. 1%)" },
      { clause: "Opsigelse (funktionærloven + 3 mdr.)", status: "compliant", detail: "9 mdr. fra AG (6 mdr. funktionærloven + 3 mdr. forlænget) — korrekt" },
      { clause: "Konkurrenceklausul (12 mdr.)", status: "deviation", detail: "Ingen kompensationsbestemmelse — klausulen er ugyldig uden min. 40% kompensation jf. lov om ansættelsesklausuler §8 stk. 1" },
      { clause: "Barsel (fuld løn)", status: "compliant", detail: "4 uger før + 14 uger barsel + 12 uger forældreorlov — korrekt" },
    ],
  },

  contractIntelligence: {
    salaryComponents: [
      { label: "Grundløn", amount: 68000 },
      { label: "Fri bil (skatteværdi)", amount: 9760, sublabel: "BMW 330e, nyvogn 550.000 kr." },
      { label: "Fri telefon (skatteværdi)", amount: 300, sublabel: "Multimediabeskatning" },
      { label: "Bonus (10% realiseret)", amount: 6800, sublabel: "Op til 15% af grundløn, udbetalt i marts" },
    ],
    totalPackage: 84860,
    pension: {
      totalPercent: 15.0,
      minimumPercent: 10.0,
      fritvalgPercent: 0,
      fritvalgMonthly: 0,
      provider: "PFA Lederpension",
      components: [
        { label: "Arbejdsgiverbidrag", percent: 10.0, monthly: 6800 },
        { label: "Egetbidrag", percent: 5.0, monthly: 3400 },
      ],
    },
    careerSteps: [
      { date: "Mar 2012", label: "Produktionschef", detail: "Ansat hos NordicSteel A/S (kilde: ansættelseskontrakt)", isCurrent: true },
      { date: "2012", label: "Lederne-medlem", detail: "Aftaledækning: Lederaftalen (DA + Lederne)" },
      { date: "1. jan 2026", label: "Næste lønregulering", detail: "Jf. Lederaftalen §6 stk. 3 og kontraktens pkt. 3.2", isFuture: true },
    ],
    negotiationPoints: [
      { label: "Pensionssats", status: "potential", detail: "Din nuværende sats er 15% (10% AG + 5% eget). Ledere på dit niveau har typisk 17–20%. Næste forhandling: 1. januar 2026", benchmark: "Kilde: Lederne lønstatistik 2024" },
      { label: "Fratrædelsesgodtgørelse (Lederaftalen §12)", status: "potential", detail: "Når du fylder 50 år (juli 2032), aktiveres ret til 3 mdrs. ekstra godtgørelse ved opsigelse — du har allerede de krævede 10 års anciennitet", benchmark: "Aktiveres jul 2032" },
    ],
    termination: {
      isFunktionaer: true,
      anciennityStartDate: "2012-03-01",
      employerNoticePeriodMonths: 9,
      employeeNoticePeriodMonths: 1,
      severanceEligibleAfterYears: 12,
      severanceEligibleDate: "2024-03-01",
      scenarios: [
        {
          title: "Hvis du opsiger",
          noticePeriod: "1 måned til udgangen af en måned",
          legalBasis: "Funktionærloven §2, stk. 6",
          details: [
            { label: "Opsigelsesvarsel", value: "1 måned til udgangen af en måned", status: "info" },
            { label: "Konkurrenceklausul", value: "Klausulen er ugyldig uden kompensation (§7 i lov om ansættelsesklausuler) — du er IKKE bundet", status: "positive" },
            { label: "Firmabil", value: "Skal afleveres ved fratræden — beskatning stopper", status: "info" },
            { label: "Bonus", value: "Forholdsmæssig andel af årlig bonus udbetales ved fratræden", status: "info" },
            { label: "Pension", value: "PFA Lederpension-indbetaling stopper ved fratræden", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Ingen ved egen opsigelse", status: "warning" },
          ],
        },
        {
          title: "Hvis du bliver opsagt",
          noticePeriod: "9 måneder (6 mdr. funktionærloven + 3 mdr. forlænget)",
          legalBasis: "Funktionærloven §2, stk. 2 + kontrakt §9.1 (forlænget 3 mdr.)",
          details: [
            { label: "Opsigelsesvarsel", value: "9 måneder (funktionærlovens 6 mdr. + kontraktens 3 mdr. forlængelse)", status: "info" },
            { label: "Fritstilling", value: "Ret til fritstilling ved AG-opsigelse (kontrakt §9.2) — fuld løn inkl. personalegoder", status: "positive" },
            { label: "Firmabil", value: "Beholdes i opsigelsesperioden (beskatning fortsætter)", status: "info" },
            { label: "Bonus i opsigelsesperioden", value: "Fuld bonus beregnes for hele opsigelsesperioden", status: "positive" },
            { label: "Konkurrenceklausul", value: "Ugyldig uden kompensation — binder dig IKKE uanset opsigelsesform", status: "positive" },
            { label: "Fratrædelsesgodtgørelse (funktionærloven §2a)", value: "Du har 13+ års anciennitet — ret til 3 mdrs. løn ved opsigelse", status: "positive" },
            { label: "Fratrædelsesgodtgørelse (Lederaftalen §12)", value: "Kræver 50+ år OG 10+ års anciennitet — du opfylder anciennitet men er 43 år. Ret opnås ved 50 år (2032)", status: "future" },
            { label: "Pension", value: "PFA Lederpension-indbetaling fortsætter i hele opsigelsesperioden", status: "positive" },
          ],
          timeline: [
            { label: "Opsigelse modtaget", detail: "Skriftlig opsigelse fra NordicSteel A/S", icon: "calendar" },
            { label: "Opsigelsesperiode (9 mdr.)", detail: "Fuld løn, pension, firmabil og personalegoder fortsætter", icon: "clock" },
            { label: "Evt. fritstilling", detail: "Ret til fritstilling jf. kontrakt §9.2 — modregning i ny løn efter 3 mdr.", icon: "briefcase" },
            { label: "Fratrædelsesgodtgørelse", detail: "3 mdrs. løn (funktionærloven §2a, 12+ års anciennitet)", icon: "banknote" },
            { label: "Fratræden", detail: "Sidste arbejdsdag — firmabil afleveres", icon: "shield" },
            { label: "Slutafregning", detail: "Bonus, feriepenge, ferietillæg og pension opgøres", icon: "banknote" },
          ],
        },
      ],
      relatedFinding: "Konkurrenceklausul (K-7)",
    },
  },

  welcomeHeadline: "Leverer din arbejdsgiver det aftalte?",
  welcomeSub: "PayTjek tjekker din lederkontrakt",
  welcomeDescription:
    "Ledere har komplekse lønpakker med bonus, personalegoder og pension. Hvem tjekker at kontrakten er korrekt — og at arbejdsgiveren leverer det der blev aftalt?",
  ctaQuestion: "Er din kontrakt og løn korrekt?",
  authFeatures: [
    "Verificér at din lederkontrakt overholder Lederaftalen",
    "Tjek ferietillæg, pensionssplit og personalegoder",
    "AI-rådgivning baseret på din individuelle kontrakt",
  ],

  pitchTagline: "Din kontrakt er aftalt — PayTjek tjekker den",
  pitchSub:
    "Upload lønsedlen — Ernest matcher hvert vilkår i din lederkontrakt mod den faktiske udbetaling og finder det der koster dig penge.",

  persona: {
    firstName: "Thomas",
    name: "Thomas Vestergaard",
    jobTitle: "Produktionschef",
    employer: "NordicSteel A/S",
    cvr: "31456789",
  },

  collectiveAgreement: "Lederaftalen (DA + Ledernes Hovedorganisation)",

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

  payslip: LEDERNE_MAJ,
  validation: LEDERNE_VAL_MAJ,

  demoPayslips: {
    "marts":  { payslip: LEDERNE_MARTS, validation: LEDERNE_VAL_MARTS },
    "april":  { payslip: LEDERNE_APRIL, validation: LEDERNE_VAL_APRIL },
    "maj":    { payslip: LEDERNE_MAJ, validation: LEDERNE_VAL_MAJ },
  },
};

// ─── Serviceforbundet / VSL ───────────────────────────────────────────────────
// Persona: Mikkel Brandt, Vagtassistent (kontrolcentral), Securitas A/S
// Brancheoverenskomst for vagtassistenter 2025-2028 (DI nr. 854609)
// DI Overenskomst II × Serviceforbundet for VSL
// Fejlene eskalerer over Q1 2026:
//   Januar:  Gammel lørdagstillægssats (32,80 i stedet for 34,16 kr/t)
//   Februar: Gammel pensionssats (12% i stedet for 13%)
//   Marts:   Manglende stigning i særlig opsparing (9% i stedet for 10%)

const SEF_EMPLOYER = { name: "Securitas A/S", cvr: "17565844", department: "Kontrolcentral, Ballerup" };
const SEF_ABSENCE = { sygdom: { dage: 0, timer: 0 }, ferie: { dage: 0, timer: 0 }, afspadsering: { dage: 0, timer: 0 }, barnsSygdom: { dage: 0, timer: 0 } };

// Korrekt januar 2026 lønseddel (baseline)
const SEF_JAN_CORRECT: PayslipData = {
  id: "ps-sef-2026-01-ok",
  userId: "demo-sef",
  period: { month: "Januar", year: 2026, startDate: "2026-01-01", endDate: "2026-01-31" },
  employer: SEF_EMPLOYER,
  salary: {
    grundlon: 32195.13,
    timelon: 200.80,
    normalTimer: 154.12,
    beregnetTimelon: { udenTillaeg: 200.80, medTillaeg: 207.83, afvigelse: 0, status: "ok" },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 8, sats: 51.44, beloeb: 411.52 },
    lordagstillaeg: { timer: 16, sats: 34.16, beloeb: 546.56 },
  },
  deductions: {
    pension: { beloeb: 683.63, procent: 2.0, grundlag: 34181.49 },
    skat: { beloeb: 8833.85, procent: 38 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 2734.52, procent: 8 },
  },
  absence: SEF_ABSENCE,
  totals: {
    bruttolon: 34280.49,
    nettolon: 22613.12,
    totalFradrag: 11667.37,
    totalTillaeg: 2085.36,
  },
  uploadedAt: "2026-02-01T08:00:00Z",
  analyzedAt: "2026-02-01T08:00:04Z",
};

// FEJL 1: Gammel lørdagstillægssats (32,80 i stedet for 34,16 kr/t)
const SEF_JAN_ERROR1: PayslipData = {
  ...SEF_JAN_CORRECT,
  id: "ps-sef-2026-01-err1",
  supplements: {
    ...SEF_JAN_CORRECT.supplements,
    lordagstillaeg: { timer: 16, sats: 32.80, beloeb: 524.80 },
  },
  totals: { bruttolon: 34258.73, nettolon: 22598.36, totalFradrag: 11660.37, totalTillaeg: 2063.60 },
};

const SEF_VAL_ERROR1: PayslipValidationResult = {
  id: "val-sef-err1",
  payslipId: "ps-sef-2026-01-err1",
  status: "errors",
  discrepancies: [{
    id: "err-sef-1",
    category: "supplement",
    field: "lordagstillaeg",
    severity: "error",
    expected: 546.56,
    actual: 524.80,
    difference: -21.76,
    description: "Lørdagstillægget er beregnet med den gamle sats 32,80 kr/t — men den korrekte sats fra 1. maj 2025 er 34,16 kr/t. Lønsystemet har ikke fået satsopdateringen.",
    calculation: "Regel: Brancheoverenskomst for vagtassistenter §7, stk. 1 — Genetillæg lørdag kl. 14:00–mandag kl. 06:00. Sats pr. 01.05.2025: 34,16 kr/t. Forventet: 16t × 34,16 = 546,56 kr. Faktisk: 16t × 32,80 = 524,80 kr.",
    suggestion: "Kontakt lønadministrationen hos Securitas A/S og henvis til vagtassistentoverenskomsten §7, stk. 1. Lørdagstillægssatsen blev opdateret 1. maj 2025 fra 32,80 kr/t til 34,16 kr/t. Du mangler 21,76 kr i efterbetaling for januar.",
  }],
  summary: { totalDifference: -21.76, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-02-01T08:00:04Z",
};

// FEJL 2: Gammel pensionssats (12% i stedet for 13%)
const SEF_FEB_ERROR2: PayslipData = {
  ...SEF_JAN_CORRECT,
  id: "ps-sef-2026-02-err2",
  period: { month: "Februar", year: 2026, startDate: "2026-02-01", endDate: "2026-02-28" },
  deductions: {
    ...SEF_JAN_CORRECT.deductions,
    pension: { beloeb: 683.63, procent: 2.0, grundlag: 34181.49 },
  },
};

const SEF_VAL_ERROR2: PayslipValidationResult = {
  id: "val-sef-err2",
  payslipId: "ps-sef-2026-02-err2",
  status: "errors",
  discrepancies: [{
    id: "err-sef-2",
    category: "deduction",
    field: "pension",
    severity: "error",
    expected: 4443.59,
    actual: 4101.78,
    difference: -341.81,
    description: "Pensionen er beregnet med samlet 12% (AG 10% + MA 2%) — men den korrekte sats fra 1. maj 2025 er samlet 13% (AG 11% + MA 2%). Der indbetales ca. 342 kr/md for lidt til PensionDanmark.",
    calculation: "Regel: Brancheoverenskomst for vagtassistenter §8, stk. 1. Pensionssats pr. 01.05.2025: samlet 13% af A-skattepligtig løn (AG 11% + MA 2%). A-skattepligtig løn: 34.181,49 kr. Forventet samlet pension: 34.181,49 × 13% = 4.443,59 kr. Faktisk (12%): 34.181,49 × 12% = 4.101,78 kr.",
    suggestion: "Kontakt HR hos Securitas A/S og henvis til vagtassistentoverenskomsten §8, stk. 1. Pensionssatsen steg fra samlet 12% til 13% pr. 1. maj 2025. Arbejdsgiverbidraget skal være 11%, ikke 10%. PensionDanmark bør også orienteres om det for lave indbetalingsgrundlag. Difference: 341,81 kr/md.",
  }],
  summary: { totalDifference: -341.81, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-03-01T08:00:04Z",
};

// FEJL 3: Manglende stigning i særlig opsparing (9% i stedet for 10%)
const SEF_MAR_ERROR3: PayslipData = {
  ...SEF_JAN_CORRECT,
  id: "ps-sef-2026-03-err3",
  period: { month: "Marts", year: 2026, startDate: "2026-03-01", endDate: "2026-03-31" },
};

const SEF_VAL_ERROR3: PayslipValidationResult = {
  id: "val-sef-err3",
  payslipId: "ps-sef-2026-03-err3",
  status: "errors",
  discrepancies: [{
    id: "err-sef-3",
    category: "deduction",
    field: "saerlig_opsparing",
    severity: "error",
    expected: 3428.05,
    actual: 3085.24,
    difference: -342.81,
    description: "Særlig opsparing er stadig beregnet med 9,0% — men den korrekte sats fra 1. marts 2026 er 10,0%. Der opspares ca. 343 kr/md for lidt.",
    calculation: "Regel: Brancheoverenskomst for vagtassistenter §14. Særlig opsparing pr. 01.03.2026: 10,0% af ferieberettiget løn (var 9,0%). Ferieberettiget løn: 34.280,49 kr. Forventet: 34.280,49 × 10% = 3.428,05 kr. Faktisk (9%): 34.280,49 × 9% = 3.085,24 kr.",
    suggestion: "Kontakt lønadministrationen hos Securitas A/S og henvis til vagtassistentoverenskomsten §14. Særlig opsparing steg fra 9,0% til 10,0% pr. 1. marts 2026. Den løbende udbetaling (over 4%-pointene) er for lav. Difference: 342,81 kr/md.",
  }],
  summary: { totalDifference: -342.81, issuesCount: 1, warningsCount: 0 },
  validatedAt: "2026-04-01T08:00:04Z",
};

// Korrekt validering (ingen fejl)
const SEF_VAL_OK: PayslipValidationResult = {
  id: "val-sef-ok",
  payslipId: "ps-sef-2026-01-ok",
  status: "ok",
  discrepancies: [],
  summary: { totalDifference: 0, issuesCount: 0, warningsCount: 0 },
  validatedAt: "2026-02-01T08:00:04Z",
};

export const SEF_CONFIG: UnionDemoConfig = {
  id: "sef",
  name: "Serviceforbundet",
  fullName: "Serviceforbundet / VSL",
  primaryColor: "#005F73",
  secondaryColor: "#003D4D",
  bgColor: "#F0F6F7",
  logo: sefLogo,

  demoProfile: "agreement" as DemoProfile,

  welcomeHeadline: "Får du det rigtige weekendtillæg?",
  welcomeSub: "Serviceforbundet og PayTjek tjekker det for dig",
  welcomeDescription:
    "Vagtassistenter har skiftende vagter med weekend- og helligdagstillæg der ofte beregnes med forkert sats. PayTjek finder de fejl lønsystemet laver.",
  ctaQuestion: "Er dine genetillæg beregnet korrekt?",
  authFeatures: [
    "Automatisk tjek af weekend- og helligdagstillæg",
    "Synkroniser vagtplan og find skjulte satsfejl",
    "AI-rådgivning baseret på vagtassistentoverenskomsten",
  ],

  pitchTagline: "Fra lønseddel til svar på 30 sekunder",
  pitchSub:
    "Upload din lønseddel — PayTjek tjekker den mod vagtassistentoverenskomsten og finder de satsfejl der koster mest over tid.",

  persona: {
    firstName: "Mikkel",
    name: "Mikkel Brandt",
    jobTitle: "Vagtassistent",
    employer: "Securitas A/S",
    cvr: "17565844",
  },

  collectiveAgreement: "Brancheoverenskomst for vagtassistenter (DI nr. 854609)",

  demoIcsUrl: "/demo/sef-vagter-jan-2026.ics",
  demoIcsDisplayUrl: "https://securitas.planday.dk/ics/export/mikkel-brandt.ics",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  theme: {
    "--primary": "190 100% 23%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "190 100% 15%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "190 40% 95%",
    "--accent-foreground": "190 100% 20%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "190 20% 97%",
    "--card-foreground": "0 0% 10%",
    "--muted": "190 10% 95%",
    "--muted-foreground": "0 0% 40%",
    "--border": "190 10% 90%",
    "--ring": "190 100% 23%",
    "--font-heading": "'Inter', sans-serif",
    "--font-body": "'Inter', sans-serif",
  },

  payslip: SEF_JAN_ERROR1,
  validation: SEF_VAL_ERROR1,

  demoPayslips: {
    "jan": { payslip: SEF_JAN_ERROR1, validation: SEF_VAL_ERROR1 },
    "feb": { payslip: SEF_FEB_ERROR2, validation: SEF_VAL_ERROR2 },
    "mar": { payslip: SEF_MAR_ERROR3, validation: SEF_VAL_ERROR3 },
    "korrekt": { payslip: SEF_JAN_CORRECT, validation: SEF_VAL_OK },
  },
};

// ─── SEF Kontrakttjek (contract-only demo) ────────────────────────────────────
// Separat demo til Serviceforbundet der KUN viser kontrakttjek.
// Rører ikke SEF_CONFIG — den forbliver intakt med fuld løntjek-demo.

export const SEF_KONTRAKT_CONFIG: UnionDemoConfig = {
  id: "sef-kontrakt",
  name: "SEF Kontrakttjek",
  fullName: "Serviceforbundet / VSL — Kontrakttjek",
  primaryColor: "#0d6e56",
  secondaryColor: "#094d3c",
  bgColor: "#F0F7F4",
  logo: sefLogo,

  demoProfile: "contract-only" as DemoProfile,
  demoContractComparison: {
    agreedMonthly: 34280,
    paidMonthly: 34280,
    difference: 0,
    matchedTerms: 8,
    deviations: 2,
  },
  demoContractAnalysis: {
    totalClauses: 10,
    compliant: 8,
    deviations: 2,
    clauses: [
      { clause: "Løngruppe (Gruppe 3)", status: "compliant", detail: "32.195,13 kr/md — korrekt iht. anciennitet (47 mdr. → over 36 mdr.)" },
      { clause: "Pension (13%)", status: "compliant", detail: "Samlet 13% (AG 11% + MA 2%) via PensionDanmark — korrekt pr. 01.05.2025 (§8, stk. 1)" },
      { clause: "Funktionærstatus", status: "compliant", detail: "Omfattet af funktionærloven (§22)" },
      { clause: "Opsigelsesvarsel (4 mdr.)", status: "compliant", detail: "Korrekt iht. funktionærloven §2, stk. 4 (3 år 11 mdr. anciennitet)" },
      { clause: "Prøveperiode (3 mdr.)", status: "compliant", detail: "Korrekt iht. §2, stk. 4 — max 3 mdr. tilladt" },
      { clause: "Arbejdstid (154,12 t/md)", status: "compliant", detail: "Korrekt fuldtidsnorm (§3, stk. 1) — gns. over 6 mdr., kompenseret for skæve helligdage" },
      { clause: "Overenskomsthenvisning", status: "compliant", detail: "Brancheoverenskomst for vagtassistenter (DI 854609) — korrekt angivet (Protokollat 12)" },
      { clause: "Godkendelse vagtvirksomhedsloven", status: "compliant", detail: "§7 i Lov om Vagtvirksomhed nævnt — godkendelseskrav fremgår" },
      { clause: "Sundhedsordning", status: "missing", detail: "Ikke nævnt i kontrakten — du har ret til sundhedsordning via PensionDanmark (§9). Max 0,15% af normalløn." },
      { clause: "Uniform", status: "missing", detail: "Ikke nævnt — hvis din arbejdsgiver kræver uniform, skal de betale (§23)" },
    ],
  },

  contractIntelligence: {
    salaryComponents: [
      { label: "Grundløn Gruppe 3", amount: 32195, sublabel: "Over 36 mdr. anciennitet (§6, stk. 1)" },
      { label: "Anciennitetstillæg", amount: 364, sublabel: "364,39 kr/md — Gruppe 3" },
      { label: "Branchetillæg", amount: 763, sublabel: "4,95 kr/t × 154,12 t/md" },
      { label: "Genetillæg (gennemsnit)", amount: 958, sublabel: "Lør-/søn-/helligdagstillæg (§7)" },
    ],
    totalPackage: 34280,
    pension: {
      totalPercent: 13.0,
      minimumPercent: 13.0,
      fritvalgPercent: 0,
      fritvalgMonthly: 0,
      provider: "PensionDanmark",
      components: [
        { label: "Arbejdsgiverbidrag", percent: 11.0, monthly: 3771 },
        { label: "Egetbidrag", percent: 2.0, monthly: 686 },
      ],
    },
    careerSteps: [
      { date: "Jun 2022", label: "Ansat", detail: "Vagtassistent (kontrolcentral), Gruppe 1" },
      { date: "Jun 2023", label: "Gruppe 2", detail: "12 mdr. anciennitet" },
      { date: "Jun 2025", label: "Gruppe 3", detail: "36 mdr. anciennitet", isCurrent: true },
    ],
    negotiationPoints: [
      { label: "Sundhedsordning", status: "active", detail: "Mangler i kontrakten — du har ret til sundhedsordning via PensionDanmark (§9)", benchmark: "Bed om nyt ansættelsesbevis" },
      { label: "Uniform", status: "active", detail: "Mangler i kontrakten — arbejdsgiver betaler hvis de kræver uniform (§23)", benchmark: "Bed om tilføjelse" },
      { label: "Varskotillæg", status: "potential", detail: "522,93 kr pr. varslet ekstravagt — tjek om det udbetales konsekvent" },
    ],
    termination: {
      isFunktionaer: true,
      anciennityStartDate: "2022-06-01",
      employerNoticePeriodMonths: 4,
      employeeNoticePeriodMonths: 1,
      severanceEligibleAfterYears: 12,
      severanceEligibleDate: "2034-06-01",
      scenarios: [
        {
          title: "Hvis du opsiger",
          noticePeriod: "1 måned til udgangen af en måned",
          legalBasis: "Funktionærloven §2, stk. 6",
          details: [
            { label: "Dit varsel", value: "1 måned til udgangen af en måned", status: "info" },
            { label: "Optjent ferie", value: "Udbetales ved fratræden", status: "info" },
            { label: "Særlig opsparing", value: "Saldo udbetales ved fratræden", status: "info" },
            { label: "Ikke-afholdte feriefridage", value: "Udbetales ved fratræden (§13)", status: "info" },
            { label: "Fratrædelsesgodtgørelse", value: "Ingen — kun ved arbejdsgivers opsigelse", status: "warning" },
          ],
        },
        {
          title: "Hvis du bliver opsagt",
          noticePeriod: "4 måneder",
          legalBasis: "Funktionærloven §2, stk. 2 — næste trin: 5 mdr. ved 5 år 8 mdr. (feb 2028)",
          details: [
            { label: "Opsigelsesvarsel", value: "4 måneder (3 år 11 mdr. anciennitet)", status: "info" },
            { label: "Opsigelse", value: "SKAL være skriftlig (§2, stk. 5)", status: "info" },
            { label: "A-kasse / VSL", value: "2 timers fri med løn til a-kasse hurtigst muligt (§2, stk. 7)", status: "positive" },
            { label: "Uddannelse i opsigelsesperioden", value: "Ret til 2 ugers kursus — AG betaler deltagerbetaling max 1.500 kr (§18, stk. 10)", status: "positive" },
            { label: "Fuld løn i opsigelsesperioden", value: "Fuld løn inkl. alle tillæg — AG tilstræber ingen overarbejde (§2, stk. 6)", status: "positive" },
            { label: "Feriefridage", value: "Kan IKKE varsles i opsigelsesperiode (§13, stk. 4)", status: "positive" },
            { label: "Fratrædelsesgodtgørelse", value: "Kræver 12 års ansættelse (funktionærloven §2a) — du opnår ret i juni 2034", status: "future" },
          ],
          timeline: [
            { label: "Opsigelse modtaget", detail: "Skriftlig opsigelse fra arbejdsgiver (§2, stk. 5)", icon: "calendar" },
            { label: "2 timers fri til a-kasse/VSL", detail: "Hurtigst muligt — med fuld løn (§2, stk. 7)", icon: "briefcase" },
            { label: "Ret til 2 ugers kursus", detail: "AG betaler deltagerbetaling max 1.500 kr (§18, stk. 10)", icon: "briefcase" },
            { label: "Opsigelsesperiode (4 mdr.)", detail: "Fuld løn, genetillæg og pension — ingen overarbejde tilstræbes", icon: "clock" },
            { label: "Fratræden", detail: "Sidste arbejdsdag — 30. september 2026 ved opsigelse i dag", icon: "shield" },
            { label: "Slutafregning", detail: "Ferieafregning + særlig opsparing udbetales", icon: "banknote" },
          ],
        },
      ],
    },
    rights: [
      {
        title: "Løn & tillæg",
        icon: "money",
        items: [
          { text: "Grundløn Gruppe 3: 32.195,13 kr/md", reference: "§6, stk. 1" },
          { text: "Anciennitetstillæg: 364,39 kr/md", reference: "Gruppe 3" },
          { text: "Branchetillæg: 4,95 kr/time" },
          { text: "Genetillæg lørdag: 34,16 kr/t", reference: "§7" },
          { text: "Genetillæg søn-/helligdag: 51,44 kr/t", reference: "§7" },
          { text: "Overarbejde: timeløn + 50%", reference: "§11" },
        ],
      },
      {
        title: "Fravær med løn",
        icon: "health",
        items: [
          { text: "Sygdom: fuld løn", reference: "Funktionærloven via §22" },
          { text: "Barns 1. sygedag: fri med fuld løn", reference: "§17" },
          { text: "+ 2 ekstra dage fra særlig opsparing" },
          { text: "Barns hospitalsindlæggelse: max 1 uge/år", reference: "§17" },
          { text: "2 børneomsorgsdage/år", reference: "§17, stk. 4" },
          { text: "2 børnebørns-omsorgsdage/år", reference: "§17, stk. 5" },
          { text: "Ledsagelse af nærtstående: 2 dage/år + 5 ekstra ved kritisk sygdom", reference: "§17, stk. 6" },
        ],
      },
      {
        title: "Ferie & fridage",
        icon: "vacation",
        items: [
          { text: "25 feriedage", reference: "Ferieloven" },
          { text: "5 feriefridage pr. ferieår", reference: "§13" },
          { text: "Særlig opsparing: 10% af ferieberettiget løn (stiger fra 9% pr. 01.03.2026)", reference: "§14" },
        ],
      },
      {
        title: "Uddannelse",
        icon: "education",
        items: [
          { text: "2 ugers frihed/år til uddannelse", reference: "§18, stk. 4" },
          { text: "Kompetenceudviklingsfonden betaler" },
          { text: "4 timer fri til FVU/ordblinde-screening", reference: "§18, stk. 4" },
          { text: "Ved afskedigelse: ret til 2 ugers kursus", reference: "§18, stk. 10" },
        ],
      },
      {
        title: "Beskyttelse",
        icon: "protection",
        items: [
          { text: "Funktionærstatus", reference: "§22" },
          { text: "4 mdr. opsigelsesvarsel (din anciennitet)" },
          { text: "Skriftlig opsigelse påkrævet", reference: "§2, stk. 5" },
          { text: "Ret til 2 timers fri til a-kasse ved afskedigelse", reference: "§2, stk. 7" },
          { text: "AG tilstræber ingen overarbejde i opsigelsesperioden", reference: "§2, stk. 6" },
          { text: "Feriefridage kan IKKE varsles i opsigelsesperiode", reference: "§13, stk. 4" },
        ],
      },
      {
        title: "Arbejdsvilkår",
        icon: "conditions",
        items: [
          { text: "Uniform betalt af arbejdsgiver", reference: "§23" },
          { text: "Sundhedsordning via PensionDanmark", reference: "§9" },
          { text: "Spisetid ½ time indregnet i tjenestetiden", reference: "§10" },
          { text: "Pension 13% via PensionDanmark", reference: "§8" },
        ],
      },
    ],
  },

  welcomeHeadline: "Er din kontrakt i orden?",
  welcomeSub: "Serviceforbundet og PayTjek tjekker det for dig",
  welcomeDescription:
    "Upload din ansættelseskontrakt — vi tjekker om løn, tillæg og vilkår matcher den gældende overenskomst. Automatisk, hurtigt og præcist.",
  ctaQuestion: "Matcher din kontrakt overenskomsten?",
  authFeatures: [
    "Automatisk tjek af løngruppe og anciennitet",
    "Verificér pension, tillæg og opsigelsesvilkår",
    "Sammenlign med vagtassistentoverenskomsten (DI nr. 854609)",
  ],

  pitchTagline: "Din kontrakt tjekket på 30 sekunder",
  pitchSub:
    "Upload din kontrakt — PayTjek sammenligner hvert vilkår med vagtassistentoverenskomsten og finder de afvigelser der koster dig penge.",

  persona: {
    firstName: "Mikkel",
    name: "Mikkel Brandt",
    jobTitle: "Vagtassistent (kontrolcentral)",
    employer: "Securitas A/S",
    cvr: "17565844",
  },

  collectiveAgreement: "Brancheoverenskomst for vagtassistenter (DI 854609)",

  googleFontsImport:
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  theme: {
    "--primary": "160 79% 24%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "160 79% 17%",
    "--secondary-foreground": "0 0% 100%",
    "--accent": "155 30% 95%",
    "--accent-foreground": "160 79% 20%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 10%",
    "--card": "155 20% 97%",
    "--card-foreground": "0 0% 10%",
    "--muted": "155 10% 95%",
    "--muted-foreground": "0 0% 40%",
    "--border": "155 10% 90%",
    "--ring": "160 79% 24%",
    "--font-heading": "'Inter', sans-serif",
    "--font-body": "'Inter', sans-serif",
  },

  payslip: SEF_JAN_CORRECT,
  validation: SEF_VAL_OK,
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const UNION_CONFIGS: Record<UnionId, UnionDemoConfig> = {
  hk: HK_CONFIG,
  foa: FOA_CONFIG,
  "3f": THREEF_CONFIG,
  djoef: DJOEF_CONFIG,
  lederne: LEDERNE_CONFIG,
  sef: SEF_CONFIG,
  "sef-kontrakt": SEF_KONTRAKT_CONFIG,
};

export function getUnionConfig(id: string): UnionDemoConfig {
  return UNION_CONFIGS[id as UnionId] ?? HK_CONFIG;
}
