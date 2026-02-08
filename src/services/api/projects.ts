import { get, post, patch, del } from "./client.ts";
import { API_ENDPOINTS } from "@/config/api";
import type { 
  ApiResponse, 
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateProviderConfigRequest
} from "@/types";

// ============================================
// PROJECTS SERVICE
// Endpoints: /projects/* (JWT authenticated)
// ============================================

/**
 * Create a new project
 * POST /projects
 */
export async function createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
  return post<ApiResponse<Project>>(API_ENDPOINTS.projects.create, data);
}

/**
 * List all projects for current user
 * GET /projects
 */
export async function listProjects(includeInactive = false): Promise<ApiResponse<Project[]>> {
  const params = new URLSearchParams();
  if (includeInactive) params.append("includeInactive", "true");
  const query = params.toString();
  return get<ApiResponse<Project[]>>(`${API_ENDPOINTS.projects.list}${query ? `?${query}` : ""}`);
}

/**
 * Get project by slug
 * GET /projects/slug/:slug
 */
export async function getProjectBySlug(slug: string): Promise<ApiResponse<Project>> {
  return get<ApiResponse<Project>>(API_ENDPOINTS.projects.getBySlug(slug));
}

/**
 * Get project by ID
 * GET /projects/:id
 */
export async function getProjectById(id: string): Promise<ApiResponse<Project>> {
  return get<ApiResponse<Project>>(API_ENDPOINTS.projects.getById(id));
}

/**
 * Update project
 * PATCH /projects/:id
 */
export async function updateProject(id: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
  return patch<ApiResponse<Project>>(API_ENDPOINTS.projects.update(id), data);
}

/**
 * Update project provider configuration
 * PATCH /projects/:id/provider-config
 */
export async function updateProviderConfig(
  id: string, 
  data: UpdateProviderConfigRequest
): Promise<ApiResponse<Project>> {
  return patch<ApiResponse<Project>>(API_ENDPOINTS.projects.updateProviderConfig(id), data);
}

/**
 * Delete project
 * DELETE /projects/:id
 */
export async function deleteProject(id: string): Promise<ApiResponse<null>> {
  return del<ApiResponse<null>>(API_ENDPOINTS.projects.delete(id));
}

// Legacy exports for backward compatibility
export const getProjects = listProjects;
export const getProject = getProjectById;
export type CreateProjectData = CreateProjectRequest;
export type UpdateProjectData = UpdateProjectRequest;
