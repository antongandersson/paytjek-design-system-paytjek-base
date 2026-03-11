import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";

// Coolshop A/S — Funktionæroverenskomst for Handel, Viden og Service (HK/DE)
const TIMELON = 125.00;

interface DemoPayslip {
  payslip: PayslipData;
  validation: PayslipValidationResult;
}

// ──────────────────────────────────────────────
// September 2025 — Lønperiode 21. aug – 20. sep
// Ingen fejl
// ──────────────────────────────────────────────

const SEP_PAYSLIP: PayslipData = {
  id: "ps-2025-09",
  userId: "user-1",
  period: {
    month: "September",
    year: 2025,
    startDate: "2025-08-21",
    endDate: "2025-09-20",
  },
  employer: {
    name: "Coolshop A/S",
    cvr: "26457602",
    department: "Warehouse",
  },
  salary: {
    grundlon: 20285.00,        // 162,28t × 125 kr/t
    timelon: TIMELON,
    normalTimer: 162.28,
    beregnetTimelon: {
      udenTillaeg: 125.00,
      medTillaeg: 131.65,      // 21364.93 / 162.28
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
    pension: { beloeb: 519.17, procent: 2, grundlag: 25958.39 },
    skat: { beloeb: 7474.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1581.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 1, timer: 7.5, beloeb: 986.18 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 21364.93,       // 20285.00 + 986.18 + 93.75
    nettolon: 11466.76,
    totalFradrag: 9898.17,     // 519.17 + 7474 + 99 + 1581 + 25 + 200
    totalTillaeg: 1079.93,     // sygedagpenge 986.18 + overtid 93.75
  },
  uploadedAt: "2025-10-01T08:00:00Z",
  analyzedAt: "2025-10-01T08:00:04Z",
};

const SEP_VALIDATION: PayslipValidationResult = {
  id: "val-2025-09",
  payslipId: "ps-2025-09",
  status: "ok",
  discrepancies: [],
  summary: {
    totalDifference: 0,
    issuesCount: 0,
    warningsCount: 0,
  },
  validatedAt: "2025-10-01T08:00:04Z",
};

// ──────────────────────────────────────────────
// Oktober 2025 — Lønperiode 21. sep – 20. okt
// FEJL: Overarbejde d. 5. oktober (søndag) er takseret med 50 %
// i stedet for 100 % jf. Funktionæroverenskomsten § 3, pkt. 1A.
// ──────────────────────────────────────────────

const OKT_PAYSLIP: PayslipData = {
  id: "ps-2025-10",
  userId: "user-1",
  period: {
    month: "Oktober",
    year: 2025,
    startDate: "2025-09-21",
    endDate: "2025-10-20",
  },
  employer: {
    name: "Coolshop A/S",
    cvr: "26457602",
    department: "Warehouse",
  },
  salary: {
    grundlon: 19557.50,        // 156,46t × 125 kr/t
    timelon: TIMELON,
    normalTimer: 156.46,
    beregnetTimelon: {
      udenTillaeg: 125.00,
      medTillaeg: 125.80,      // 19682.50 / 156.46
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 1, sats: 62.50, beloeb: 62.50 },
  },
  deductions: {
    pension: { beloeb: 478.28, procent: 2, grundlag: 19682.50 },
    skat: { beloeb: 6855.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1528.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 0, timer: 0 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 19682.50,       // 19557.50 + 62.50 + 62.50
    nettolon: 10497.22,
    totalFradrag: 9185.28,     // 478.28 + 6855 + 99 + 1528 + 25 + 200
    totalTillaeg: 125.00,      // overtid 1-3t: 62.50 + overtid +4t: 62.50
  },
  uploadedAt: "2025-11-01T09:00:00Z",
  analyzedAt: "2025-11-01T09:00:05Z",
};

const OKT_VALIDATION: PayslipValidationResult = {
  id: "val-2025-10",
  payslipId: "ps-2025-10",
  status: "errors",
  discrepancies: [
    {
      id: "err-okt-1",
      category: "supplement",
      field: "soenHelligdag",
      severity: "error",
      expected: 125.00,        // 1t × 125,00 kr (100 % tillæg på søndag)
      actual: 62.50,           // 1t × 62,50 kr (50 % tillæg — forkert)
      difference: -62.50,
      description:
        "Den 5. oktober 2025 er en søndag. Du har arbejdet 1 times overarbejde denne dag, men lønsystemet har kun givet 50 % tillæg (62,50 kr). Ifølge Funktionæroverenskomsten § 3, pkt. 1A skal overarbejde på søn- og helligdage altid betales med 100 % tillæg (125,00 kr).",
      calculation:
        "Rule: Funktionæroverenskomst-§3-pkt1A-søndag, Sats: 125.00 kr/t, Forventet: 1t, Faktisk: 0t",
      suggestion:
        "Kontakt din leder eller lønadministrationen og henvis til Funktionæroverenskomsten § 3, pkt. 1A. Overarbejdet d. 5. oktober (søndag) skal takseres med 100 % tillæg i stedet for 50 %. Du mangler 62,50 kr i efterbetaling.",
    },
  ],
  summary: {
    totalDifference: -62.50,
    issuesCount: 1,
    warningsCount: 0,
  },
  validatedAt: "2025-11-01T09:00:05Z",
};

// ──────────────────────────────────────────────
// December 2025 — Lønperiode 21. nov – 17. dec
// Ingen fejl
// ──────────────────────────────────────────────

const DEC_PAYSLIP: PayslipData = {
  id: "ps-2025-12",
  userId: "user-1",
  period: {
    month: "December",
    year: 2025,
    startDate: "2025-11-21",
    endDate: "2025-12-17",
  },
  employer: {
    name: "Coolshop A/S",
    cvr: "26457602",
    department: "Warehouse",
  },
  salary: {
    grundlon: 20761.25,        // 166,09t × 125 kr/t
    timelon: TIMELON,
    normalTimer: 166.09,
    beregnetTimelon: {
      udenTillaeg: 125.00,
      medTillaeg: 152.27,      // 25289.43 / 166.09
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 10.27, sats: 15.00, beloeb: 154.05 },
    soenHelligdag: { timer: 0, sats: 0, beloeb: 0 },
  },
  deductions: {
    pension: { beloeb: 614.53, procent: 2, grundlag: 25289.43 },
    skat: { beloeb: 8848.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1887.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 1, timer: 7.5, beloeb: 986.18 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 25289.43,       // grundløn + sygedagpenge + rød trøje + overtid rød trøje + nattillæg + nattillæg OT + overtid 1-3 + overtid +4
    nettolon: 13615.90,
    totalFradrag: 11673.53,    // pension + skat + atp + am-bidrag + personaleforening + kantine
    totalTillaeg: 4528.18,     // 986.18 + 830.45 + 50.00 + 47.50 + 154.05 + 22.50 + 1250.00 + 1187.50
  },
  uploadedAt: "2026-01-02T10:00:00Z",
  analyzedAt: "2026-01-02T10:00:04Z",
};

const DEC_VALIDATION: PayslipValidationResult = {
  id: "val-2025-12",
  payslipId: "ps-2025-12",
  status: "ok",
  discrepancies: [],
  summary: {
    totalDifference: 0,
    issuesCount: 0,
    warningsCount: 0,
  },
  validatedAt: "2026-01-02T10:00:04Z",
};

// ──────────────────────────────────────────────
// EXPORT: Lookup by filename
// ──────────────────────────────────────────────

const DEMO_PAYSLIPS: Record<string, DemoPayslip> = {
  "2025-09-29_Lønseddel": { payslip: SEP_PAYSLIP, validation: SEP_VALIDATION },
  "2025-10-30_Lønseddel": { payslip: OKT_PAYSLIP, validation: OKT_VALIDATION },
  "2025-12-29_Lønseddel": { payslip: DEC_PAYSLIP, validation: DEC_VALIDATION },
};

const DEMO_PAYSLIPS_ORDERED: DemoPayslip[] = [
  { payslip: OKT_PAYSLIP, validation: OKT_VALIDATION },
  { payslip: DEC_PAYSLIP, validation: DEC_VALIDATION },
  { payslip: SEP_PAYSLIP, validation: SEP_VALIDATION },
];

let fallbackIndex = 0;

export function getDemoPayslip(filename: string): DemoPayslip {
  const key = filename.replace(/\.[^/.]+$/, "");

  if (DEMO_PAYSLIPS[key]) {
    return DEMO_PAYSLIPS[key];
  }

  const result = DEMO_PAYSLIPS_ORDERED[fallbackIndex % DEMO_PAYSLIPS_ORDERED.length];
  fallbackIndex++;
  return result;
}


