import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  SettingsState,
  ThemeMode,
  RadiusSize,
  FontScale,
  SidebarDensity,
  ThemeColors,
} from "@/types";

// Load settings from localStorage
const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return {
    theme: "system",
    colors: {
      primary: "oklch(0.205 0 0)",
      secondary: "oklch(0.97 0 0)",
    },
    radius: "md",
    fontScale: "md",
    sidebarDensity: "comfortable",
  };
};

const initialState: SettingsState = loadSettings();

// Helper to persist settings
const persistSettings = (state: SettingsState) => {
  try {
    localStorage.setItem("app-settings", JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      persistSettings(state);
    },
    setColors: (state, action: PayloadAction<ThemeColors>) => {
      state.colors = action.payload;
      persistSettings(state);
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.colors.primary = action.payload;
      persistSettings(state);
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.colors.secondary = action.payload;
      persistSettings(state);
    },
    setRadius: (state, action: PayloadAction<RadiusSize>) => {
      state.radius = action.payload;
      persistSettings(state);
    },
    setFontScale: (state, action: PayloadAction<FontScale>) => {
      state.fontScale = action.payload;
      persistSettings(state);
    },
    setSidebarDensity: (state, action: PayloadAction<SidebarDensity>) => {
      state.sidebarDensity = action.payload;
      persistSettings(state);
    },
    resetSettings: (state) => {
      state.theme = "system";
      state.colors = {
        primary: "oklch(0.205 0 0)",
        secondary: "oklch(0.97 0 0)",
      };
      state.radius = "md";
      state.fontScale = "md";
      state.sidebarDensity = "comfortable";
      persistSettings(state);
    },
  },
});

export const {
  setTheme,
  setColors,
  setPrimaryColor,
  setSecondaryColor,
  setRadius,
  setFontScale,
  setSidebarDensity,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
