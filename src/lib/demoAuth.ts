/**
 * Demo Authentication System
 * 
 * Simple localStorage-based auth for demo/presentation purposes.
 * No real backend - just validates against hardcoded credentials.
 */

// ============================================
// DEMO CREDENTIALS
// ============================================

const DEMO_CREDENTIALS = {
  email: 'sara@demo.dk',
  password: 'demo1234',
};

// ============================================
// SESSION MANAGEMENT
// ============================================

interface DemoSession {
  loggedIn: boolean;
  email: string;
  loginTime: number;
}

const SESSION_KEY = 'paytjek_demo_session';

/**
 * Login with demo credentials
 */
export function login(email: string, password: string): boolean {
  // Check credentials
  if (email.toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    // Create session
    const session: DemoSession = {
      loggedIn: true,
      email: email.toLowerCase(),
      loginTime: Date.now(),
    };
    
    // Save to localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    console.log('✅ Demo login successful:', email);
    return true;
  }
  
  console.log('❌ Demo login failed: Invalid credentials');
  return false;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  
  if (!sessionStr) {
    return false;
  }
  
  try {
    const session: DemoSession = JSON.parse(sessionStr);
    return session.loggedIn === true;
  } catch (error) {
    console.error('Failed to parse session:', error);
    return false;
  }
}

/**
 * Get current session
 */
export function getSession(): DemoSession | null {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  
  if (!sessionStr) {
    return null;
  }
  
  try {
    return JSON.parse(sessionStr);
  } catch (error) {
    console.error('Failed to parse session:', error);
    return null;
  }
}

/**
 * Logout - clear session
 */
export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  console.log('✅ Demo logout successful');
}

/**
 * Get demo credentials (for display in dev mode)
 */
export function getDemoCredentials() {
  return {
    email: DEMO_CREDENTIALS.email,
    password: '••••••••', // Don't expose actual password
  };
}

// ============================================
// OPTIONAL: Session expiry (uncomment if needed)
// ============================================

/**
 * Check if session is expired (24 hours)
 */
export function isSessionExpired(): boolean {
  const session = getSession();
  
  if (!session) {
    return true;
  }
  
  const expiryTime = 24 * 60 * 60 * 1000; // 24 hours in ms
  const now = Date.now();
  const sessionAge = now - session.loginTime;
  
  return sessionAge > expiryTime;
}

/**
 * Check if logged in AND session not expired
 */
export function isValidSession(): boolean {
  return isLoggedIn() && !isSessionExpired();
}
