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

/**
 * Slug rule shared with the app (Signup.jsx) and the API (routes/auth.js),
 * all three mirroring public.slugify from migration 058.
 */
export function planSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A signup link that carries the tier the visitor actually clicked.
 *
 * Without this the pricing table is a lie by omission: every tier pointed at
 * a bare /signup, and the signup page hardcoded "Single Branch", so someone
 * choosing Multi-Branch was told they had picked the cheaper plan.
 *
 * The API re-resolves the slug against platform_plans and falls back to
 * Single Branch if it does not recognise it, so a stale name here shows the
 * wrong label at worst. It can never attach a plan that does not exist.
 */
export function signupUrl(planName?: string): string {
  return planName ? `${SIGNUP_URL}?plan=${planSlug(planName)}` : SIGNUP_URL;
}

/**
 * The origin the site is actually served from.
 *
 * Vercel 308s the apex to www, but canonical and og:url both pointed at the
 * apex, so every crawler and every social scraper was handed a URL that
 * redirects, and the page competed with itself for its own canonical. This is
 * the one place that decides which host is authoritative.
 *
 * If you ever flip Vercel to serve the apex instead, change this and nothing
 * else needs to move.
 */
export const SITE_URL = "https://www.quaderp.app";

/** Absolute URL for a path, for the tags that cannot take a relative one. */
export function absUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
