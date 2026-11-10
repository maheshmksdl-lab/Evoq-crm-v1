"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NewContactDrawer from "@/components/contacts/NewContactDrawer";
import ContactGridView from "@/components/contacts/ContactGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listGridSx, fitHeaders, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, House, CaretRight, Trash,
  DotsThreeVertical, Phone, DeviceMobile, Envelope, FunnelSimple, CaretDown,
  User, IdentificationBadge, UserCircle, CalendarBlank,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import { OWNER_AVATARS } from "@/lib/avatars";
import { useTheme } from "@/components/ThemeContext";

// ---------------------------------------------
//  Data — exact from screenshot (13 visible of 25)
// ---------------------------------------------
interface Contact {
  id: number; firstName: string; lastName: string;
  ownerName: string; ownerEmail: string; ownerInitials: string;
  email: string; phone: string; mobile: string;
  accountName: string; creation: string; modified: string;
}

const ALL_CONTACTS: Contact[] = [
  { id:1,  firstName:"Cop",          lastName:"Mar",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"",           mobile:"",           accountName:"",            creation:"27 May 2026, 02:38 PM", modified:"27 May 2026, 02:38 PM" },
  { id:2,  firstName:"Michael",      lastName:"Lee",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"michael.lee@demo.com",    phone:"",           mobile:"9123456780",  accountName:"",            creation:"15 May 2026, 09:31 AM", modified:"15 May 2026, 09:31 AM" },
  { id:3,  firstName:"Lead SDL",     lastName:"11",      ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"leadsdl1@mailinator.com", phone:"",           mobile:"9999992222",  accountName:"SDL LEAD1",   creation:"15 Apr 2026, 11:13 AM", modified:"15 Apr 2026, 11:13 AM" },
  { id:4,  firstName:"John",         lastName:"Smith",   ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"johnsmith@mailinator.com",phone:"9898989898",  mobile:"",           accountName:"Sears Homelife", creation:"13 Apr 2026, 06:00 PM", modified:"14 Apr 2026, 07:45 PM" },
  { id:5,  firstName:"Raja",         lastName:"rajan",   ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"rajarajan@rmvt.com",      phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:40 PM", modified:"14 Apr 2026, 07:30 PM" },
  { id:6,  firstName:"mmmm",         lastName:"mmmm",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"mmmm@rmvt.com",           phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:53 PM", modified:"14 Apr 2026, 06:53 PM" },
  { id:7,  firstName:"Vishnutharan", lastName:"R",       ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"vishnu@rmvt.com",         phone:"",           mobile:"",           accountName:"RMVT",        creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:44 PM" },
  { id:8,  firstName:"test",         lastName:"test",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"test@mailinator.com",     phone:"",           mobile:"",           accountName:"test",        creation:"13 Apr 2026, 06:17 PM", modified:"13 Apr 2026, 06:17 PM" },
  { id:9,  firstName:"Speedy",       lastName:"Mike",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"",           mobile:"0111111111",  accountName:"Speedy Motors", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM" },
  { id:10, firstName:"SDL Test",     lastName:"Test",    ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"sdltest@mailinator.com",  phone:"9988776655", mobile:"",           accountName:"SDL",         creation:"17 Mar 2026, 06:06 PM", modified:"20 Mar 2026, 05:13 PM" },
  { id:11, firstName:"SDL Mar 17",   lastName:"SDL",     ownerName:"PM SDL",    ownerEmail:"pm@socialdnalabs.com",  ownerInitials:"PM", email:"",                        phone:"77881122",   mobile:"",           accountName:"SDL",         creation:"17 Mar 2026, 11:32 AM", modified:"17 Mar 2026, 11:34 AM" },
  { id:12, firstName:"Jimmy",        lastName:"Davis",   ownerName:"Admin",     ownerEmail:"admin@mailinator.com",  ownerInitials:"AD", email:"",                        phone:"8877994455", mobile:"",           accountName:"",            creation:"08 Jul 2025, 11:14 AM", modified:"17 Mar 2026, 11:32 AM" },
  { id:13, firstName:"Test",         lastName:"user001", ownerName:"Admin",     ownerEmail:"admin@mailinator.com",  ownerInitials:"AD", email:"",                        phone:"9978654311", mobile:"",           accountName:"",            creation:"20 Aug 2025, 11:57 AM", modified:"05 Feb 2026, 06:50 PM" },
];

// ---------------------------------------------
//  Column definitions
// ---------------------------------------------
const COL_DEFS = [
  { key: "firstName",    label: "First Name",     width: "200px" },
  { key: "lastName",     label: "Last Name",      width: "130px" },
  { key: "contactOwner", label: "Contact Owner",  width: "170px" },
  { key: "email",        label: "Email",          width: "210px" },
  { key: "phone",        label: "Phone",          width: "130px" },
  { key: "mobile",       label: "Mobile",         width: "130px" },
  { key: "creation",     label: "Creation",       width: "165px" },
  { key: "modified",     label: "Modified",       width: "165px" },
];

const DEFAULT_VISIBLE = new Set(["firstName", "lastName", "contactOwner", "email", "phone", "creation"]);

// ---------------------------------------------
//  Helpers
// ---------------------------------------------
const AVATAR_PAL = ["#7C3AED", "#10B981", "#F59E0B", "#DB2777"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];

function ColHeader({ label, icon: Icon }: { label: string; icon?: ElementType }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`flex items-center gap-1.5 font-heading text-[14px]/[18px] font-semibold uppercase tracking-wide select-none ${isDark ? "text-[#E4E4E7]" : "text-[#737373]"}`}>
      {Icon && <Icon size={13} weight="duotone" />}
      {label}
    </div>
  );
}

// ---------------------------------------------
//  Page
// ---------------------------------------------
export default function ContactsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selected, setSelected]     = useState<number[]>([]);
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState<"list" | "grid">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE));

  const filtered = ALL_CONTACTS.filter(c => {
    const q = search.toLowerCase();
    return !q ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q);
  });

  // -- DataGrid column builders, keyed by COL_DEFS.key
  const COLUMN_BUILDERS: Record<string, GridColDef<Contact>> = {
    firstName: {
      field: "firstName", headerName: "First Name", flex: 1.3, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="First Name" icon={User} />,
      renderCell: (params) => (
        <p className={`m-0 font-heading text-[15px]/[20px] font-medium truncate ${isDark ? "text-[#FFFFFF]" : "text-slate-800"}`}>{params.row.firstName}</p>
      ),
    },
    lastName: {
      field: "lastName", headerName: "Last Name", flex: 1.1, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Last Name" icon={IdentificationBadge} />,
      renderCell: (params) => (
        <p className={`m-0 text-[15px]/[20px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.lastName}</p>
      ),
    },
    contactOwner: {
      field: "contactOwner", headerName: "Contact Owner", flex: 1.4, minWidth: 150, sortable: false,
      renderHeader: () => <ColHeader label="Contact Owner" icon={UserCircle} />,
      renderCell: (params) => {
        const contact = params.row;
        return (
          <Tooltip title={`${contact.ownerName} · ${contact.ownerEmail}`} placement="top">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar src={OWNER_AVATARS[contact.ownerName]} sx={{ width: 20, height: 20, bgcolor: avatarColor(contact.ownerName), fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>{contact.ownerInitials}</Avatar>
              <span className={`text-[15px]/[20px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{contact.ownerEmail}</span>
            </div>
          </Tooltip>
        );
      },
    },
    email: {
      field: "email", headerName: "Email", flex: 1.7, minWidth: 180, sortable: false,
      renderHeader: () => <ColHeader label="Email" icon={Envelope} />,
      renderCell: (params) => (
        <Tooltip title={params.row.email} placement="top">
          <div className="text-[15px]/[20px] truncate w-full">
            {params.row.email
              ? <span className={`flex items-center gap-1 ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}><Envelope size={11} color="#94A3B8" weight="duotone" className="shrink-0" />{params.row.email}</span>
              : <span className={isDark ? "text-[#71717A]" : "text-slate-400"}>—</span>}
          </div>
        </Tooltip>
      ),
    },
    phone: {
      field: "phone", headerName: "Phone", flex: 1.1, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Phone" icon={Phone} />,
      renderCell: (params) => (
        <div className={`text-[15px]/[20px] font-mono truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>
          {params.row.phone
            ? <span className="flex items-center gap-1"><Phone size={11} color="#94A3B8" weight="duotone" />{params.row.phone}</span>
            : <span className={isDark ? "text-[#71717A]" : "text-slate-400"}>—</span>}
        </div>
      ),
    },
    mobile: {
      field: "mobile", headerName: "Mobile", flex: 1.1, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Mobile" icon={DeviceMobile} />,
      renderCell: (params) => (
        <div className={`text-[15px]/[20px] font-mono truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>
          {params.row.mobile
            ? <span className="flex items-center gap-1"><DeviceMobile size={11} color="#94A3B8" weight="duotone" />{params.row.mobile}</span>
            : <span className={isDark ? "text-[#71717A]" : "text-slate-400"}>—</span>}
        </div>
      ),
    },
    creation: {
      field: "creation", headerName: "Creation", flex: 1.4, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="Creation" icon={CalendarBlank} />,
      renderCell: (params) => (
        <p className={`m-0 text-[13px]/[16px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.creation}</p>
      ),
    },
    modified: {
      field: "modified", headerName: "Modified", flex: 1.4, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="Modified" icon={CalendarBlank} />,
      renderCell: (params) => (
        <p className={`m-0 text-[13px]/[16px] truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.modified}</p>
      ),
    },
  };

  const gridColumns: GridColDef<Contact>[] = [
    ...COL_DEFS.filter(c => visibleCols.has(c.key)).map(c => COLUMN_BUILDERS[c.key]),
    {
      field: "actions", headerName: "", width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <div className="row-actions flex justify-end w-full">
          <Tooltip title="Actions">
            <IconButton size="small" aria-label={`Actions for ${`${params.row.firstName} ${params.row.lastName}`.trim()}`} onClick={e => e.stopPropagation()} sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: isDark ? "#27272A" : "#E3ECFC" } }}>
              <DotsThreeVertical size={16} color={isDark ? "#A1A1AA" : "#64748B"} weight="bold" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="sidebar-content app-canvas flex-1 flex flex-col min-h-screen overflow-auto">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3 sm:space-y-5 animate-fade-in">

          {/* -- Breadcrumb + Header -- */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className={`flex items-center gap-1.5 text-[13.5px]/[18px] mb-1 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>
                <House size={16} weight="duotone" />
                <CaretRight size={12} weight="duotone" />
                <Link href="/contacts" className={`transition-colors font-medium ${isDark ? "hover:text-[#D4D4D8]" : "hover:text-brand-700"}`}>Contacts</Link>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <h1 className="font-heading text-[22px]/[28px] font-semibold text-slate-900 tracking-tight m-0">Contacts</h1>
                <span className={`text-[13px]/[16px] font-medium border px-2.5 py-1 rounded-full shadow-xs flex items-center ${isDark ? "bg-[#0A0A0A] border-[#27272A] text-[#A1A1AA]" : "bg-surface border-border-light text-slate-500"}`}>
                  {ALL_CONTACTS.length} total
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* View toggle */}
              <div className={`flex items-center rounded-xl p-0.5 gap-0.5 shadow-xs border ${isDark ? "bg-[#000000] border-[#27272A]" : "bg-[#EFF6FF] border-border-light"}`}>
                {[
                  { k: "list", Icon: List,     label: "List" },
                  { k: "grid", Icon: GridFour, label: "Grid" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)} aria-pressed={view === k}
                    className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-[14px]/[18px] font-medium transition-all ${
                      view === k
                        ? isDark ? "bg-[#18181B] text-[#D4D4D8]" : "bg-white text-brand-700 shadow-xs"
                        : isDark ? "text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#D4D4D8]" : "text-slate-600 hover:bg-white/70 hover:text-brand-700"
                    }`}>
                    <Icon size={14} weight="duotone" />{label}
                  </button>
                ))}
              </div>

              <Button variant="contained"
                startIcon={<Plus size={16} weight="bold" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "15px", px: 2, py: 0.85, boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px 0 #60A5FA55" }, "&:active": { bgcolor: isDark ? "#52525B" : "#0C2472" } }}>
                New Contact
              </Button>
            </div>
          </div>

          {/* -- Toolbar -- */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 basis-full sm:basis-auto sm:min-w-[240px] focus-within:border-[#60A5FA] focus-within:shadow-[0_0_0_3px_rgba(96,165,250,0.30)] transition-shadow ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-surface border-border-light"}`}>
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search contacts…" value={search} inputProps={{ "aria-label": "Search contacts" }}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.86rem", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" className={`rounded-md px-1 text-[15px]/[20px] transition-colors ${isDark ? "text-[#71717A] hover:text-[#D4D4D8]" : "text-slate-400 hover:text-slate-600"}`}>✕</button>}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-2.5">
            <Button variant="outlined" size="small"
              startIcon={activeFilters.length > 0
                ? <Badge badgeContent={activeFilters.length} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: "0.55rem", height: 14, minWidth: 14 } }}>
                    <FunnelSimple size={14} weight="duotone" />
                  </Badge>
                : <FunnelSimple size={14} weight="duotone" />
              }
              onClick={e => setFiltersAnchor(e.currentTarget)}
              sx={{
                borderColor: activeFilters.length > 0 ? "#1D4ED8" : isDark ? "#27272A" : "#E3ECFC",
                color: activeFilters.length > 0 ? "#fff" : isDark ? "#E4E4E7" : "#0C2472",
                bgcolor: activeFilters.length > 0 ? "#1D4ED8" : isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px", minWidth: 0,
                "&:hover": {
                  borderColor: activeFilters.length > 0 ? "#1640B8" : "#1D4ED8",
                  color: activeFilters.length > 0 ? "#fff" : "#0C2472",
                  bgcolor: activeFilters.length > 0 ? "#1640B8" : isDark ? "#0A0A0A" : "#DCE6FB",
                },
              }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#E4E4E7" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px", minWidth: 0,
                "&:hover": { borderColor: "#1D4ED8", color: "#0C2472", bgcolor: isDark ? "#0A0A0A" : "#DCE6FB" },
              }}>
              Columns
            </Button>

            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#E4E4E7" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px", minWidth: 0,
                "&:hover": { borderColor: "#1D4ED8", color: "#0C2472", bgcolor: isDark ? "#0A0A0A" : "#DCE6FB" },
              }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>
            </div>

            <span aria-live="polite" className={`w-full sm:w-auto text-right sm:ml-auto text-[13px]/[16px] px-3 py-1.5 rounded-lg ${isDark ? "text-[#A1A1AA] bg-[#0A0A0A]" : "text-slate-500 bg-surface"}`}>
              {filtered.length} of {ALL_CONTACTS.length} records
            </span>
          </div>

          {/* -- Bulk action bar -- */}
          {selected.length > 0 && (
            <div role="toolbar" aria-label="Bulk actions" className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 rounded-xl border animate-slide-up shadow-xs ${isDark ? "bg-[#18181B] border-[#27272A]" : "bg-[#EFF6FF] border-border-light"}`}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-brand-700 text-white flex items-center justify-center text-[13px]/[16px]">{selected.length}</span>
                <span className={`text-[14px]/[18px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>selected</span>
              </div>
              <div className={`w-px h-4 ${isDark ? "bg-[#27272A]" : "bg-border-light"}`} />
              <button className={`text-[14px]/[18px] font-medium transition-colors ${isDark ? "text-[#A1A1AA] hover:text-[#FAFAFA]" : "text-brand-700 hover:text-[#0C2472]"}`}>Send Email</button>
              <button className={`text-[14px]/[18px] font-medium transition-colors ${isDark ? "text-[#A1A1AA] hover:text-[#FAFAFA]" : "text-brand-700 hover:text-[#0C2472]"}`}>Assign Owner</button>
              <button onClick={() => setSelected([])} className={`ml-auto text-[14px]/[18px] font-medium transition-colors ${isDark ? "text-[#9CA3AF] hover:text-[#A1A1AA]" : "text-slate-500 hover:text-slate-600"}`}>Clear</button>
              <button className={`flex items-center gap-1.5 text-[14px]/[18px] font-medium transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}>
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* -- GRID VIEW -- */}
          {view === "grid" && (
            <ContactGridView contacts={filtered.map(c => ({
              id: c.id, firstName: c.firstName, lastName: c.lastName,
              ownerName: c.ownerName, ownerInitials: c.ownerInitials,
              email: c.email, phone: c.phone, mobile: c.mobile,
              accountName: c.accountName,
            }))} />
          )}

          {/* -- LIST VIEW (MUI DataGrid) -- */}
          {view === "list" && (
            <div className={`rounded-2xl border shadow-xs overflow-hidden ${isDark ? "border-[#27272A]" : "border-border-light"}`} style={{ height: 600 }}>
              <DataGrid<Contact>
                rows={filtered}
                columns={fitHeaders(gridColumns)}
                getRowId={row => row.id}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={44}
                columnHeaderHeight={40}
                rowSelectionModel={selected}
                onRowSelectionModelChange={model => setSelected(model as number[])}
                onRowClick={params => router.push(`/contacts/${params.id}`)}
                initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                slots={{
                  noRowsOverlay: () => (
                    <div className="py-16 px-4 text-center break-words" role="status">
                      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-3">
                        <MagnifyingGlass size={22} color="#94A3B8" weight="duotone" />
                      </div>
                      <p className="font-heading text-slate-500 text-sm font-semibold">No contacts found</p>
                      <p className="text-slate-500 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  ),
                }}
                sx={listGridSx(isDark)}
              />
            </div>
          )}
        </main> 

      {/* -- Panels -- */}
      <NewContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FiltersDrawer
        anchor={filtersAnchor} onClose={() => setFiltersAnchor(null)}
        filters={activeFilters} onChange={setActiveFilters}
      />

      <ColumnsDrawer
        open={columnsOpen} onClose={() => setColumnsOpen(false)}
        selected={visibleCols} onChange={setVisibleCols}
      />

      <SortPopover
        anchor={sortAnchor} onClose={() => setSortAnchor(null)}
        sorts={activeSorts} onChange={setActiveSorts}
      />
    </div>
  );
}
