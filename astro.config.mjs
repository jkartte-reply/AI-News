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

// GitHub Pages: served at https://jkartte-reply.github.io/AI-News/
// -> site = origin, base = repo subpath. import.meta.env.BASE_URL becomes "/AI-News/".
export default defineConfig({
  site: 'https://jkartte-reply.github.io',
  base: '/AI-News',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [rehypeTableWrap],
  },
});
