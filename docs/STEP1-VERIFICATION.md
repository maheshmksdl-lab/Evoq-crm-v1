# Step 1 Verification Report — Next 16 / Tailwind 4 / shadcn / TanStack Query / Zod

Local-only. No Git or deploy actions were taken as part of this verification.
Tested against the running dev server (Next 16.4.6, Turbopack) with headless Chromium
at 1440×900, auth cookie `crm_auth=true`, both themes via the app's own toggle.

## Coverage

| Area | Result |
|---|---|
| List/landing routes: `/`, `/leads`, `/contacts`, `/accounts`, `/deals`, `/tasks`, `/reports`, `/comms`, `/settings` (+ `?tab=homepage`, `?tab=permission`) | 200, no console/page errors |
| Builder routes: `/reports/create`, `/reports/new/edit` | 200 |
| Inner pages: `/leads/1`, `/contacts/1`, `/accounts/1`, `/deals/1`, `/tasks/1`, `/reports/r1` | 200 in light and dark |
| Auth pages: `/login`, `/register`, `/forgot-password` (unauthenticated) | 200, light-only by design |
| Unknown route `/nonexistent` | 404 (expected) |
| Horizontal overflow at 1440px | None on any page |
| Total page loads checked | 43 |

Not covered: `/home/[id]/edit` (no entry point found without interacting with Settings),
mobile/tablet breakpoints, interactive flows (drawers, popovers, kanban drag, report builder
canvas), and real data (everything is mock data).

## Issues found and FIXED (all in `app/globals.css`)

1. **Unlayered element rules beat Tailwind v4 utilities.** In v4 utilities live in a CSS
   layer, so plain `h1–h6 { color; font-size; margin }`, responsive heading rules,
   `table` and `button` rules overrode utilities such as `text-white`, `text-lg`, `mb-1`.
   Visible symptom: "Welcome back, PM SDL" invisible in light mode on the dashboard; page
   titles oversized with extra margin. Fix: moved those rules into `@layer base`
   (restores v3 behaviour).
2. **Upgrade tool rewrote hex colours to theme tokens, breaking dark mode.** e.g.
   `bg-[#f9fbff]` → `bg-surface`, `text-[#1D4ED8]` → `text-brand-700`,
   `border-[#E3ECFC]` → `border-border-light` (~356 uses). The dark-mode overrides in
   globals.css target the old hex class names, so those elements stayed light in dark mode
   (e.g. white lead header card with white, invisible name). Fix: added alias selectors for
   the token classes to 15 existing dark rules (21 aliases). Token ↔ hex map:
   brand-50/surface-light=#eff6ff, brand-100=#dbeafe, brand-500=#3b82f6,
   brand-600=#2563eb, brand-700=#1d4ed8, brand-900=#1e3a5f, border-light=#e3ecfc,
   border=#e5e7eb, surface=#f9fbff.
   **Going forward, new dark-mode overrides must target the token class names.**
3. **shadcn light tokens did not match the MUI/brand palette** (pure white
   `--background`/`--card`, neutral greys). Aligned light tokens: background/card/popover
   `#F9FBFF`, foreground `#0C2472`, muted/accent `#EFF6FF`, secondary/input `#E3ECFC`,
   muted-foreground `#64748B`, destructive `#EF4444`, primary `#0C2472`, ring `#3B82F6`.
4. Inter restored as the font after shadcn init switched it to Geist.

## Theme consistency (MUI vs shadcn)

| Token | Light shadcn | Light MUI | Dark shadcn | Dark MUI |
|---|---|---|---|---|
| surface / paper | #f9fbff | #f9fbff | #0a0a0a | #0a0a0a |
| border | #e3ecfc | #E3ECFC | #27272a | #27272A |
| page background | `--bg-page` #eff6ff | #f9fbff default | #000 | #000 |

Consistent. Caveat: in dark mode `--primary` falls back to shadcn's neutral light grey
(`.dark` block) since the app's `html.dark` block does not define it. That fits the app's
current grey dark buttons, but confirm when the first shadcn `Button` is used for primary CTAs.
No shadcn component other than the starter `button.tsx` is used in any page yet, so the
shadcn side is verified at token level only, not visually in context.

## Follow-up fixes (second pass)

| # | Issue | Fix | Verified |
|---|---|---|---|
| 1 | Dark mode lost on reload | *(superseded by the cookie-based approach in the third pass)* `ThemeContext`: removed the effect that wrote `crm-theme` on every render (it saved the default `"light"` before the stored value was applied; StrictMode's second effect pass then read it back). The value is now written only in `toggle()`. | Toggle dark → reload → still dark, stored `dark`. Also stays dark across client navigation, `/settings`, and authed `/login` redirect. Toggle back to light + reload → light. Checked on dev server and production build. |
| 2 | Logo invisible in dark mode; new logo supplied | Replaced `public/logo.png` with the supplied logo (135×55). Generated `public/logo-dark.png` (white wordmark, icon unchanged). New `components/layout/Logo.tsx` renders both and swaps via `dark:` CSS (no flash). Used in `AppHeader` and `Sidebar`. Login/register/forgot-password keep `/logo.png` (light-only pages). | Header logo visible in light and dark (screenshots). Login page shows the new logo. |
| 3 | `/favicon.ico` 404 | Added `app/favicon.ico` (16/32/48 px, cropped from the logo icon). | `GET /favicon.ico` → 200 `image/x-icon` 5560 B on dev and production; `<link rel="icon">` present. |

Note: the supplied logo reads "CRM" only (no "EVOQ" wordmark); it was used as provided.

Files touched: `components/ThemeContext.tsx`, `components/layout/AppHeader.tsx`,
`components/layout/Sidebar.tsx`, `components/layout/Logo.tsx` (new),
`public/logo.png`, `public/logo-dark.png` (new), `app/favicon.ico` (new).

## Responsive testing (production build, Chromium)

68 page loads: 17 routes × {mobile 375×812, tablet 768×1024} × {light, dark}, touch enabled.
All 200, correct theme applied, zero console errors, and no element extends past the
viewport outside a scroll container (checked per element, because `html/body` use
`overflow-x: hidden` which would hide page-level overflow).

Observations at the time (**all fixed in the third pass**, except the mobile button-label/stacking note):
- A faint grey gradient strip is visible along the left edge on mobile and tablet
  (off-canvas sidebar shadow leaking; seen on light mode, e.g. `/leads`, `/leads/1`).
- Mobile header shows only the hamburger, theme, bell and avatar; the logo is not shown
  below the desktop breakpoint (design choice or gap — confirm).
- Lead detail "Stage Progress" clips at 375px ("In Pro…"); DataGrid tables on tablet
  scroll horizontally with truncated headers ("PROBAB", "ACCOUNT N").
- Mobile "New Lead" button label shortens to "New"; the Filters/Columns/Sort buttons
  stack full-width (works, but tall).

## Interactive-flow testing (production build, desktop 1440×900, light + dark)

66 checks (33 per theme): **66/66 pass, zero console errors.**

- New Lead / Contact / Account / Deal / Task drawers open (5 modules)
- DataGrid row click → detail page (leads, contacts, accounts, deals, tasks)
- Leads: Filters popover, Columns drawer, Sort popover, status-tab filter (New → 4 rows),
  search ("priya" → 1 row), Grid view, Kanban view; Deals Kanban view
- Lead detail: Timeline tab, Convert drawer (settles fully inside the viewport), stage click
- Sidebar collapse/expand; every nav item navigates to the right route
- Top bar: notifications, global search typing, avatar menu; dashboard switcher menu
- Settings: all 9 sections clickable
- Reports: list → sample report; Create Chart; builder Add Module dialog; adding a module
  creates a canvas node
- In-page theme toggle

*(Second pass; the third pass below re-tests these on a clean production server and adds the previously unexercised flows.)*

Two initial failures were test-selector errors (sidebar link names include badge counts;
first "Leads" text match was the sidebar behind the modal) and passed after correcting
the selectors. The flows not exercised here (forms, kanban, bulk, builder edges, keyboard-only) are covered in the third pass.

## Third pass: warning root cause, mobile/tablet polish, remaining interaction checks

### 1. React dev warning — root cause found and fixed (no workaround)

Warning: `Can't perform a React state update on a component that hasn't mounted yet`
(5× per page load, dev only). Correction to the previous report: it was **not** specific to
`/leads` — it occurred on every page with a DataGrid (leads, contacts, deals, accounts,
tasks, reports) whenever dark mode was restored at load.

Investigation:
1. Captured the JS call stack at the moment React logged it: `useGridVirtualScroller.mainRefCallback`
   (DataGrid ref attach) → `publishEvent('resize')` → `useGridDimensions.updateDimensions`
   → `store.update` → `useGridSelector` subscriber `setState` on a not-yet-mounted component.
2. Timeline instrumentation showed the warning fired during the page's first mount, in the
   same window as the theme flip.
3. **Controlled experiment:** delaying the post-mount `setTheme("dark")` by 3 s made the
   warning disappear → the trigger is the theme flip racing the DataGrid's initial mount.

Root cause: `ThemeContext` started as `"light"` and resolved the stored theme in a mount
effect (`setTheme("dark")`). That state change re-rendered the whole tree, with a freshly built
MUI theme object, while the page's DataGrid was still mounting.

Fix (removes the flip itself): the theme preference is now a **cookie** (`crm-theme`),
read on the server.
- `app/layout.tsx` (async) reads the cookie and renders `<html class="dark">` server-side,
  and passes `initialTheme` to `ThemeRegistry` → `ThemeProvider` (state initialised from it).
  No post-mount flip, no flash of light theme.
- `proxy.ts` forwards the pathname as `x-pathname` so light-only pages (`/login`,
  `/register`, `/forgot-password`) never receive the dark class on the server.
- `toggle()` writes the cookie (1 year, `SameSite=Lax`). The old `localStorage` key
  is no longer read, so users' previously saved preference resets to light once.
- Side effect: reading cookies in the root layout makes **all routes dynamic (ƒ)** instead of
  static (○). Acceptable for an authenticated app; noted for deployment planning.

Verified (dev server): 9 routes × {dark, light} cookie → server HTML carries the right class,
client agrees, **0 console errors/warnings**; auth pages stay light with a dark cookie.
In-page toggle → cookie → reload persists; toggling back to light persists.

### 2. Mobile / tablet polish (verified at 375 px and 768 px, light and dark)

| Item | Root cause | Fix | Result |
|---|---|---|---|
| Logo missing in mobile header | Mobile header branch never rendered a logo | `<Logo height={26}/>` added after the hamburger in `AppHeader` | Visible (64×26) with the correct light/dark variant |
| Stage Progress clipped on Lead Detail | Row was `overflow-x-auto` with 104 px-min buttons: clipped with no scroll cue | `LeadDetail.tsx`: row wraps below `lg`; carets hidden below `sm`; Won/Lost pinned right. Desktop single-row layout unchanged | All 4 stage buttons fully inside the viewport at 375 px |
| Truncated DataGrid headers on tablet | Hand-set `minWidth` 100–160 px too small for icon + 14 px uppercase header | `fitHeaders()` in `lib/dataGridStyles.ts` raises each column's `minWidth` to fit its header; applied with a one-line change in the 6 list pages | 0 truncated headers on 6 grids @768 and Deals @1440, both themes |
| Left-edge shadow strip | Closed mobile drawer sat at `translateX(-100%)` but kept its `box-shadow` (4 px + 24 px blur ≈ 28 px bleed) | `Sidebar.tsx`: shadow only while open | Closed drawer: `box-shadow: none` |
| Closed drawer links were keyboard-focusable (found while fixing the above) | Off-screen only, not hidden | `visibility: hidden` (delayed to the end of the close animation) + `aria-hidden` | First 6 Tab stops never enter the closed drawer; opens/closes correctly |

Not changed (outside the listed scope): `DealDetail.tsx` has a similar `overflow-x-auto`
stage bar.

### 3. Interaction checks — what is connected to a backend and what is not

**There is no backend.** No API routes (`app/api` does not exist), no `fetch`/axios/React Query
calls anywhere in `app`, `components` or `lib`. The only network requests the app makes are
page assets and **avatar images from `randomuser.me`** (a third-party host; consider
bundling avatars before production). Zero non-GET requests were observed during any
form submission in either theme. All data is in-memory mock data and resets on reload.

| Area | Behaviour observed | Status |
|---|---|---|
| Login | Hard-coded credential constants in client code, 600 ms fake delay; on match sets `crm_auth` cookie + localStorage and redirects. Wrong credentials → inline error. Empty → native `required` blocks. | **Frontend-only auth simulation** (credentials are in the client bundle; the `lib/schemas/auth.ts` Zod schema is not wired in) |
| Register | Native `required` + JS checks (passwords match, ≥ 6 chars). Success state then redirect to `/login`. No account is created anywhere. | **Frontend-only** |
| Forgot password | Shows "Check your email / We sent a reset link" after 0.8 s. No email is sent. | **Frontend-only (simulated)** |
| New Lead / Contact / Deal / Task drawers | Save does `console.log(form)` and closes. **No validation** (the Lead drawer shows a required `*` marker that is not enforced; an empty form saves). No new row appears, nothing persists. | **Frontend-only, non-functional save** |
| New Account drawer | Save button disabled until Account Name is filled; otherwise same as above (log + close, nothing saved). | **Frontend-only, non-functional save** |
| Lead detail Edit drawer | Opens prefilled; "Update Lead" logs and closes; header is not updated. | **Frontend-only, non-functional save** |
| Lead Convert drawer | "Convert" gating works (requires deal name + close date when "Create a new Deal" is ticked). No conversion happens. | **Frontend-only** |
| Drawer reset | Escape closes all drawers. Leads/Contacts/Tasks reset on reopen; **Accounts and Deals keep stale text after Escape** (reset only on Cancel/Save). | Minor bug |
| Bulk actions — Leads | Assign Owner, Update Status, Delete all work on in-memory state; lost on reload. Select-all and Clear work. | Works (frontend-only) |
| Bulk actions — Contacts, Accounts, Deals, Tasks | Bar appears with its buttons (Send Email / Assign Owner / Update Type / Update Stage / Update Status / Delete) but **the buttons have no handlers**: Delete leaves the row count unchanged. | **UI only, not implemented** |
| Bulk actions — Reports | Checkboxes exist; no bulk bar. | Not implemented |
| Kanban drag-and-drop (Leads, Deals) | Cards are not draggable (0 `draggable` elements, no DnD library); a real mouse drag changes nothing. | **Not implemented** (not invented) |
| Report builder — edge linking | Adding a module creates a node (no automatic edge; the status panel shows "has no connections" by design). Dragging a source handle to a target handle creates an edge (connection line shown during the drag, status → "Ready"). Linking a node to itself creates a red dashed edge and the message "Accounts and Accounts cannot be connected directly". All 5 modules are mutually related in `moduleRelationships.ts`, so self-links are the only invalid connection reachable. Removing a node removes its edges. | Works (frontend-only; saving a report is not persisted) |

Keyboard-only navigation (both themes):
- Tab order on `/leads`: collapse sidebar → search → theme toggle → notifications → sidebar links → toolbar → grid; **every stop shows a visible focus indicator**.
- New Lead drawer opens with Enter, focus moves inside it, **0 of 45 Tab presses escape the drawer**, Escape closes it and returns focus to the "New Lead" button.
- Grid: arrow keys move cell focus; Space on a row checkbox selects the row.
- Sidebar links activate with Enter; the theme toggle works with Enter and Space; the Sort popover opens with Enter and closes with Escape.
- **Gap:** pressing Enter on a focused grid cell does **not** open the record. Opening a lead/contact/etc. is mouse/touch-click only, so keyboard-only users cannot reach detail pages from the lists.

Test notes: the first full run was polluted by running concurrent jobs against the dev server
(timeouts, one "Page crashed") and by selector mistakes (floating-label inputs have no
placeholder; the builder's "Add related modules" button becomes "Add Module" after the first
module). Everything was rerun on a quiet production server. Final: 86 checks; the 10 that
failed were all test-selector issues, re-verified individually (login, forgot password,
builder) with corrected selectors — all pass in light and dark. Console: 0 errors/warnings.

## Open issues / remaining problems (NOT fixed)

1. **No backend / persistence** (see the table in section 3). Every "save" is a `console.log`.
2. **Bulk actions on Contacts, Accounts, Deals, Tasks** are UI-only (no handlers).
3. **Kanban drag-and-drop** is not implemented on Leads or Deals.
4. **Keyboard users cannot open records from the grids** (Enter on a cell does nothing).
5. **Accounts and Deals drawers keep stale input after Escape.**
6. **Credentials are hard-coded in the client bundle** (login page) — acceptable only for the mock phase.
7. **Avatars are loaded from `randomuser.me`** (third-party dependency / privacy).
8. **Dashboard "View All" (Recent Deals) is a `<button>` with no handler** — does nothing.
9. **Duplicate `--color-border`** in globals.css: the later definition wins (`#E3ECFC` light). Negligible.
10. **All routes are now dynamic** (cookie read in the root layout) — a deployment consideration.
11. **Heavy global CSS**: ~500 lines of `html.dark …` `!important` overrides plus MUI theme overrides; each module migrated to shadcn should use `dark:` variants / tokens and drop them.
12. **MUI X DataGrid pinned at 7.x** (9.x available); MUI still wraps the app. Intentional for Step 1.
13. Dev-only overlays (Next dev indicator, TanStack devtools button) sit bottom-left.
14. `DealDetail.tsx` stage bar still uses the scroll-clip pattern at narrow widths.
15. `package-lock.json` removed; `pnpm-lock.yaml` is the only lockfile.
