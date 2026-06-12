// @ts-check
import { defineConfig } from 'astro/config';

// Wraps every <table> in <div class="table-wrap"> so wide report tables can scroll
// horizontally instead of being clipped at the right edge (issue #22).
// Dependency-free hast walker — no unist-util-visit needed.
function rehypeTableWrap() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

// Gives every h2/h3 a stable, slug-based id so sections can be deep-linked
// (#10 Copy-Link pro Sektion) and listed in the TOC (#09). Dependency-free:
// gathers the heading text, slugifies it (umlaut-safe) and dedupes per page.
function rehypeHeadingIds() {
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/&/g, ' und ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const textOf = (node) => {
    if (node.type === 'text') return node.value;
    if (node.children) return node.children.map(textOf).join('');
    return '';
  };

  return (tree) => {
    const seen = new Map();
    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (
          child.type === 'element' &&
          (child.tagName === 'h2' || child.tagName === 'h3') &&
          !(child.properties && child.properties.id)
        ) {
          let slug = slugify(textOf(child)) || 'abschnitt';
          const n = seen.get(slug) ?? 0;
          seen.set(slug, n + 1);
          if (n > 0) slug = `${slug}-${n}`;
          child.properties = { ...(child.properties || {}), id: slug };
        }
        walk(child);
      }
    };
    walk(tree);
  };
}

// GitHub Pages: served at https://jkartte-reply.github.io/AI-News/
// -> site = origin, base = repo subpath. import.meta.env.BASE_URL becomes "/AI-News/".
export default defineConfig({
  site: 'https://jkartte-reply.github.io',
  base: '/AI-News',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [rehypeHeadingIds, rehypeTableWrap],
  },
});
