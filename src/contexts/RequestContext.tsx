import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';

// ============================================
// TYPES
// ============================================

export type RequestStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface SalaryRequest {
  id: string;
  // Periode info
  period: string;              // "Maj 2024"
  employer: string;            // "Region Hovedstaden"
  department?: string;         // "Bispebjerg Hospital"
  
  // Anmodningsdetaljer
  totalDifference: number;     // -1409.96
  issuesCount: number;         // 4
  issues: Array<{
    field: string;
    label: string;
    difference: number;
    okReference: string;
    atReference: string;
  }>;
  
  // Brugerens besked
  message: string;
  
  // Status
  status: RequestStatus;
  statusMessage?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface RequestContextType {
  requests: SalaryRequest[];
  pendingCount: number;
  
  // Actions
  addRequest: (request: Omit<SalaryRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => SalaryRequest;
  updateRequestStatus: (id: string, status: RequestStatus, message?: string) => void;
  getRequest: (id: string) => SalaryRequest | null;
  clearRequests: () => void;
  clearAllData: () => void;  // For logout
}

// ============================================
// STORAGE
// ============================================

const STORAGE_KEY = 'paytjek_requests';

const STORAGE_VERSION = 'v2-coolshop';

function loadFromStorage(): SalaryRequest[] {
  try {
    const version = localStorage.getItem(STORAGE_KEY + '_version');
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY + '_version', STORAGE_VERSION);
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Kunne ikke læse anmodninger fra localStorage:', e);
  }
  return [];
}

function saveToStorage(requests: SalaryRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.warn('Kunne ikke gemme anmodninger til localStorage:', e);
  }
}

// ============================================
// CONTEXT
// ============================================

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SalaryRequest[]>(() => loadFromStorage());

  // Gem til localStorage når requests ændres
  useEffect(() => {
    saveToStorage(requests);
  }, [requests]);

  // Antal afventende anmodninger
  const pendingCount = useMemo(() => 
    requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    [requests]
  );

  // Tilføj ny anmodning
  const addRequest = useCallback((requestData: Omit<SalaryRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SalaryRequest => {
    const newRequest: SalaryRequest = {
      ...requestData,
      id: `REQ-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  }, []);

  // Opdater status på anmodning
  const updateRequestStatus = useCallback((id: string, status: RequestStatus, message?: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          statusMessage: message,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : req.resolvedAt,
        };
      }
      return req;
    }));
  }, []);

  // Hent enkelt anmodning
  const getRequest = useCallback((id: string): SalaryRequest | null => {
    return requests.find(r => r.id === id) || null;
  }, [requests]);

  // Ryd alle anmodninger
  const clearRequests = useCallback(() => {
    setRequests([]);
  }, []);

  // Ryd alt data (til logout)
  const clearAllData = useCallback(() => {
    setRequests([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const contextValue = useMemo(() => ({
    requests,
    pendingCount,
    addRequest,
    updateRequestStatus,
    getRequest,
    clearRequests,
    clearAllData,
  }), [requests, pendingCount, addRequest, updateRequestStatus, getRequest, clearRequests, clearAllData]);

  return (
    <RequestContext.Provider value={contextValue}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests skal bruges inden for RequestProvider');
  }
  return context;
}
