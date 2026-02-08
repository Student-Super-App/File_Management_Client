import { 
  getWithApiKey, 
  postWithApiKey, 
  patchWithApiKey, 
  delWithApiKey 
} from "./client.ts";
import { API_ENDPOINTS } from "@/config/api";
import type { 
  ApiResponse,
  PaginatedResponse,
  Asset,
  PresignedUploadResponse,
  PresignUploadRequest,
  ConfirmUploadRequest,
  ListAssetsParams,
  UpdateAssetVisibilityRequest
} from "@/types";

// ============================================
// UPLOADS SERVICE
// Endpoints: /uploads/* (API Key authenticated via X-API-Key header)
// ============================================

/**
 * Generate presigned upload URL
 * POST /uploads/presign
 * Authentication: API Key (X-API-Key header)
 */
export async function generatePresignedUrl(
  data: PresignUploadRequest,
  apiKey: string
): Promise<ApiResponse<PresignedUploadResponse>> {
  return postWithApiKey<ApiResponse<PresignedUploadResponse>>(
    API_ENDPOINTS.uploads.presign,
    data,
    apiKey
  );
}

/**
 * Confirm upload completion
 * POST /uploads/confirm
 * Authentication: API Key (X-API-Key header)
 */
export async function confirmUpload(
  data: ConfirmUploadRequest,
  apiKey: string
): Promise<ApiResponse<Asset>> {
  return postWithApiKey<ApiResponse<Asset>>(
    API_ENDPOINTS.uploads.confirm,
    data,
    apiKey
  );
}

// ============================================
// ASSETS SERVICE
// Endpoints: /assets/* (API Key authenticated via X-API-Key header)
// ============================================

/**
 * List assets
 * GET /assets
 * Authentication: API Key with 'read' scope
 */
export async function listAssets(
  params: ListAssetsParams,
  apiKey: string
): Promise<PaginatedResponse<Asset>> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.append("category", params.category);
  if (params.visibility) searchParams.append("visibility", params.visibility);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  
  const query = searchParams.toString();
  return getWithApiKey<PaginatedResponse<Asset>>(
    `${API_ENDPOINTS.assets.list}${query ? `?${query}` : ""}`,
    apiKey
  );
}

/**
 * Get asset by storage reference
 * GET /assets/ref/:storageRef
 * Authentication: API Key with 'read' scope
 */
export async function getAssetByRef(
  storageRef: string,
  apiKey: string
): Promise<ApiResponse<Asset>> {
  return getWithApiKey<ApiResponse<Asset>>(
    API_ENDPOINTS.assets.getByRef(storageRef),
    apiKey
  );
}

/**
 * Get asset by ID
 * GET /assets/:id
 * Authentication: API Key with 'read' scope
 */
export async function getAssetById(
  id: string,
  apiKey: string
): Promise<ApiResponse<Asset>> {
  return getWithApiKey<ApiResponse<Asset>>(
    API_ENDPOINTS.assets.getById(id),
    apiKey
  );
}

/**
 * Get signed URL for private asset
 * GET /assets/:id/signed-url
 * Authentication: API Key with 'read' scope
 */
export async function getSignedUrl(
  id: string,
  apiKey: string,
  expiresIn = 3600
): Promise<ApiResponse<{ signedUrl: string; expiresAt: string }>> {
  return getWithApiKey<ApiResponse<{ signedUrl: string; expiresAt: string }>>(
    `${API_ENDPOINTS.assets.getSignedUrl(id)}?expiresIn=${expiresIn}`,
    apiKey
  );
}

/**
 * Update asset visibility
 * PATCH /assets/:id/visibility
 * Authentication: API Key with 'upload' scope
 */
export async function updateAssetVisibility(
  id: string,
  data: UpdateAssetVisibilityRequest,
  apiKey: string
): Promise<ApiResponse<Asset>> {
  return patchWithApiKey<ApiResponse<Asset>>(
    API_ENDPOINTS.assets.updateVisibility(id),
    data,
    apiKey
  );
}

/**
 * Delete asset
 * DELETE /assets/:id
 * Authentication: API Key with 'delete' scope
 */
export async function deleteAsset(
  id: string,
  apiKey: string
): Promise<ApiResponse<null>> {
  return delWithApiKey<ApiResponse<null>>(
    API_ENDPOINTS.assets.delete(id),
    apiKey
  );
}

// Legacy exports for backward compatibility
export const getAssets = listAssets;
export const getAsset = getAssetById;
