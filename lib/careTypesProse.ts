/**
 * Turn raw Google-style category labels into short phrases for directory prose.
 * Keeps locksmith, lock and key, and related services; drops unrelated map noise.
 */

/** Display brand matching production domain locksmithsdirectories.com */
export const DIRECTORY_BRAND_NAME = "LocksmithsDirectories.com";

/** Support email for listings, advertising, and privacy requests (replaces legacy network addresses). */
export const DIRECTORY_SUPPORT_EMAIL = "hello@directoriesnetwork.com";

const EXACT_PHRASE: Record<string, string> = {
  "locksmith service": "locksmith services",
  "emergency locksmith": "emergency locksmiths",
  "residential locksmith": "residential locksmiths",
  "commercial locksmith": "commercial locksmiths",
  "automotive locksmith": "automotive locksmiths",
  "key cutting": "key cutting",
  "key replacement": "key replacement",
  "lock repair": "lock repair",
  rekey: "rekeying",
  "high security lock": "high security locks",
  "car key": "car keys",
  "transponder key": "transponder keys",
  "door lock": "door locks",
  "master key": "master key systems",
  "safe service": "safe services",
};

const LOCKSMITH_LIKE =
  /lock|key|rekey|safe|door|transpond|car\s*key|ignition|padlock|deadbolt|high\s*sec|master\s*key|emergency|residential|commercial|automotive|locksmith/i;

/** Map categories that are clearly not locksmith businesses. */
const NON_LOCKSMITH =
  /tattoo|piercing|body\s*art|salon|barber|plumber|restaurant|gas\s+station|auto\s+repair|church|hotel|gym|dentist|veterinar|nail\s+salon|funeral|coffee|pizza|liquor/i;

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function humanizeFallback(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "";
  if (s.endsWith(" service")) {
    return `${s.slice(0, -" service".length)} services`;
  }
  if (s.endsWith(" clinic")) {
    return s.replace(/ clinic$/, " clinics");
  }
  if (s.endsWith(" center")) {
    return s.replace(/ center$/, " centers");
  }
  if (s.endsWith("ist") && !s.endsWith("onomist")) {
    return `${s}s`;
  }
  if (!s.endsWith("s")) {
    return `${s}s`;
  }
  return s;
}

function phraseForLabel(raw: string): string | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (NON_LOCKSMITH.test(key)) return null;
  if (EXACT_PHRASE[key]) return EXACT_PHRASE[key];
  if (!LOCKSMITH_LIKE.test(raw)) return null;
  return humanizeFallback(raw);
}

function oxfordJoin(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * @param careTypes Raw labels from listings (dedupe before calling if needed).
 * @param maxItems Cap how many categories appear in the sentence (default 5).
 * @returns Clause starting with "including …" or a neutral fallback.
 */
export function formatCareTypesClause(
  careTypes: string[],
  maxItems = 5,
): string {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of careTypes) {
    const p = phraseForLabel(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    phrases.push(p);
    if (phrases.length >= maxItems) break;
  }
  if (phrases.length === 0) {
    return "including emergency locksmith, residential locksmith, commercial locksmith, automotive locksmith, key cutting, and lock repair";
  }
  return `including ${oxfordJoin(phrases)}`;
}

/** Schema.org `Thing` entries for primary locksmith categories on this directory. */
export function locksmithCategorySchemaThings(): {
  "@type": "Thing";
  name: string;
}[] {
  return [
    { "@type": "Thing", name: "Locksmith" },
    { "@type": "Thing", name: "Residential Locksmith" },
    { "@type": "Thing", name: "Commercial Locksmith" },
    { "@type": "Thing", name: "Automotive Locksmith" },
    { "@type": "Thing", name: "Emergency Locksmith" },
    { "@type": "Thing", name: "Key Cutting Service" },
  ];
}

/** Default sentence when no care-type stats exist (FAQ answers, etc.). */
export const DEFAULT_LOCKSMITH_CARE_TYPES_SENTENCE =
  "Locksmith, Residential Locksmith, Commercial Locksmith, Automotive Locksmith, Emergency Locksmith, Key Cutting Service";
