import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CalendarSyncRequest, Shift } from "@/lib/api";

// ============================================
// Query Keys
// ============================================

export const calendarKeys = {
  all: ["calendar"] as const,
  connection: () => [...calendarKeys.all, "connection"] as const,
  shifts: () => [...calendarKeys.all, "shifts"] as const,
  shiftsForMonth: (year: number, month: number) =>
    [...calendarKeys.shifts(), year, month] as const,
  stats: (year?: number, month?: number) =>
    [...calendarKeys.all, "stats", year, month] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Get the current calendar connection status
 */
export function useCalendarConnection() {
  return useQuery({
    queryKey: calendarKeys.connection(),
    queryFn: async () => {
      const response = await api.getCalendarConnection();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get connection");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get shifts for a specific month
 */
export function useShifts(year?: number, month?: number) {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth() + 1;

  return useQuery({
    queryKey: calendarKeys.shiftsForMonth(targetYear, targetMonth),
    queryFn: async () => {
      const response = await api.getShifts(targetYear, targetMonth);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get shifts");
      }
      // Convert date strings to Date objects
      return response.data?.map((shift) => ({
        ...shift,
        date: new Date(shift.date),
      })) as Shift[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get all shifts
 */
export function useAllShifts() {
  return useQuery({
    queryKey: calendarKeys.shifts(),
    queryFn: async () => {
      const response = await api.getAllShifts();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get shifts");
      }
      // Convert date strings to Date objects
      return response.data?.map((shift) => ({
        ...shift,
        date: new Date(shift.date),
      })) as Shift[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get calendar statistics
 */
export function useCalendarStats(year?: number, month?: number) {
  return useQuery({
    queryKey: calendarKeys.stats(year, month),
    queryFn: async () => {
      const response = await api.getCalendarStats(year, month);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get stats");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Sync calendar from ICS URL or other source
 */
export function useSyncCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CalendarSyncRequest) => {
      const response = await api.syncCalendar(data);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to sync calendar");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all calendar queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

/**
 * Disconnect calendar
 */
export function useDisconnectCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.disconnectCalendar();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to disconnect");
      }
      return response.data;
    },
    onSuccess: () => {
      // Clear all calendar data
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

/**
 * Force re-sync calendar
 */
export function useResyncCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.resyncCalendar();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to resync");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

/**
 * Add a manual shift
 */
export function useAddShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shift: Omit<Shift, "id">) => {
      const response = await api.addShift(shift);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to add shift");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.shifts() });
    },
  });
}



