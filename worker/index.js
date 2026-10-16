// Cloudflare Worker for www.quaderp.app (and quaderp.app, which redirects).
//
// Astro builds a static site into dist/, served here through the ASSETS
// binding. Every request comes through this file first (run_worker_first in
// wrangler.jsonc) so it can do what Vercel did outside the app:
//
//   1. quaderp.app -> www.quaderp.app, 308. www is the canonical host: see
//      `site` in astro.config.mjs.
//   2. POST /api/confirm, the contact-form emails (worker/confirm.js).
//   3. The cache and security headers that used to live in vercel.json.

import { confirm } from './confirm.js';

const APEX = 'quaderp.app';

const SECURITY = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
};

/** Same rules vercel.json had. Anything else keeps the default. */
function cacheControl(pathname) {
    if (pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/')) {
        // Hashed or versioned files: a changed file is a different URL.
        return 'public, max-age=31536000, immutable';
    }
    if (
        pathname.startsWith('/images/') ||
        /^\/(favicon\.ico|favicon\.svg|apple-touch-icon\.png|robots\.txt|sitemap\.xml)$/.test(pathname)
    ) {
        return 'public, max-age=86400, stale-while-revalidate=604800';
    }
    return null;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.hostname === APEX) {
            url.hostname = `www.${APEX}`;
            return Response.redirect(url.toString(), 308);
        }

        const isConfirm = url.pathname === '/api/confirm' || url.pathname === '/api/confirm/';
        const upstream = isConfirm ? await confirm(request, env) : await env.ASSETS.fetch(request);

        // Responses from the assets binding have immutable headers.
        const res = new Response(upstream.body, upstream);
        for (const [k, v] of Object.entries(SECURITY)) res.headers.set(k, v);
        const cc = !isConfirm && res.ok ? cacheControl(url.pathname) : null;
        if (cc) res.headers.set('Cache-Control', cc);
        return res;
    },
};
