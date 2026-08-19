# QuadERP landing page

Astro static site, deployed to Vercel at https://www.quaderp.app.

## Deploy config

`vercel.json` sets the cache headers. Without it every asset came back with
Vercel's default `public, max-age=0, must-revalidate`: the CDN cached them but
the browser did not, so a returning visitor revalidated the whole page's assets
on every visit. Content-hashed files under `/_astro/` and the self-hosted fonts
get a year and `immutable`, because a hashed filename cannot go stale: a
changed file is a different URL. Unhashed files from `public/` get a day with
`stale-while-revalidate`. HTML stays `must-revalidate` so a deploy is live
immediately.

**`vercel.json` takes no comments.** Vercel validates it against
https://openapi.vercel.sh/vercel.json, which sets `additionalProperties: false`
at the top level and on every header rule, so a `"//"` key fails the deploy
before anything builds. `$schema` is the only non-functional key allowed. To
check before pushing:

```sh
curl -sS https://openapi.vercel.sh/vercel.json -o /tmp/vercel-schema.json
python3 -c "
import json; from jsonschema import Draft7Validator
print(list(Draft7Validator(json.load(open('/tmp/vercel-schema.json')))
      .iter_errors(json.load(open('vercel.json')))) or 'valid')"
```

Where two rules set the same header key the last match wins, so the `/(.*)`
catch-all here only carries security headers. It must never set
`Cache-Control`, or it would override every specific rule above it.

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
