// Parsed contract details for Emil Hansen — Coolshop A/S (Dansk Erhverv / HK Handel)

export interface ContractDetails {
  // Personalia
  employee: {
    name: string;
    cpr: string; // masked
    address: string;
  };

  // Arbejdsgiver
  employer: {
    name: string;
    cvr: string;
    address: string;
    department: string;
  };

  // Ansættelsesvilkår
  employment: {
    title: string;
    startDate: string;       // ISO date
    type: "permanent" | "temporary" | "substitute";
    weeklyHours: number;
    probationMonths: number;
    noticePeriodMonths: number;
  };

  // Overenskomst
  collectiveAgreement: {
    name: string;
    id: string;
    union: string;
    unionFullName: string;
    employerOrg: string;
  };

  // Løn
  salary: {
    hourlyRate: number;
    trin: number;
    trinLabel: string;
    seniorityYears: number;
    seniorityFrom: string;
    fritvalgPercent: number;
  };

  // Tillæg — kan være faste satser eller overenskomstbaserede
  supplements:
    | {
        type: "fixed";
        evening: { rate: number; label: string; hours: string };
        saturday: { rate: number; label: string; hours: string };
        sunday: { rate: number; label: string; hours: string };
      }
    | {
        type: "agreement";
        description: string;
        rules: Array<{ label: string; rule: string }>;
      };

  // Pension
  pension: {
    employeePercent: number;
    employerPercent: number;
    provider: string;
  };

  // Ferie
  vacation: {
    daysPerYear: number;
    type: string;
  };

  // Metadata
  signedDate: string;
  documentId: string;
}

export const DEMO_CONTRACT: ContractDetails = {
  employee: {
    name: "Emil Hansen",
    cpr: "••••••-••••",
    address: "Myrdalstræde 76, st., 9220 Aalborg Ø",
  },

  employer: {
    name: "Coolshop A/S",
    cvr: "26 45 76 02",
    address: "Loftbrovej 28-30, 9400 Nørresundby",
    department: "Warehouse",
  },

  employment: {
    title: "Warehouse Assistant",
    startDate: "2025-01-13",
    type: "permanent",
    weeklyHours: 37,
    probationMonths: 3,
    noticePeriodMonths: 3,
  },

  collectiveAgreement: {
    name: "Funktionæroverenskomst for Handel, Viden og Service",
    id: "hk-handel-dansk-erhverv",
    union: "HK",
    unionFullName: "HK Privat og HK HANDEL",
    employerOrg: "Dansk Erhverv Arbejdsgiver",
  },

  salary: {
    hourlyRate: 125.00,
    trin: 0,
    trinLabel: "Individuel aftale",
    seniorityYears: 2,
    seniorityFrom: "2023-09-18",
    fritvalgPercent: 9,
  },

  supplements: {
    type: "agreement",
    description: "Følger den gældende overenskomst",
    rules: [
      { label: "Overarbejde (første 3 timer)", rule: "+50 %" },
      { label: "Overarbejde (derefter)", rule: "+100 %" },
      { label: "Søn- og helligdage", rule: "+100 %" },
    ],
  },

  pension: {
    employeePercent: 2,
    employerPercent: 11,
    provider: "AP Pension (Warehouse)",
  },

  vacation: {
    daysPerYear: 25,
    type: "Feriegodtgørelse iht. ferieloven",
  },

  signedDate: "2025-01-10",
  documentId: "ANS-2025-01-10-ESC",
};

// Analysis steps for the contract parsing animation
export const CONTRACT_ANALYSIS_STEPS = [
  { id: "read", label: "Læser dokument" },
  { id: "identify", label: "Identificerer kontrakttype" },
  { id: "agreement", label: "Finder overenskomst" },
  { id: "salary", label: "Udtrækker lønsatser" },
  { id: "terms", label: "Verificerer vilkår" },
];


