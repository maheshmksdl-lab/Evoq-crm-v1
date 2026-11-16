import { ALL_LEADS, ALL_DEALS } from "@/lib/crmData";

export interface SearchHit {
  kind: "Lead" | "Deal";
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  href: string;
}

const norm = (s: string) => s.toLowerCase().trim();

/** Every typed word must appear somewhere in the record, so "sweany proposal" narrows the list. */
function matches(haystack: string[], terms: string[]) {
  const text = norm(haystack.join(" "));
  return terms.every((t) => text.includes(t));
}

/** Name matches rank above matches in other fields. */
function rank(title: string, terms: string[]) {
  const t = norm(title);
  return terms.every((w) => t.startsWith(w) || t.includes(` ${w}`)) ? 0 : 1;
}

export function searchCrm(query: string, perKind = 5): { leads: SearchHit[]; deals: SearchHit[] } {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return { leads: [], deals: [] };

  const leads = ALL_LEADS
    .filter((l) => matches([l.name, l.company, l.email, l.mobile, l.status, l.owner, l.leadSource], terms))
    .sort((a, b) => rank(a.name, terms) - rank(b.name, terms))
    .slice(0, perKind)
    .map<SearchHit>((l) => ({
      kind: "Lead", id: l.id, title: l.name, subtitle: [l.company, l.email].filter(Boolean).join(" · ") || "No company", badge: l.status, href: `/leads/${l.id}`,
    }));

  const deals = ALL_DEALS
    .filter((d) => matches([d.name, d.account, d.contactName, d.stage, d.owner], terms))
    .sort((a, b) => rank(a.name, terms) - rank(b.name, terms))
    .slice(0, perKind)
    .map<SearchHit>((d) => ({
      kind: "Deal", id: d.id, title: d.name, subtitle: [d.account, d.contactName].filter(Boolean).join(" · ") || "No account", badge: d.stage, href: `/deals/${d.id}`,
    }));

  return { leads, deals };
}
