import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, STALE_TIMES } from "@/config/api";
import * as usageService from "@/services/api/usage";
import type { GetStorageParams, GetBandwidthParams } from "@/types";

// ============================================
// USAGE HOOKS
// ============================================

/**
 * Get storage usage
 */
export function useStorageUsage(params?: GetStorageParams) {
  return useQuery({
    queryKey: ["usage", "storage", params],
    queryFn: () => usageService.getStorageUsage(params),
    staleTime: STALE_TIMES.short,
    select: (response) => response.data,
  });
}

/**
 * Get bandwidth usage
 */
export function useBandwidthUsage(params?: GetBandwidthParams) {
  return useQuery({
    queryKey: ["usage", "bandwidth", params],
    queryFn: () => usageService.getBandwidthUsage(params),
    staleTime: STALE_TIMES.short,
    select: (response) => response.data,
  });
}

/**
 * Get bandwidth history
 */
export function useBandwidthHistory(months = 6) {
  return useQuery({
    queryKey: ["usage", "bandwidth", "history", months],
    queryFn: () => usageService.getBandwidthHistory(months),
    staleTime: STALE_TIMES.medium,
    select: (response) => response.data,
  });
}

/**
 * Get usage summary (combined storage, bandwidth, asset count)
 * Transforms data for UI convenience
 */
export function useUsageSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.usage.current,
    queryFn: () => usageService.getUsageSummary(),
    staleTime: STALE_TIMES.short,
    select: (response) => {
      const data = response.data;
      if (!data) return null;
      
      // Transform to add UI convenience fields
      return {
        ...data,
        storage: {
          ...data.storage,
          used: data.storage?.used ?? data.storage?.usedBytes ?? 0,
          limit: data.storage?.limit ?? data.storage?.totalBytes ?? 0,
        },
        bandwidth: {
          ...data.bandwidth,
          used: data.bandwidth?.used ?? data.bandwidth?.totalBytes ?? 0,
          limit: data.bandwidth?.limit ?? 0,
        },
        requests: data.requests ?? { count: 0, limit: 0 },
      };
    },
  });
}

// Legacy alias
export const useCurrentUsage = useUsageSummary;

/**
 * Get usage history for charts
 */
export function useUsageHistory(months = 6) {
  return useQuery({
    queryKey: ["usage", "history", months],
    queryFn: () => usageService.getBandwidthHistory(months),
    staleTime: STALE_TIMES.medium,
    select: (response) => response.data,
  });
}

// ============================================
// BILLING HOOKS
// ============================================

/**
 * Get all invoices
 * Transforms data for UI convenience
 */
export function useInvoices() {
  return useQuery({
    queryKey: QUERY_KEYS.billing.invoices,
    queryFn: () => usageService.getAllInvoices(),
    staleTime: STALE_TIMES.long,
    select: (response) => {
      const invoices = response.data || [];
      // Add UI convenience fields
      return invoices.map((invoice: any) => ({
        ...invoice,
        id: invoice.id || invoice._id,
        date: invoice.date || invoice.createdAt || invoice.month,
        pdfUrl: invoice.pdfUrl || `/api/v1/billing/invoices/${invoice._id || invoice.id}/pdf`,
      }));
    },
  });
}

/**
 * Get billing estimate for current month
 * Transforms data for UI convenience - provides plan info when available
 */
export function useBillingEstimate() {
  return useQuery({
    queryKey: QUERY_KEYS.billing.info,
    queryFn: () => usageService.getBillingEstimate(),
    staleTime: STALE_TIMES.medium,
    select: (response) => {
      const data = response.data;
      if (!data) return null;
      
      // Return with UI convenience fields
      return {
        ...data,
        plan: data.plan ?? "free",
        status: data.status ?? "active",
        amount: data.amount ?? data.estimatedAmount ?? 0,
      };
    },
  });
}

// Legacy alias
export const useBillingInfo = useBillingEstimate;

/**
 * Get invoice by month
 */
export function useInvoiceByMonth(month: string) {
  return useQuery({
    queryKey: ["billing", "invoices", "month", month],
    queryFn: () => usageService.getInvoiceByMonth(month),
    staleTime: STALE_TIMES.long,
    enabled: !!month,
    select: (response) => response.data,
  });
}

/**
 * Get invoice by ID
 */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["billing", "invoices", id],
    queryFn: () => usageService.getInvoiceById(id),
    staleTime: STALE_TIMES.long,
    enabled: !!id,
    select: (response) => response.data,
  });
}

/**
 * Generate invoice for a month
 */
export function useGenerateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (month: string) => usageService.generateInvoice(month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.invoices });
    },
  });
}

/**
 * Mark invoice as paid
 */
export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usageService.markInvoicePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.invoices });
    },
  });
}
