// Demo contract data — fiktiv person og arbejdsgiver (anonymiseret)

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
    noticeLabel?: string;    // Overstyrer "{n} mdr." (fx "Afhænger af ansættelsesform")
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
    monthlyRate?: number;
    trin: number;
    trinLabel: string;
    trinHeading?: string;    // Overstyrer "Løntrin"-label (fx "Løntype")
    seniorityYears: number;
    seniorityFrom: string;
    fritvalgPercent: number;
    fritvalgNote?: string;   // Suffix til fritvalgs-procent (fx "fra 1.3.2026")
  };

  // Tillæg — kan være faste satser eller overenskomstbaserede
  supplements:
    | {
        type: "fixed";
        evening: { rate: number; label: string; hours: string };
        night?: { rate: number; label: string; hours: string };
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
    note?: string;           // Kilde-/satshenvisning (fx "iht. §34 stk. 2 (fra 1.5.2025)")
  };

  // Ferie
  vacation: {
    daysPerYear: number;
    type: string;
    headline?: string;       // Overstyrer "{n} feriedage / år"-overskriften
    bullets?: string[];      // Punktliste under overskriften (rene kontraktvilkår)
  };

  // Rettigheder iht. overenskomst (valgfri ekstra-blok, fx Industriens OK)
  rights?: Array<{ emoji: string; label: string; value: string; sub?: string }>;

  // Overlay der FØRST må vises efter mindst én lønseddel er uploadet.
  // Sammenligninger mellem kontrakt og lønseddel (fx ansat-dato 2019, "afhænger af
  // ansættelsesform", forbehold, 33.000-uoverensstemmelse) er logisk umulige før upload.
  postPayslip?: {
    startDate?: string;        // Overstyrer "Ansat siden" (fx lønsedlernes 2019-dato)
    startDateNote?: string;    // Lille note under datoen (fx "iflg. lønsedler")
    noticeLabel?: string;      // Overstyrer opsigelse (fx "Afhænger af ansættelsesform")
    salaryNote?: string;       // ⚠️-note under løn (fx "Lønseddel viser 33.000 kr…")
    vacationHeadline?: string; // Overstyrer ferie-overskrift
    vacationType?: string;     // Overstyrer ferie-undertekst
    structuralNote?: string;   // Diskret strukturel note (fx §28-bemærkning)
    reservation?: boolean;     // True = hero viser "verificeret — med forbehold"
  };

  // Metadata
  signedDate: string;
  documentId: string;
}

export const DEMO_CONTRACT: ContractDetails = {
  employee: {
    name: "Sara Nielsen",
    cpr: "••••••-••••",
    address: "Havnegade 14, 2. tv., 8000 Aarhus C",
  },

  employer: {
    name: "Nordic Retail A/S",
    cvr: "38 14 72 05",
    address: "Industrivej 42, 8200 Aarhus N",
    department: "Lager & Logistik",
  },

  employment: {
    title: "Butiksassistent",
    startDate: "2024-08-01",
    type: "permanent",
    weeklyHours: 37,
    probationMonths: 3,
    noticePeriodMonths: 3,
  },

  collectiveAgreement: {
    name: "HK/DI Butiksoverenskomsten",
    id: "hk-di-butik",
    union: "HK",
    unionFullName: "HK Privat og HK HANDEL",
    employerOrg: "Dansk Industri",
  },

  salary: {
    hourlyRate: 132.00,
    trin: 0,
    trinLabel: "Individuel aftale",
    seniorityYears: 2,
    seniorityFrom: "2024-08-01",
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
    provider: "PensionDanmark",
  },

  vacation: {
    daysPerYear: 25,
    type: "Feriegodtgørelse iht. ferieloven",
  },

  signedDate: "2024-07-28",
  documentId: "ANS-2024-07-28-SN4",
};

// Analysis steps for the contract parsing animation
export const CONTRACT_ANALYSIS_STEPS = [
  { id: "read", label: "Læser dokument" },
  { id: "identify", label: "Identificerer kontrakttype" },
  { id: "agreement", label: "Finder overenskomst" },
  { id: "salary", label: "Udtrækker lønsatser" },
  { id: "terms", label: "Verificerer vilkår" },
];


