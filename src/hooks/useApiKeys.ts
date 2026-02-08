import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, STALE_TIMES } from "@/config/api";
import * as apiKeysService from "@/services/api/apiKeys";
import type { CreateApiKeyRequest } from "@/types";

// ============================================
// API KEYS HOOKS
// ============================================

/**
 * Get all API keys (optionally filtered by project)
 */
export function useApiKeys(projectId?: string) {
  return useQuery({
    queryKey: projectId 
      ? QUERY_KEYS.apiKeys.byProject(projectId) 
      : QUERY_KEYS.apiKeys.all,
    queryFn: () => apiKeysService.listApiKeys(projectId),
    staleTime: STALE_TIMES.medium,
    select: (response) => response.data,
  });
}

/**
 * Get a single API key by ID
 */
export function useApiKey(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys.detail(id),
    queryFn: () => apiKeysService.getApiKeyById(id),
    staleTime: STALE_TIMES.medium,
    enabled: !!id,
    select: (response) => response.data,
  });
}

/**
 * Create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => apiKeysService.createApiKey(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.apiKeys.byProject(variables.projectId),
      });
    },
  });
}

/**
 * Deactivate an API key
 */
export function useDeactivateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeysService.deactivateApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys.all });
    },
  });
}

/**
 * Reactivate an API key
 */
export function useReactivateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeysService.reactivateApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys.all });
    },
  });
}

/**
 * Rotate an API key (generate new secret)
 */
export function useRotateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeysService.rotateApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys.all });
    },
  });
}

/**
 * Delete an API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeysService.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys.all });
    },
  });
}

// Legacy exports for backward compatibility
export const useRevokeApiKey = useDeleteApiKey;
export const useRegenerateApiKey = useRotateApiKey;
