import { get, post, patch, del } from "./client.ts";
import { API_ENDPOINTS } from "@/config/api";
import type { 
  ApiResponse, 
  ApiKey,
  CreateApiKeyRequest
} from "@/types";

// ============================================
// API KEYS SERVICE
// Endpoints: /api-keys/* (JWT authenticated)
// ============================================

/**
 * Create a new API key
 * POST /api-keys
 * Note: The full key is only returned ONCE upon creation
 */
export async function createApiKey(data: CreateApiKeyRequest): Promise<ApiResponse<ApiKey>> {
  return post<ApiResponse<ApiKey>>(API_ENDPOINTS.apiKeys.create, data);
}

/**
 * List all API keys for current user
 * GET /api-keys
 */
export async function listApiKeys(projectId?: string): Promise<ApiResponse<ApiKey[]>> {
  const params = new URLSearchParams();
  if (projectId) params.append("projectId", projectId);
  const query = params.toString();
  return get<ApiResponse<ApiKey[]>>(`${API_ENDPOINTS.apiKeys.list}${query ? `?${query}` : ""}`);
}

/**
 * Get API key by ID
 * GET /api-keys/:id
 * Note: Full key value is NOT returned
 */
export async function getApiKeyById(id: string): Promise<ApiResponse<ApiKey>> {
  return get<ApiResponse<ApiKey>>(API_ENDPOINTS.apiKeys.getById(id));
}

/**
 * Deactivate an API key
 * PATCH /api-keys/:id/deactivate
 */
export async function deactivateApiKey(id: string): Promise<ApiResponse<ApiKey>> {
  return patch<ApiResponse<ApiKey>>(API_ENDPOINTS.apiKeys.deactivate(id));
}

/**
 * Reactivate an API key
 * PATCH /api-keys/:id/reactivate
 */
export async function reactivateApiKey(id: string): Promise<ApiResponse<ApiKey>> {
  return patch<ApiResponse<ApiKey>>(API_ENDPOINTS.apiKeys.reactivate(id));
}

/**
 * Rotate an API key (generate new secret)
 * POST /api-keys/:id/rotate
 * Note: The new key is only returned ONCE. Old key is immediately invalidated.
 */
export async function rotateApiKey(id: string): Promise<ApiResponse<ApiKey>> {
  return post<ApiResponse<ApiKey>>(API_ENDPOINTS.apiKeys.rotate(id));
}

/**
 * Delete an API key
 * DELETE /api-keys/:id
 */
export async function deleteApiKey(id: string): Promise<ApiResponse<null>> {
  return del<ApiResponse<null>>(API_ENDPOINTS.apiKeys.delete(id));
}

// Legacy exports for backward compatibility
export const getApiKeys = listApiKeys;
export const getApiKey = getApiKeyById;
export const revokeApiKey = deleteApiKey;
export const regenerateApiKey = rotateApiKey;
export type CreateApiKeyData = CreateApiKeyRequest;
