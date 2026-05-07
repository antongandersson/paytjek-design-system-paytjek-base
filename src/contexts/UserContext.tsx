import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from 'react';
import { api } from '@/lib/api/client';
import type { UserProfile, EmployerType, CollectiveAgreement } from '@/lib/api/types';
import { useDemo } from '@/contexts/DemoContext';

// ============================================
// LIGHTRAG API KONFIGURATION
// ============================================

const LIGHTRAG_API_URL = 'https://ernst-production.up.railway.app'; // Temporarily hardcoded for testing

// ============================================
// TYPES
// ============================================

// Kontekst til Ernest - kun de relevante felter
export interface ErnestUserContext {
  name: string;
  employer: string;
  union: string;
  jobTitle?: string;
  shiftType?: string;
  collectiveAgreement?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  getErnestContext: () => ErnestUserContext | undefined;
  detectCollectiveAgreement: (employer: string) => Promise<CollectiveAgreement | null>;
}

// ============================================
// OVERENSKOMST AUTO-DETEKTION
// ============================================

// Mapping af arbejdsgivere til overenskomster
const EMPLOYER_PATTERNS: Array<{
  pattern: RegExp;
  employerType: EmployerType;
  agreement: string;
  agreementId: string;
}> = [
  // Handel / retail / e-commerce (Dansk Erhverv)
  {
    pattern: /(coolshop|elgiganten|power|bilka|føtex|netto|salling|magasin|matas|imerco|jysk|ikea|bauhaus|bog\s*&\s*idé|coop|dagrofa)/i,
    employerType: 'other',
    agreement: 'HK/DI Butiksoverenskomsten',
    agreementId: 'hk-di-butik',
  },
  // Logistik og warehouse
  {
    pattern: /(warehouse|lager|logistik|postnord|gls|dao|bring|dsv)/i,
    employerType: 'other',
    agreement: 'HK/DI Butiksoverenskomsten',
    agreementId: 'hk-di-butik',
  },
  // Kontor og administration (HK Privat)
  {
    pattern: /(kontor|administration|service|it\s|finans|bank|forsikring)/i,
    employerType: 'other',
    agreement: 'HK/DI Butiksoverenskomsten',
    agreementId: 'hk-privat-dansk-erhverv',
  },
];

// Lokal funktion til at detektere overenskomst
function detectAgreementLocally(employer: string): { agreement: string; agreementId: string; employerType: EmployerType } | null {
  const normalizedEmployer = employer.toLowerCase().trim();
  
  for (const mapping of EMPLOYER_PATTERNS) {
    if (mapping.pattern.test(normalizedEmployer)) {
      return {
        agreement: mapping.agreement,
        agreementId: mapping.agreementId,
        employerType: mapping.employerType,
      };
    }
  }
  
  return null;
}

// ============================================
// VAGTTYPE BEREGNING
// ============================================

function calculatePrimaryShiftType(shifts: Array<{ type: string }>): 'day' | 'evening' | 'night' | 'mixed' | undefined {
  if (!shifts || shifts.length === 0) return undefined;
  
  const counts = { day: 0, evening: 0, night: 0 };
  
  for (const shift of shifts) {
    if (shift.type === 'day') counts.day++;
    else if (shift.type === 'evening') counts.evening++;
    else if (shift.type === 'night') counts.night++;
  }
  
  const total = counts.day + counts.evening + counts.night;
  if (total === 0) return undefined;
  
  // Hvis en type udgør mere end 60%, er det den primære
  if (counts.day / total > 0.6) return 'day';
  if (counts.evening / total > 0.6) return 'evening';
  if (counts.night / total > 0.6) return 'night';
  
  return 'mixed';
}

// ============================================
// CONTEXT
// ============================================

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { demoConfig } = useDemo();

  // Bygger en demo-bruger fra den aktive unions persona
  const demoMockUser = useMemo<UserProfile>(() => {
    const nameParts = demoConfig.persona.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return {
      id: `demo-${demoConfig.id}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}@example.dk`,
      phone: '+45 12 34 56 78',
      address: '',
      employer: demoConfig.persona.employer,
      employerType: 'other' as EmployerType,
      jobTitle: demoConfig.persona.jobTitle,
      department: '',
      area: 1,
      seniorityDate: '2022-01-01',
      yearsOfExperience: 3,
      union: demoConfig.name,
      unionFullName: demoConfig.fullName,
      memberNumber: `${demoConfig.name.toUpperCase()}-DEMO`,
      memberSince: 'Januar 2022',
      primaryShiftType: 'day',
      avgHoursPerWeek: 37,
      collectiveAgreement: demoConfig.collectiveAgreement,
      collectiveAgreementId: `${demoConfig.id}-demo`,
      createdAt: '2022-01-01T10:00:00Z',
      updatedAt: new Date().toISOString(),
    };
  }, [demoConfig]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoFallback, setUsingDemoFallback] = useState(false);

  // Ref so fetchUser closure always reads current demo user without recreating
  const demoMockUserRef = useRef(demoMockUser);
  useEffect(() => {
    demoMockUserRef.current = demoMockUser;
  }, [demoMockUser]);

  // When union switches and we're already in demo fallback mode, update immediately
  useEffect(() => {
    if (usingDemoFallback) {
      setUser(demoMockUser);
    }
  }, [demoMockUser, usingDemoFallback]);

  // Hent brugerdata — i demo mode bruges altid demoMockUser direkte
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Always use demo persona — no API call
    setUsingDemoFallback(true);
    setUser(demoMockUserRef.current);
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Opdater bruger
  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    // Optimistic update
    const previousUser = user;
    let newUser = { ...user, ...updates };
    
    // Auto-detect overenskomst hvis arbejdsgiver ændres
    if (updates.employer && updates.employer !== user.employer) {
      const detected = detectAgreementLocally(updates.employer);
      if (detected) {
        newUser = {
          ...newUser,
          collectiveAgreement: detected.agreement,
          collectiveAgreementId: detected.agreementId,
          employerType: detected.employerType,
        };
      }
    }
    
    setUser(newUser);
    
    try {
      // 🆕 Prøv LightRAG API først
      const lightragResponse = await fetch(`${LIGHTRAG_API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (lightragResponse.ok) {
        console.log('[UserContext] Profil opdateret via LightRAG API');
        return;
      }
      
      // Fallback til standard API
      const response = await api.updateUserProfile(updates);
      
      if (!response.success) {
        // Rollback on error
        setUser(previousUser);
        setError(response.error?.message || 'Kunne ikke opdatere profil');
      }
    } catch (err) {
      // I development: Behold ændringen lokalt
      console.warn('API opdatering fejlede, ændring beholdt lokalt:', err);
    }
  };

  // Refresh brugerdata
  const refreshUser = async () => {
    await fetchUser();
  };

  // Byg kontekst til Ernest
  const getErnestContext = (): ErnestUserContext | undefined => {
    if (!user) return undefined;
    
    return {
      name: user.firstName,
      employer: user.employer,
      union: user.union,
      jobTitle: user.jobTitle,
      shiftType: user.primaryShiftType,
      collectiveAgreement: user.collectiveAgreement,
    };
  };

  // Detekter overenskomst
  const detectCollectiveAgreement = async (employer: string): Promise<CollectiveAgreement | null> => {
    // 🆕 Prøv LightRAG API først
    try {
      const response = await fetch(`${LIGHTRAG_API_URL}/api/collective-agreements/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employer }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[UserContext] LightRAG overenskomst-detektion:', data);
        if (data) {
          return data as CollectiveAgreement;
        }
      }
    } catch (err) {
      console.warn('LightRAG API detektion fejlede, prøver lokal:', err);
    }
    
    // Fallback til lokal detektion
    const local = detectAgreementLocally(employer);
    if (local) {
      return {
        id: local.agreementId,
        name: local.agreement,
        shortName: local.agreementId,
        union: demoMockUserRef.current.union,
        employerTypes: [local.employerType],
        validFrom: '2024-04-01',
        validTo: '2026-03-31',
      };
    }
    
    // Fallback til standard API
    try {
      const response = await api.detectCollectiveAgreement(employer);
      if (response.success && response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('API detektion fejlede:', err);
    }
    
    return null;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      error,
      updateUser, 
      refreshUser,
      getErnestContext,
      detectCollectiveAgreement,
    }}>
      {children}
    </UserContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}

// ============================================
// EXPORTS
// ============================================

export { calculatePrimaryShiftType, detectAgreementLocally };
