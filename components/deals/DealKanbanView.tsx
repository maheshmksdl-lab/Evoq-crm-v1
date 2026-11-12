"use client";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { avatarFor } from "@/lib/avatars";
import Tooltip from "@mui/material/Tooltip";
import { Plus, Buildings, User, DotsThreeVertical, CurrencyDollar } from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

type DealStage = "Qualification" | "Needs Analysis" | "Value Proposition" |
  "Identify Decision Makers" | "Proposal/Price Quote" | "Negotiation/Review" | "Closed Won";

interface Deal {
  id: number; name: string; amount: number; account: string;
  stage: DealStage; probability: number; contactName: string;
  owner: string; ownerInitials: string;
}

const STAGES: { key: DealStage; label: string; headerBg: string; dot: string }[] = [
  { key: "Qualification",            label: "Qualification",            headerBg: "#0C2472", dot: "#94A3B8" },
  { key: "Needs Analysis",           label: "Needs Analysis",           headerBg: "#1F7A5E", dot: "#238264" },
  { key: "Value Proposition",        label: "Value Proposition",        headerBg: "#2563EB", dot: "#B45F1B" },
  { key: "Identify Decision Makers", label: "Identify Decision Makers", headerBg: "#9D174D", dot: "#C74C78" },
  { key: "Proposal/Price Quote",     label: "Proposal / Price Quote",   headerBg: "#0C2472", dot: "#5B6CB5" },
  { key: "Negotiation/Review",       label: "Negotiation / Review",     headerBg: "#B45309", dot: "#F59E0B" },
  { key: "Closed Won",               label: "Closed Won",               headerBg: "#047857", dot: "#10B981" },
];

const AVATAR_PAL = ["#7C3AED", "#047857", "#B45309", "#DB2777"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];
const initials    = (n: string) => { const p = n.trim().split(/\s+/); return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : n.substring(0, 2).toUpperCase(); };
const fmt         = (n: number) => n === 0 ? "₹0" : `₹${(n / 1000).toFixed(0)}k`;
const fmtTotal    = (n: number) => n === 0 ? "₹0" : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}k`;

interface Props { deals: Deal[] }

export default function DealKanbanView({ deals }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const byStage = Object.fromEntries(
    STAGES.map(s => [s.key, deals.filter(d => d.stage === s.key)])
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-280px)]" style={{ scrollbarWidth: "thin" }}>
      {STAGES.map(col => {
        const colDeals = byStage[col.key] || [];
        const total    = colDeals.reduce((s, d) => s + d.amount, 0);

        return (
          <div key={col.key} className="shrink-0 w-[240px] flex flex-col">
            {/* Column header — keeps semantic color regardless of theme */}
            <div className="rounded-xl mb-3 overflow-hidden shadow-xs">
              <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: col.headerBg }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-heading text-[12px] font-bold uppercase tracking-wider text-white truncate">{col.label}</span>
                  <span className="text-[11px] font-bold bg-surface/20 text-white px-1.5 py-0.5 rounded-full shrink-0">
                    {colDeals.length}
                  </span>
                </div>
                <button onClick={e => e.stopPropagation()} aria-label={`Add deal to ${col.label}`}
                  className="w-6 h-6 rounded-lg bg-surface/15 hover:bg-surface/30 flex items-center justify-center transition-colors shrink-0 ml-1">
                  <Plus size={13} color="white" weight="bold" />
                </button>
              </div>
              {/* Total amount */}
              <div
                className={`px-3 py-1.5 border-x border-b rounded-b-none ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-surface border-border-light"}`}
                style={{ borderTop: `2px solid ${col.dot}` }}
              >
                <p className={`text-[12px] font-medium flex items-center gap-1 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                  <CurrencyDollar size={10} color={isDark ? "#8A8A94" : "#64748B"} weight="duotone" />
                  Total: <span className={`font-bold ml-0.5 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{fmtTotal(total)}</span>
                </p>
              </div>
            </div>

            {/* Deal cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 360px)" }}>
              {colDeals.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed text-[12px] text-center ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}
                  style={{ borderColor: col.dot + "60" }}>
                  <Plus size={20} color={col.dot} weight="bold" className="mb-1 opacity-40" />
                  No deals
                </div>
              ) : colDeals.map(deal => {
                const owCol  = avatarColor(deal.owner);
                const owInit = initials(deal.ownerInitials);

                return (
                  <div key={deal.id}
                    onClick={() => router.push(`/deals/${deal.id}`)}
                    className={`rounded-xl border p-3 shadow-xs cursor-pointer group transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? "bg-[#1C1C1E] border-[#27272A] hover:shadow-md hover:border-[#3F3F46]"
                        : "bg-surface border-border-light hover:shadow-md hover:border-[#60A5FA]"
                    }`}
                  >
                    {/* Amount */}
                    <p className={`font-heading text-[14px] font-extrabold mb-1 ${isDark ? "text-[#FAFAFA]" : "text-[#0C2472]"}`}>{fmt(deal.amount)}</p>

                    {/* Deal name */}
                    <p className={`font-heading text-[14px] font-bold truncate leading-tight mb-2 ${isDark ? "text-[#D4D4D8]" : "text-slate-800"}`}>
                      {deal.name}
                    </p>

                    {/* Probability mini-bar */}
                    {deal.probability > 0 && (
                      <div className={`w-full h-0.5 rounded-full mb-2 overflow-hidden ${isDark ? "bg-[#27272A]" : "bg-border-light"}`}>
                        <div className="h-full rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: col.dot }} />
                      </div>
                    )}

                    {/* Account + Contact */}
                    <div className="space-y-1 mb-2.5">
                      {deal.account && (
                        <div className={`flex items-center gap-1 text-[12px] truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                          <Buildings size={10} color={isDark ? "#8A8A94" : "#64748B"} weight="duotone" className="shrink-0" />
                          <span className="truncate">{deal.account}</span>
                        </div>
                      )}
                      {deal.contactName && (
                        <div className={`flex items-center gap-1 text-[12px] truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                          <User size={10} color={isDark ? "#8A8A94" : "#64748B"} weight="duotone" className="shrink-0" />
                          <span className="truncate">{deal.contactName}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`flex items-center gap-1.5 pt-2 border-t ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}>
                      <Tooltip title={deal.owner}>
                        <Avatar src={avatarFor(deal.owner)} sx={{ width: 16, height: 16, bgcolor: owCol, fontSize: "0.45rem", fontWeight: 800 }}>{owInit}</Avatar>
                      </Tooltip>
                      <span className={`text-[12px] truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{deal.owner}</span>
                      <span className={`ml-auto text-[12px] ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{deal.probability}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add deal */}
            <button
              className={`flex items-center gap-1.5 mt-3 px-2 py-2 rounded-xl border border-dashed text-[12px] font-medium w-full transition-colors ${
                isDark ? "text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-[#FAFAFA]" : "text-slate-500 hover:bg-[#EFF6FF] hover:text-slate-700"
              }`}
              style={{ borderColor: col.dot + "60" }}>
              <Plus size={13} weight="bold" />
              Add deal
            </button>
          </div>
        );
      })}
    </div>
  );
}

