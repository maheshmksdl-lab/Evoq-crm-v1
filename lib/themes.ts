import { mix, readableOnWhite } from "./palette";

/** Colour themes for the CRM. A theme only changes colour tokens (and, for a custom theme, type and shape), never layout or behaviour. */
export interface Theme {
  id: string;
  name: string;
  audience: string;
  description: string;
  primary: string;
  accent: string;
  secondary: string;
  /** Optional explicit layout colours: light sidebar and header, and a slightly deeper gradient for the page canvas. Light mode only. */
  layout?: { aside: string; header: string; canvas: [string, string, string] };
}

export const THEMES: Theme[] = [
  { id: "evoq",     name: "EVOQ Classic",  audience: "Default",    description: "The original EVOQ blue.",                              primary: "#1d4ed8", accent: "#3b82f6", secondary: "#dbeafe" },
  { id: "sky",      name: "Sky Mist",      audience: "Blue variant", description: "Light blue sidebar and header over a deeper blue canvas.", primary: "#1d4ed8", accent: "#3b82f6", secondary: "#dbeafe",
    layout: { aside: "#EEF5FE", header: "#F3F8FE", canvas: ["#F8FAFE", "#EDF4FC", "#EAF1FB"] } },
  { id: "ocean",    name: "Ocean Breeze",  audience: "Blue variant", description: "Fresh sky-cyan blues, light navigation, soft ocean canvas.", primary: "#0369A1", accent: "#0EA5E9", secondary: "#bae6fd",
    layout: { aside: "#ECF6FC", header: "#F2F9FD", canvas: ["#F7FBFD", "#EBF5FB", "#E8F2F9"] } },
  { id: "periwinkle", name: "Periwinkle",  audience: "Blue variant", description: "Soft blue-violet navigation with a gentle periwinkle canvas.", primary: "#3949AB", accent: "#5C7CFA", secondary: "#dbe4ff",
    layout: { aside: "#F0F2FD", header: "#F5F6FE", canvas: ["#F8F9FE", "#EFF1FC", "#EBEEFA"] } },
  { id: "clinic",   name: "Clinic Blue",  audience: "Calm",       description: "Calm, professional blues for everyday work.",          primary: "#2563A8", accent: "#2BA6C9", secondary: "#7CCFC4" },
  { id: "mint",     name: "Fresh Mint",    audience: "Fresh",      description: "Clean teal and mint, bright and reassuring.",          primary: "#0E7C80", accent: "#2EB5BC", secondary: "#79D6CB" },
  { id: "rose",     name: "Rose Quartz",   audience: "Refined",    description: "Soft rose and blush with a refined feel.",             primary: "#A23B64", accent: "#C46C94", secondary: "#9ED6C7" },
  { id: "sage",     name: "Soft Sage",     audience: "Natural",    description: "Natural sage greens, gentle on the eyes.",             primary: "#3B7A58", accent: "#4BA58C", secondary: "#9BD3B4" },
  { id: "coral",    name: "Active Coral",  audience: "Energetic",  description: "Warm, energetic coral with a steady blue accent.",     primary: "#B24A1A", accent: "#2A93B0", secondary: "#8DD0BB" },
  { id: "lavender", name: "Calm Lavender", audience: "Restful",    description: "Restful lavender and mist for a calm, welcoming space.", primary: "#6A4DAE", accent: "#7E8FD6", secondary: "#A5DCCB" },
  { id: "indigo",   name: "Slate Indigo",  audience: "Composed",   description: "Composed indigo and slate that suits any team.",       primary: "#3B4CB0", accent: "#4F8DD0", secondary: "#8FCFC4" },
];

export const DEFAULT_THEME = "evoq";

/** A team's own theme: three brand colours plus type and shape choices. */
export interface CustomTheme {
  name: string;
  /** The company logo, shrunk and stored as a data address. */
  logo?: string;
  primary: string; accent: string; secondary: string;
  font: "inter" | "system" | "humanist" | "serif";
  size: "compact" | "default" | "comfortable";
  corners: "sharp" | "soft" | "round";
  buttons: "square" | "rounded" | "pill";
}
export const DEFAULT_CUSTOM: CustomTheme = { name: "My brand", primary: "#1d4ed8", accent: "#3b82f6", secondary: "#7acfc5", font: "inter", size: "default", corners: "soft", buttons: "rounded" };

type Tokens = Record<string, string>;

/** Builds every CRM colour token from three brand colours. The main colour is darkened if white text on it would be hard to read. */
export function colorsFrom(primary: string, accent: string, secondary: string): { accent: Tokens; surface: Tokens } {
  const p = readableOnWhite(primary), W = "#ffffff", K = "#000000";
  const border = mix(p, W, 0.88);
  return {
    // Brand colour tokens that Tailwind utilities (bg-brand-700, text-brand-700 ...) read.
    accent: {
      "--color-brand-50": mix(p, W, 0.95), "--color-brand-100": mix(secondary, W, 0.8), "--color-brand-500": accent,
      "--color-brand-600": mix(p, W, 0.12), "--color-brand-700": p, "--color-brand-900": mix(p, K, 0.55),
    },
    // Page, card, border and sidebar surfaces. Light mode only; dark mode keeps its own surfaces.
    surface: {
      "--color-border-light": border, "--color-surface-light": mix(p, W, 0.95), "--color-surface": mix(p, W, 0.985),
      "--bg-page": mix(p, W, 0.95), "--bg-card": mix(p, W, 0.985), "--bg-topbar": border, "--bg-aside": border, "--bg-header": border, "--border": border, "--bg-sidebar": mix(p, K, 0.6),
    },
  };
}

export const getTheme = (id?: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];
const LAYOUT_KEYS = ["--canvas-from", "--canvas-via", "--canvas-to", "--canvas-glow"];
const KEYS = Array.from(new Set(Object.keys(colorsFrom("#1d4ed8", "#3b82f6", "#dbeafe").accent).concat(Object.keys(colorsFrom("#1d4ed8", "#3b82f6", "#dbeafe").surface), LAYOUT_KEYS)));
const ATTRS = ["font", "size", "corners", "buttons"] as const;

/** Applies a theme to the page by setting colour variables on the root element. The default clears them. A custom theme also sets type and shape choices. */
export function applyTheme(id?: string, custom?: CustomTheme | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  KEYS.forEach((k) => root.style.removeProperty(k));
  ATTRS.forEach((a) => root.removeAttribute(`data-${a}`));
  const dark = root.classList.contains("dark");
  const t: Pick<Theme, "id" | "primary" | "accent" | "secondary" | "layout"> = id === "custom" && custom ? { id: "custom", primary: custom.primary, accent: custom.accent, secondary: custom.secondary } : getTheme(id);
  if (t.id === "evoq") { root.dataset.theme = "evoq"; return; }
  const { accent, surface } = colorsFrom(t.primary, t.accent, t.secondary);
  Object.entries(accent).forEach(([k, v]) => root.style.setProperty(k, v));
  if (!dark) {
    Object.entries(surface).forEach(([k, v]) => root.style.setProperty(k, v));
    if (t.layout) {
      const { aside, header, canvas } = t.layout;
      root.style.setProperty("--bg-aside", aside); root.style.setProperty("--bg-header", header); root.style.setProperty("--bg-topbar", header);
      root.style.setProperty("--canvas-from", canvas[0]); root.style.setProperty("--canvas-via", canvas[1]); root.style.setProperty("--canvas-to", canvas[2]);
      root.style.setProperty("--canvas-glow", `color-mix(in srgb, ${t.accent} 4%, transparent)`);
    }
  }
  if (id === "custom" && custom) ATTRS.forEach((a) => root.setAttribute(`data-${a}`, custom[a]));
  root.dataset.theme = t.id;
}
