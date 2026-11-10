"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

// These pages are light-only by design (no isDark awareness in their
// markup) and render before the user is authenticated, so the app-wide
// dark mode preference must never leak into them via the global
// html.dark CSS overrides.
const FORCE_LIGHT_ROUTES = ["/login", "/register", "/forgot-password"];

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export const THEME_COOKIE = "crm-theme";

// `initialTheme` comes from the cookie on the server, so the very first render
// (and the server HTML) already use the right theme. Resolving the theme after
// mount (localStorage + setState in an effect) re-rendered the whole tree with a
// new MUI theme while the page's DataGrid was still mounting, which made MUI X
// DataGrid call setState on not-yet-mounted subscribers (React dev warning).
export function ThemeProvider({ children, initialTheme = "light" }: { children: React.ReactNode; initialTheme?: Theme }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const forceLight = FORCE_LIGHT_ROUTES.includes(pathname);
    if (theme === "dark" && !forceLight) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, pathname]);

  // Persist only on an explicit user choice (cookie, so the server can read it).
  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
