# Step 4 — Dashboard gradient rolled out to all CRM screens

Local-only. No Git, deploy or dependency changes. Reference: [STEP3-DASHBOARD-GRADIENT.md](STEP3-DASHBOARD-GRADIENT.md).

## What changed

Every CRM screen already renders inside the same canvas wrapper, `div.sidebar-content`
(the area right of the sidebar, below the header). The Step 3 gradient lives in a single CSS rule;
Step 4 simply attaches that rule to the same wrapper on every other screen.

**Shared implementation (no duplicated CSS, no new tokens):** one rule in `app/globals.css`, now with two
selectors:

```css
.dashboard-canvas,
.app-canvas {
  background-color: var(--canvas-from);
  background-image:
    radial-gradient(120% 70% at 100% 0%, var(--canvas-glow) 0%, transparent 60%),
    linear-gradient(165deg, var(--canvas-from) 0%, var(--canvas-via) 55%, var(--canvas-to) 100%);
  background-repeat: no-repeat;
}
```

The tokens (`--canvas-from/-via/-to/-glow`) and their light/dark values are exactly those approved in
Step 3 (built from `--bg-page`, `--border`, `--bg-surface-2`, brand-100/500/900); they were not touched.
`.dashboard-canvas` on the Dashboard was not changed; `.app-canvas` is an alias so other pages don't carry a
misleading class name. Theme switching/persistence needs nothing extra — the tokens are redefined under
`html.dark`, which is already server-rendered from the theme cookie.

## Files modified

1 CSS file + 18 component/page files, 24 wrapper elements. Each TSX change is one added class
(`sidebar-content` → `sidebar-content app-canvas`); no markup, layout, logic or data changes.

| File | Wrappers |
|---|---|
| `app/globals.css` | rule selector extended (`.dashboard-canvas, .app-canvas`) + comment |
| `app/leads/page.tsx`, `app/contacts/page.tsx`, `app/accounts/page.tsx`, `app/deals/page.tsx`, `app/tasks/page.tsx` | 1 each |
| `app/reports/page.tsx`, `app/reports/create/page.tsx`, `app/reports/[id]/edit/page.tsx` | 1 each |
| `app/reports/[id]/page.tsx` | 2 (not-found/loading branch + main) |
| `app/settings/page.tsx`, `app/comms/page.tsx`, `app/home/[id]/edit/page.tsx` | 1 each |
| `components/leads/LeadDetail.tsx`, `components/contacts/ContactDetail.tsx`, `components/accounts/AccountDetail.tsx`, `components/deals/DealDetail.tsx`, `components/tasks/TaskDetail.tsx` | 2 each (not-found + main) |
| `components/layout/PageSkeleton.tsx` | 1 (shared by every `loading.tsx`, so the skeleton and the loaded page share one background — no flash) |

(`app/page.tsx` — the Dashboard — is unchanged in this step.)

## Screens and routes covered

Inventory method: listed every `page.tsx`/`loading.tsx` under `app/` and grepped for the canvas wrapper across
`app` and `components`. 21 routes/states below, 126 page states (× 3 viewports × 2 themes) all carry the gradient.
Screenshot links: **L** = light, **D** = dark (after the change; before-state desktop shots are in `step4/before-*`).

| Route | Screen | Canvas wrapper edited | Desktop 1440 | Tablet 768 | Mobile 375 |
|---|---|---|---|---|---|
| `/` | Dashboard | `app/page.tsx` (Step 3, unchanged) | [L](step4/after-light-desktop-root.png) [D](step4/after-dark-desktop-root.png) | [L](step4/after-light-tablet-root.png) [D](step4/after-dark-tablet-root.png) | [L](step4/after-light-mobile-root.png) [D](step4/after-dark-mobile-root.png) |
| `/leads` | Leads list | `app/leads/page.tsx` | [L](step4/after-light-desktop-leads.png) [D](step4/after-dark-desktop-leads.png) | [L](step4/after-light-tablet-leads.png) [D](step4/after-dark-tablet-leads.png) | [L](step4/after-light-mobile-leads.png) [D](step4/after-dark-mobile-leads.png) |
| `/leads/1` | Lead detail | `components/leads/LeadDetail.tsx` | [L](step4/after-light-desktop-leads_1.png) [D](step4/after-dark-desktop-leads_1.png) | [L](step4/after-light-tablet-leads_1.png) [D](step4/after-dark-tablet-leads_1.png) | [L](step4/after-light-mobile-leads_1.png) [D](step4/after-dark-mobile-leads_1.png) |
| `/leads/9999` | Lead detail — not-found state | `components/leads/LeadDetail.tsx` | [L](step4/after-light-desktop-leads_9999.png) [D](step4/after-dark-desktop-leads_9999.png) | [L](step4/after-light-tablet-leads_9999.png) [D](step4/after-dark-tablet-leads_9999.png) | [L](step4/after-light-mobile-leads_9999.png) [D](step4/after-dark-mobile-leads_9999.png) |
| `/contacts` | Contacts list | `app/contacts/page.tsx` | [L](step4/after-light-desktop-contacts.png) [D](step4/after-dark-desktop-contacts.png) | [L](step4/after-light-tablet-contacts.png) [D](step4/after-dark-tablet-contacts.png) | [L](step4/after-light-mobile-contacts.png) [D](step4/after-dark-mobile-contacts.png) |
| `/contacts/1` | Contact detail | `components/contacts/ContactDetail.tsx` | [L](step4/after-light-desktop-contacts_1.png) [D](step4/after-dark-desktop-contacts_1.png) | [L](step4/after-light-tablet-contacts_1.png) [D](step4/after-dark-tablet-contacts_1.png) | [L](step4/after-light-mobile-contacts_1.png) [D](step4/after-dark-mobile-contacts_1.png) |
| `/accounts` | Accounts list | `app/accounts/page.tsx` | [L](step4/after-light-desktop-accounts.png) [D](step4/after-dark-desktop-accounts.png) | [L](step4/after-light-tablet-accounts.png) [D](step4/after-dark-tablet-accounts.png) | [L](step4/after-light-mobile-accounts.png) [D](step4/after-dark-mobile-accounts.png) |
| `/accounts/1` | Account detail | `components/accounts/AccountDetail.tsx` | [L](step4/after-light-desktop-accounts_1.png) [D](step4/after-dark-desktop-accounts_1.png) | [L](step4/after-light-tablet-accounts_1.png) [D](step4/after-dark-tablet-accounts_1.png) | [L](step4/after-light-mobile-accounts_1.png) [D](step4/after-dark-mobile-accounts_1.png) |
| `/deals` | Deals list | `app/deals/page.tsx` | [L](step4/after-light-desktop-deals.png) [D](step4/after-dark-desktop-deals.png) | [L](step4/after-light-tablet-deals.png) [D](step4/after-dark-tablet-deals.png) | [L](step4/after-light-mobile-deals.png) [D](step4/after-dark-mobile-deals.png) |
| `/deals/1` | Deal detail | `components/deals/DealDetail.tsx` | [L](step4/after-light-desktop-deals_1.png) [D](step4/after-dark-desktop-deals_1.png) | [L](step4/after-light-tablet-deals_1.png) [D](step4/after-dark-tablet-deals_1.png) | [L](step4/after-light-mobile-deals_1.png) [D](step4/after-dark-mobile-deals_1.png) |
| `/tasks` | Tasks list | `app/tasks/page.tsx` | [L](step4/after-light-desktop-tasks.png) [D](step4/after-dark-desktop-tasks.png) | [L](step4/after-light-tablet-tasks.png) [D](step4/after-dark-tablet-tasks.png) | [L](step4/after-light-mobile-tasks.png) [D](step4/after-dark-mobile-tasks.png) |
| `/tasks/1` | Task detail | `components/tasks/TaskDetail.tsx` | [L](step4/after-light-desktop-tasks_1.png) [D](step4/after-dark-desktop-tasks_1.png) | [L](step4/after-light-tablet-tasks_1.png) [D](step4/after-dark-tablet-tasks_1.png) | [L](step4/after-light-mobile-tasks_1.png) [D](step4/after-dark-mobile-tasks_1.png) |
| `/reports` | Reports list | `app/reports/page.tsx` | [L](step4/after-light-desktop-reports.png) [D](step4/after-dark-desktop-reports.png) | [L](step4/after-light-tablet-reports.png) [D](step4/after-dark-tablet-reports.png) | [L](step4/after-light-mobile-reports.png) [D](step4/after-dark-mobile-reports.png) |
| `/reports/r1` | Report detail | `app/reports/[id]/page.tsx` (2 wrappers) | [L](step4/after-light-desktop-reports_r1.png) [D](step4/after-dark-desktop-reports_r1.png) | [L](step4/after-light-tablet-reports_r1.png) [D](step4/after-dark-tablet-reports_r1.png) | [L](step4/after-light-mobile-reports_r1.png) [D](step4/after-dark-mobile-reports_r1.png) |
| `/reports/no-such-id` | Report detail — unknown id | `app/reports/[id]/page.tsx` | [L](step4/after-light-desktop-reports_no-such-id.png) [D](step4/after-dark-desktop-reports_no-such-id.png) | [L](step4/after-light-tablet-reports_no-such-id.png) [D](step4/after-dark-tablet-reports_no-such-id.png) | [L](step4/after-light-mobile-reports_no-such-id.png) [D](step4/after-dark-mobile-reports_no-such-id.png) |
| `/reports/r1/edit` | Report builder (edit) | `app/reports/[id]/edit/page.tsx` | [L](step4/after-light-desktop-reports_r1_edit.png) [D](step4/after-dark-desktop-reports_r1_edit.png) | [L](step4/after-light-tablet-reports_r1_edit.png) [D](step4/after-dark-tablet-reports_r1_edit.png) | [L](step4/after-light-mobile-reports_r1_edit.png) [D](step4/after-dark-mobile-reports_r1_edit.png) |
| `/reports/new/edit` | Report builder (new) | `app/reports/[id]/edit/page.tsx` | [L](step4/after-light-desktop-reports_new_edit.png) [D](step4/after-dark-desktop-reports_new_edit.png) | [L](step4/after-light-tablet-reports_new_edit.png) [D](step4/after-dark-tablet-reports_new_edit.png) | [L](step4/after-light-mobile-reports_new_edit.png) [D](step4/after-dark-mobile-reports_new_edit.png) |
| `/reports/create` | Report create | `app/reports/create/page.tsx` | [L](step4/after-light-desktop-reports_create.png) [D](step4/after-dark-desktop-reports_create.png) | [L](step4/after-light-tablet-reports_create.png) [D](step4/after-dark-tablet-reports_create.png) | [L](step4/after-light-mobile-reports_create.png) [D](step4/after-dark-mobile-reports_create.png) |
| `/comms` | Customer Comms (placeholder) | `app/comms/page.tsx` | [L](step4/after-light-desktop-comms.png) [D](step4/after-dark-desktop-comms.png) | [L](step4/after-light-tablet-comms.png) [D](step4/after-dark-tablet-comms.png) | [L](step4/after-light-mobile-comms.png) [D](step4/after-dark-mobile-comms.png) |
| `/settings` | Settings | `app/settings/page.tsx` | [L](step4/after-light-desktop-settings.png) [D](step4/after-dark-desktop-settings.png) | [L](step4/after-light-tablet-settings.png) [D](step4/after-dark-tablet-settings.png) | [L](step4/after-light-mobile-settings.png) [D](step4/after-dark-mobile-settings.png) |
| `/home/1/edit` | Dashboard editor | `app/home/[id]/edit/page.tsx` | [L](step4/after-light-desktop-home_1_edit.png) [D](step4/after-dark-desktop-home_1_edit.png) | [L](step4/after-light-tablet-home_1_edit.png) [D](step4/after-dark-tablet-home_1_edit.png) | [L](step4/after-light-mobile-home_1_edit.png) [D](step4/after-dark-mobile-home_1_edit.png) |

Loading skeletons (`loading.tsx` for leads, contacts, accounts, deals, tasks, reports, settings) all render
`PageSkeleton`, covered by its single wrapper.

### Intentionally excluded

| Screen | Reason |
|---|---|
| `/login`, `/register`, `/forgot-password` | Standalone, light-only auth pages with their own full-page gradient background and no sidebar/header/canvas wrapper. |
| Next.js default `/_not-found` | Outside the CRM chrome (no sidebar/header). |
| **Calls** and **Meetings** | **No such screens exist** in this app (no routes, no sidebar entries). "Calls" is only a related-list section inside Lead Detail, which already sits on the covered canvas. |
| Inner surfaces: cards, tables, forms, drawers, dialogs, popovers, chart panels, Settings' inner nav/content panels, the report builder's flow canvas and side panels | Deliberately not given a gradient (brief: main canvas only). They keep their own backgrounds, so on pages built from large opaque panels (Settings, report builder/detail) the gradient shows in the page header strip and gutters rather than behind the panel. |

## Verification

Dev server (Next 16.4.6) + production build, Chromium, both themes, 3 viewports. 21 routes/states × 3 × 2 = **126 page states.**

**1. Gradient applied everywhere.** 126/126 states have the gradient computed on the canvas wrapper; on all 126 the
before-state had none except the 6 Dashboard states (baseline: only `/` had it).

**2. No layout change — in-page A/B.** Comparing two separate page loads is too noisy (chart animations, late-loading
avatars, mobile/desktop flip during hydration), so each state was measured on one live page: wait until the layout is
stable → fingerprint every element box in the canvas + header + sidebar + document height → remove the gradient class
from the same DOM → fingerprint again. Result: **122/126 identical on the first pass; the other 4**
(light mobile `/reports/r1`, dark desktop `/accounts` and `/accounts/1`, dark mobile `/home/1/edit`) **were re-run 4× each
(16 runs): 0 differing elements** — the first-pass differences were late-settling content, not the class. Document heights
unchanged everywhere; header and sidebar boxes unchanged.

**3. Horizontal overflow.** 0 of 126 states have `scrollWidth > viewport`. No status-code changes on any route.

**4. Console.** One message type only: React Flow's "new nodeTypes object" warning on the two report-builder routes
(12 states) — present in the baseline run with the same count, i.e. pre-existing and unrelated. A single React
hydration-mismatch message appeared once in 126 A/B loads (light mobile `/reports/r1`); it did not occur in the
other two runs of that state nor in 10 further reloads of it. The added class is a static string identical on server and
client, so it cannot cause one; treated as a rare transient, noted here for transparency.

**5. Contrast.** Text colours used on the canvas vs the flat baseline and the worst gradient stop (conservative: assumes
the top-right glow sits on the mid stop):

| Text | Light flat → worst | Dark flat → worst |
|---|---|---|
| Primary (`#0C2472` / `#FFFFFF`) | 12.77 → 11.35 : 1 | 21.00 → 17.63 : 1 |
| Body (`#334155` / `#D4D4D8`) | 9.51 → 8.46 : 1 | 14.21 → 11.93 : 1 |
| Muted (`#64748B` / `#9CA3AF`) | 4.37 → 3.89 : 1 | 8.27 → 6.94 : 1 |
| Brand link (`#1D4ED8` / `#60A5FA`) | 6.16 → 5.47 : 1 | 8.26 → 6.93 : 1 |

Primary, body and link text stay well above 4.5 : 1 in both themes. Light-mode muted text (`#64748B`) was already below
4.5 : 1 on the flat colour (4.37) and drops to 3.89 only at the corner glow, which in practice only sits behind buttons
on white surfaces. The "faint" slate (`#94A3B8`, 2.36 : 1 on flat) is a pre-existing low-contrast colour.

**6. Interactions, theme switching and persistence (production build).**
- Theme: 9 routes × {dark, light} cookie → server HTML carries the right class, client agrees, 0 console errors; auth pages
  stay light with a dark cookie; in-page toggle and reload persist.
- Interaction suite (drawers, filters/columns/sort, status tabs, search, grid/kanban views, row → detail, detail tabs,
  Convert drawer, bulk actions, sidebar/top bar, settings sections, report builder add/link/remove, keyboard navigation):
  **86 checks, 76 pass, 10 "fail" — identical to the Step 2 baseline.** The 10 are test-harness issues, not regressions:
  login/forgot-password selectors (floating-label inputs have no placeholder) and two builder assertions that expect an
  automatic edge (the builder links manually by design). The corrected re-run passes login (valid/invalid), forgot-password
  and manual edge linking in both themes. 0 console errors, 0 non-avatar network requests.

**7. Build and type checks.**
- `tsc --noEmit`: exit 0.
- `pnpm build`: compiled successfully, 16/16 pages generated. All routes are dynamic (ƒ) — from the Step 2 theme-cookie change, not this step.

## Remaining issues / notes

- The Step 2 findings still stand (no backend, UI-only bulk actions on four modules, no kanban drag-and-drop, keyboard
  users can't open records from lists, etc.) — see `STEP1-VERIFICATION.md`. Nothing from them was changed here.
- On opaque-panel screens the gradient is only visible around the panels (see "Intentionally excluded"). If you want the
  report builder's flow canvas or the Settings content panel to carry the gradient, that is a separate, small change to
  those inner surfaces — say so and I'll do it.
- `docs/step4/` holds 42 before and 126 after screenshots (~23 MB) plus the raw before/after/A-B result files.
- Tool-generated files `tsconfig.tsbuildinfo` and `next-env.d.ts` are rewritten by `tsc`/`next build`; not manual edits.
