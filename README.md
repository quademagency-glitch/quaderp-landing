# QuadERP landing page

Astro static site, served by a Cloudflare Worker at https://www.quaderp.app.

## Deploy config

`npm run build` writes the site to `dist/`; `npx wrangler deploy` publishes it
with `worker/index.js` in front (config in `wrangler.jsonc`). Until October 2026
it was on Vercel and `vercel.json` did this job.

The Worker redirects `quaderp.app` to `www.quaderp.app` (308), serves the
contact-form emails at `POST /api/confirm` (`worker/confirm.js`, needs the
`RESEND_API_KEY` secret), and sets the headers. Content-hashed files under
`/_astro/` and the self-hosted fonts get a year and `immutable`, because a
hashed filename cannot go stale: a changed file is a different URL. Unhashed
files from `public/` get a day with `stale-while-revalidate`. HTML stays
`must-revalidate` so a deploy is live immediately.

`PUBLIC_GA_ID` is read at build time, so it is a build variable, not a Worker
secret.

The canonical host is `www`. `src/config/site.ts` holds `SITE_URL`, and
canonical, `og:url` and the sitemap all derive from it.

# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
