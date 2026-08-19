/**
 * Conversion tracking.
 *
 * The page had none. Ahrefs' script counts pageviews and nothing else, so
 * there was no way to tell a visit that bounced off the hero from one that
 * read the whole page, opened the demo and then balked at the setup fee.
 * "The landing page converts badly" was unfalsifiable.
 *
 * This is deliberately provider-agnostic. Every event is pushed to
 * `window.dataLayer`, which is what GA4, Google Tag Manager and most others
 * read, so wiring a provider later is a matter of setting PUBLIC_GA_ID (or
 * pasting a GTM snippet) rather than re-instrumenting the markup.
 *
 * With no provider configured the calls are harmless: the events queue on
 * dataLayer and nothing ships them anywhere.
 */

/** Set PUBLIC_GA_ID in Vercel to start sending. Unset = queue only, no network. */
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? "";

/**
 * The events worth having. Kept as a closed list so the names in the markup
 * and the names in the reports cannot drift apart.
 *
 * The funnel these are meant to answer, in order:
 *   how many arrived  ->  page_view          (Ahrefs already has this)
 *   how many engaged  ->  demo_open
 *   how many priced   ->  pricing_view
 *   how many asked    ->  lead_submit / whatsapp_click
 *   how many started  ->  trial_start
 */
export const EVENTS = {
  TRIAL_START: "trial_start",
  DEMO_OPEN: "demo_open",
  PRICING_VIEW: "pricing_view",
  PLAN_SELECT: "plan_select",
  WHATSAPP_CLICK: "whatsapp_click",
  LEAD_SUBMIT: "lead_submit",
  CALL_BOOK: "call_book",
} as const;
