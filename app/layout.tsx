import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import QueryProvider from "@/components/QueryProvider";
import NavGuard from "@/components/layout/NavGuard";
import { cn } from "@/lib/utils";


// ── Inter: universal font family ──────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social DNA Labs — CRM",
  description: "Customer Relationship Management Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = (await cookies()).get("crm-theme")?.value === "dark" ? "dark" : "light";
  const pathname = (await headers()).get("x-pathname") ?? "";
  // Light-only auth pages never get the dark class (mirrors ThemeContext).
  const forceLight = ["/login", "/register", "/forgot-password"].includes(pathname);
  return (
    <html lang="en" className={cn("font-sans", inter.variable, theme === "dark" && !forceLight && "dark")} style={{ fontFamily: "var(--font-inter)" }}>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ThemeRegistry initialTheme={theme}>
          <NavGuard />
          {children}
        </ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
