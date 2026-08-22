import type { APIRoute } from 'astro';
import { ALL_PAGES } from '../config/pages';
import { SITE_URL, absUrl } from '../config/site';

/**
 * The sitemap, generated from src/config/pages.ts.
 *
 * It used to be a hand-written file in public/ listing one URL, which was
 * accurate for exactly as long as this site had one page. A hand-written
 * sitemap is wrong the moment somebody adds a route and forgets it, and the
 * failure is silent: the page simply never gets crawled.
 *
 * Not @astrojs/sitemap, deliberately. It would be the first integration in a
 * config that has none, and it emits /sitemap-index.xml, so robots.txt would
 * need changing and the stale public/sitemap.xml would still be served at the
 * URL robots points at. Fifteen lines here keeps the existing /sitemap.xml
 * URL and stays single-sourced with the footer and the related-links block.
 *
 * No lastmod. An invented date is worse than none: it tells crawlers to come
 * back for a page that has not changed, and they learn to stop believing it.
 */
export const GET: APIRoute = () => {
  const urls = [SITE_URL + '/', ...ALL_PAGES.map((page) => absUrl(page.path))];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
