import type {
  ApiResponse,
  User,
  UserProfile,
  CollectiveAgreement,
  Shift,
  CalendarConnection,
  CalendarSyncRequest,
  CalendarSyncResponse,
  CalendarStats,
  PayslipAnalysis,
  EarningsData,
  EarnedItem,
  CaseRequest,
  // Nye løntjek types
  PayslipData,
  PayslipValidationResult,
  ExpectedPayslipData,
} from "./types";

// ============================================
// API Client Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Demo API til løntjek (Rule Engine)
const PAYSLIP_DEMO_API_URL = "https://paytjek-v2-rule-engine-7bnrxueh5a-lz.a.run.app/api";

// LightRAG API (Ernest + brugerdata)
const LIGHTRAG_API_URL = "https://ernst-production.up.railway.app"; // Temporarily hardcoded for testing

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem("paytjek_auth_token");
  }

  // ============================================
  // Token Management
  // ============================================

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("paytjek_auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("paytjek_auth_token");
  }

  getToken() {
    return this.token;
  }

  // ============================================
  // Base Request Method
  // ============================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || "UNKNOWN_ERROR",
            message: data.message || "An error occurred",
          },
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error",
        },
      };
    }
  }

  // ============================================
  // Auth Endpoints
  // ============================================

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async signup(email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  async getUser() {
    return this.request<User>("/auth/me");
  }

  // ============================================
  // User Profile Endpoints
  // ============================================

  /**
   * Get full user profile with all details
   */
  async getUserProfile() {
    return this.request<UserProfile>("/profile");
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: Partial<UserProfile>) {
    return this.request<UserProfile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Get available collective agreements
   */
  async getCollectiveAgreements() {
    return this.request<CollectiveAgreement[]>("/collective-agreements");
  }

  /**
   * Detect collective agreement based on employer
   */
  async detectCollectiveAgreement(employer: string) {
    return this.request<CollectiveAgreement | null>(
      "/collective-agreements/detect",
      {
        method: "POST",
        body: JSON.stringify({ employer }),
      }
    );
  }

  // ============================================
  // Calendar Endpoints
  // ============================================

  /**
   * Sync calendar from ICS URL or other source
   * This endpoint parses the ICS file and returns shifts
   */
  async syncCalendar(data: CalendarSyncRequest) {
    return this.request<CalendarSyncResponse>("/calendar/sync", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get current calendar connection status
   */
  async getCalendarConnection() {
    return this.request<CalendarConnection | null>("/calendar/connection");
  }

  /**
   * Disconnect/remove calendar connection
   */
  async disconnectCalendar() {
    return this.request<{ success: boolean }>("/calendar/disconnect", {
      method: "DELETE",
    });
  }

  /**
   * Get shifts for a specific month
   */
  async getShifts(year: number, month: number) {
    return this.request<Shift[]>(`/calendar/shifts?year=${year}&month=${month}`);
  }

  /**
   * Get all shifts (for overview)
   */
  async getAllShifts() {
    return this.request<Shift[]>("/calendar/shifts");
  }

  /**
   * Get calendar statistics for current month
   */
  async getCalendarStats(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    
    return this.request<CalendarStats>(
      `/calendar/stats${params.toString() ? `?${params}` : ""}`
    );
  }

  /**
   * Manually add a shift
   */
  async addShift(shift: Omit<Shift, "id">) {
    return this.request<Shift>("/calendar/shifts", {
      method: "POST",
      body: JSON.stringify(shift),
    });
  }

  /**
   * Force re-sync from ICS URL
   */
  async resyncCalendar() {
    return this.request<CalendarSyncResponse>("/calendar/resync", {
      method: "POST",
    });
  }

  // ============================================
  // Payslip Endpoints
  // ============================================

  /**
   * Upload and analyze a payslip
   */
  async analyzePayslip(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<PayslipAnalysis>("/payslip/analyze", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  /**
   * Get all analyzed payslips
   */
  async getPayslips() {
    return this.request<PayslipAnalysis[]>("/payslip/list");
  }

  /**
   * Get a specific payslip analysis
   */
  async getPayslip(id: string) {
    return this.request<PayslipAnalysis>(`/payslip/${id}`);
  }

  // ============================================
  // Demo Payslip Endpoints (Rule Engine API)
  // ============================================

  /**
   * Hent lønseddel med validering fra demo API
   * Tilgængelige demo payslips: "05-2024" (med warnings), "03-2025" (uden validering)
   */
  async getDemoPayslip(payslipId: string): Promise<ApiResponse<{
    payslip: PayslipData;
    expected: ExpectedPayslipData | null;
    validation: PayslipValidationResult | null;
  }>> {
    try {
      const response = await fetch(`${PAYSLIP_DEMO_API_URL}/payslips/${payslipId}`);
      const result = await response.json();
      
      if (!result.success) {
        return {
          success: false,
          error: {
            code: "API_ERROR",
            message: "Kunne ikke hente lønseddel fra demo API",
          },
        };
      }
      
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error",
        },
      };
    }
  }

  // ============================================
  // LightRAG Payslip Analysis Endpoints
  // ============================================

  /**
   * Send lønseddel-analyse til backend efter tjek
   * Gemmer analysen så Ernest kan referere til den
   */
  async submitPayslipAnalysis(data: {
    userId: string;
    payslip: PayslipData;
    validation: PayslipValidationResult;
  }): Promise<ApiResponse<{ id: string; status: string }>> {
    try {
      const response = await fetch(`${LIGHTRAG_API_URL}/api/payslip/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          analyzedAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: {
            code: "API_ERROR",
            message: result.error?.message || "Kunne ikke gemme analyse",
          },
        };
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error("[API] Fejl ved submitPayslipAnalysis:", error);
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error",
        },
      };
    }
  }

  /**
   * Hent seneste lønseddel-analyse for bruger
   * Bruges af Ernest til at få kontekst
   */
  async getLatestPayslipAnalysis(): Promise<ApiResponse<{
    id: string;
    period: string;
    employer: string;
    status: "ok" | "warnings" | "errors";
    bruttolon: number;
    nettolon: number;
    totalDifference: number;
    issuesCount: number;
    discrepancies: Array<{
      field: string;
      severity: string;
      difference: number;
      description: string;
    }>;
    analyzedAt: string;
  } | null>> {
    try {
      const response = await fetch(`${LIGHTRAG_API_URL}/api/payslip/latest`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: true, data: null }; // Ingen analyse endnu
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error("[API] Fejl ved getLatestPayslipAnalysis:", error);
      return { success: true, data: null }; // Fejl = ingen data
    }
  }

  // ============================================
  // Earnings Endpoints
  // ============================================

  async getEarnings() {
    return this.request<EarningsData>("/earnings/current");
  }

  async getEarnedItems() {
    return this.request<EarnedItem[]>("/earnings/items");
  }

  async getPaymentInfo() {
    return this.request<{
      amount: string;
      daysLeft: number;
      month: string;
    }>("/earnings/next-payment");
  }

  // ============================================
  // Case Request Endpoints (Fagforening)
  // ============================================

  async submitCase(payslipId: string, comment?: string) {
    return this.request<CaseRequest>("/cases/submit", {
      method: "POST",
      body: JSON.stringify({ payslipId, comment }),
    });
  }

  async getCases() {
    return this.request<CaseRequest[]>("/cases/list");
  }

  // ============================================
  // Ernest AI Chat
  // ============================================

  async chatWithErnest(message: string, context?: "global" | "analysis") {
    return this.request<{ response: string; suggestions?: string[] }>(
      "/ernest/chat",
      {
        method: "POST",
        body: JSON.stringify({ message, context }),
      }
    );
  }
}

// Export singleton instance
export const api = new ApiClient();


