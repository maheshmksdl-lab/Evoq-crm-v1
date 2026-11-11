import type { SxProps, Theme } from "@mui/material/styles";

// Shared MUI X DataGrid theming - matched exactly to RecentDeals table styling
// Reference: components/dashboard/RecentDeals.tsx
// Every list page (Leads, Deals, Contacts, Accounts) uses this consistently.
export const getDataGridSx = (isDark: boolean): SxProps<Theme> => ({
  border: "none",
  bgcolor: isDark ? "#0A0A0A" : "#f9fbff",
  fontFamily: "inherit",

  // ──────────────────────────────────────────────────────────────────
  // COLUMN HEADERS - Matching RecentDeals exactly
  // ──────────────────────────────────────────────────────────────────
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: `${isDark ? "#111111" : "#EFF6FF"} !important`,
    borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"} !important`,
  },

  "& .MuiDataGrid-columnHeader": {
    outline: "none !important",
    // Horizontal inset only — columnHeaderHeight is a fixed pixel box (see
    // columnHeaderHeight={40} on each page); vertical padding here would eat
    // into that fixed height and clip the header content instead of centering it.
    padding: "0 16px !important",
  },

  // Typography fallback for columns that render a plain headerName (no custom
  // renderHeader). Every current column uses a local <ColHeader> component with
  // its own Tailwind classes, which take precedence over these inherited values
  // since they're set explicitly on that element — so this never fights it.
  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "11.5px !important",
    fontWeight: "700 !important",
    textTransform: "uppercase !important",
    letterSpacing: "0.05em !important",
    color: `${isDark ? "#9CA3AF" : "#0C2472"} !important`,
  },

  "& .MuiDataGrid-columnSeparator": {
    display: "none !important",
  },

  // ──────────────────────────────────────────────────────────────────
  // CELLS - Matching RecentDeals typography/colors within the fixed
  // rowHeight={44} box (vertical padding would clip content the same way).
  // ──────────────────────────────────────────────────────────────────
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"} !important`,
    padding: "0 16px !important",
    backgroundColor: `${isDark ? "#18181B" : "#f9fbff"} !important`,
    color: `${isDark ? "#D4D4D8" : "#334155"} !important`,
    display: "flex !important",
    alignItems: "center !important",
    fontSize: "14px !important",
    outline: "none !important",
  },

  "& .MuiDataGrid-cell:focus": {
    outline: "none !important",
  },

  "& .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },

  // ──────────────────────────────────────────────────────────────────
  // ROWS - Matching RecentDeals hover/selection
  // ──────────────────────────────────────────────────────────────────
  "& .MuiDataGrid-row": {
    cursor: "pointer !important",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: `${isDark ? "rgba(255,255,255,0.03)" : "rgba(29,78,216,0.04)"} !important`,
  },

  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: `${isDark ? "#1B1B20" : "rgba(59,130,246,0.12)"} !important`,
  },

  "& .MuiDataGrid-row.Mui-selected:hover": {
    backgroundColor: `${isDark ? "#1B1B20" : "rgba(59,130,246,0.12)"} !important`,
  },

  "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
    backgroundColor: `${isDark ? "#1B1B20" : "rgba(59,130,246,0.12)"} !important`,
  },

  // ──────────────────────────────────────────────────────────────────
  // FOOTER & PAGINATION
  // ──────────────────────────────────────────────────────────────────
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${isDark ? "#27272A" : "#E3ECFC"} !important`,
    backgroundColor: `${isDark ? "#0A0A0A" : "#f9fbff"} !important`,
    fontSize: "11px !important",
  },

  "& .MuiDataGrid-selectedRowCount": {
    fontSize: "11px !important",
    color: `${isDark ? "#A1A1AA" : "#64748B"} !important`,
  },

  "& .MuiTablePagination-root": {
    fontSize: "11px !important",
    color: `${isDark ? "#A1A1AA" : "#334155"} !important`,
  },

  // ──────────────────────────────────────────────────────────────────
  // CHECKBOXES
  // ──────────────────────────────────────────────────────────────────
  "& .MuiCheckbox-root": {
    color: `${isDark ? "#8A8A94" : "#64748B"} !important`,
  },

  "& .MuiCheckbox-root.Mui-checked": {
    color: "#1D4ED8 !important",
  },

  "& .MuiCheckbox-root.MuiCheckbox-indeterminate": {
    color: "#1D4ED8 !important",
  },

  "& .MuiCheckbox-root.Mui-focusVisible": {
    outline: "2px solid #3B82F6 !important",
    outlineOffset: "-3px !important",
  },

  // ──────────────────────────────────────────────────────────────────
  // BACKGROUND
  // ──────────────────────────────────────────────────────────────────
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: `${isDark ? "#0A0A0A" : "#f9fbff"} !important`,
  },

  "& .MuiDataGrid-overlay": {
    backgroundColor: "transparent !important",
  },
});

// ── List refinements ─────────────────────────────────────────────────
// Enhanced row actions visibility and keyboard focus styling for better UX.
// Applied to all DataGrid list pages (Leads, Deals, Contacts, Accounts).
export const getListGridRefinementsSx = (isDark: boolean): SxProps<Theme> => ({
  // row actions: revealed on row hover / keyboard focus, always visible on touch devices
  "& .row-actions": { opacity: 0, transition: "opacity 120ms ease" },
  "& .MuiDataGrid-row:hover .row-actions, & .MuiDataGrid-row:focus-within .row-actions, & .row-actions:focus-within": { opacity: 1 },
  "@media (hover: none)": { "& .row-actions": { opacity: 1 } },
  // keyboard focus ring for cells / headers
  "&& .MuiDataGrid-cell:focus-visible, && .MuiDataGrid-columnHeader:focus-visible": { outline: "2px solid #3B82F6 !important", outlineOffset: "-2px" },
});

/** Base list styling + Step 7 refinements, for list pages other than Leads (which layers its own copy). */
export const listGridSx = (isDark: boolean): SxProps<Theme> =>
  [getDataGridSx(isDark), getListGridRefinementsSx(isDark)] as SxProps<Theme>;

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// ── Header-aware column sizing ───────────────────────────────────────
// Column minWidths were hand-set (100–160px) and are too narrow for the
// 14px/semibold/uppercase header (icon + label + cell padding), so headers like
// "AMOUNT" / "PROBABILITY (%)" were truncated once the grid stopped stretching
// (tablet widths). This raises each column's minWidth to fit its header text;
// columns that are wider already are left alone.
const HEADER_CHAR_PX = 9.8;   // 14px semibold uppercase + tracking-wide
const HEADER_CHROME_PX = 65;  // icon (13) + gap (6) + header padding (2×16) + safety (14)

export function fitHeaders<T extends { headerName?: string; field: string; minWidth?: number; width?: number; flex?: number }>(cols: T[]): T[] {
  return cols.map((c) => {
    if (!c.headerName) return c;
    const needed = Math.ceil(c.headerName.length * HEADER_CHAR_PX + HEADER_CHROME_PX);
    if (c.flex != null) return { ...c, minWidth: Math.max(c.minWidth ?? 0, needed) };
    if (c.width != null) return { ...c, width: Math.max(c.width, needed) };
    return c;
  });
}
