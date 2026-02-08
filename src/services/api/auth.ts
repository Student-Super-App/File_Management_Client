import { get, post, patch } from "./client.ts";
import { setTokens, clearTokens } from "./client.ts";
import { API_ENDPOINTS } from "@/config/api";
import type { 
  ApiResponse, 
  User, 
  AuthData,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest
} from "@/types";

// ============================================
// AUTH SERVICE
// Endpoints: /auth/* (JWT authenticated)
// ============================================

/**
 * Register a new user
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<AuthData>> {
  const response = await post<ApiResponse<AuthData>>(API_ENDPOINTS.auth.register, data);
  // Store tokens on successful registration
  const authData = response.data;
  if (authData) {
    const accessToken = authData.accessToken || authData.token;
    if (accessToken) {
      // Use accessToken as fallback if no refreshToken provided
      const refreshToken = authData.refreshToken || accessToken;
      setTokens(accessToken, refreshToken);
    }
  }
  return response;
}

/**
 * Login with email and password
 * POST /auth/login
 */
export async function login(credentials: LoginRequest): Promise<ApiResponse<AuthData>> {
  const response = await post<ApiResponse<AuthData>>(API_ENDPOINTS.auth.login, credentials);
  // Store tokens on successful login
  const authData = response.data;
  if (authData) {
    const accessToken = authData.accessToken || authData.token;
    if (accessToken) {
      // Use accessToken as fallback if no refreshToken provided
      const refreshToken = authData.refreshToken || accessToken;
      setTokens(accessToken, refreshToken);
    }
  }
  return response;
}

/**
 * Silent token refresh
 * POST /auth/refresh
 * Note: This is handled automatically by the API client interceptor
 */
export async function refreshToken(): Promise<ApiResponse<{ token: string; refreshToken?: string }>> {
  return post<ApiResponse<{ token: string; refreshToken?: string }>>(API_ENDPOINTS.auth.refresh);
}

/**
 * Get current authenticated user
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
}

/**
 * Update current user profile
 * PATCH /auth/me
 */
export async function updateCurrentUser(data: { name?: string }): Promise<ApiResponse<User>> {
  return patch<ApiResponse<User>>(API_ENDPOINTS.auth.me, data);
}

/**
 * Change password
 * POST /auth/change-password
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>(API_ENDPOINTS.auth.changePassword, data);
}

/**
 * Logout current user
 * POST /auth/logout
 */
export async function logout(): Promise<ApiResponse<null>> {
  const response = await post<ApiResponse<null>>(API_ENDPOINTS.auth.logout);
  // Clear tokens on logout
  clearTokens();
  return response;
}

// Legacy aliases for backward compatibility
export type LoginCredentials = LoginRequest;
export type RegisterData = RegisterRequest;
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}
