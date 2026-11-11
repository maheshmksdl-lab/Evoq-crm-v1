// ─────────────────────────────────────────────────────────────────────────────
//  Shared UI/UX tokens (Step 7)
//  The same values the Leads list (Step 5) and Lead Detail (Step 6) introduced
//  locally, collected so every other module uses one source instead of copies.
// ─────────────────────────────────────────────────────────────────────────────

/** Text hierarchy: primary (names, values) > secondary (body) > tertiary (labels, meta) > empty (dash marks). */
export const tone = (isDark: boolean) => ({
  primary:   isDark ? "#FAFAFA" : "#0F172A",
  secondary: isDark ? "#D4D4D8" : "#475569",
  tertiary:  isDark ? "#A1A1AA" : "#64748B",
  empty:     isDark ? "#8A8A94" : "#64748B",
});

/** Keyboard-only focus ring (Tailwind classes). Matches the global :focus-visible rule. */
export const FOCUS_RING = "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]";

/** Keyboard-only focus ring for MUI ButtonBase components (sx). */
export const muiFocus = { "&.Mui-focusVisible": { outline: "2px solid #3B82F6", outlineOffset: "2px" } } as const;

/** One card surface for detail-page panels (dark uses the detail-page card tone shared by all modules). */
export const cardCls = (isDark: boolean) =>
  `rounded-2xl border shadow-xs ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-surface border-border-light"}`;

/**
 * Detail-page grid: main column + side column.
 * Explicit track classes on purpose — the global tablet rule in globals.css rewrites
 * `.grid-cols-1` / `.lg:grid-cols-3` to two equal columns between 641–1023px.
 */
export const DETAIL_GRID =
  "grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start";

/** Field grid inside a card body that is a container (`@container`): 2 columns unless the card is very narrow. */
export const KV_GRID = "grid grid-cols-[minmax(0,1fr)] @min-[18rem]:grid-cols-2 gap-x-6 @min-[30rem]:gap-x-8";

/** Header action row on detail pages: wraps instead of overflowing on narrow screens. */
export const HEADER_ACTIONS = "flex items-center gap-2 flex-wrap";

/** Secondary (outlined) header button style used on detail pages. */
export const outlinedBtnSx = (isDark: boolean) => ({
  ...muiFocus,
  borderColor: isDark ? "#27272A" : "#E3ECFC", color: isDark ? "#D4D4D8" : "#1D4ED8", borderRadius: "9px", textTransform: "none",
  fontWeight: 600, fontSize: "0.84rem", bgcolor: isDark ? "#0F0F0F" : "transparent", whiteSpace: "nowrap",
  "&:hover": { borderColor: isDark ? "#3F3F46" : "#1D4ED8", color: isDark ? "#FAFAFA" : "#1D4ED8", bgcolor: isDark ? "#18181B" : "#EFF6FF" },
}) as const;

/** Primary (contained) header button style — same colours as the Leads "New Lead" / Lead Detail "Edit" buttons. */
export const primaryBtnSx = (isDark: boolean) => ({
  ...muiFocus,
  bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "#FFFFFF", borderRadius: "9px", textTransform: "none",
  fontWeight: 700, fontSize: "0.84rem", whiteSpace: "nowrap", boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833",
  "&:hover": { bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px 0 #60A5FA55" },
  "&:active": { bgcolor: isDark ? "#52525B" : "#0C2472" },
}) as const;

/** Small icon-only action inside a card header (was #E2E8F0 / #3F3F46 — effectively invisible). */
export const iconActionSx = (isDark: boolean) => ({
  ...muiFocus,
  p: 0.5, borderRadius: "6px", color: isDark ? "#A1A1AA" : "#64748B",
  "&:hover": { color: isDark ? "#FAFAFA" : "#1D4ED8", bgcolor: isDark ? "#27272A" : "#EFF6FF" },
}) as const;
