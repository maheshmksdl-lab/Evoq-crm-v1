"use client";
import { useThemeSettings } from "@/lib/themeSettings";

/** True while the Graphite theme is the chosen colour theme. */
export function useGraphite(): boolean {
  return useThemeSettings().theme === "graphite";
}
