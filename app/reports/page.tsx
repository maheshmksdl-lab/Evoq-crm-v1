"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/ThemeContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listGridSx, fitHeaders, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  House, CaretRight, MagnifyingGlass, Plus, DotsThreeVertical, Star,
  ChartBar, Rows, X,
  Play, PencilSimple, CopySimple, Export, FolderSimple, Trash,
  FileCsv, FilePdf, FileXls,
  SortAscending, SortDescending, CaretUp, CaretDown, ListIcon, GridFour,
} from "@phosphor-icons/react";

interface Report {
  id: string;
  name: string;
  description: string;
  collection: string;
  lastAccessedDate: string;
  createdBy: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
  isPinned: boolean;
}

const SAMPLE_REPORTS: Report[] = [
  { id: "r1", name: "Deal 30", description: "", collection: "Deal Reports", lastAccessedDate: "Now", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#6366F1", tags: ["deals", "sales", "active"], isPinned: true },
  { id: "r2", name: "Deal with Stage", description: "Deal with Stage", collection: "Deal Reports", lastAccessedDate: "Jun 22, 2026", createdBy: "pm@socialdnalabs.com", icon: ChartBar, color: "#8B5CF6", tags: ["deals", "pipeline", "analytics"], isPinned: false },
  { id: "r3", name: "Deal List", description: "", collection: "Deal Reports", lastAccessedDate: "Jun 19, 2026", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#EC4899", tags: ["deals", "sales"], isPinned: false },
  { id: "r4", name: "Account Wise Deal Summary", description: "Account Wise Deal Summary", collection: "Deal Reports", lastAccessedDate: "Jun 5, 2026", createdBy: "Administrator", icon: ChartBar, color: "#14B8A6", tags: ["accounts", "deals", "summary"], isPinned: true },
  { id: "r5", name: "Account List", description: "All accounts with industry and revenue", collection: "Account Reports", lastAccessedDate: "Jun 10, 2026", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#0EA5E9", tags: ["accounts", "industry", "revenue"], isPinned: false },
];

// Column header matching the Leads listing page's DataGrid header style
function ColHeader({ label, icon: Icon }: { label: string; icon?: React.ElementType }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`flex items-center gap-1.5 font-heading text-[14px]/[18px] font-semibold uppercase tracking-wide select-none ${isDark ? "text-[#E4E4E7]" : "text-[#737373]"}`}>
      {Icon && <Icon size={13} weight="duotone" />}
      {label}
    </div>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Deal Reports"]);
  // Collections nav collapses into a dropdown on mobile (md:flex always shows it on desktop)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const goToReport = (reportId: string) => {
    router.push(`/reports/${reportId}`);
    setMobileNavOpen(false);
  };

  // Get all categories with counts
  const allCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    reports.forEach(r => categoryMap.set(r.collection, (categoryMap.get(r.collection) || 0) + 1));
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reports]);

  // Get pinned reports
  const pinnedReports = reports.filter(r => r.isPinned);

  // Filter reports by search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [reports, search]);

  // Sort
  type SortColumn = "name" | "description" | "lastAccessedDate" | "createdBy";
  const SORT_COLUMNS: { key: SortColumn; label: string }[] = [
    { key: "name", label: "Report Name" },
    { key: "description", label: "Description" },
    { key: "lastAccessedDate", label: "Last Accessed" },
    { key: "createdBy", label: "Created By" },
  ];
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null);
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState<string[]>([]);

  const parseAccessedDate = (s: string) => {
    if (s === "Now") return Date.now();
    const t = new Date(s).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  const applySort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp: number;
      if (sortColumn === "lastAccessedDate") {
        cmp = parseAccessedDate(a.lastAccessedDate) - parseAccessedDate(b.lastAccessedDate);
      } else {
        cmp = a[sortColumn].toLowerCase().localeCompare(b[sortColumn].toLowerCase());
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortColumn, sortDirection]);

  const toggleCategory = (category: string) =>
    setExpandedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);

  const togglePin = (reportId: string) => {
    setReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, isPinned: !r.isPinned } : r
    ));
  };

  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; reportId: string } | null>(null);
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const openRowMenu = (e: React.MouseEvent<HTMLElement>, reportId: string) => {
    e.stopPropagation();
    setMenuAnchor({ el: e.currentTarget, reportId });
  };
  const closeRowMenu = () => { setMenuAnchor(null); setExportAnchor(null); };
  const menuReport = reports.find(r => r.id === menuAnchor?.reportId) || null;

  const handleClone = (report: Report) => {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const clonedId = `report-${Date.now()}`;
    setReports(prev => [...prev, { ...report, id: clonedId, name: `${report.name} (Copy)`, isPinned: false, lastAccessedDate: now }]);
    closeRowMenu();
  };

  const handleExport = (format: string) => {
    // Placeholder for export wiring — no backend export endpoint yet.
    closeRowMenu();
  };

  const handleShowEnclosingCollection = (report: Report) => {
    setExpandedCategories(prev => prev.includes(report.collection) ? prev : [...prev, report.collection]);
    closeRowMenu();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setReports(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // DataGrid columns — mirrors the Leads listing page's column pattern
  const gridColumns: GridColDef<Report>[] = [
    {
      field: "name", headerName: "Report Name", flex: 2, minWidth: 220, sortable: false,
      renderHeader: () => <ColHeader label="Report Name" icon={Rows} />,
      renderCell: (params) => {
        const report = params.row;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: report.color + "18" }}>
              <report.icon size={14} color={report.color} weight="duotone" />
            </div>
            <p className={`m-0 font-heading text-[15px]/[20px] font-medium truncate ${isDark ? "text-[#60A5FA]" : "text-brand-700"}`}>{report.name}</p>
          </div>
        );
      },
    },
    {
      field: "description", headerName: "Description", flex: 1.6, minWidth: 160, sortable: false,
      renderHeader: () => <ColHeader label="Description" />,
      renderCell: (params) => (
        <div className={`text-[15px]/[20px] truncate ${params.row.description ? (isDark ? "text-[#A1A1AA]" : "text-slate-500") : (isDark ? "text-[#A1A1AA]" : "text-slate-400")}`}>
          {params.row.description || "—"}
        </div>
      ),
    },
    {
      field: "tags", headerName: "Tags", flex: 1.4, minWidth: 170, sortable: false,
      renderHeader: () => <ColHeader label="Tags" />,
      renderCell: (params) => (
        <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden w-full leading-none">
          {params.row.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className={`inline-flex shrink-0 items-center whitespace-nowrap leading-none px-2 py-1 rounded-full text-[11px] font-semibold ${isDark ? "bg-[#18181B] text-[#A1A1AA]" : "bg-border-light text-[#4A5675]"}`}>{tag}</span>
          ))}
          {params.row.tags.length > 2 && <span className={`shrink-0 whitespace-nowrap leading-none text-[11px] font-semibold ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>+{params.row.tags.length - 2}</span>}
        </div>
      ),
    },
    {
      field: "lastAccessedDate", headerName: "Last Accessed", flex: 1, minWidth: 120, sortable: false,
      renderHeader: () => <ColHeader label="Last Accessed" />,
      renderCell: (params) => <div className={`text-[13px]/[16px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.lastAccessedDate}</div>,
    },
    {
      field: "createdBy", headerName: "Created By", flex: 1.2, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="Created By" />,
      renderCell: (params) => <div className={`text-[13px]/[16px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.createdBy}</div>,
    },
    {
      field: "actions", headerName: "", width: 76, sortable: false, disableColumnMenu: true,
      renderCell: (params) => {
        const report = params.row;
        return (
          <div className="flex items-center justify-end gap-0.5 w-full" onClick={e => e.stopPropagation()}>
            <Tooltip title={report.isPinned ? "Unpin" : "Pin"}>
              <IconButton size="small" onClick={() => togglePin(report.id)}
                aria-label={report.isPinned ? `Unpin ${report.name}` : `Pin ${report.name}`} aria-pressed={!!report.isPinned} sx={{ color: report.isPinned ? "#F59E0B" : (isDark ? "#71717A" : "#94A3B8") }}>
                <Star size={15} weight={report.isPinned ? "fill" : "duotone"} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actions">
              <IconButton size="small" aria-label={`Actions for ${report.name}`} aria-haspopup="menu" onClick={e => openRowMenu(e, report.id)}
                sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: isDark ? "#27272A" : "#E3ECFC" } }}>
                <DotsThreeVertical size={16} color={isDark ? "#A1A1AA" : "#64748B"} weight="bold" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <>
    <div className={`sidebar-content app-canvas flex flex-col md:flex-row min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      {/* Left Sidebar — mirrors SettingsSidebar exactly; collapses into a dropdown on mobile */}
      <div className={`w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r flex flex-col transition-colors duration-300 ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-surface border-border-light"}`}>
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          className={`w-full flex items-center justify-between px-4 py-4 md:pt-5 md:pb-4 border-b text-left transition-colors duration-300 md:cursor-default ${isDark ? "border-[#27272A]" : "border-border-light"}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center shadow-xs shrink-0">
              <ChartBar size={15} color="#fff" weight="duotone" />
            </div>
            <div>
              <div className={`font-heading text-[14px] font-bold leading-tight ${isDark ? "text-[#FFFFFF]" : "text-slate-900"}`}>Reports</div>
              <div className="text-[12px] text-slate-500 leading-tight">Browse &amp; organize</div>
            </div>
          </div>
          <span className="md:hidden shrink-0">
            {mobileNavOpen
              ? <CaretUp size={14} color={isDark ? "#9CA3AF" : "#64748B"} weight="bold" />
              : <CaretDown size={14} color={isDark ? "#9CA3AF" : "#64748B"} weight="bold" />}
          </span>
        </button>

        <nav className={`${mobileNavOpen ? "flex" : "hidden"} md:flex flex-col flex-1 py-3 px-2 space-y-1 overflow-y-auto max-h-[50vh] md:max-h-none`}>
          {/* Pinned Reports Section */}
          {pinnedReports.length > 0 && (
            <div>
              <div className={`flex items-center justify-between w-full px-2 py-1.5 min-h-[32px]`}>
                <span className={`font-heading text-[13px] font-bold uppercase tracking-widest truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>Pinned</span>
              </div>
              <div className="space-y-0.5 mb-1.5">
                {pinnedReports.map(report => (
                  <button key={report.id}
                    onClick={(e) => { goToReport(report.id); e.currentTarget.blur(); }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`relative flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all min-h-[36px] outline-hidden focus:outline-hidden focus:bg-none focus-visible:ring-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B82F6] ${
                      isDark ? "focus-visible:ring-[#3B82F6]" : "focus-visible:ring-[#1D4ED8]"
                    } ${
                      isDark ? "text-[#9CA3AF] hover:bg-[#27272A] hover:text-[#FFFFFF]" : "text-slate-500 hover:bg-[#EFF6FF]/60 hover:text-slate-700"
                    }`}>
                    <report.icon size={13} color="#94A3B8" weight="duotone" />
                    <span className="flex-1 truncate text-left">{report.name}</span>
                    <Star size={13} color="#F59E0B" weight="fill" className="shrink-0 opacity-80" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories — each collection behaves like a Settings SECTION (collapsible group) */}
          {allCategories.map(({ name, count }) => {
            const isOpen = expandedCategories.includes(name);
            return (
              <div key={name}>
                <button onClick={() => toggleCategory(name)} aria-expanded={isOpen}
                  className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg transition-colors group min-h-[32px] outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] ${isDark ? "hover:bg-brand-700/15" : "hover:bg-[#EFF6FF]"}`}>
                  <span className={`font-heading text-[13px] font-bold uppercase tracking-widest transition-colors truncate ${isDark ? "text-[#A1A1AA] group-hover:text-[#D4D4D8]" : "text-slate-500 group-hover:text-slate-700"}`}>
                    {name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-[#27272A] text-[#9CA3AF]" : "bg-border-light text-slate-500"}`}>{count}</span>
                    {isOpen ? <CaretUp size={10} color={isDark ? "#71717A" : "#94A3B8"} weight="bold" /> : <CaretDown size={10} color={isDark ? "#71717A" : "#94A3B8"} weight="bold" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-0.5 mb-1.5">
                    {reports.filter(r => r.collection === name).map(report => (
                      <button key={report.id}
                        onClick={(e) => { goToReport(report.id); e.currentTarget.blur(); }}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        className={`relative flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all min-h-[36px] outline-hidden focus:outline-hidden focus:bg-none focus-visible:ring-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B82F6] ${
                          isDark ? "focus-visible:ring-[#3B82F6]" : "focus-visible:ring-[#1D4ED8]"
                        } ${
                          isDark ? "text-[#9CA3AF] hover:bg-[#27272A] hover:text-[#FFFFFF]" : "text-slate-500 hover:bg-[#EFF6FF]/60 hover:text-slate-700"
                        }`}>
                        <report.icon size={13} color="#94A3B8" weight="duotone" />
                        <span className="flex-1 truncate text-left">{report.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right Content — mirrors the Leads listing page */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3 sm:space-y-5 overflow-y-auto animate-fade-in">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className={`flex items-center gap-1.5 text-[13.5px]/[18px] mb-1 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>
                <House size={16} weight="duotone" />
                <CaretRight size={12} weight="duotone" />
                <Link href="/reports" className={`transition-colors font-medium ${isDark ? "hover:text-[#D4D4D8]" : "hover:text-brand-700"}`}>Reports</Link>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <h1 className="font-heading text-lg sm:text-[22px]/[28px] font-semibold text-slate-900 tracking-tight m-0">Reports</h1>
                <span className={`text-[12px] sm:text-[13px]/[16px] font-medium border px-2 sm:px-2.5 py-1 rounded-full shadow-xs flex items-center whitespace-nowrap ${isDark ? "bg-[#0A0A0A] border-[#27272A] text-[#A1A1AA]" : "bg-surface border-border-light text-slate-500"}`}>
                  {reports.length} total
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* View toggle - hidden on mobile */}
              <div className={`hidden sm:flex items-center rounded-xl p-0.5 gap-0.5 shadow-xs border ${isDark ? "bg-[#000000] border-[#27272A]" : "bg-[#EFF6FF] border-border-light"}`}>
                {[
                  { k: "list", Icon: ListIcon, label: "List" },
                  { k: "grid", Icon: GridFour, label: "Grid" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)} aria-pressed={view === k} aria-label={`${label} view`}
                    className={`flex items-center gap-1 px-2 py-[6px] rounded-lg text-[13px]/[16px] font-medium transition-all ${
                      view === k
                        ? isDark ? "bg-[#18181B] text-[#D4D4D8]" : "bg-white text-brand-700 shadow-xs"
                        : isDark ? "text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#D4D4D8]" : "text-slate-600 hover:bg-white/70 hover:text-brand-700"
                    }`}>
                    <Icon size={14} weight="duotone" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <Button variant="contained" startIcon={<Plus size={16} weight="bold" />}
                onClick={() => router.push("/reports/new/edit")}
                sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: { xs: "13px", sm: "15px" }, px: { xs: 1.5, sm: 2 }, py: 0.75, flex: { xs: 1, sm: "unset" }, boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px 0 #60A5FA55" }, "&:active": { bgcolor: isDark ? "#52525B" : "#0C2472" } }}>
                <span className="hidden sm:inline">Create Report</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>

          {/* Toolbar: Search | Sort | Record count */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 sm:min-w-[240px] focus-within:border-[#60A5FA] focus-within:shadow-[0_0_0_3px_rgba(96,165,250,0.30)] transition-shadow ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-surface border-border-light"}`}>
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search All Reports" value={search} inputProps={{ "aria-label": "Search all reports" }} onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.86rem", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" className={`rounded-md px-1 transition-colors text-[15px]/[20px] ${isDark ? "text-[#71717A] hover:text-[#D4D4D8]" : "text-slate-400 hover:text-slate-600"}`}>✕</button>}
            </div>

            <Button variant="outlined" size="small"
              startIcon={sortDirection === "asc" ? <SortAscending size={14} weight="duotone" /> : <SortDescending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortMenuAnchor(e.currentTarget)}
              sx={{
                borderColor: sortColumn ? "#1D4ED8" : isDark ? "#27272A" : "#E3ECFC",
                color: sortColumn ? "#fff" : isDark ? "#E4E4E7" : "#0C2472",
                bgcolor: sortColumn ? "#1D4ED8" : isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px",
                "&:hover": {
                  borderColor: sortColumn ? "#1640B8" : "#1D4ED8",
                  color: sortColumn ? "#fff" : "#0C2472",
                  bgcolor: sortColumn ? "#1640B8" : isDark ? "#0A0A0A" : "#DCE6FB",
                },
              }}>
              {sortColumn ? SORT_COLUMNS.find(c => c.key === sortColumn)?.label : "Sort"}
            </Button>
            <Menu anchorEl={sortMenuAnchor} open={!!sortMenuAnchor} onClose={() => setSortMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: "12px", minWidth: 200, bgcolor: isDark ? "#18181B" : "#fff", border: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` } }}>
              {SORT_COLUMNS.map(col => (
                <MenuItem key={col.key} onClick={() => { applySort(col.key); setSortMenuAnchor(null); }}>
                  <ListItemIcon>
                    {sortColumn === col.key
                      ? (sortDirection === "asc" ? <SortAscending size={16} weight="bold" color="#1D4ED8" /> : <SortDescending size={16} weight="bold" color="#1D4ED8" />)
                      : <SortAscending size={16} weight="regular" />}
                  </ListItemIcon>
                  <ListItemText sx={{ color: sortColumn === col.key ? "#1D4ED8" : undefined, fontWeight: sortColumn === col.key ? 700 : 400 }}>{col.label}</ListItemText>
                </MenuItem>
              ))}
              {sortColumn && [
                <Divider key="divider" />,
                <MenuItem key="clear" onClick={() => { setSortColumn(null); setSortMenuAnchor(null); }}>
                  <ListItemIcon><X size={16} /></ListItemIcon>
                  <ListItemText>Clear Sort</ListItemText>
                </MenuItem>,
              ]}
            </Menu>

            <span aria-live="polite" className={`text-right sm:ml-auto text-[13px]/[16px] px-3 py-1.5 rounded-lg ${isDark ? "text-[#A1A1AA] bg-[#0A0A0A]" : "text-slate-500 bg-surface"}`}>
              {sorted.length} of {reports.length} records
            </span>
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sorted.map(report => (
                <div key={report.id}
                  className={`rounded-2xl border p-4 cursor-pointer transition-colors ${isDark ? "border-[#27272A] bg-[#0A0A0A] hover:bg-[#111113]" : "border-border-light bg-white hover:bg-[#fafcff]"}`}
                  onClick={() => router.push(`/reports/${report.id}`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: report.color + "18" }}>
                      <report.icon size={16} color={report.color} weight="duotone" />
                    </div>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <Tooltip title={report.isPinned ? "Unpin" : "Pin"}>
                        <IconButton size="small" onClick={() => togglePin(report.id)}
                          aria-label={report.isPinned ? `Unpin ${report.name}` : `Pin ${report.name}`} aria-pressed={!!report.isPinned} sx={{ color: report.isPinned ? "#F59E0B" : (isDark ? "#71717A" : "#94A3B8") }}>
                          <Star size={15} weight={report.isPinned ? "fill" : "duotone"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More actions">
                        <IconButton size="small" aria-label={`Actions for ${report.name}`} aria-haspopup="menu" onClick={e => openRowMenu(e, report.id)}
                          sx={{ color: isDark ? "#A1A1AA" : "#64748B", bgcolor: isDark ? "#27272A" : "#F1F5F9", "&:hover": { bgcolor: isDark ? "#A1A1AA" : "#64748B", color: isDark ? "#F4F4F5" : "#0F172A" } }}>
                          <DotsThreeVertical size={15} weight="bold" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  <div className={`text-[14px] font-semibold mb-1 ${isDark ? "text-[#60A5FA]" : "text-brand-700"}`}>{report.name}</div>
                  <div className={`text-[12.5px] mb-3 line-clamp-2 ${report.description ? (isDark ? "text-[#D4D4D8]" : "text-slate-600") : (isDark ? "text-[#A1A1AA]" : "text-slate-500")}`}>{report.description || "No description"}</div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {report.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? "bg-[#18181B] text-[#A1A1AA]" : "bg-border-light text-[#4A5675]"}`}>{tag}</span>
                    ))}
                  </div>
                  <div className={`flex items-center justify-between text-[11px] pt-3 border-t ${isDark ? "border-[#1C1C1E] text-[#A1A1AA]" : "border-[#EFF6FF] text-slate-500"}`}>
                    <span>{report.lastAccessedDate}</span>
                    <span className="truncate max-w-[45%]">{report.createdBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View (MUI DataGrid) — mirrors the Leads listing page */}
          {view === "list" && (
            <div className={`rounded-2xl border shadow-xs overflow-hidden ${isDark ? "border-[#27272A]" : "border-border-light"}`} style={{ height: 600 }}>
              <DataGrid<Report>
                rows={sorted}
                columns={fitHeaders(gridColumns)}
                getRowId={row => row.id}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={44}
                columnHeaderHeight={40}
                rowSelectionModel={selected}
                onRowSelectionModelChange={model => setSelected(model as string[])}
                onRowClick={params => router.push(`/reports/${params.id}`)}
                paginationModel={{ page: page - 1, pageSize: rowsPerPage }}
                onPaginationModelChange={model => { setPage(model.page + 1); setRowsPerPage(model.pageSize); }}
                pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                slots={{
                  noRowsOverlay: () => (
                    <div className="py-16 text-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
                        <MagnifyingGlass size={22} color={isDark ? "#E4E4E7" : "#94A3B8"} weight="duotone" />
                      </div>
                      <p className={`font-heading text-[15px]/[20px] font-semibold ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>No reports found</p>
                      <p className={`text-[13px]/[16px] mt-1 ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>Try adjusting your search</p>
                    </div>
                  ),
                }}
                sx={listGridSx(isDark)}
              />
            </div>
          )}
        </main>
      </div>
    </div>

    {/* Row action menu */}
    <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor && !exportAnchor} onClose={closeRowMenu}
      PaperProps={{ sx: { borderRadius: "12px", minWidth: 200, bgcolor: isDark ? "#18181B" : "#fff", border: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` } }}>
      <MenuItem onClick={() => { if (menuReport) router.push(`/reports/${menuReport.id}`); closeRowMenu(); }}>
        <ListItemIcon><Play size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Run</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { if (menuReport) router.push(`/reports/${menuReport.id}/edit`); closeRowMenu(); }}>
        <ListItemIcon><PencilSimple size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => menuReport && handleClone(menuReport)}>
        <ListItemIcon><CopySimple size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Clone</ListItemText>
      </MenuItem>
      <MenuItem onClick={e => setExportAnchor(e.currentTarget)}>
        <ListItemIcon><Export size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Export</ListItemText>
        <CaretRight size={14} />
      </MenuItem>
      <MenuItem onClick={() => menuReport && handleShowEnclosingCollection(menuReport)}>
        <ListItemIcon><FolderSimple size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Show Enclosing Collection</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { setDeleteTarget(menuReport); setMenuAnchor(null); }} sx={{ color: "#EF4444" }}>
        <ListItemIcon><Trash size={16} weight="duotone" color="#EF4444" /></ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>

    {/* Export submenu */}
    <Menu anchorEl={exportAnchor} open={!!exportAnchor} onClose={closeRowMenu}
      PaperProps={{ sx: { borderRadius: "12px", minWidth: 160, bgcolor: isDark ? "#18181B" : "#fff", border: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` } }}>
      <MenuItem onClick={() => handleExport("csv")}>
        <ListItemIcon><FileCsv size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>CSV</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleExport("xlsx")}>
        <ListItemIcon><FileXls size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>Excel</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleExport("pdf")}>
        <ListItemIcon><FilePdf size={16} weight="duotone" /></ListItemIcon>
        <ListItemText>PDF</ListItemText>
      </MenuItem>
    </Menu>

    {/* Delete confirmation */}
    <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
      PaperProps={{ sx: { borderRadius: "16px", bgcolor: isDark ? "#18181B" : "#fff" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: isDark ? "#F4F4F5" : "#0C2472" }}>Delete report?</DialogTitle>
      <DialogContent>
        <span className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
          This will permanently delete "{deleteTarget?.name}". This action cannot be undone.
        </span>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: "none", fontWeight: 600, color: isDark ? "#A1A1AA" : "#64748B" }}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} variant="contained" sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}>Delete</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
