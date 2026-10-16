/**
 * The links that leave this site for the app.
 *
 * SIGNUP_URL used to be declared twice, once in index.astro and once in
 * Layout.astro, with nothing keeping the two in step. They happened to
 * agree, but a wrong URL in either place is a lost signup that looks like
 * nothing is wrong, so both now import from here.
 */
export const APP_URL = "https://app.quaderp.app";

export const SIGNUP_URL = `${APP_URL}/signup`;

/**
 * `?demo=1` is a contract with the app, not a decoration: Login.jsx reads it
 * and signs the visitor into the sandbox automatically. Dropping the query
 * string leaves them staring at a login form with no credentials.
 */
export const DEMO_URL = `${APP_URL}/login?demo=1`;

/*
 * There is no plan parameter any more. Until 8 October 2026 the pricing cards
 * sent `?plan=<slug>` so the signup page showed the tier the visitor had
 * clicked (Single Branch or Multi-Branch). Since then there is one plan, the
 * app's Signup page ignores `?plan=` on older links, and nothing here sends
 * it. planSlug() and signupUrl(planName) went with it; the JSON-LD Offer uses
 * SIGNUP_URL directly.
 */

interface AppLinkOptions {
  /** Which control was clicked: nav, mobile-nav, hero, pricing, closing. */
  cta?: string;
  /** The page the click came from. Pass Astro.url.pathname. */
  lp?: string;
  /** Defaults to signup. Pass DEMO_URL to decorate a sandbox link. */
  base?: string;
}

/**
 * An app-bound link that says where it came from.
 *
 * The two sites are separate origins, so nothing is shared between them: no
 * storage, no cookie, no analytics session. Before these parameters the only
 * thing that crossed was `?plan`, which meant a finished signup could never be
 * traced to the page, the section or the campaign that produced it. Every
 * question worth asking about this funnel ends at the domain boundary.
 *
 * Never used for the JSON-LD, which takes the bare SIGNUP_URL for Offer.url.
 * Schema URLs have to stay canonical, and a tracking parameter in structured
 * data is both noise and a duplicate-URL signal.
 *
 * Campaign parameters are not added here. They are only knowable at runtime,
 * so Layout.astro appends them on load. This half is build-time, so it
 * survives a visitor with JavaScript off.
 */
export function appHref(options: AppLinkOptions = {}): string {
  const { cta, lp, base = SIGNUP_URL } = options;
  const url = new URL(base);
  if (cta) url.searchParams.set("cta", cta);
  if (lp) url.searchParams.set("lp", lp);
  return url.href;
}

/**
 * The origin the site is actually served from.
 *
 * The apex 308s to www (worker/index.js), but canonical and og:url once pointed at the
 * apex, so every crawler and every social scraper was handed a URL that
 * redirects, and the page competed with itself for its own canonical. This is
 * the one place that decides which host is authoritative.
 *
 * If you ever serve the apex instead, change this and the redirect in
 * worker/index.js.
 */
export const SITE_URL = "https://www.quaderp.app";

/** Absolute URL for a path, for the tags that cannot take a relative one. */
export function absUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The WhatsApp number every "chat with us" link on the site opens.
 *
 * International format, no plus and no spaces, which is what wa.me takes.
 * 0209027276 becomes 233209027276: drop the leading zero, prefix 233.
 *
 * It lived as a `const whatsappNumber` in both index.astro and Layout.astro,
 * declared separately with no connection between them, so changing the number
 * meant changing it twice and half the site would have kept pointing at the
 * old one if either was missed. A fourth copy is in worker/confirm.js, which
 * is built separately from Astro and does not import this file; that one
 * carries a comment pointing back here.
 */
export const WHATSAPP_NUMBER = "233209027276";

/** The message pre-filled when someone opens the chat. */
export const WHATSAPP_MESSAGE =
  "Hi Quadem! I'm interested in QuadERP for my store. Can we talk?";

/** wa.me link with the message already typed. */
export const WHATSAPP_LINK =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
