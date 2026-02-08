// ============================================
// THEME COLOR PRESETS
// ============================================

export interface ThemePreset {
  name: string;
  primary: string;
  secondary: string;
  description: string;
}

export const themePresets: ThemePreset[] = [
  {
    name: "Default",
    primary: "oklch(0.205 0 0)",
    secondary: "oklch(0.97 0 0)",
    description: "Clean neutral theme",
  },
  {
    name: "Ocean",
    primary: "oklch(0.546 0.245 262.881)",
    secondary: "oklch(0.932 0.032 255.508)",
    description: "Calm blue tones",
  },
  {
    name: "Forest",
    primary: "oklch(0.527 0.154 150.069)",
    secondary: "oklch(0.962 0.044 156.743)",
    description: "Natural green palette",
  },
  {
    name: "Sunset",
    primary: "oklch(0.637 0.237 25.331)",
    secondary: "oklch(0.969 0.059 41.592)",
    description: "Warm orange tones",
  },
  {
    name: "Royal",
    primary: "oklch(0.541 0.281 293.009)",
    secondary: "oklch(0.958 0.049 303.109)",
    description: "Rich purple palette",
  },
  {
    name: "Rose",
    primary: "oklch(0.645 0.246 16.439)",
    secondary: "oklch(0.969 0.032 17.17)",
    description: "Elegant pink tones",
  },
];

// ============================================
// RADIUS OPTIONS
// ============================================

export const radiusOptions = [
  { value: "sm", label: "Small", pixels: "4px" },
  { value: "md", label: "Medium", pixels: "8px" },
  { value: "lg", label: "Large", pixels: "12px" },
] as const;

// ============================================
// FONT SCALE OPTIONS
// ============================================

export const fontScaleOptions = [
  { value: "sm", label: "Small", size: "14px" },
  { value: "md", label: "Medium", size: "16px" },
  { value: "lg", label: "Large", size: "18px" },
] as const;

// ============================================
// SIDEBAR DENSITY OPTIONS
// ============================================

export const sidebarDensityOptions = [
  { value: "compact", label: "Compact", description: "Tighter spacing" },
  { value: "comfortable", label: "Comfortable", description: "More breathing room" },
] as const;
