import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store/store";
import { 
  loginSuccess, 
  logout as logoutAction, 
  setLoading,
  setUser 
} from "@/app/store/authSlice";
import { QUERY_KEYS, STALE_TIMES } from "@/config/api";
import * as authService from "@/services/api/auth";
import { 
  clearTokens, 
  hasTokens, 
  getAccessToken 
} from "@/services/api/client";
import type { User, LoginRequest, RegisterRequest, ChangePasswordRequest } from "@/types";

// ============================================
// AUTH HOOKS - TanStack Query integration
// With token refresh support
// ============================================

/**
 * Hook to get and maintain auth session
 * Checks if user has valid tokens and fetches user data
 */
export function useSession() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        // Check if we have tokens
        if (!hasTokens()) {
          dispatch(logoutAction());
          return null;
        }

        // Fetch current user
        const response = await authService.getCurrentUser();
        
        if (response.data) {
          dispatch(setUser(response.data));
          return response.data;
        } else {
          dispatch(logoutAction());
          return null;
        }
      } catch {
        // Token might be expired, the interceptor will handle refresh
        // If refresh also fails, it will trigger logout event
        dispatch(logoutAction());
        return null;
      }
    },
    staleTime: STALE_TIMES.long,
    retry: false,
    // Only run if we have an access token
    enabled: !!getAccessToken(),
  });
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.data) {
        dispatch(loginSuccess(response.data));
        queryClient.setQueryData<User | null>(
          QUERY_KEYS.auth.session,
          response.data.user
        );
      }
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      if (response.data) {
        dispatch(loginSuccess(response.data));
        queryClient.setQueryData<User | null>(
          QUERY_KEYS.auth.session,
          response.data.user
        );
      }
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
    onError: () => {
      // Even if logout API fails, clear local state
      clearTokens();
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string }) => authService.updateCurrentUser(data),
    onSuccess: (response) => {
      if (response.data) {
        dispatch(setUser(response.data));
        queryClient.setQueryData<User | null>(
          QUERY_KEYS.auth.session,
          response.data
        );
      }
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
  });
}

/**
 * Hook to listen for auth events (logout, forbidden)
 * Use this in your App component to handle global auth events
 */
export function useAuthEventListener() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(() => {
    clearTokens();
    dispatch(logoutAction());
    queryClient.clear();
  }, [dispatch, queryClient]);

  const handleForbidden = useCallback(() => {
    // Could navigate to forbidden page or show a toast
    console.warn("Access forbidden");
  }, []);

  useEffect(() => {
    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:forbidden", handleForbidden);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:forbidden", handleForbidden);
    };
  }, [handleLogout, handleForbidden]);
}

/**
 * Hook to initialize auth state on app load
 * Checks for existing tokens and validates session
 */
export function useAuthInitializer() {
  const { refetch, isLoading } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasTokens()) {
      refetch();
    } else {
      dispatch(setLoading(false));
    }
  }, [refetch, dispatch]);

  return { isLoading };
}

// Legacy exports for backward compatibility
export { useSession as useCurrentUser };
