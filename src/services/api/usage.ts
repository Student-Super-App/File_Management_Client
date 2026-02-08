import { get, post } from "./client.ts";
import { API_ENDPOINTS } from "@/config/api";
import type { 
  ApiResponse,
  StorageUsage,
  BandwidthUsage,
  UsageSummary,
  Invoice,
  BillingEstimate,
  GetStorageParams,
  GetBandwidthParams
} from "@/types";

// ============================================
// USAGE SERVICE
// Endpoints: /usage/* (JWT authenticated)
// ============================================

/**
 * Get storage usage
 * GET /usage/storage
 */
export async function getStorageUsage(params?: GetStorageParams): Promise<ApiResponse<StorageUsage>> {
  const searchParams = new URLSearchParams();
  if (params?.projectId) searchParams.append("projectId", params.projectId);
  const query = searchParams.toString();
  return get<ApiResponse<StorageUsage>>(
    `${API_ENDPOINTS.usage.storage}${query ? `?${query}` : ""}`
  );
}

/**
 * Get bandwidth usage
 * GET /usage/bandwidth
 */
export async function getBandwidthUsage(params?: GetBandwidthParams): Promise<ApiResponse<BandwidthUsage>> {
  const searchParams = new URLSearchParams();
  if (params?.month) searchParams.append("month", params.month);
  if (params?.projectId) searchParams.append("projectId", params.projectId);
  const query = searchParams.toString();
  return get<ApiResponse<BandwidthUsage>>(
    `${API_ENDPOINTS.usage.bandwidth}${query ? `?${query}` : ""}`
  );
}

/**
 * Get bandwidth history
 * GET /usage/bandwidth/history
 */
export async function getBandwidthHistory(months = 6): Promise<ApiResponse<BandwidthUsage[]>> {
  return get<ApiResponse<BandwidthUsage[]>>(
    `${API_ENDPOINTS.usage.bandwidthHistory}?months=${months}`
  );
}

/**
 * Get usage summary
 * GET /usage/summary
 */
export async function getUsageSummary(): Promise<ApiResponse<UsageSummary>> {
  return get<ApiResponse<UsageSummary>>(API_ENDPOINTS.usage.summary);
}

// ============================================
// BILLING SERVICE
// Endpoints: /billing/* (JWT authenticated)
// ============================================

/**
 * Get all invoices
 * GET /billing/invoices
 */
export async function getAllInvoices(): Promise<ApiResponse<Invoice[]>> {
  return get<ApiResponse<Invoice[]>>(API_ENDPOINTS.billing.invoices);
}

/**
 * Get current billing estimate
 * GET /billing/estimate
 */
export async function getBillingEstimate(): Promise<ApiResponse<BillingEstimate>> {
  return get<ApiResponse<BillingEstimate>>(API_ENDPOINTS.billing.estimate);
}

/**
 * Get invoice by month
 * GET /billing/invoices/month/:month
 */
export async function getInvoiceByMonth(month: string): Promise<ApiResponse<Invoice>> {
  return get<ApiResponse<Invoice>>(API_ENDPOINTS.billing.invoiceByMonth(month));
}

/**
 * Get invoice by ID
 * GET /billing/invoices/:id
 */
export async function getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
  return get<ApiResponse<Invoice>>(API_ENDPOINTS.billing.invoiceById(id));
}

/**
 * Generate invoice for a month
 * POST /billing/invoices/generate
 */
export async function generateInvoice(month: string): Promise<ApiResponse<Invoice>> {
  return post<ApiResponse<Invoice>>(API_ENDPOINTS.billing.generateInvoice, { month });
}

/**
 * Mark invoice as paid
 * POST /billing/invoices/:id/pay
 */
export async function markInvoicePaid(id: string): Promise<ApiResponse<Invoice>> {
  return post<ApiResponse<Invoice>>(API_ENDPOINTS.billing.markPaid(id));
}

// Legacy exports for backward compatibility
export async function getCurrentUsage(): Promise<ApiResponse<UsageSummary>> {
  return getUsageSummary();
}

export async function getBillingInfo(): Promise<ApiResponse<BillingEstimate>> {
  return getBillingEstimate();
}
