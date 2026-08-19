// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    /* Vercel serves this from www and 308s the apex to it, so www is what
       canonical, og:url and the sitemap all have to agree on. Astro uses this
       to resolve Astro.url and any absolute link it generates. */
    site: 'https://www.quaderp.app',

    build: {
        /* Emit the hashed assets under /_astro/ so vercel.json can hand the
           whole directory an immutable year-long cache. A hashed filename
           cannot go stale: a changed image is a different URL. */
        assets: '_astro',
    },

    image: {
        /* WebP for the screenshots. AVIF is smaller again but costs noticeably
           more to decode on the low-end Android hardware a lot of this
           audience is on, which eats the transfer saving. */
        responsiveStyles: true,
    },
});
