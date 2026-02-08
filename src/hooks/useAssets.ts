import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, STALE_TIMES } from "@/config/api";
import * as assetsService from "@/services/api/assets";
import type { 
  ListAssetsParams, 
  PresignUploadRequest, 
  UpdateAssetVisibilityRequest 
} from "@/types";

// ============================================
// UPLOAD HOOKS
// ============================================

/**
 * Generate presigned upload URL
 */
export function useGeneratePresignedUrl() {
  return useMutation({
    mutationFn: ({ data, apiKey }: { data: PresignUploadRequest; apiKey: string }) =>
      assetsService.generatePresignedUrl(data, apiKey),
  });
}

/**
 * Confirm upload completion
 */
export function useConfirmUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, apiKey }: { assetId: string; apiKey: string }) =>
      assetsService.confirmUpload({ assetId }, apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
    },
  });
}

// ============================================
// ASSETS HOOKS
// ============================================

/**
 * Asset filter options for UI
 */
interface AssetFilters {
  search?: string;
  type?: "image" | "video" | "document" | "other";
  visibility?: "public" | "private";
}

/**
 * Get assets with pagination and filters
 * Supports both API key auth (external) and token auth (dashboard)
 */
export function useAssets(
  projectId: string,
  page = 1,
  limit = 20,
  filters?: AssetFilters,
  apiKey?: string
) {
  const params: ListAssetsParams = {
    page,
    limit,
    category: filters?.type,
    visibility: filters?.visibility,
  };
  
  return useQuery({
    queryKey: [...QUERY_KEYS.assets.all, projectId, page, limit, filters],
    queryFn: () => apiKey 
      ? assetsService.listAssets(params, apiKey)
      : assetsService.listAssets(params, projectId), // Use projectId as "apiKey" for now
    staleTime: STALE_TIMES.short,
    enabled: !!projectId,
    select: (response) => {
      // Transform assets to add UI convenience fields
      const assets = response.data || [];
      return {
        ...response,
        data: assets.map((asset: any) => ({
          ...asset,
          id: asset.id || asset._id,
          name: asset.name || asset.filename || asset.originalName,
          type: asset.type || getAssetType(asset.contentType),
          url: asset.url || asset.publicUrl,
        })),
      };
    },
  });
}

/**
 * Helper to determine asset type from content type
 */
function getAssetType(contentType: string): "image" | "video" | "document" | "other" {
  if (contentType?.startsWith("image/")) return "image";
  if (contentType?.startsWith("video/")) return "video";
  if (contentType?.includes("pdf") || contentType?.includes("document") || contentType?.includes("text")) return "document";
  return "other";
}

/**
 * Get a single asset by ID
 */
export function useAsset(id: string, apiKey: string) {
  return useQuery({
    queryKey: QUERY_KEYS.assets.detail(id),
    queryFn: () => assetsService.getAssetById(id, apiKey),
    staleTime: STALE_TIMES.medium,
    enabled: !!id && !!apiKey,
    select: (response) => response.data,
  });
}

/**
 * Get asset by storage reference
 */
export function useAssetByRef(storageRef: string, apiKey: string) {
  return useQuery({
    queryKey: ["assets", "ref", storageRef],
    queryFn: () => assetsService.getAssetByRef(storageRef, apiKey),
    staleTime: STALE_TIMES.medium,
    enabled: !!storageRef && !!apiKey,
    select: (response) => response.data,
  });
}

/**
 * Get signed URL for private asset
 */
export function useSignedUrl(assetId: string, apiKey: string, expiresIn = 3600) {
  return useQuery({
    queryKey: ["assets", assetId, "signed-url", expiresIn],
    queryFn: () => assetsService.getSignedUrl(assetId, apiKey, expiresIn),
    staleTime: Math.min(expiresIn * 1000 - 60000, STALE_TIMES.medium), // Refresh before expiry
    enabled: !!assetId && !!apiKey,
    select: (response) => response.data,
  });
}

/**
 * Update asset visibility
 */
export function useUpdateAssetVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data, 
      apiKey 
    }: { 
      id: string; 
      data: UpdateAssetVisibilityRequest; 
      apiKey: string;
    }) => assetsService.updateAssetVisibility(id, data, apiKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.assets.detail(variables.id) 
      });
    },
  });
}

/**
 * Delete an asset
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, apiKey }: { id: string; apiKey: string }) =>
      assetsService.deleteAsset(id, apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
    },
  });
}
