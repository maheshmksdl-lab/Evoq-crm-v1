"use client";
import { useSyncExternalStore } from "react";
import type { CustomTheme } from "./themes";

/** The chosen colour theme. Kept in this browser only. */
export interface ThemeSettings { theme: string; custom: CustomTheme | null }
const DEFAULTS: ThemeSettings = { theme: "evoq", custom: null };
const KEY = "crm.themeSettings";
const EVENT = "crm-theme-settings";

let cache: { raw: string | null; val: ThemeSettings } = { raw: "__", val: DEFAULTS };
export function getThemeSettings(): ThemeSettings {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw !== cache.raw) {
    let v = DEFAULTS;
    try { if (raw) v = { ...DEFAULTS, ...JSON.parse(raw) }; } catch {}
    cache = { raw, val: v };
  }
  return cache.val;
}
export function saveThemeSettings(patch: Partial<ThemeSettings>) {
  const next = { ...getThemeSettings(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new Event(EVENT)); } catch {}
}
const sub = (cb: () => void) => { window.addEventListener(EVENT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); }; };
export function useThemeSettings(): ThemeSettings { return useSyncExternalStore(sub, getThemeSettings, () => DEFAULTS); }
