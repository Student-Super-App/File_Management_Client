import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, AuthData } from "@/types";

// Load persisted project from localStorage
const loadPersistedProject = (): string | null => {
  try {
    return localStorage.getItem("fms_active_project");
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  activeProjectId: loadPersistedProject(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<AuthData>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
      // Handle both accessToken (new API) and token (legacy) field names
      state.token = action.payload.accessToken || action.payload.token || null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.activeProjectId = null;
      // Clear persisted project
      localStorage.removeItem("fms_active_project");
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
      // Persist to localStorage
      if (action.payload) {
        localStorage.setItem("fms_active_project", action.payload);
      } else {
        localStorage.removeItem("fms_active_project");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  setUser,
  logout,
  setActiveProject,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
