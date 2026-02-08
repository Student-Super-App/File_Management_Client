import axios from "axios";
import type { 
  AxiosError, 
  AxiosInstance, 
  AxiosRequestConfig, 
  InternalAxiosRequestConfig,
  AxiosResponse
} from "axios";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import type { ApiError, ApiResponse } from "@/types";

// ============================================
// TOKEN STORAGE KEYS
// ============================================

const TOKEN_KEYS = {
  ACCESS: "fms_access_token",
  REFRESH: "fms_refresh_token",
} as const;

// ============================================
// TOKEN MANAGEMENT
// ============================================

let accessToken: string | null = null;
let refreshToken: string | null = null;
let apiKeyToken: string | null = null;

// Initialize tokens from localStorage on module load
(() => {
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
    refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
  }
})();

/**
 * Set the access token
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, token);
  } else {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
  }
}

/**
 * Get the current access token
 */
export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
  }
  return accessToken;
}

/**
 * Set the refresh token
 */
export function setRefreshToken(token: string | null): void {
  refreshToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEYS.REFRESH, token);
  } else {
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  }
}

/**
 * Get the current refresh token
 */
export function getRefreshToken(): string | null {
  if (!refreshToken) {
    refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
  }
  return refreshToken;
}

/**
 * Set both tokens at once (after login)
 */
export function setTokens(access: string, refresh: string): void {
  setAccessToken(access);
  setRefreshToken(refresh);
}

/**
 * Clear all tokens (logout)
 */
export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  apiKeyToken = null;
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
}

/**
 * Check if user has valid tokens
 * Only requires access token since refresh token might be HTTP-only cookie
 */
export function hasTokens(): boolean {
  return !!getAccessToken();
}

/**
 * Set the API key for upload/asset operations
 */
export function setApiKey(key: string | null): void {
  apiKeyToken = key;
}

/**
 * Get the current API key
 */
export function getApiKey(): string | null {
  return apiKeyToken;
}

// Legacy alias for backward compatibility
export const setAuthToken = setAccessToken;
export const getAuthToken = getAccessToken;

// ============================================
// TOKEN REFRESH QUEUE SYSTEM
// ============================================

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

/**
 * Process the queue after token refresh
 */
function processQueue(error: AxiosError | null, token: string | null = null): void {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token && request.config.headers) {
      request.config.headers.Authorization = `Bearer ${token}`;
      apiClient(request.config)
        .then(request.resolve)
        .catch(request.reject);
    }
  });
  failedQueue = [];
}

/**
 * Refresh the access token using refresh token
 * The refresh token might be in:
 * 1. HTTP-only cookie (sent automatically with withCredentials)
 * 2. localStorage (sent in Authorization header)
 */
async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  
  // Build headers - only add Authorization if we have a refresh token in storage
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (refresh) {
    headers.Authorization = `Bearer ${refresh}`;
  }

  try {
    // Use a separate axios instance to avoid interceptor loops
    const response = await axios.post(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.auth.refresh}`,
      {}, // Empty body
      {
        headers,
        withCredentials: true, // Important: sends cookies automatically
      }
    );

    // Handle flexible response structure
    const responseData = response.data;
    const data = responseData.data || responseData;
    
    // Extract access token (try both field names)
    const newAccessToken = data.accessToken || data.token;
    const newRefreshToken = data.refreshToken;

    if (!newAccessToken) {
      throw new Error("No access token in refresh response");
    }

    // Update tokens
    setAccessToken(newAccessToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    return newAccessToken;
  } catch (error: any) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// AXIOS INSTANCE
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add access token if available
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR WITH TOKEN REFRESH
// ============================================

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Handle 401 Unauthorized - attempt token refresh
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Skip refresh for auth endpoints (login, register, refresh itself)
      const isAuthEndpoint = originalRequest.url?.includes("/auth/login") ||
                            originalRequest.url?.includes("/auth/register") ||
                            originalRequest.url?.includes("/auth/refresh");
      
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Check if we have any form of authentication (access token or cookies)
      // Don't require refresh token in storage as it might be HTTP-only cookie
      const hasAccessToken = !!getAccessToken();
      
      if (!hasAccessToken) {
        // No access token means user is not logged in
        clearTokens();
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[Auth] Attempting token refresh...');
        const newToken = await refreshAccessToken();
        console.log('[Auth] Token refresh successful');
        
        // Process queued requests with new token
        processQueue(null, newToken);
        
        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - logout user
        console.error('[Auth] Token refresh failed, logging out:', refreshError);
        processQueue(refreshError as AxiosError, null);
        clearTokens();
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    // Handle 500 Server Error
    if (status === 500) {
      window.dispatchEvent(
        new CustomEvent("api:error", {
          detail: { 
            message: error.response?.data?.message || "Server error. Please try again later.",
            status: 500
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE HELPERS
// ============================================

/**
 * Extract data from API response - handles flexible response formats
 */
export function extractData<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data as T;
  }
  return response as T;
}

/**
 * Check if response indicates success
 */
export function isSuccess(response: ApiResponse<unknown>): boolean {
  return response.success !== false && !response.error;
}

// ============================================
// TYPED REQUEST METHODS
// ============================================

/**
 * GET request
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * POST request
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * PUT request
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * PATCH request
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * DELETE request
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

// ============================================
// API KEY REQUEST METHODS
// For upload/asset operations that use X-API-Key header
// ============================================

/**
 * Create a separate axios instance for API Key authenticated requests
 */
const apiKeyClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiKeyClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const key = getApiKey();
    if (key && config.headers) {
      config.headers["X-API-Key"] = key;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * GET request with API Key auth
 */
export async function getWithApiKey<T>(
  url: string,
  apiKey?: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const headers = apiKey ? { "X-API-Key": apiKey, ...config?.headers } : config?.headers;
  const response = await apiKeyClient.get<T>(url, { ...config, headers });
  return response.data;
}

/**
 * POST request with API Key auth
 */
export async function postWithApiKey<T, D = unknown>(
  url: string,
  data?: D,
  apiKey?: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const headers = apiKey ? { "X-API-Key": apiKey, ...config?.headers } : config?.headers;
  const response = await apiKeyClient.post<T>(url, data, { ...config, headers });
  return response.data;
}

/**
 * DELETE request with API Key auth
 */
export async function delWithApiKey<T>(
  url: string,
  apiKey?: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const headers = apiKey ? { "X-API-Key": apiKey, ...config?.headers } : config?.headers;
  const response = await apiKeyClient.delete<T>(url, { ...config, headers });
  return response.data;
}

/**
 * PATCH request with API Key auth
 */
export async function patchWithApiKey<T, D = unknown>(
  url: string,
  data?: D,
  apiKey?: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const headers = apiKey ? { "X-API-Key": apiKey, ...config?.headers } : config?.headers;
  const response = await apiKeyClient.patch<T>(url, data, { ...config, headers });
  return response.data;
}

export default apiClient;
