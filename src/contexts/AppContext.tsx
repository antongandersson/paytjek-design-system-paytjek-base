import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ============================================
// LOCALSTORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  APP_STATE: 'paytjek_app_state',
  SEEN_FEATURES: 'paytjek_seen_features',
} as const;

// ============================================
// TYPES
// ============================================

interface AppState {
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt: string | null;  // ISO date
  firstVisitAt: string;                   // ISO date
  lastActiveAt: string;                   // ISO date
}

interface AppContextType {
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // First-time experiences
  hasSeenFeature: (feature: string) => boolean;
  markFeatureSeen: (feature: string) => void;
  resetSeenFeatures: () => void;
  
  // App state
  isFirstVisit: boolean;
  lastActiveDate: Date | null;
  
  // Setup status helpers
  setupStatus: {
    hasCalendar: boolean;
    hasPayslip: boolean;
    hasProfile: boolean;
    isFullySetup: boolean;
    setupProgress: number;  // 0-100
  };
  
  // Update setup status (called by other contexts)
  updateSetupStatus: (status: Partial<AppContextType['setupStatus']>) => void;
  
  // 🆕 Clear all data (for logout)
  clearAllData: () => void;
}

const DEFAULT_APP_STATE: AppState = {
  hasCompletedOnboarding: false,
  onboardingCompletedAt: null,
  firstVisitAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
};

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

function loadFromStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn(`Fejl ved læsning af ${key} fra localStorage:`, e);
    return null;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Fejl ved gemning af ${key} til localStorage:`, e);
  }
}

// ============================================
// CONTEXT
// ============================================

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // App state
  const [appState, setAppState] = useState<AppState>(DEFAULT_APP_STATE);
  const [seenFeatures, setSeenFeatures] = useState<Set<string>>(new Set());
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  // Setup status (tracked from other contexts)
  const [setupStatus, setSetupStatus] = useState({
    hasCalendar: false,
    hasPayslip: false,
    hasProfile: false,
    isFullySetup: false,
    setupProgress: 0,
  });

  // ============================================
  // LOAD FROM LOCALSTORAGE ON MOUNT
  // ============================================
  
  useEffect(() => {
    const savedState = loadFromStorage<AppState>(STORAGE_KEYS.APP_STATE);
    const savedFeatures = loadFromStorage<string[]>(STORAGE_KEYS.SEEN_FEATURES);
    
    if (savedState) {
      setAppState({
        ...savedState,
        lastActiveAt: new Date().toISOString(),
      });
      setIsFirstVisit(false);
    } else {
      // First visit - create initial state
      const initialState: AppState = {
        ...DEFAULT_APP_STATE,
        firstVisitAt: new Date().toISOString(),
      };
      setAppState(initialState);
      saveToStorage(STORAGE_KEYS.APP_STATE, initialState);
      setIsFirstVisit(true);
    }
    
    if (savedFeatures) {
      setSeenFeatures(new Set(savedFeatures));
    }
  }, []);

  // ============================================
  // SAVE TO LOCALSTORAGE ON CHANGE
  // ============================================
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APP_STATE, appState);
  }, [appState]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SEEN_FEATURES, Array.from(seenFeatures));
  }, [seenFeatures]);

  // ============================================
  // ONBOARDING ACTIONS
  // ============================================

  const completeOnboarding = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      onboardingCompletedAt: new Date().toISOString(),
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      hasCompletedOnboarding: false,
      onboardingCompletedAt: null,
    }));
  }, []);

  // ============================================
  // FEATURE TRACKING
  // ============================================

  const hasSeenFeature = useCallback((feature: string): boolean => {
    return seenFeatures.has(feature);
  }, [seenFeatures]);

  const markFeatureSeen = useCallback((feature: string) => {
    setSeenFeatures(prev => new Set([...prev, feature]));
  }, []);

  const resetSeenFeatures = useCallback(() => {
    setSeenFeatures(new Set());
  }, []);

  // ============================================
  // SETUP STATUS
  // ============================================

  const updateSetupStatus = useCallback((status: Partial<AppContextType['setupStatus']>) => {
    setSetupStatus(prev => {
      const newStatus = { ...prev, ...status };
      
      // Beregn progress
      let progress = 0;
      if (newStatus.hasProfile) progress += 33;
      if (newStatus.hasCalendar) progress += 33;
      if (newStatus.hasPayslip) progress += 34;
      
      newStatus.setupProgress = progress;
      newStatus.isFullySetup = progress === 100;
      
      return newStatus;
    });
  }, []);

  // 🆕 Ryd ALT data inkl. localStorage (til logout)
  const clearAllData = useCallback(() => {
    setAppState(DEFAULT_APP_STATE);
    setSeenFeatures(new Set());
    setIsFirstVisit(true);
    setSetupStatus({
      hasCalendar: false,
      hasPayslip: false,
      hasProfile: false,
      isFullySetup: false,
      setupProgress: 0,
    });
    // Ryd localStorage
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
    localStorage.removeItem(STORAGE_KEYS.SEEN_FEATURES);
  }, []);

  // Computed
  const lastActiveDate = appState.lastActiveAt ? new Date(appState.lastActiveAt) : null;

  return (
    <AppContext.Provider value={{
      // Onboarding
      hasCompletedOnboarding: appState.hasCompletedOnboarding,
      completeOnboarding,
      resetOnboarding,
      
      // Features
      hasSeenFeature,
      markFeatureSeen,
      resetSeenFeatures,
      
      // App state
      isFirstVisit,
      lastActiveDate,
      
      // Setup status
      setupStatus,
      updateSetupStatus,
      
      // Logout
      clearAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useApp() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}

// ============================================
// FEATURE KEYS (for consistency)
// ============================================

export const FEATURES = {
  WELCOME_BUBBLE: 'welcome_bubble',
  CALENDAR_INTRO: 'calendar_intro',
  PAYSLIP_INTRO: 'payslip_intro',
  ERNEST_INTRO: 'ernest_intro',
  DASHBOARD_TOUR: 'dashboard_tour',
} as const;
