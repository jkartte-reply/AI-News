import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getReports, excerpt } from '../lib/reports';

// Build-time RSS feed (covers issue #15's core). Served at /AI-News/rss.xml
export async function GET(context: APIContext) {
  const reports = await getReports();
  const base = import.meta.env.BASE_URL; // "/AI-News/"

  return rss({
    title: 'AI Weekly News',
    description: 'Wöchentliche KI-Neuigkeiten für AI Engineers im Microsoft Partner Umfeld',
    site: context.site ?? 'https://jkartte-reply.github.io',
    items: reports.map((r) => ({
      title: `AI Weekly — ${r.label}`,
      pubDate: new Date(r.iso),
      link: `${base}reports/${r.slug}/`,
      description: excerpt(r.entry.body),
    })),
    customData: '<language>de</language>',
  });
}
