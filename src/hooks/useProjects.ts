import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, STALE_TIMES } from "@/config/api";
import * as projectsService from "@/services/api/projects";
import type { CreateProjectRequest, UpdateProjectRequest } from "@/types";

// ============================================
// PROJECTS HOOKS
// ============================================

/**
 * Get all projects for current user
 */
export function useProjects(includeInactive = false) {
  return useQuery({
    queryKey: [...QUERY_KEYS.projects.all, { includeInactive }],
    queryFn: () => projectsService.listProjects(includeInactive),
    staleTime: STALE_TIMES.medium,
    select: (response) => response.data,
  });
}

/**
 * Get a single project by ID
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.detail(id),
    queryFn: () => projectsService.getProjectById(id),
    staleTime: STALE_TIMES.medium,
    enabled: !!id,
    select: (response) => response.data,
  });
}

/**
 * Get a project by slug
 */
export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => projectsService.getProjectBySlug(slug),
    staleTime: STALE_TIMES.medium,
    enabled: !!slug,
    select: (response) => response.data,
  });
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
  });
}

/**
 * Update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects.detail(variables.id),
      });
    },
  });
}

/**
 * Update project provider configuration
 */
export function useUpdateProviderConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, providerConfig }: { id: string; providerConfig: object }) =>
      projectsService.updateProviderConfig(id, { providerConfig }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects.detail(variables.id),
      });
    },
  });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
  });
}
