"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Custom hook that syncs theme changes with cookies for SSR
 * This ensures no flash of wrong theme on page load
 */
export function useThemeWithCookies() {
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    // Sync theme to cookie whenever it changes
    if (theme) {
      const resolvedTheme = theme === "system" ? systemTheme : theme;
      document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [theme, systemTheme]);

  return { theme, setTheme, systemTheme };
}

