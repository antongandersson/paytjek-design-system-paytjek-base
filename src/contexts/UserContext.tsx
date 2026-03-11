import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api/client';
import type { UserProfile, EmployerType, CollectiveAgreement } from '@/lib/api/types';

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
    agreement: 'Funktionæroverenskomst for Handel, Viden og Service',
    agreementId: 'hk-handel-dansk-erhverv',
  },
  // Logistik og warehouse
  {
    pattern: /(warehouse|lager|logistik|postnord|gls|dao|bring|dsv)/i,
    employerType: 'other',
    agreement: 'Funktionæroverenskomst for Handel, Viden og Service',
    agreementId: 'hk-handel-dansk-erhverv',
  },
  // Kontor og administration (HK Privat)
  {
    pattern: /(kontor|administration|service|it\s|finans|bank|forsikring)/i,
    employerType: 'other',
    agreement: 'Funktionæroverenskomst for Handel, Viden og Service',
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
// MOCK DATA - Bruges når API ikke er tilgængelig
// ============================================

const MOCK_USER: UserProfile = {
  id: 'user-1',
  firstName: 'Emil',
  lastName: 'Hansen',
  email: 'emil.hansen@example.dk',
  phone: '+45 12 34 56 78',
  address: 'Myrdalstræde 76, st., 9220 Aalborg Ø',

  employer: 'Coolshop A/S',
  employerType: 'other',
  jobTitle: 'Warehouse Assistant',
  department: 'Warehouse',
  area: 1,

  seniorityDate: '2023-09-18',
  yearsOfExperience: 2,

  union: 'HK',
  unionFullName: 'HK Privat og HK HANDEL',
  memberNumber: 'HK-2025-48291',
  memberSince: 'September 2023',

  primaryShiftType: 'day',
  avgHoursPerWeek: 37,

  collectiveAgreement: 'Funktionæroverenskomst for Handel, Viden og Service',
  collectiveAgreementId: 'hk-handel-dansk-erhverv',

  createdAt: '2023-09-18T10:00:00Z',
  updatedAt: '2025-01-15T14:30:00Z',
};

// ============================================
// CONTEXT
// ============================================

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hent brugerdata fra API
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 🆕 Prøv LightRAG API først
      const lightragResponse = await fetch(`${LIGHTRAG_API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (lightragResponse.ok) {
        const lightragData = await lightragResponse.json();
        console.log('[UserContext] Bruger LightRAG API profil:', lightragData);
        
        let userData = lightragData as UserProfile;
        
        // Auto-detect overenskomst hvis ikke sat
        if (!userData.collectiveAgreement && userData.employer) {
          const detected = detectAgreementLocally(userData.employer);
          if (detected) {
            userData = {
              ...userData,
              collectiveAgreement: detected.agreement,
              collectiveAgreementId: detected.agreementId,
              employerType: detected.employerType,
            };
          }
        }
        
        setUser(userData);
        return;
      }
      
      // Fallback til standard API
      const response = await api.getUserProfile();
      
      if (response.success && response.data) {
        let userData = response.data;
        
        // Auto-detect overenskomst hvis ikke sat
        if (!userData.collectiveAgreement && userData.employer) {
          const detected = detectAgreementLocally(userData.employer);
          if (detected) {
            userData = {
              ...userData,
              collectiveAgreement: detected.agreement,
              collectiveAgreementId: detected.agreementId,
              employerType: detected.employerType,
            };
          }
        }
        
        setUser(userData);
      } else {
        // API ikke tilgængelig - brug mock data (development)
        console.warn('API ikke tilgængelig, bruger mock data');
        setUser(MOCK_USER);
      }
    } catch (err) {
      console.warn('Fejl ved hentning af brugerdata, bruger mock data:', err);
      // Fallback til mock data
      setUser(MOCK_USER);
    } finally {
      setIsLoading(false);
    }
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
        union: MOCK_USER.union,
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
