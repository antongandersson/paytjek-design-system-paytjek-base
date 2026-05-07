import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { type ContractDetails } from '@/lib/demoContract';
import { useDemo } from '@/contexts/DemoContext';
import type { UnionDemoConfig } from '@/lib/demoUnionConfigs';
import { getUnionConfig } from '@/lib/demoUnionConfigs';

// ============================================
// Types
// ============================================

interface ContractData {
  id: string;
  filename: string;
  uploadedAt: string;
  fileSize: number;
  fileType: string;
}

type AnalysisState = 'idle' | 'analyzing' | 'done';

interface ContractContextType {
  contract: ContractData | null;
  contractDetails: ContractDetails | null;
  isUploading: boolean;
  analysisState: AnalysisState;
  analysisProgress: number;

  hasContract: boolean;
  hasDetails: boolean;

  uploadContract: (file: File) => Promise<void>;
  startAnalysis: () => void;
  removeContract: () => void;
  clearAllData: () => void;
}

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  CONTRACT: 'paytjek_contract_data',
  CONTRACT_DETAILS: 'paytjek_contract_details',
} as const;

// ============================================
// Context
// ============================================

const ContractContext = createContext<ContractContextType | null>(null);

// ─── Byg demo-kontrakt fra union-config ───────────────────────────────────────

function buildDemoContract(config: UnionDemoConfig): ContractDetails {
  if (config.id === "foa") return buildFoaContract(config);
  if (config.id === "djoef") return buildDjoefContract(config);
  return buildGenericContract(config);
}

function buildFoaContract(config: UnionDemoConfig): ContractDetails {
  const startDate = "2022-03-01";
  return {
    employee: {
      name: config.persona.name,
      cpr: "••••••-••••",
      address: "Strandvejen 42, 3. th., 6700 Esbjerg",
    },
    employer: {
      name: config.persona.employer,
      cvr: config.persona.cvr,
      address: "Torvegade 74, 6700 Esbjerg",
      department: "Botilbuddet Søndervang",
    },
    employment: {
      title: config.persona.jobTitle,
      startDate,
      type: "permanent",
      weeklyHours: 32,
      probationMonths: 3,
      noticePeriodMonths: 1,
    },
    collectiveAgreement: {
      name: config.collectiveAgreement,
      id: "foa-demo",
      union: config.name,
      unionFullName: config.fullName,
      employerOrg: "KL (Kommunernes Landsforening)",
    },
    salary: {
      hourlyRate: config.payslip.salary.timelon,
      trin: 24,
      trinLabel: "Trin 24 (SSA grundløn)",
      seniorityYears: 4,
      seniorityFrom: startDate,
      fritvalgPercent: 1.29,
    },
    supplements: {
      type: "agreement",
      description: "Arbejdstidsbestemte tillæg iht. 79.01 §13, stk. 2 (procentbaseret af timeløn)",
      rules: [
        { label: "Aftentillæg (kl. 17–23)", rule: "36% af timeløn" },
        { label: "Nattillæg (kl. 23–06)", rule: "40% af timeløn" },
        { label: "Lørdagstillæg (kl. 06–24)", rule: "32% af timeløn" },
        { label: "Søn-/helligdagstillæg (kl. 00–24)", rule: "50% af timeløn" },
      ],
    },
    pension: {
      employeePercent: 4.67,
      employerPercent: 9.33,
      provider: "PenSam",
    },
    vacation: {
      daysPerYear: 25,
      type: "Feriegodtgørelse iht. ferieloven",
    },
    signedDate: startDate,
    documentId: "ANS-2022-03-01-MS",
  };
}

function buildDjoefContract(config: UnionDemoConfig): ContractDetails {
  const startDate = "2019-09-01";
  return {
    employee: {
      name: config.persona.name,
      cpr: "150394-••••",
      address: "Østerbrogade 142, 3. tv., 2100 København Ø",
    },
    employer: {
      name: config.persona.employer,
      cvr: config.persona.cvr,
      address: "Slotsholmsgade 10, 1216 København K",
      department: "Departementet",
    },
    employment: {
      title: config.persona.jobTitle,
      startDate,
      type: "permanent",
      weeklyHours: 37,
      probationMonths: 3,
      noticePeriodMonths: 6,
    },
    collectiveAgreement: {
      name: config.collectiveAgreement,
      id: "djoef-demo",
      union: config.name,
      unionFullName: config.fullName,
      employerOrg: "Skatteministeriet (Medarbejder- og Kompetencestyrelsen)",
    },
    salary: {
      hourlyRate: config.payslip.salary.timelon,
      trin: 8,
      trinLabel: "Trin 8 (sluttrin, nyt lønsystem)",
      seniorityYears: 6,
      seniorityFrom: startDate,
      fritvalgPercent: 3.07,
    },
    supplements: {
      type: "agreement",
      description: "Rådighedstillæg + merarbejde iht. AC-overenskomsten, bilag 6, pkt. 9",
      rules: [
        { label: "Rådighedstillæg (4.–6. år)", rule: "4.361,53 kr./md" },
        { label: "Merarbejdsforpligtelse", rule: "Op til 20 timer/kvartal" },
        { label: "Valgfri pension (>15%)", rule: "3,07%-point kan udbetales" },
      ],
    },
    pension: {
      employeePercent: 6.02,
      employerPercent: 12.05,
      provider: "P+",
    },
    vacation: {
      daysPerYear: 25,
      type: "Ferie med løn iht. Ferieaftalen (staten) + 5 særlige feriedage",
    },
    signedDate: startDate,
    documentId: "ANS-2019-09-01-SKA",
  };
}

function buildGenericContract(config: UnionDemoConfig): ContractDetails {
  const startDate = `${new Date().getFullYear() - 3}-01-15`;
  return {
    employee: {
      name: config.persona.name,
      cpr: "••••••-••••",
      address: "",
    },
    employer: {
      name: config.persona.employer,
      cvr: config.persona.cvr,
      address: "",
      department: "",
    },
    employment: {
      title: config.persona.jobTitle,
      startDate,
      type: "permanent",
      weeklyHours: 37,
      probationMonths: 3,
      noticePeriodMonths: 3,
    },
    collectiveAgreement: {
      name: config.collectiveAgreement,
      id: `${config.id}-demo`,
      union: config.name,
      unionFullName: config.fullName,
      employerOrg: "",
    },
    salary: {
      hourlyRate: config.payslip.salary.timelon,
      trin: 0,
      trinLabel: "Individuel aftale",
      seniorityYears: 3,
      seniorityFrom: startDate,
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
      employeePercent: config.payslip.deductions.pension.procent ?? 5,
      employerPercent: (config.payslip.deductions.pension.procent ?? 5) * 2,
      provider: "Pensionskasse",
    },
    vacation: {
      daysPerYear: 25,
      type: "Feriegodtgørelse iht. ferieloven",
    },
    signedDate: startDate,
    documentId: `ANS-${startDate}-${config.persona.firstName?.substring(0, 2).toUpperCase() ?? "XX"}`,
  };
}

export function useContract() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}

// ============================================
// Provider
// ============================================

export function ContractProvider({ children }: { children: ReactNode }) {
  const { demoConfig } = useDemo();
  
  // Start empty — user uploads contract to trigger demo data
  const [contract, setContract] = useState<ContractData | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Reset to empty when union changes (navigating between unions)
  useEffect(() => {
    setContract(null);
    setContractDetails(null);
    setAnalysisState('idle');
  }, [demoConfig.id]);

  // Upload contract (stores metadata, triggers analysis)
  const uploadContract = useCallback(async (file: File) => {
    setIsUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const contractData: ContractData = {
        id: `contract-${Date.now()}`,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        fileType: file.type,
      };

      setContract(contractData);
      setIsUploading(false);

      // Start analysis animation, then inject union-specific contract
      setAnalysisState('analyzing');
      setAnalysisProgress(0);

      const totalSteps = 5;
      const stepDuration = 1200;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        setAnalysisProgress(Math.min((step / totalSteps) * 100, 100));

        if (step >= totalSteps) {
          clearInterval(interval);
          // Read union DIRECTLY from URL — no closure, no ref, no React
          const urlSegment = window.location.pathname.split("/")[1] || "hk";
          const freshConfig = getUnionConfig(urlSegment);
          const details = buildDemoContract(freshConfig);
          setContractDetails(details);
          setAnalysisState('done');
          toast.success('Kontrakt analyseret', {
            description: `Overenskomst: ${details.collectiveAgreement.name}`,
          });
        }
      }, stepDuration);
    } catch (error) {
      toast.error('Kunne ikke uploade kontrakt', { description: 'Prøv igen senere' });
      setIsUploading(false);
      throw error;
    }
  }, []);

  // Public trigger (for re-analysis)
  const startAnalysis = useCallback(() => {
    setAnalysisState('analyzing');
    setAnalysisProgress(0);
    const totalSteps = 5;
    const stepDuration = 1200;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnalysisProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        const urlSegment = window.location.pathname.split("/")[1] || "hk";
        const freshConfig = getUnionConfig(urlSegment);
        const details = buildDemoContract(freshConfig);
        setContractDetails(details);
        setAnalysisState('done');
      }
    }, stepDuration);
  }, []);

  const removeContract = useCallback(() => {
    setContract(null);
    setContractDetails(null);
    setAnalysisState('idle');
    setAnalysisProgress(0);
    toast.info('Kontrakt fjernet');
  }, []);

  const clearAllData = useCallback(() => {
    setContract(null);
    setContractDetails(null);
    setIsUploading(false);
    setAnalysisState('idle');
    setAnalysisProgress(0);
    localStorage.removeItem(STORAGE_KEYS.CONTRACT);
    localStorage.removeItem(STORAGE_KEYS.CONTRACT_DETAILS);
  }, []);

  const hasContract = useMemo(() => !!contract, [contract]);
  const hasDetails = useMemo(() => !!contractDetails, [contractDetails]);

  const value = useMemo<ContractContextType>(() => ({
    contract,
    contractDetails,
    isUploading,
    analysisState,
    analysisProgress,
    hasContract,
    hasDetails,
    uploadContract,
    startAnalysis,
    removeContract,
    clearAllData,
  }), [
    contract, contractDetails, isUploading, analysisState, analysisProgress,
    hasContract, hasDetails,
    uploadContract, startAnalysis, removeContract, clearAllData,
  ]);

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}
