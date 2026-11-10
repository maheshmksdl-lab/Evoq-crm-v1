"use client";
import { memo, useState } from "react";
import { ModuleType, getModuleFields, FILTER_OPERATORS } from "@/lib/moduleRelationships";
import { MODULE_ICON, MODULE_COLOR } from "@/lib/moduleVisuals";
import { Check, Trash, Plus, Funnel, ListChecks } from "@phosphor-icons/react";

export interface ReportFilter {
  id: string;
  module: ModuleType;
  fieldName: string;
  operator: string;
  value: string;
}

interface GraphPropertiesPanelProps {
  module: ModuleType | null;
  selectedFields: string[];
  onToggleField: (fieldName: string) => void;
  filters: ReportFilter[];
  onAddFilter: (filter: Omit<ReportFilter, "id">) => void;
  onRemoveFilter: (id: string) => void;
  isDark: boolean;
}

const GraphPropertiesPanel = memo(
  ({ module, selectedFields, onToggleField, filters, onAddFilter, onRemoveFilter, isDark }: GraphPropertiesPanelProps) => {
    const [activeTab, setActiveTab] = useState<"fields" | "filters">("fields");
    const [filterField, setFilterField] = useState("");
    const [filterOperator, setFilterOperator] = useState("");
    const [filterValue, setFilterValue] = useState("");

    if (!module) {
      return (
        <div
          className={`w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l flex flex-col items-center justify-center py-6 px-6 text-center ${
            isDark ? "border-[#27272A] bg-[#0A0A0A] text-[#A1A1AA]" : "border-border-light bg-white text-slate-500"
          }`}
        >
          <p className="text-[12px]">Select a module on the canvas to configure its fields and filters</p>
        </div>
      );
    }

    const fields = getModuleFields(module);
    const Icon = MODULE_ICON[module];
    const color = MODULE_COLOR[module];
    const moduleFilters = filters.filter((f) => f.module === module);
    const fieldType = fields.find((f) => f.name === filterField)?.type ?? "text";
    const operatorOptions = FILTER_OPERATORS[fieldType] ?? [];

    const handleAddFilter = () => {
      if (!filterField || !filterOperator) return;
      onAddFilter({ module, fieldName: filterField, operator: filterOperator, value: filterValue });
      setFilterField("");
      setFilterOperator("");
      setFilterValue("");
    };

    return (
      <div
        className={`w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l flex flex-col max-h-[45vh] md:max-h-none overflow-hidden transition-colors ${
          isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-border-light bg-white"
        }`}
      >
        {/* Header */}
        <div className={`px-4 py-4 border-b flex items-center gap-2 ${isDark ? "border-[#27272A]" : "border-border-light"}`}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
            <Icon size={14} color={color} weight="duotone" />
          </div>
          <div>
            <h2 className={`m-0 text-[13px] font-bold ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>{module}</h2>
            <p className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{selectedFields.length} of {fields.length} fields selected</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? "border-[#27272A]" : "border-border-light"}`}>
          {(["fields", "filters"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === tab
                  ? isDark
                    ? "text-[#93C5FD] border-b-2 border-[#93C5FD]"
                    : "text-brand-700 border-b-2 border-brand-700"
                  : isDark
                    ? "text-[#A1A1AA]"
                    : "text-slate-500"
              }`}
            >
              {tab === "fields" ? <ListChecks size={14} weight="duotone" /> : <Funnel size={14} weight="duotone" />}
              {tab === "fields" ? "Fields" : `Filters${moduleFilters.length ? ` (${moduleFilters.length})` : ""}`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab === "fields" ? (
            <div className="space-y-1">
              {fields.map((field) => {
                const isSelected = selectedFields.includes(field.name);
                return (
                  <button
                    key={field.name}
                    onClick={() => onToggleField(field.name)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isDark ? "hover:bg-[#18181B]" : "hover:bg-surface"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 ${
                        isSelected
                          ? "bg-brand-700 border-brand-700"
                          : isDark
                            ? "border-[#3F3F46]"
                            : "border-[#CBD5E1]"
                      }`}
                    >
                      {isSelected && <Check size={10} color="white" weight="bold" />}
                    </div>
                    <span className={`text-[12px] font-medium flex-1 truncate ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>
                      {field.label}
                    </span>
                    <span className={`text-[10px] uppercase font-semibold ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>
                      {field.type}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Existing filters */}
              {moduleFilters.length > 0 && (
                <div className="space-y-1.5">
                  {moduleFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] ${
                        isDark ? "bg-[#18181B] text-[#D4D4D8]" : "bg-[#F0F9FF] text-slate-700"
                      }`}
                    >
                      <span className="flex-1 truncate">
                        <b>{fields.find((f) => f.name === filter.fieldName)?.label ?? filter.fieldName}</b>{" "}
                        {filter.operator} {filter.value && `"${filter.value}"`}
                      </span>
                      <button onClick={() => onRemoveFilter(filter.id)} className="shrink-0">
                        <Trash size={13} color="#EF4444" weight="fill" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add filter form */}
              <div className="space-y-2">
                <label className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                  Add Filter
                </label>
                <select
                  value={filterField}
                  onChange={(e) => {
                    setFilterField(e.target.value);
                    setFilterOperator("");
                  }}
                  className={`w-full px-3 py-2 text-[12px] border rounded-lg outline-hidden cursor-pointer ${
                    isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-border-light text-slate-700"
                  }`}
                >
                  <option value="">Select field</option>
                  {fields.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  disabled={!filterField}
                  className={`w-full px-3 py-2 text-[12px] border rounded-lg outline-hidden cursor-pointer disabled:opacity-50 ${
                    isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-border-light text-slate-700"
                  }`}
                >
                  <option value="">Select condition</option>
                  {operatorOptions.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                <input
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  disabled={!filterOperator}
                  placeholder="Value"
                  className={`w-full px-3 py-2 text-[12px] border rounded-lg outline-hidden disabled:opacity-50 ${
                    isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8] placeholder-[#52525B]" : "bg-white border-border-light text-slate-700 placeholder-slate-400"
                  }`}
                />

                <button
                  onClick={handleAddFilter}
                  disabled={!filterField || !filterOperator}
                  className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark ? "bg-brand-700/20 text-[#93C5FD] hover:bg-brand-700/30" : "bg-brand-700/10 text-brand-700 hover:bg-brand-700/20"
                  }`}
                >
                  <Plus size={13} weight="bold" />
                  Add Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GraphPropertiesPanel.displayName = "GraphPropertiesPanel";

export default GraphPropertiesPanel;
