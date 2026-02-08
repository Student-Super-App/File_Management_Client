import { useEffect } from "react";
import { useAppSelector } from "@/app/store/store";

// Radius values mapping
const radiusValues = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
};

// Font scale values mapping
const fontScaleValues = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

/**
 * ThemeProvider - Applies theme settings as CSS variables
 * This component reads from Redux settings and applies theme dynamically
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useAppSelector((state) => state.settings);

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme mode
    if (settings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", settings.theme === "dark");
    }

    // Apply custom colors
    root.style.setProperty("--primary", settings.colors.primary);
    root.style.setProperty("--secondary", settings.colors.secondary);

    // Apply radius
    root.style.setProperty("--radius", radiusValues[settings.radius]);

    // Apply font scale
    root.style.setProperty("--font-size-base", fontScaleValues[settings.fontScale]);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.theme === "system") {
        root.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings]);

  return <>{children}</>;
}

export default ThemeProvider;
