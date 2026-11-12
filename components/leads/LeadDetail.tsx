"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewLeadDrawer from "@/components/leads/NewLeadDrawer";
import ConvertToDealDrawer from "@/components/leads/ConvertToDealDrawer";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
// Phosphor Duotone Icons
import {
  House, CaretRight, PencilSimple, Phone, Envelope,
  DotsThreeVertical, Check, Note, ClipboardText, Paperclip,
  ClockCounterClockwise, User, AddressBook, TrendUp, Buildings,
  ArrowsLeftRight, Star, Clock, UserPlus, Copy, DownloadSimple,
  Trash, Users, ThumbsUp, ThumbsDown,
} from "@phosphor-icons/react";
import { LEAD_AVATARS, OWNER_AVATARS } from "@/lib/avatars";
import { useTheme } from "@/components/ThemeContext";

// ─────────────────────────────────────────────
//  Types & data
// ─────────────────────────────────────────────
type LeadStatus = "New" | "Contacted" | "In Progress" | "Qualified" | "Lost" | "Unqualified";

interface LeadRecord {
  id: number; salutation: string; firstName: string; lastName: string;
  company: string; title: string; email: string; phone: string;
  mobile: string; fax: string; website: string; status: LeadStatus;
  leadSource: string; industry: string; rating: string;
  noOfEmployees: string; annualRevenue: string; owner: string;
  ownerInitials: string; ownerColor: string; created: string;
  modified: string; emailOptOut: boolean; description: string;
}

const LEADS: Record<number, LeadRecord> = {
  1:  { id:1,  salutation:"Mrs.", firstName:"Shobha",    lastName:"R",       company:"Shobha Realty",     title:"Director",  email:"",                      phone:"",            mobile:"",               fax:"", website:"www.shobarealty.in",     status:"New",         leadSource:"Web",         industry:"Real Estate",   rating:"Hot",  noOfEmployees:"1–10",   annualRevenue:"",         owner:"PM SDL",    ownerInitials:"PM", ownerColor:"#1D4ED8", created:"27 May 2026", modified:"27 May 2026", emailOptOut:false, description:"" },
  2:  { id:2,  salutation:"Ms.",  firstName:"Priya",     lastName:"Nair",    company:"Nair & Co",         title:"Manager",   email:"priya.nair@demo.com",    phone:"04425561234", mobile:"9988776655",     fax:"", website:"",                      status:"Contacted",    leadSource:"Referral",    industry:"Finance",       rating:"Warm", noOfEmployees:"11–50",  annualRevenue:"2500000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"02 Feb 2025", modified:"15 Apr 2026", emailOptOut:false, description:"Interested in enterprise plan." },
  3:  { id:3,  salutation:"Mr.",  firstName:"John",      lastName:"Carter",  company:"Carter Traders",    title:"CEO",       email:"john.carter@demo.com",   phone:"",            mobile:"9876543210",     fax:"", website:"www.cartertraders.com", status:"Qualified",    leadSource:"Cold Call",   industry:"Retail",        rating:"Hot",  noOfEmployees:"51–200", annualRevenue:"8000000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"02 Feb 2025", modified:"10 May 2026", emailOptOut:false, description:"Looking for bulk pricing. Follow up next week." },
  4:  { id:4,  salutation:"Mrs.", firstName:"Sudha",     lastName:"R",       company:"ddd",               title:"",          email:"Sudha@gmail.com",        phone:"",            mobile:"76656564456544", fax:"", website:"",                      status:"In Progress",  leadSource:"Advertisement",industry:"Other",          rating:"Cold", noOfEmployees:"1–10",   annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  5:  { id:5,  salutation:"",     firstName:"Jaya",      lastName:"56678",   company:"",                  title:"",          email:"",                       phone:"",            mobile:"76656564456544", fax:"", website:"",                      status:"New",          leadSource:"Web",         industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  6:  { id:6,  salutation:"Mr.",  firstName:"Leo",       lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"7865443322",     fax:"", website:"",                      status:"Unqualified",  leadSource:"Web",         industry:"",              rating:"Cold", noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  7:  { id:7,  salutation:"",     firstName:"gfdsfs",    lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"9876543212",     fax:"", website:"",                      status:"Lost",         leadSource:"",            industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  8:  { id:8,  salutation:"",     firstName:"335634656", lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"675432124578",   fax:"", website:"",                      status:"New",          leadSource:"",            industry:"",              rating:"",     noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  9:  { id:9,  salutation:"Mr.",  firstName:"Leo",       lastName:"",        company:"",                  title:"",          email:"",                       phone:"",            mobile:"6757567456",     fax:"", website:"",                      status:"Contacted",    leadSource:"Web",         industry:"",              rating:"Cold", noOfEmployees:"",       annualRevenue:"",         owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"22 Jul 2025", modified:"22 Jul 2025", emailOptOut:false, description:"" },
  10: { id:10, salutation:"Mr.",  firstName:"James",     lastName:"Wilson",  company:"Wilson & Partners", title:"Partner",   email:"james@wilson.com",       phone:"02244556677", mobile:"9876541234",     fax:"", website:"www.wilsonpartners.com",status:"Qualified",    leadSource:"Referral",    industry:"Finance",       rating:"Hot",  noOfEmployees:"11–50",  annualRevenue:"12000000", owner:"PM SDL",    ownerInitials:"PM", ownerColor:"#1D4ED8", created:"15 May 2026", modified:"28 May 2026", emailOptOut:false, description:"High-value lead via Apex Solutions." },
  11: { id:11, salutation:"Ms.",  firstName:"Sara",      lastName:"Kim",     company:"TechFlow Ltd",      title:"CTO",       email:"sara.kim@techflow.io",   phone:"",            mobile:"8765432109",     fax:"", website:"www.techflow.io",       status:"In Progress",  leadSource:"Trade Show",  industry:"Technology",    rating:"Warm", noOfEmployees:"51–200", annualRevenue:"5000000",  owner:"SE User 1", ownerInitials:"SU", ownerColor:"#3B82F6", created:"10 Apr 2026", modified:"20 May 2026", emailOptOut:false, description:"Met at TechSummit 2026. Needs platform demo." },
  12: { id:12, salutation:"Mr.",  firstName:"Raj",       lastName:"Mehta",   company:"Apex Group",        title:"MD",        email:"raj@apex.in",            phone:"08033445566", mobile:"9845123456",     fax:"", website:"www.apexgroup.in",      status:"New",          leadSource:"Web",         industry:"Manufacturing", rating:"Hot",  noOfEmployees:"200+",   annualRevenue:"50000000", owner:"Admin",     ownerInitials:"AD", ownerColor:"#0C2472", created:"08 Mar 2026", modified:"08 Mar 2026", emailOptOut:false, description:"" },
};

const STATUS_CFG: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  "New":         { bg:"#EFF6FF", text:"#0C2472", dot:"#94A3B8" },
  "Contacted":   { bg:"#E3ECFC", text:"#0C2472", dot:"#3B82F6" },
  "In Progress": { bg:"#E3ECFC", text:"#0C2472", dot:"#1D4ED8" },
  "Qualified":   { bg:"#DCFCE7", text:"#166534", dot:"#16A34A" },
  "Lost":        { bg:"#FEF2F2", text:"#991B1B", dot:"#EF4444" },
  "Unqualified": { bg:"#EFF6FF", text:"#475569", dot:"#94A3B8" },
};

const STATUS_CFG_DARK: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  "New":         { bg:"#18181B", text:"#D4D4D8", dot:"#D4D4D8" },
  "Contacted":   { bg:"#27272A", text:"#D4D4D8", dot:"#D4D4D8" },
  "In Progress": { bg:"#27272A", text:"#D4D4D8", dot:"#38BDF8" },
  "Qualified":   { bg:"#064E3B", text:"#E2E8F0", dot:"#10B981" },
  "Lost":        { bg:"#450A0A", text:"#E2E8F0", dot:"#EF4444" },
  "Unqualified": { bg:"#2D2D2D", text:"#D4D4D8", dot:"#9CA3AF" },
};

const PIPELINE: LeadStatus[] = ["New", "Contacted", "In Progress", "Qualified"];

const AVATAR_PAL = ["#7C3AED", "#047857", "#B45309", "#DB2777"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_PAL.length];
const initials = (n: string) => { const p = n.trim().split(/\s+/); return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():n.substring(0,2).toUpperCase(); };

// ─────────────────────────────────────────────
//  Lead detail: tone + focus + layout tokens
// ─────────────────────────────────────────────
// Same text hierarchy as the Leads list (Step 5): primary > secondary > tertiary, using neutrals
// already in the app. Replaces slate-400 / slate-300 (≈2.5 : 1 and 1.4 : 1 on light surfaces) and the
// near-invisible #3F3F46 empty-state text in dark mode.
const tone = (isDark: boolean) => ({
  primary:   isDark ? "#FAFAFA" : "#0F172A",
  secondary: isDark ? "#D4D4D8" : "#475569",
  tertiary:  isDark ? "#A1A1AA" : "#64748B",
  empty:     isDark ? "#8A8A94" : "#64748B",
});
// Visible keyboard focus (focus-visible only, so mouse clicks stay clean) — same ring as the Leads list.
const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]";
const muiFocus = { "&.Mui-focusVisible": { outline: "2px solid #3B82F6", outlineOffset: "2px" } } as const;
// One card surface for every panel on the page (header and Timeline used a different dark surface).
const cardCls = (isDark: boolean) => `rounded-2xl border shadow-xs ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-surface border-border-light"}`;
// Page grid. Explicit track classes on purpose: the global tablet rule in globals.css rewrites
// `.grid-cols-1` / `.lg:grid-cols-3` to two equal 352px columns between 641–1023px, which squeezed this page.
const PAGE_GRID = "grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start";

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section aria-label={title} className={`${cardCls(isDark)} overflow-hidden`}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-light">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
          <Icon size={13} color={isDark ? "#A1A1AA" : "#1D4ED8"} weight="duotone" />
        </div>
        <h2 className={`m-0 font-heading text-[12px]/[16px] font-bold uppercase tracking-[0.12em] ${isDark ? "text-[#D4D4D8]" : "text-brand-700"}`}>{title}</h2>
      </div>
      <div className="@container px-5 py-4">{children}</div>
    </section>
  );
}

// Field grid: two columns when the card is wide enough, one column on very narrow screens (≤ 320px).
const KV_GRID = "grid grid-cols-[minmax(0,1fr)] @min-[18rem]:grid-cols-2 gap-x-6 @min-[30rem]:gap-x-8";

function KV({ label, value, blue, wide }: { label: string; value?: string; blue?: boolean; wide?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = tone(isDark);
  return (
    <div className={`py-2.5 border-b border-border-light min-w-0 ${wide ? "col-span-full" : ""}`}>
      <dt className="font-heading text-[11.5px]/[16px] font-semibold uppercase tracking-wider mb-1" style={{ color: t.tertiary }}>{label}</dt>
      <dd className={`text-[14px]/[20px] [overflow-wrap:anywhere] ${value ? "font-medium" : ""} ${blue ? "text-inherit" : ""}`}
        style={{ color: value ? t.primary : t.empty }}>
        {value || <span aria-label="Not set">—</span>}
      </dd>
    </div>
  );
}

type RelatedItem = { icon: React.ElementType; label: string; count: number; color: string };

// Related list (shown on both tabs — previously duplicated markup with slightly different styling).
function RelatedList({ items, onSelect, isDark }: { items: RelatedItem[]; onSelect: (label: string) => void; isDark: boolean }) {
  const t = tone(isDark);
  return (
    <nav aria-label="Related list" className={`${cardCls(isDark)} overflow-hidden w-full`}>
      <div className="px-4 py-3.5 border-b border-border-light">
        <h2 className="m-0 font-heading text-[12px]/[16px] font-bold uppercase tracking-wider" style={{ color: t.tertiary }}>Related List</h2>
      </div>
      <ul className="p-2 space-y-0.5 list-none">
        {items.map(({ icon: Icon, label, count, color }) => (
          <li key={label}>
            <button
              onClick={() => onSelect(label)}
              aria-label={count > 0 ? `${label}, ${count}` : label}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl group transition-colors ${FOCUS_RING} ${isDark ? "hover:bg-[#27272A]" : "hover:bg-[#EFF6FF]"}`}
            >
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:color+"20" }}>
                <Icon size={14} color={color} weight="duotone" />
              </span>
              <span className="flex-1 text-left text-[14px]/[20px] font-medium min-w-0 truncate" style={{ color: t.secondary }}>{label}</span>
              {count > 0 && (
                <span className="text-[12px]/[16px] font-bold bg-border-light text-brand-700 min-w-[22px] text-center px-1.5 py-0.5 rounded-full tabular-nums">{count}</span>
              )}
              <CaretRight size={14} weight="bold" aria-hidden
                className={`shrink-0 transition-all group-hover:translate-x-0.5 ${isDark ? "text-[#71717A] group-hover:text-[#D4D4D8]" : "text-[#64748B] group-hover:text-[#1D4ED8]"}`} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
export default function LeadDetail({ leadId }: { leadId: number }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = tone(isDark);
  const lead = LEADS[leadId];

  // ── UI state ──
  const [activeTab, setActiveTab]         = useState<"overview"|"activity">("overview");
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead?.status ?? "New");
  const [editOpen, setEditOpen]           = useState(false);
  const [convertOpen, setConvertOpen]     = useState(false);
  const [moreAnchor, setMoreAnchor]       = useState<null|HTMLElement>(null);
  const [note, setNote]                   = useState("");
  const [notes, setNotes]                 = useState<{ text: string; at: string }[]>([
    { text: "Initial contact made…", at: lead?.modified ?? "" },
  ]);

  if (!lead) {
    return (
      <div className="flex h-screen bg-surface"><Sidebar />
        <div className="sidebar-content app-canvas flex-1 flex items-center justify-center flex-col gap-3 px-4 text-center">
          <p className="text-[16px]/[24px] font-semibold" style={{ color: t.secondary }}>Lead not found</p>
          <button onClick={() => router.push("/leads")}
            className={`rounded-md px-1 text-[15px]/[20px] font-bold hover:underline ${FOCUS_RING} ${isDark ? "text-[#FAFAFA]" : "text-brand-700"}`}>
            ← Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const fullName  = [lead.salutation, lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const avColor   = avatarColor(fullName);
  const avInit    = initials(fullName || "?");
  const pipelineIdx = PIPELINE.indexOf(currentStatus);
  const cfg       = isDark ? STATUS_CFG_DARK[currentStatus] : STATUS_CFG[currentStatus];

  // Activity timeline items
  const actBg = isDark ? "#27272A" : "#EFF6FF";
  const activityFeed = [
    { icon: UserPlus,            color:"#2F6FED", bg:actBg, text:`Lead created by ${lead.owner}`,          time:lead.created  },
    { icon: TrendUp,             color:"#3B82F6", bg:actBg, text:`Status set to "${lead.status}"`,         time:lead.created  },
    { icon: Note,                color:"#7C3AED", bg:actBg, text:"Note added: Initial contact made…",      time:lead.modified },
    { icon: Envelope,            color:"#B45F1B", bg:actBg, text:"Email sent to lead",                     time:lead.modified },
    { icon: Phone,               color:"#C74C78", bg:actBg, text:"Call logged — 5 min, no answer",         time:lead.modified },
  ];

  // More menu options
  const moreOptions = [
    { icon: Envelope,       label:"Send Email",      color:"#3B82F6" },
    { icon: Users,          label:"Assign to Team",  color:"#238264" },
    { icon: Copy,           label:"Duplicate Lead",  color:"#5B6CB5" },
    { icon: DownloadSimple, label:"Export as PDF",   color:"#6B7A92" },
    { type:"divider" as const },
    { icon: Trash,          label:"Delete Lead",     color:"#EF4444" },
  ];

  // Tasks & Calls (section content)
  const tasksData = [
    { subject:"Follow up call",        status:"To Do",  due:lead.modified },
    { subject:"Send proposal document", status:"To Do",  due:lead.modified },
  ];
  const callsData = [
    { summary:"Call logged — 5 min, no answer", time:lead.modified },
  ];

  // Related list → section mapping (Stage History links to the Timeline tab)
  const relatedItems: RelatedItem[] = [
    { icon: Note,                label:"Notes",         count:notes.length,        color:"#7C3AED" },
    { icon: ClipboardText,       label:"Tasks",         count:tasksData.length,    color:"#3B82F6" },
    { icon: Phone,               label:"Calls",         count:callsData.length,    color:"#C74C78" },
    { icon: Envelope,            label:"Emails",        count:0,                   color:"#B45F1B" },
    { icon: Paperclip,           label:"Attachments",   count:0,                   color:"#6B7A92" },
    { icon: ClockCounterClockwise,label:"Stage History", count:activityFeed.length, color: isDark?"#38BDF8":"#0C2472" },
  ];

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [{ text: note.trim(), at: "Just now" }, ...prev]);
    setNote("");
  };

  const handleRelatedClick = (label: string) => {
    if (label === "Stage History") { setActiveTab("activity"); return; }
    const id = `section-${label.toLowerCase()}`;
    if (activeTab !== "overview") {
      setActiveTab("overview");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    }
  };

  // Shared header-button styling (outlined secondary actions)
  const outlinedSx = {
    ...muiFocus,
    borderColor: isDark?"#27272A":"#E3ECFC", color: isDark?"#D4D4D8":"#1D4ED8", borderRadius:"9px", textTransform:"none",
    fontWeight:600, fontSize:"0.84rem", bgcolor: isDark?"#0F0F0F":"transparent", whiteSpace:"nowrap",
    "&:hover":{ borderColor: isDark?"#3F3F46":"#1D4ED8", color: isDark?"#FAFAFA":"#1D4ED8", bgcolor: isDark?"#18181B":"#EFF6FF" },
  } as const;
  // Meta text that sits on a blue-tinted surface (canvas, note/task/call rows) needs the darker tone in light mode to keep ≥ 4.5 : 1.
  const tintMeta = isDark ? t.tertiary : t.secondary;
  const itemCls  = `rounded-xl px-4 py-3 border border-border-light ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`;
  const emptyCls = "flex items-center justify-center py-6 text-[14px]/[20px]";

  return (
    <div className="flex h-screen bg-transparent font-sans">
      <Sidebar />

      <div className={`sidebar-content app-canvas flex-1 flex flex-col min-h-screen overflow-auto transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        {/* <TopBar /> */}

        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-5 space-y-4 animate-fade-in">

          {/* ══ Breadcrumb ══ */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13.5px]/[20px] min-w-0" style={{ color: tintMeta }}>
            <House size={16} weight="duotone" aria-hidden className="shrink-0" />
            <CaretRight size={12} weight="bold" aria-hidden className="shrink-0" />
            <Link href="/leads" className={`rounded-sm font-medium transition-colors shrink-0 ${FOCUS_RING} ${isDark ? "hover:text-[#FAFAFA]" : "hover:text-brand-700"}`}>Leads</Link>
            <CaretRight size={12} weight="bold" aria-hidden className="shrink-0" />
            <span aria-current="page" className={`font-semibold truncate min-w-0 max-w-[240px] sm:max-w-[420px] ${isDark ? "text-[#FAFAFA]" : "text-brand-700"}`}>{fullName}</span>
          </nav>

          {/* ══ Lead Header Card ══ */}
          <header className={`${cardCls(isDark)} detail-hero @container px-4 sm:px-5 py-4`}>
            <div className="flex flex-col gap-4 @min-[44rem]:flex-row @min-[44rem]:items-center">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <Avatar
                    src={LEAD_AVATARS[leadId]}
                    alt=""
                    sx={{ width:56, height:56, bgcolor:avColor, fontSize:"1.2rem", fontWeight:800, boxShadow: isDark ? "none" : "0 4px 14px 0 rgba(12,36,114,0.2)" }}
                  >
                    {avInit}
                  </Avatar>
                  <span aria-hidden className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${isDark ? "border-[#1C1C1E]" : "border-white"}`} style={{ backgroundColor: cfg.dot }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-2.5 gap-y-1 mb-1 flex-wrap">
                    <h1 className="m-0 text-[20px]/[26px] font-extrabold tracking-tight [overflow-wrap:anywhere]" style={{ color: t.primary }}>{fullName}</h1>
                    <span className="inline-flex items-center gap-1 text-[11.5px]/[16px] font-bold px-2.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor:cfg.bg, color:cfg.text }}>
                      <span aria-hidden className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor:cfg.dot }} />
                      <span className="sr-only">Status: </span>{currentStatus}
                    </span>
                  </div>
                  {lead.company && (
                    <p className="text-[14px]/[20px] font-medium flex items-center flex-wrap gap-x-1.5 min-w-0" style={{ color: t.secondary }}>
                      <Buildings size={14} color={t.tertiary} weight="duotone" aria-hidden className="shrink-0" />
                      <span className="min-w-0 truncate">{lead.company}</span>
                      {lead.industry && <><span aria-hidden style={{ color: t.empty }}>·</span><span style={{ color: t.tertiary }}>{lead.industry}</span></>}
                    </p>
                  )}
                  <p className="text-[12px]/[18px] mt-0.5 tabular-nums" style={{ color: t.tertiary }}>
                    Lead ID: CRM-LEAD-{String(lead.id).padStart(4,"0")} · Created {lead.created}
                  </p>
                </div>
              </div>

              {/* Action buttons — wrap instead of overflowing on narrow screens */}
              <div className="flex items-center gap-2 flex-wrap @min-[44rem]:flex-nowrap @min-[44rem]:shrink-0">
                {(lead.phone || lead.mobile) && (
                  <Button variant="outlined" size="small" disableFocusRipple startIcon={<Phone size={14} weight="duotone" />} sx={outlinedSx}>
                    Call
                  </Button>
                )}
                {lead.email && (
                  <Button variant="outlined" size="small" disableFocusRipple startIcon={<Envelope size={14} weight="duotone" />} sx={outlinedSx}>
                    Email
                  </Button>
                )}

                {/* Convert to Deal */}
                <Button variant="outlined" size="small" disableFocusRipple startIcon={<ArrowsLeftRight size={14} weight="duotone" />}
                  onClick={() => setConvertOpen(true)}
                  sx={{ ...outlinedSx, fontWeight:700 }}>
                  Convert
                </Button>

                {/* Edit */}
                <Button variant="contained" size="small" disableFocusRipple startIcon={<PencilSimple size={14} weight="duotone" />}
                  onClick={() => setEditOpen(true)}
                  sx={{ ...muiFocus, bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "#FFFFFF", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.84rem", whiteSpace:"nowrap", boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px 0 #60A5FA55" }, "&:active":{ bgcolor: isDark ? "#52525B" : "#0C2472" } }}>
                  Edit
                </Button>

                {/* Three-dot menu */}
                <Tooltip title="More actions">
                  <IconButton size="small" disableFocusRipple
                    aria-label="More actions"
                    aria-haspopup="menu"
                    aria-expanded={Boolean(moreAnchor)}
                    aria-controls={moreAnchor ? "lead-more-menu" : undefined}
                    onClick={e => setMoreAnchor(e.currentTarget)}
                    sx={{ ...muiFocus, width:32, height:32, borderRadius:"9px", border: isDark?"1.5px solid #27272A":"1.5px solid #E3ECFC", color: isDark ? "#D4D4D8" : "#475569", bgcolor: moreAnchor ? (isDark?"#27272A":"#EFF6FF") : (isDark?"#0F0F0F":"transparent"), "&:hover":{ bgcolor: isDark?"#27272A":"#EFF6FF", borderColor: isDark ? "#3F3F46" : "#1D4ED8" } }}>
                    <DotsThreeVertical size={18} weight="bold" />
                  </IconButton>
                </Tooltip>

                {/* MUI Menu */}
                <Menu
                  id="lead-more-menu"
                  anchorEl={moreAnchor}
                  open={Boolean(moreAnchor)}
                  onClose={() => setMoreAnchor(null)}
                  transformOrigin={{ horizontal:"right", vertical:"top" }}
                  anchorOrigin={{ horizontal:"right", vertical:"bottom" }}
                  PaperProps={{ sx: { borderRadius:"14px", border: isDark?"1.5px solid #27272A":"1.5px solid #E3ECFC", bgcolor: isDark?"#0A0A0A":"#fff", boxShadow: isDark?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(12,36,114,0.12)", minWidth:200, mt:0.5 } }}
                >
                  {moreOptions.map((opt, i) =>
                    opt.type === "divider"
                      ? <Divider key={i} sx={{ my:0.5, borderColor: isDark?"#27272A":"#EFF6FF" }} />
                      : (
                        <MenuItem key={opt.label} onClick={() => setMoreAnchor(null)}
                          sx={{ mx:0.5, borderRadius:"8px", py:1, "&:hover":{ bgcolor: isDark?"#27272A":"#EFF6FF" }, "&.Mui-focusVisible":{ bgcolor: isDark?"#27272A":"#EFF6FF", outline:"2px solid #3B82F6", outlineOffset:"-2px" } }}>
                          <ListItemIcon sx={{ minWidth:30 }}>
                            <opt.icon size={16} color={opt.color} weight="duotone" />
                          </ListItemIcon>
                          <ListItemText primaryTypographyProps={{ fontSize:"0.9rem", fontWeight:600, color: opt.color==="#EF4444" ? (isDark ? "#F87171" : "#DC2626") : isDark?"#E2E8F0":"#334155" }}>
                            {opt.label}
                          </ListItemText>
                        </MenuItem>
                      )
                  )}
                </Menu>
              </div>
            </div>
          </header>

          {/* ══ Tab Bar ══ */}
          <div role="group" aria-label="Lead sections" className={`flex items-center gap-1 border rounded-xl p-1 w-fit shadow-xs ${isDark ? "bg-[#000000] border-[#27272A]" : "bg-surface border-border-light"}`}>
            {([{ key:"overview", label:"Overview" }, { key:"activity", label:"Timeline" }] as const).map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} aria-pressed={activeTab===key}
                className={`px-4 py-1.5 rounded-lg text-[14px]/[20px] font-semibold transition-all ${FOCUS_RING} ${
                  activeTab===key ? (isDark ? "bg-[#27272A] text-[#FAFAFA] shadow-xs" : "bg-brand-700 text-white shadow-xs")
                    : isDark ? "text-[#A1A1AA] bg-[#0A0A0A] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                    : "text-[#0C2472] bg-border-light hover:bg-brand-700/10"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════ OVERVIEW ══════════════════════════ */}
          {activeTab === "overview" && (
            <div className={PAGE_GRID}>

              {/* Main column */}
              <div className="@container space-y-4 min-w-0">

                {/* ── Stage Pipeline (clickable) ── */}
                <section aria-label="Stage progress" className={`${cardCls(isDark)} @container p-4 sm:p-5`}>
                  <div className="flex items-start justify-between flex-wrap gap-x-4 gap-y-2 mb-4">
                    <div className="min-w-0">
                      <h2 className="m-0 font-heading text-[12px]/[16px] font-bold uppercase tracking-widest" style={{ color: t.tertiary }}>Stage Progress</h2>
                      <p className="text-[12px]/[18px] mt-1" style={{ color: t.tertiary }}>Click a stage to update · Started <span className="font-semibold" style={{ color: t.secondary }}>{lead.created}</span></p>
                    </div>
                    <div className="text-left @min-[30rem]:text-right shrink-0">
                      <p className="font-heading text-[12px]/[16px] font-bold uppercase tracking-widest" style={{ color: t.tertiary }}>Last Updated</p>
                      <p className="text-[12px]/[18px] font-semibold mt-1" style={{ color: t.secondary }}>{lead.modified}</p>
                    </div>
                  </div>

                  {/* Wide: one row with chevrons. Narrow: 2 × 2 stage grid, Won / Lost below. */}
                  <div className="flex flex-col gap-2 @min-[34rem]:flex-row @min-[34rem]:items-center @min-[34rem]:gap-1">
                    <div className="grid grid-cols-2 gap-1.5 @min-[34rem]:flex @min-[34rem]:flex-1 @min-[34rem]:items-center @min-[34rem]:gap-1 min-w-0">
                      {PIPELINE.map((stage, i) => {
                        const isDone    = i < pipelineIdx;
                        const isActive  = i === pipelineIdx;
                        const isPending = i > pipelineIdx;
                        return (
                          <div key={stage} className="flex items-center min-w-0 gap-1 @min-[34rem]:flex-1">
                            <Tooltip title={isDone ? "Completed" : isActive ? "Current stage" : "Click to set stage"} describeChild>
                              <button
                                onClick={() => setCurrentStatus(stage)}
                                aria-current={isActive ? "step" : undefined}
                                className={`flex items-center justify-center gap-1.5 flex-1 min-w-0 h-9 px-2 rounded-xl text-[12.5px]/[16px] font-bold border transition-colors ${FOCUS_RING}
                                  ${isActive  ? (isDark ? "bg-[#3F3F46] border-[#52525B] text-[#FAFAFA]" : "bg-brand-700 border-transparent text-white shadow-md shadow-[#1D4ED8]/25") : ""}
                                  ${isDone    ? isDark ? "bg-[#27272A] border-transparent text-[#D4D4D8] hover:bg-[#3F3F46]" : "bg-border-light border-transparent text-brand-700 hover:bg-[#BFD3F5]" : ""}
                                  ${isPending ? isDark ? "bg-transparent border-[#27272A] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]" : "bg-transparent border-[#E3ECFC] text-[#64748B] hover:bg-[#EFF6FF] hover:text-brand-700" : ""}
                                `}
                              >
                                {isDone && <Check size={12} weight="bold" aria-hidden className="shrink-0" />}
                                <span className="truncate">{stage}</span>
                              </button>
                            </Tooltip>
                            {i < PIPELINE.length - 1 && (
                              <CaretRight size={14} weight="bold" aria-hidden color={isDone||isActive ? (isDark ? "#A1A1AA" : "#1D4ED8") : (isDark ? "#71717A" : "#6B7A92")} className="hidden @min-[34rem]:block shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Won / Lost buttons */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 @min-[34rem]:ml-1">
                      <Tooltip title="Mark as Qualified / Won">
                        <button onClick={() => setCurrentStatus("Qualified")} aria-pressed={currentStatus==="Qualified"}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${FOCUS_RING}
                            ${currentStatus==="Qualified" ? "bg-emerald-600 text-white" : isDark ? "bg-emerald-500/15 text-[#34D399] hover:bg-emerald-500/25" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                          <ThumbsUp size={17} weight={currentStatus==="Qualified" ? "fill" : "duotone"} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Mark as Lost">
                        <button onClick={() => setCurrentStatus("Lost")} aria-pressed={currentStatus==="Lost"}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${FOCUS_RING}
                            ${currentStatus==="Lost" ? "bg-red-600 text-white" : isDark ? "bg-red-500/15 text-[#F87171] hover:bg-red-500/25" : "bg-red-50 text-red-700 hover:bg-red-100"}`}>
                          <ThumbsDown size={17} weight={currentStatus==="Lost" ? "fill" : "duotone"} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Status changed banner */}
                  {currentStatus !== lead.status && (
                    <div role="status" className={`mt-3 flex items-center flex-wrap gap-x-2 gap-y-1 rounded-xl px-3 py-2 text-[12.5px]/[18px] animate-slide-up border border-border-light ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
                      <span className="font-semibold" style={{ color: isDark ? "#FAFAFA" : "#1D4ED8" }}>Stage updated to &ldquo;{currentStatus}&rdquo;</span>
                      <span style={{ color: t.tertiary }}>— not saved yet</span>
                      <button onClick={() => setCurrentStatus(lead.status)}
                        className={`ml-auto rounded-md px-1.5 font-bold transition-colors hover:underline ${FOCUS_RING} ${isDark ? "text-[#FAFAFA]" : "text-[#0C2472]"}`}>
                        Undo
                      </button>
                    </div>
                  )}
                </section>

                {/* Quick Stats */}
                <dl className="grid grid-cols-2 @min-[36rem]:grid-cols-4 gap-3">
                  {[
                    { label:"Lead Source", value:lead.leadSource||"—",    icon:TrendUp,   fill: isDark?"#1A2D4A":"#D6E4F9", deep: isDark?"#60A5FA":"#2F6FED" },
                    { label:"Rating",      value:lead.rating||"—",        icon:Star,      fill: isDark?"#1A2D3A":"#D0E5E0", deep: isDark?"#34D399":"#238264" },
                    { label:"Industry",    value:lead.industry||"—",      icon:Buildings, fill: isDark?"#2A1E10":"#FAE3D0", deep: isDark?"#FB923C":"#B45F1B" },
                    { label:"Employees",   value:lead.noOfEmployees||"—", icon:User,      fill: isDark?"#2A1828":"#F5D9E1", deep: isDark?"#F472B6":"#C74C78" },
                  ].map(({ label, value, icon: Icon, fill, deep }) => (
                    <div key={label} className={`rounded-xl border p-3.5 min-w-0 ${isDark ? "border-white/10" : "border-white/60"}`}
                      style={{ backgroundColor:fill, boxShadow: isDark ? "none" : "0 6px 24px rgba(15,23,42,0.06)" }}>
                      <div aria-hidden className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(249,251,255,0.7)" }}>
                        <Icon size={15} color={deep} weight="duotone" />
                      </div>
                      <dt className="font-heading text-[12px]/[16px] font-bold uppercase tracking-wider mb-1 truncate" style={{ color: isDark ? "#A1A1AA" : "#475569" }}>{label}</dt>
                      <dd className="text-[14px]/[20px] font-bold truncate" title={value} style={{ color: isDark ? "#FFFFFF" : "#0C2472" }}>{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Personal Info */}
                <SectionCard icon={User} title="Personal Information">
                  <dl className={KV_GRID}>
                    <KV label="Salutation"   value={lead.salutation} />
                    <KV label="First Name"   value={lead.firstName} />
                    <KV label="Last Name"    value={lead.lastName} />
                    <KV label="Title"        value={lead.title} />
                    <KV label="Company"      value={lead.company} />
                    <KV label="Industry"     value={lead.industry} />
                    <KV label="Email Opt Out" value={lead.emailOptOut?"Yes":"No"} />
                    <KV label="Description"  value={lead.description} wide />
                  </dl>
                </SectionCard>

                {/* Contact Details */}
                <SectionCard icon={AddressBook} title="Contact Details">
                  <dl className={KV_GRID}>
                    <KV label="Email"   value={lead.email}   blue={!!lead.email} />
                    <KV label="Phone"   value={lead.phone} />
                    <KV label="Mobile"  value={lead.mobile} />
                    <KV label="Fax"     value={lead.fax} />
                    <KV label="Website" value={lead.website} blue={!!lead.website} />
                  </dl>
                </SectionCard>

                {/* Lead Details */}
                <SectionCard icon={TrendUp} title="Lead Details">
                  <dl className={KV_GRID}>
                    <KV label="Lead Source"       value={lead.leadSource} />
                    <KV label="Lead Status"       value={currentStatus} />
                    <KV label="Rating"            value={lead.rating} />
                    <KV label="No. of Employees"  value={lead.noOfEmployees} />
                    <KV label="Annual Revenue"    value={lead.annualRevenue ? `₹${Number(lead.annualRevenue).toLocaleString("en-IN")}` : ""} />
                  </dl>
                </SectionCard>

                {/* Notes */}
                <div id="section-notes" className="scroll-mt-20">
                  <SectionCard icon={Note} title="Notes">
                    <div className="space-y-3">
                      <div className={`border rounded-xl overflow-hidden transition-all ${isDark ? "border-[#3F3F46] focus-within:border-[#A1A1AA] focus-within:shadow-[0_0_0_2px_#3B82F6]" : "border-border-light focus-within:border-brand-700 focus-within:shadow-[0_0_0_2px_#4A7AE8]"}`}>
                        <InputBase
                          fullWidth multiline minRows={2}
                          placeholder="Add a note…"
                          inputProps={{ "aria-label": "Add a note" }}
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          sx={{ px:2, py:1.5, fontSize:"0.875rem", lineHeight:1.45, color: isDark ? "#FAFAFA" : "#0F172A", "& textarea::placeholder":{ color: isDark ? "#A1A1AA" : "#64748B", opacity:1 } }}
                        />
                        {note.trim() && (
                          <div className="flex justify-end px-3 pb-2">
                            <Button size="small" variant="contained" disableFocusRipple onClick={addNote}
                              sx={{ ...muiFocus, bgcolor: isDark ? "#3F3F46" : "#1D4ED8", color: isDark ? "#FAFAFA" : "#FFFFFF", boxShadow:"none", borderRadius:"8px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", "&:hover":{ bgcolor: isDark ? "#52525B" : "#2563EB", boxShadow:"none" } }}>
                              Save Note
                            </Button>
                          </div>
                        )}
                      </div>
                      <ul className="p-0 list-none space-y-2">
                        {notes.map((n, i) => (
                          <li key={i} className={itemCls}>
                            <p className="text-[14px]/[20px] [overflow-wrap:anywhere] whitespace-pre-line" style={{ color: t.primary }}>{n.text}</p>
                            <p className="text-[12px]/[16px] mt-1" style={{ color: tintMeta }}>{n.at}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SectionCard>
                </div>

                {/* Tasks */}
                <div id="section-tasks" className="scroll-mt-20">
                  <SectionCard icon={ClipboardText} title="Tasks">
                    <ul className="p-0 list-none space-y-2">
                      {tasksData.map((task, i) => (
                        <li key={i} className={`flex items-center justify-between gap-3 ${itemCls}`}>
                          <div className="min-w-0">
                            <p className="text-[14px]/[20px] font-medium" style={{ color: t.primary }}>{task.subject}</p>
                            <p className="text-[12px]/[16px] mt-0.5" style={{ color: tintMeta }}>Due {task.due}</p>
                          </div>
                          <span className={`text-[11.5px]/[16px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${isDark ? "bg-[#3F3F46] text-[#FAFAFA]" : "bg-border-light text-brand-700"}`}>{task.status}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>

                {/* Calls */}
                <div id="section-calls" className="scroll-mt-20">
                  <SectionCard icon={Phone} title="Calls">
                    <ul className="p-0 list-none space-y-2">
                      {callsData.map((c, i) => (
                        <li key={i} className={itemCls}>
                          <p className="text-[14px]/[20px]" style={{ color: t.primary }}>{c.summary}</p>
                          <p className="text-[12px]/[16px] mt-1" style={{ color: tintMeta }}>{c.time}</p>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>

                {/* Emails */}
                <div id="section-emails" className="scroll-mt-20">
                  <SectionCard icon={Envelope} title="Emails">
                    <p className={emptyCls} style={{ color: t.tertiary }}>No emails yet</p>
                  </SectionCard>
                </div>

                {/* Attachments */}
                <div id="section-attachments" className="scroll-mt-20">
                  <SectionCard icon={Paperclip} title="Attachments">
                    <p className={emptyCls} style={{ color: t.tertiary }}>No attachments yet</p>
                  </SectionCard>
                </div>
              </div>

              {/* Side column */}
              <aside aria-label="Lead summary" className="space-y-4 min-w-0 md:sticky md:top-[100px] md:self-start">

                {/* Related List */}
                <RelatedList items={relatedItems} onSelect={handleRelatedClick} isDark={isDark} />

                {/* Lead Owner */}
                <section aria-label="Ownership" className={`${cardCls(isDark)} p-4 space-y-3`}>
                  <h2 className="font-heading text-[12px]/[16px] font-bold uppercase tracking-wider" style={{ color: t.tertiary }}>Ownership</h2>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={OWNER_AVATARS[lead.owner]} alt="" sx={{ width:32, height:32, bgcolor:lead.ownerColor, fontSize:"0.72rem", fontWeight:800 }}>
                      {lead.ownerInitials}
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[14px]/[20px] font-semibold truncate" style={{ color: t.primary }}>{lead.owner}</p>
                      <p className="text-[12px]/[16px]" style={{ color: t.tertiary }}>Lead Owner</p>
                    </div>
                  </div>
                  <Divider sx={{ borderColor: isDark ? "#27272A" : "#E3ECFC" }} />
                  <dl className="space-y-2">
                    <div className="flex justify-between gap-3 text-[12px]/[18px]">
                      <dt className="font-medium" style={{ color: t.tertiary }}>Created</dt>
                      <dd className="font-semibold tabular-nums" style={{ color: t.secondary }}>{lead.created}</dd>
                    </div>
                    <div className="flex justify-between gap-3 text-[12px]/[18px]">
                      <dt className="font-medium" style={{ color: t.tertiary }}>Modified</dt>
                      <dd className="font-semibold tabular-nums" style={{ color: t.secondary }}>{lead.modified}</dd>
                    </div>
                  </dl>
                </section>
              </aside>
            </div>
          )}

          {/* ══════════════════════════ ACTIVITY ══════════════════════════ */}
          {activeTab === "activity" && (
            <div className={PAGE_GRID}>
              <section aria-label="Timeline" className={`${cardCls(isDark)} min-w-0`}>
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-light">
                  <h2 className="m-0 font-heading text-[12px]/[16px] font-bold uppercase tracking-wider" style={{ color: t.tertiary }}>Timeline</h2>
                  <span className={`text-[12px]/[16px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`} style={{ color: t.secondary }}>{activityFeed.length} events</span>
                </div>
                <ol className="px-5 py-4 list-none">
                  {activityFeed.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex gap-4">
                        {/* Timeline line + dot */}
                        <div aria-hidden className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center z-10" style={{ backgroundColor:item.bg }}>
                            <Icon size={15} color={item.color} weight="duotone" />
                          </div>
                          {i < activityFeed.length-1 && <div className={`w-px flex-1 my-1 min-h-[20px] ${isDark ? "bg-[#3F3F46]" : "bg-border-light"}`} />}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-4">
                          <p className="text-[14px]/[20px] font-medium mt-1 [overflow-wrap:anywhere]" style={{ color: t.primary }}>{item.text}</p>
                          <p className="text-[12px]/[16px] mt-1 flex items-center gap-1 tabular-nums" style={{ color: t.tertiary }}>
                            <Clock size={12} weight="duotone" aria-hidden />{item.time}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>

              {/* Side: related list still visible */}
              <aside aria-label="Lead summary" className="space-y-4 min-w-0 md:sticky md:top-[100px] md:self-start">
                <RelatedList items={relatedItems} onSelect={handleRelatedClick} isDark={isDark} />
              </aside>
            </div>
          )}

        </main>
      </div>

      {/* ══ Drawers ══ */}
      <NewLeadDrawer
        key={editOpen ? "edit" : "closed"}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={{
          salutation: lead.salutation, firstName: lead.firstName,
          lastName: lead.lastName, company: lead.company, title: lead.title,
          email: lead.email, phone: lead.phone, mobile: lead.mobile,
          fax: lead.fax, website: lead.website, leadSource: lead.leadSource,
          leadStatus: currentStatus, industry: lead.industry,
          noOfEmployees: lead.noOfEmployees, annualRevenue: lead.annualRevenue,
          rating: lead.rating, emailOptOut: lead.emailOptOut,
        }}
      />

      <ConvertToDealDrawer
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        leadName={fullName}
        leadCompany={lead.company}
        leadOwner={lead.owner}
        leadOwnerInitials={lead.ownerInitials}
        leadOwnerColor={lead.ownerColor}
        leadAvatarColor={avColor}
        leadInitials={avInit}
      />
    </div>
  );
}
