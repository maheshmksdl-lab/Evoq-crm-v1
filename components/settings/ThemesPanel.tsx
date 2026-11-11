"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ImageSquare, ArrowCounterClockwise, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";
import { readableOnWhite, readLogo } from "@/lib/palette";
import { saveThemeSettings, useThemeSettings } from "@/lib/themeSettings";
import { applyTheme, colorsFrom, DEFAULT_CUSTOM, THEMES, type CustomTheme } from "@/lib/themes";

/** A small picture of the app in a set of colours. It is only a preview. */
function Preview({ primary, accent, secondary }: { primary: string; accent: string; secondary: string }) {
  const { accent: a, surface: s } = colorsFrom(primary, accent, secondary);
  return (
    <div aria-hidden className="flex h-28 overflow-hidden rounded-xl border" style={{ borderColor: s["--color-border-light"], background: `linear-gradient(160deg, ${s["--bg-page"]}, ${a["--color-brand-100"]})` }}>
      <div className="flex w-9 flex-col gap-1.5 p-1.5" style={{ background: s["--bg-sidebar"] }}>
        <span className="h-1.5 rounded bg-white" /><span className="h-1.5 rounded bg-white/40" /><span className="h-1.5 rounded bg-white/40" /><span className="h-1.5 rounded bg-white/40" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-9 rounded-lg" style={{ background: `linear-gradient(115deg, ${a["--color-brand-50"]}, ${a["--color-brand-100"]} 55%, ${accent}55)` }} />
        <div className="flex gap-1.5">
          <span className="h-5 flex-1 rounded-md shadow-sm" style={{ background: s["--bg-card"] }} />
          <span className="h-5 flex-1 rounded-md" style={{ background: a["--color-brand-100"] }} />
          <span className="h-5 w-10 rounded-md" style={{ background: a["--color-brand-700"] }} />
        </div>
        <div className="h-8 rounded-md shadow-sm" style={{ background: s["--bg-card"] }} />
      </div>
    </div>
  );
}

const FONTS: { value: CustomTheme["font"]; label: string }[] = [{ value: "inter", label: "Inter" }, { value: "system", label: "System" }, { value: "humanist", label: "Humanist" }, { value: "serif", label: "Serif headings" }];
const SIZES: { value: CustomTheme["size"]; label: string }[] = [{ value: "compact", label: "Compact" }, { value: "default", label: "Standard" }, { value: "comfortable", label: "Comfortable" }];
const CORNERS: { value: CustomTheme["corners"]; label: string }[] = [{ value: "sharp", label: "Sharp" }, { value: "soft", label: "Soft" }, { value: "round", label: "Round" }];
const BUTTONS: { value: CustomTheme["buttons"]; label: string }[] = [{ value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }, { value: "pill", label: "Pill" }];

function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-border-light bg-surface-light p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${on ? "bg-brand-700 text-white shadow-xs" : "text-slate-600 hover:bg-white"}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Panel({ title, sub, action, children, isDark }: { title: string; sub: string; action?: React.ReactNode; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={`mb-5 overflow-hidden rounded-2xl border shadow-xs ${isDark ? "border-[#27272A] bg-[#1C1C1E]" : "border-border-light bg-surface"}`}>
      <div className={`flex items-center justify-between gap-3 border-b px-5 py-3.5 ${isDark ? "border-[#27272A]" : "border-border-light"}`}>
        <div>
          <h2 className="m-0 font-heading text-[14px] font-bold">{title}</h2>
          <p className="m-0 mt-0.5 text-[12px] text-slate-500">{sub}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const Badge = ({ children }: { children: React.ReactNode }) => <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">{children}</span>;

/** Upload or drop a logo, take its colours as a starting palette, then adjust colours, type, corners and buttons. */
function BrandEditor({ isDark }: { isDark: boolean }) {
  const s = useThemeSettings();
  const [draft, setDraft] = useState<CustomTheme>(s.custom ?? DEFAULT_CUSTOM);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const saved = useRef({ theme: s.theme, custom: s.custom });
  saved.current = { theme: s.theme, custom: s.custom };
  // Leaving the page without saving puts the saved look back.
  useEffect(() => () => applyTheme(saved.current.theme, saved.current.custom), []);

  const change = (p: Partial<CustomTheme>) => { const n = { ...draft, ...p }; setDraft(n); setDirty(true); applyTheme("custom", n); };
  const take = async (file?: File | null) => {
    if (!file) return;
    setError(""); setNote(""); setBusy(true);
    try {
      const { dataUrl, colors } = await readLogo(file);
      const [a, b, c] = [colors[0], colors[1] ?? colors[0], colors[2] ?? colors[1] ?? colors[0]];
      if (!a) { change({ logo: dataUrl }); setNote("No clear brand colour was found in this logo, so the colours were left as they are. You can pick them yourself."); }
      else { const p = readableOnWhite(a); change({ logo: dataUrl, primary: p, accent: b, secondary: c }); setNote(p !== a ? "Colours were taken from your logo. The main colour was made slightly darker so white text on buttons stays easy to read." : "Colours were taken from your logo. Adjust any of them below."); }
    } catch (e) { setError(e instanceof Error ? e.message : "That file could not be used."); }
    finally { setBusy(false); }
  };
  const save = () => { saveThemeSettings({ theme: "custom", custom: draft }); setDirty(false); setNote("Your theme is applied."); };
  const reset = () => { saveThemeSettings({ theme: "evoq", custom: null }); setDraft(DEFAULT_CUSTOM); setDirty(false); setNote("Back to the default theme."); applyTheme("evoq", null); };
  const active = s.theme === "custom";
  const colorInput = (k: "primary" | "accent" | "secondary", label: string, hint: string) => (
    <label className="flex items-center gap-3 rounded-xl border border-border-light bg-white p-2.5">
      <input type="color" value={draft[k]} onChange={(e) => change({ [k]: e.target.value })} aria-label={`${label} colour`} className="size-10 shrink-0 cursor-pointer rounded-lg border border-border-light bg-white p-0.5" />
      <span className="min-w-0"><span className="block text-[13px] font-medium text-slate-800">{label}</span><span className="block text-xs text-slate-500">{hint} · <span className="font-mono">{draft[k].toUpperCase()}</span></span></span>
    </label>
  );
  const field = (label: string, node: React.ReactNode) => <div className="min-w-0"><p className="mb-1.5 text-[13px] font-medium">{label}</p>{node}</div>;

  return (
    <Panel isDark={isDark} title="Your brand" sub="Add your logo to build a theme from its colours, then adjust it to suit your company." action={active && !dirty ? <Badge><Check size={12} weight="bold" aria-hidden />In use</Badge> : undefined}>
      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <label onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); }}
            className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-500/40 ${over ? "border-brand-700 bg-brand-50" : "border-border-light bg-surface-light/50 hover:border-brand-500 hover:bg-brand-50/60"}`}>
            <input type="file" accept="image/*" className="sr-only" aria-label="Upload a logo" onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
            {draft.logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={draft.logo} alt="Your logo" className="max-h-20 max-w-full object-contain" />
              : <span className="grid size-12 place-items-center rounded-xl bg-white text-brand-700 shadow-sm"><ImageSquare size={22} weight="duotone" aria-hidden /></span>}
            <span className="text-[13px] font-medium">{busy ? "Reading your logo…" : draft.logo ? "Drop a different logo or click to replace" : "Drop your logo here or click to choose"}</span>
            <span className="text-xs text-slate-500">PNG, JPG, SVG or WebP, up to 3 MB. The image stays in this browser.</span>
          </label>
          {draft.logo && <button type="button" onClick={() => change({ logo: undefined })} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-brand-50"><Trash size={15} weight="duotone" aria-hidden />Remove logo</button>}
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}
          {note && <div role="status" className="rounded-xl border border-border-light bg-brand-50 p-3 text-[13px] text-slate-700">{note}</div>}
          <p className="text-xs text-slate-500">Pulling colours from a website address needs a server to read the page, so it is not available yet. For now, use your logo or pick colours by hand.</p>
        </div>

        <div className="space-y-5">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {colorInput("primary", "Main colour", "Buttons and links")}
            {colorInput("accent", "Accent", "Highlights")}
            {colorInput("secondary", "Support", "Soft backgrounds")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{field("Font", <Segmented label="Font" value={draft.font} onChange={(v) => change({ font: v })} options={FONTS} />)}</div>
            <div className="sm:col-span-2">{field("Text size", <Segmented label="Text size" value={draft.size} onChange={(v) => change({ size: v })} options={SIZES} />)}</div>
            {field("Corners", <Segmented label="Corners" value={draft.corners} onChange={(v) => change({ corners: v })} options={CORNERS} />)}
            {field("Buttons", <Segmented label="Buttons" value={draft.buttons} onChange={(v) => change({ buttons: v })} options={BUTTONS} />)}
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-medium">Preview</p>
            <Preview primary={draft.primary} accent={draft.accent} secondary={draft.secondary} />
          </div>
          <div className={`flex flex-wrap items-center gap-2 border-t pt-4 ${isDark ? "border-[#27272A]" : "border-border-light"}`}>
            <button type="button" onClick={save} disabled={!dirty && active} className="rounded-xl bg-brand-700 px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">Use this theme</button>
            <button type="button" onClick={reset} disabled={!s.custom && !dirty} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-600 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"><ArrowCounterClockwise size={15} weight="bold" aria-hidden />Reset to default</button>
            {dirty && <span className="text-xs text-slate-500">Previewing. Nothing is saved until you choose Use this theme.</span>}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function ThemesPanel() {
  const { theme: mode } = useTheme();
  const isDark = mode === "dark";
  const { theme } = useThemeSettings();
  const [msg, setMsg] = useState("");
  const choose = (id: string, name: string) => { saveThemeSettings({ theme: id }); applyTheme(id, null); setMsg(`${name} theme applied`); };
  return (
    <div className={`flex-1 overflow-y-auto px-4 sm:px-8 pt-0 pb-8 ${isDark ? "bg-[#0A0A0A]" : "bg-transparent"}`}>
      <BrandEditor isDark={isDark} />
      <Panel isDark={isDark} title="Ready-made themes" sub="Choose a look that suits your company. These change colours only.">
        <ul className="m-0 grid list-none gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {THEMES.map((t) => {
            const on = t.id === theme;
            return (
              <li key={t.id} className={`rounded-2xl border p-3 shadow-xs ${isDark ? "bg-[#18181B]" : "bg-white"} ${on ? "border-brand-700 ring-2 ring-brand-700/20" : isDark ? "border-[#27272A]" : "border-border-light"}`}>
                <Preview primary={t.primary} accent={t.accent} secondary={t.secondary} />
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="m-0 text-sm font-semibold">{t.name}</p><span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-900">{t.audience}</span></div>
                  {on ? <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"><Check size={13} weight="bold" aria-hidden />Current</span>
                    : <button type="button" aria-label={`Use the ${t.name} theme`} onClick={() => choose(t.id, t.name)} className="rounded-lg border border-border-light bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-700 hover:bg-brand-50">Use theme</button>}
                </div>
                <p className="m-0 mt-2 text-[13px] text-slate-600">{t.description}</p>
              </li>
            );
          })}
        </ul>
      </Panel>
      <div role="status" aria-live="polite" className="mt-3 min-h-5 text-[13px] font-medium text-brand-700">{msg}</div>
    </div>
  );
}
