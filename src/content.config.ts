import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Reports stay at the repo root in Reports/ — read at BUILD TIME, no runtime GitHub API.
// Each .md becomes a collection entry whose id is the filename without extension,
// e.g. "2026-06-12_AI_Weekly". Schema is intentionally loose: reports currently have
// NO frontmatter (that is issue #19). Metadata is derived from the filename instead.
const reports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './Reports' }),
});

export const collections = { reports };
