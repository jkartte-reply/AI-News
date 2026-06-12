import { getCollection, type CollectionEntry } from 'astro:content';

const DE_MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

/** ISO date (YYYY-MM-DD) parsed from the filename / entry id. */
export function isoFromId(id: string): string {
  return id.slice(0, 10);
}

/** "12. Juni 2026" from an ISO date string. */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${DE_MONTHS[m - 1]} ${y}`;
}

export interface ReportMeta {
  entry: CollectionEntry<'reports'>;
  iso: string;
  slug: string;
  label: string;
}

/** All reports, newest first. Date comes from the filename, not frontmatter. */
export async function getReports(): Promise<ReportMeta[]> {
  const entries = await getCollection('reports');
  return entries
    .map((entry) => {
      const iso = isoFromId(entry.id);
      return { entry, iso, slug: iso, label: fmtDate(iso) };
    })
    .sort((a, b) => b.iso.localeCompare(a.iso));
}

/** Plain-text excerpt from raw markdown, for RSS descriptions. */
export function excerpt(body: string | undefined, max = 280): string {
  if (!body) return '';
  const text = body
    .replace(/^#.*$/gm, '')            // headings
    .replace(/^>\s?/gm, '')            // blockquotes
    .replace(/^\s*\|.*$/gm, '')        // table rows
    .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/`(.+?)`/g, '$1')         // inline code
    .replace(/[#*_>`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}
