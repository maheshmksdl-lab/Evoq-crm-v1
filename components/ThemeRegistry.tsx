"use client";
import { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useThemeSettings } from "@/lib/themeSettings";
import { applyTheme } from "@/lib/themes";
import { ThemeProvider as CRMThemeProvider, useTheme } from "./ThemeContext";
import { SidebarProvider } from "./SidebarContext";

const HEADING = "var(--font-heading), sans-serif";
const BODY    = "var(--font-body), system-ui, -apple-system, sans-serif";

const C = {
  depth:   "#0C2472",
  primary: "#E3ECFC",
  action:  "#3B82F6",
  hover:   "#E3ECFC",
  soft:    "#E3ECFC",
};

function buildTheme(isDark: boolean) {
  const bg      = isDark ? "#0A0A0A" : "#f9fbff";
  const bgHead  = isDark ? "#000000" : "#EFF6FF";
  const border  = isDark ? "#27272A" : "#E3ECFC";
  const textPri = isDark ? "#FFFFFF" : C.depth;
  const textBod = isDark ? "#D4D4D8" : "#334155";
  const textMut = isDark ? "#9CA3AF" : "#6B7280";

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary:   { main: C.primary },
      secondary: { main: C.depth   },
      success:   { main: "#10B981" },
      warning:   { main: "#F59E0B" },
      // #EF4444 gives white-on-red (badges, filled buttons) only 3.8:1; #DC2626 gives 4.8:1. Dark keeps #EF4444 (5.4:1 on black).
      error:     { main: isDark ? "#EF4444" : "#DC2626" },
      background: {
        default: isDark ? "#000000" : "#f9fbff",
        paper:   bg,
      },
      text: {
        primary:   textPri,
        secondary: textBod,
      },
      divider: border,
    },
    typography: {
      fontFamily: BODY,
      h1: { fontFamily: HEADING, fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontFamily: HEADING, fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontFamily: HEADING, fontWeight: 600 },
      h4: { fontFamily: HEADING, fontWeight: 600 },
      h5: { fontFamily: HEADING, fontWeight: 600 },
      h6: { fontFamily: HEADING, fontWeight: 600 },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.6 },
    },
    shape: { borderRadius: 12 },

    components: {
      // ── Paper (base for Drawer, Menu, Dialog, etc.) ───
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: bg,
            backgroundImage: "none",
            borderColor: border,
          },
        },
      },

      // ── Buttons ────────────────────────────────────────
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            fontFamily: BODY,
            transition: "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, border-color 0.2s ease",
            fontSize: "0.875rem",
          },
          sizeSmall: {
            padding: "8px 14px",
            fontSize: "0.8125rem",
            height: "36px",
            minWidth: "auto",
          },
          sizeMedium: {
            padding: "10px 16px",
            height: "40px",
            minWidth: "auto",
          },
          sizeLarge: {
            padding: "12px 20px",
            height: "48px",
            minWidth: "auto",
          },
          containedPrimary: {
            backgroundColor: C.primary,
            color: "#fff",
            boxShadow: "none",
            "&:hover": { backgroundColor: C.hover, boxShadow: `0 4px 12px 0 ${C.primary}20` },
            "&:active": { backgroundColor: C.depth, transform: "scale(0.98)" },
            "&.Mui-disabled": { backgroundColor: border, color: "#9CA3AF", boxShadow: "none" },
          },
          outlinedPrimary: {
            borderColor: border,
            color: C.primary,
            backgroundColor: "transparent",
            border: `1px solid ${border}`,
            "&:hover": { borderColor: C.primary, backgroundColor: `${C.primary}08`, border: `1px solid ${C.primary}` },
            "&:active": { borderColor: C.primary, backgroundColor: `${C.primary}12`, border: `1px solid ${C.primary}` },
            "&.Mui-disabled": { borderColor: border, color: "#9CA3AF", backgroundColor: "transparent" },
          },
          textPrimary: {
            color: C.primary,
            padding: "8px 12px",
            "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(96, 165, 250, 0.1)", color: C.depth },
            "&:active": { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(96, 165, 250, 0.15)", color: C.depth },
          },
        },
      },

      // ── Icon Button ────────────────────────────────────
      MuiIconButton: {
        styleOverrides: {
          root: {
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            color: textBod,
            transition: "background-color 0.2s ease, color 0.2s ease",
            "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(96, 165, 250, 0.1)" },
            "&.Mui-disabled": { color: "#9CA3AF", backgroundColor: "transparent" },
          },
          sizeSmall: {
            width: "36px",
            height: "36px",
            fontSize: "1.25rem",
          },
          sizeMedium: {
            width: "40px",
            height: "40px",
            fontSize: "1.5rem",
          },
          sizeLarge: {
            width: "48px",
            height: "48px",
            fontSize: "1.75rem",
          },
        },
      },

      // ── Form Inputs ────────────────────────────────────
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontFamily: BODY,
            fontSize: "0.875rem",
            backgroundColor: bg,
            borderRadius: "8px",
            color: textBod,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: border, borderWidth: 1 },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#52525B" : "#D0D5DC" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: C.primary, borderWidth: 1.5 },
            "&.Mui-focused": { boxShadow: `0 0 0 3px ${C.soft}40` },
            "&.Mui-disabled": {
              backgroundColor: isDark ? "#000000" : "#EFF6FF",
              opacity: 1,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "#EF4444" },
          },
          input: { padding: "10px 12px", color: textBod },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: { fontFamily: BODY, color: textBod },
          input: { color: textBod, "&::placeholder": { color: textMut, opacity: 1 } },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontFamily: BODY,
            fontSize: "0.79rem",
            color: textMut,
            "&.Mui-focused": { color: C.primary },
            "&.Mui-error":   { color: "#EF4444" },
          },
        },
      },

      // ── Select ─────────────────────────────────────────
      MuiSelect: {
        styleOverrides: {
          select: {
            fontFamily: BODY,
            fontSize: "0.875rem",
            padding: "10px 12px",
            backgroundColor: bg,
            borderRadius: "8px",
            color: textBod,
          },
          icon: { color: textMut },
        },
      },

      // ── Chip ───────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: "0.75rem",
            backgroundColor: isDark ? "#27272A" : "#F0F1F3",
            color: isDark ? "#9CA3AF" : C.depth,
            borderRadius: "6px",
            padding: "4px 8px",
          },
          colorPrimary: {
            backgroundColor: isDark ? `${C.primary}25` : `${C.primary}15`,
            color: isDark ? C.soft : C.primary,
          },
        },
      },

      // ── Table ──────────────────────────────────────────
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontFamily: BODY,
            borderColor: border,
            padding: "12px 16px",
            backgroundColor: bg,
            color: textBod,
          },
          head: {
            fontFamily: HEADING,
            fontWeight: 700,
            color: textPri,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            backgroundColor: bgHead,
            borderColor: border,
          },
          body: {
            backgroundColor: bg,
            color: textBod,
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover td": { backgroundColor: `${C.hover}0A` },
          },
        },
      },

      // ── Keyboard focus (Step 7) ─────────────────────────
      // MUI removes the outline on ButtonBase; restore the same 2px ring the Leads
      // pages use, for every MUI button / icon button / menu item / checkbox / switch.
      MuiButtonBase: {
        styleOverrides: {
          root: { "&.Mui-focusVisible": { outline: "2px solid #3B82F6", outlineOffset: "2px" } },
        },
      },
      MuiListItemButton: {
        styleOverrides: { root: { "&.Mui-focusVisible": { outlineOffset: "-2px" } } },
      },
      MuiTab: {
        styleOverrides: { root: { "&.Mui-focusVisible": { outlineOffset: "-2px" } } },
      },

      // ── Menu / MenuItem ────────────────────────────────
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: bg,
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: BODY,
            fontSize: "0.82rem",
            color: textBod,
            "&:hover": { backgroundColor: isDark ? "#27272A" : "#EFF6FF" },
            "&.Mui-focusVisible": { outlineOffset: "-2px" },
            "&.Mui-selected": {
              backgroundColor: isDark ? `${C.primary}20` : `${C.primary}12`,
              color: C.primary,
              "&:hover": { backgroundColor: isDark ? `${C.primary}30` : `${C.primary}1A` },
            },
          },
        },
      },

      MuiListItemText: {
        styleOverrides: { primary: { fontFamily: BODY, color: textBod } },
      },

      // ── Checkbox ───────────────────────────────────────
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDark ? "#8A8A94" : "#64748B",   // was #52525B / #E2E8F0 (≈1.2 : 1) — unchecked boxes were barely visible
            "&.Mui-checked":               { color: C.primary },
            "&.MuiCheckbox-indeterminate": { color: C.primary },
            "&:hover": { backgroundColor: `${C.soft}20` },
            "&.Mui-focusVisible": { outlineOffset: "-3px" },
          },
        },
      },

      // ── Tooltip ────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? "#000000" : C.depth,
            fontSize: "0.7rem",
            fontFamily: BODY,
            borderRadius: "8px",
            padding: "5px 10px",
            border: isDark ? `1px solid ${border}` : "none",
          },
          arrow: { color: isDark ? "#000000" : C.depth },
        },
      },

      // ── Dialog / Modal ─────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: bg,
            borderRadius: "16px",
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.4)" : "0 10px 40px rgba(0,0,0,0.08)",
          },
        },
      },

      // ── Drawer ─────────────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: bg,
            borderColor: border,
          },
        },
      },

      // ── Popover ────────────────────────────────────────
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: bg,
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
          },
        },
      },

      // ── Avatar: initials are white on the (dark-enough) avatar fills. MUI's default follows the page
      // background (near-white in light mode, black in dark mode) which gave 2.1–3.7:1 on green/amber/purple.
      MuiAvatar: {
        styleOverrides: { root: { color: "#FFFFFF" } },
      },

      // ── Divider ────────────────────────────────────────
      MuiDivider: {
        styleOverrides: { root: { borderColor: border } },
      },

      // ── Badge ──────────────────────────────────────────
      MuiBadge: {
        styleOverrides: { colorPrimary: { backgroundColor: C.primary } },
      },

      // ── Switch ─────────────────────────────────────────
      MuiSwitch: {
        styleOverrides: {
          track: { backgroundColor: isDark ? "#52525B" : "#E2E8F0" },
          switchBase: { "&.Mui-focusVisible": { outlineOffset: "-4px" } },
        },
      },
    },
  });
}

/** Applies the chosen colour theme to the whole page, and again whenever light/dark mode flips. */
function ColorThemeApplier() {
  const { theme, custom } = useThemeSettings();
  useEffect(() => {
    applyTheme(theme, custom);
    const mo = new MutationObserver(() => applyTheme(theme, custom));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [theme, custom]);
  return null;
}

function MUIThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = buildTheme(theme === "dark");
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

export default function ThemeRegistry({ children, initialTheme }: { children: React.ReactNode; initialTheme?: "light" | "dark" }) {
  return (
    <CRMThemeProvider initialTheme={initialTheme}>
      <SidebarProvider>
        <ColorThemeApplier />
        <MUIThemeWrapper>{children}</MUIThemeWrapper>
      </SidebarProvider>
    </CRMThemeProvider>
  );
}

