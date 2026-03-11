import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { DEMO_CONTRACT, type ContractDetails } from '@/lib/demoContract';

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
  const [contract, setContract] = useState<ContractData | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedContract = localStorage.getItem(STORAGE_KEYS.CONTRACT);
    if (savedContract) {
      try { setContract(JSON.parse(savedContract)); } catch { /* ignore */ }
    }
    const savedDetails = localStorage.getItem(STORAGE_KEYS.CONTRACT_DETAILS);
    if (savedDetails) {
      try { setContractDetails(JSON.parse(savedDetails)); } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (contract) {
      localStorage.setItem(STORAGE_KEYS.CONTRACT, JSON.stringify(contract));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CONTRACT);
    }
  }, [contract]);

  useEffect(() => {
    if (contractDetails) {
      localStorage.setItem(STORAGE_KEYS.CONTRACT_DETAILS, JSON.stringify(contractDetails));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CONTRACT_DETAILS);
    }
  }, [contractDetails]);

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

      // Automatically start the "AI parsing" animation
      startAnalysisInternal();
    } catch (error) {
      toast.error('Kunne ikke uploade kontrakt', { description: 'Prøv igen senere' });
      setIsUploading(false);
      throw error;
    }
  }, []);

  // Internal analysis runner with step-by-step progress
  const startAnalysisInternal = useCallback(() => {
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
        setContractDetails(DEMO_CONTRACT);
        setAnalysisState('done');
        toast.success('Kontrakt analyseret', {
          description: `Overenskomst: ${DEMO_CONTRACT.collectiveAgreement.name}`,
        });
      }
    }, stepDuration);
  }, []);

  // Public trigger (for re-analysis)
  const startAnalysis = useCallback(() => {
    startAnalysisInternal();
  }, [startAnalysisInternal]);

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
