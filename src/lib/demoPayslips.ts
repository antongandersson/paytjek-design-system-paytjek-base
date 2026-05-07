import type { PayslipData, PayslipValidationResult } from "@/lib/api/types";

// Nordic Retail A/S — HK/DI Butiksoverenskomsten
const TIMELON = 132.00;

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
    name: "Nordic Retail A/S",
    cvr: "38147205",
    department: "Lager & Logistik",
  },
  salary: {
    grundlon: 21421.00,        // 162,28t × 132 kr/t
    timelon: TIMELON,
    normalTimer: 162.28,
    beregnetTimelon: {
      udenTillaeg: 132.00,
      medTillaeg: 139.02,      // 22561 / 162.28
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
    pension: { beloeb: 548.00, procent: 2, grundlag: 27412.00 },
    skat: { beloeb: 7893.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1670.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 1, timer: 7.5, beloeb: 1041.00 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 22561.00,       // 21421.00 + 1041.00 + 99.00
    nettolon: 12109.00,
    totalFradrag: 10452.00,    // 548 + 7893 + 99 + 1670 + 242
    totalTillaeg: 1140.00,     // sygedagpenge 1041.00 + overtid 99.00
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
// i stedet for 100 % jf. HK/DI Butiksoverenskomsten § 3, pkt. 1A.
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
    name: "Nordic Retail A/S",
    cvr: "38147205",
    department: "Lager & Logistik",
  },
  salary: {
    grundlon: 20653.00,        // 156,46t × 132 kr/t
    timelon: TIMELON,
    normalTimer: 156.46,
    beregnetTimelon: {
      udenTillaeg: 132.00,
      medTillaeg: 132.84,      // 20785 / 156.46
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 0, sats: 0, beloeb: 0 },
    soenHelligdag: { timer: 1, sats: 66.00, beloeb: 66.00 },
  },
  deductions: {
    pension: { beloeb: 505.00, procent: 2, grundlag: 20785.00 },
    skat: { beloeb: 7239.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1614.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 0, timer: 0 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 20785.00,       // 20653.00 + 66.00 + 66.00
    nettolon: 11085.00,
    totalFradrag: 9700.00,     // 505 + 7239 + 99 + 1614 + 243
    totalTillaeg: 132.00,      // overtid 1-3t: 66.00 + overtid +4t: 66.00
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
      expected: 132.00,        // 1t × 132,00 kr (100 % tillæg på søndag)
      actual: 66.00,           // 1t × 66,00 kr (50 % tillæg — forkert)
      difference: -66.00,
      description:
        "Den 5. oktober 2025 er en søndag. Du har arbejdet 1 times overarbejde denne dag, men lønsystemet har kun givet 50 % tillæg (66,00 kr). Ifølge HK/DI Butiksoverenskomsten § 3, pkt. 1A skal overarbejde på søn- og helligdage altid betales med 100 % tillæg (132,00 kr).",
      calculation:
        "Rule: HK/DI Butiksoverenskomsten §3-pkt1A-søndag, Sats: 132.00 kr/t, Forventet: 1t, Faktisk: 0t",
      suggestion:
        "Kontakt din leder eller lønadministrationen og henvis til HK/DI Butiksoverenskomsten § 3, pkt. 1A. Overarbejdet d. 5. oktober (søndag) skal takseres med 100 % tillæg i stedet for 50 %. Du mangler 66,00 kr i efterbetaling.",
    },
  ],
  summary: {
    totalDifference: -66.00,
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
    name: "Nordic Retail A/S",
    cvr: "38147205",
    department: "Lager & Logistik",
  },
  salary: {
    grundlon: 21924.00,        // 166,09t × 132 kr/t
    timelon: TIMELON,
    normalTimer: 166.09,
    beregnetTimelon: {
      udenTillaeg: 132.00,
      medTillaeg: 160.79,      // 26706 / 166.09
      afvigelse: 0.00,
      status: "ok",
    },
  },
  supplements: {
    aftentillaeg: { timer: 0, sats: 0, beloeb: 0 },
    nattillaeg: { timer: 10.27, sats: 16.00, beloeb: 164.00 },
    soenHelligdag: { timer: 0, sats: 0, beloeb: 0 },
  },
  deductions: {
    pension: { beloeb: 649.00, procent: 2, grundlag: 26706.00 },
    skat: { beloeb: 9343.00, procent: 39 },
    atp: { beloeb: 99.00 },
    amBidrag: { beloeb: 1993.00, procent: 8 },
  },
  absence: {
    sygdom: { dage: 1, timer: 7.5, beloeb: 1041.00 },
    ferie: { dage: 0, timer: 0 },
    afspadsering: { dage: 0, timer: 0 },
    barnsSygdom: { dage: 0, timer: 0 },
  },
  totals: {
    bruttolon: 26706.00,       // grundløn + sygedagpenge + rød trøje + overtid rød trøje + nattillæg + nattillæg OT + overtid 1-3 + overtid +4
    nettolon: 14378.00,
    totalFradrag: 12328.00,    // pension + skat + atp + am-bidrag + personaleforening + kantine
    totalTillaeg: 4782.00,     // 1041 + 877 + 53 + 50 + 164 + 24 + 1320 + 1253
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


