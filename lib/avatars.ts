/**
 * Shared avatar image URLs (randomuser.me portraits).
 * Key = lead ID for leads, owner name for owners.
 */

export const LEAD_AVATARS: Record<number, string> = {
  1:  "https://randomuser.me/api/portraits/women/56.jpg", // Mrs. Shobha R
  2:  "https://randomuser.me/api/portraits/women/44.jpg", // Priya Nair
  3:  "https://randomuser.me/api/portraits/men/32.jpg",   // John Carter
  4:  "https://randomuser.me/api/portraits/women/68.jpg", // Sudha R
  5:  "https://randomuser.me/api/portraits/women/15.jpg", // Jaya 56678
  6:  "https://randomuser.me/api/portraits/men/9.jpg",    // Leo
  7:  "https://randomuser.me/api/portraits/men/23.jpg",   // Test data
  8:  "https://randomuser.me/api/portraits/women/31.jpg", // Test data
  9:  "https://randomuser.me/api/portraits/men/43.jpg",   // Leo
  10: "https://randomuser.me/api/portraits/men/51.jpg",   // James Wilson
  11: "https://randomuser.me/api/portraits/women/79.jpg", // Sara Kim
  12: "https://randomuser.me/api/portraits/men/85.jpg",   // Raj Mehta
};

export const OWNER_AVATARS: Record<string, string> = {
  "PM SDL":    "https://randomuser.me/api/portraits/men/18.jpg",
  "SE User 1": "https://randomuser.me/api/portraits/women/26.jpg",
  "Admin":     "https://randomuser.me/api/portraits/men/45.jpg",
  "Sarah K":   "https://randomuser.me/api/portraits/women/38.jpg",
  "John D":    "https://randomuser.me/api/portraits/men/62.jpg",
  "Ria M":     "https://randomuser.me/api/portraits/women/33.jpg",
};

/** Portraits for the workspace users listed in Settings > Users (key = full name). */
export const USER_AVATARS: Record<string, string> = {
  "PM SDL":                   "https://randomuser.me/api/portraits/men/18.jpg",
  "sdl aug0701":              "https://randomuser.me/api/portraits/men/22.jpg",
  "Rajarajan N":              "https://randomuser.me/api/portraits/men/75.jpg",
  "Admin":                    "https://randomuser.me/api/portraits/men/45.jpg",
  "crmuser":                  "https://randomuser.me/api/portraits/women/12.jpg",
  "Sales manager":            "https://randomuser.me/api/portraits/women/65.jpg",
  "manager sdl":              "https://randomuser.me/api/portraits/men/36.jpg",
  "Support executive user1":  "https://randomuser.me/api/portraits/women/26.jpg",
  "Operation Manager user 1": "https://randomuser.me/api/portraits/men/54.jpg",
  "Support executive user 2": "https://randomuser.me/api/portraits/women/48.jpg",
  "VP Operation User 1":      "https://randomuser.me/api/portraits/men/67.jpg",
};

/** A real portrait for any user: a known one if we have it, otherwise a stable pick based on the name so the same person always gets the same photo. */
export function avatarFor(name: string): string {
  const known = USER_AVATARS[name] ?? OWNER_AVATARS[name];
  if (known) return known;
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `https://randomuser.me/api/portraits/${h % 2 ? "women" : "men"}/${h % 90}.jpg`;
}
