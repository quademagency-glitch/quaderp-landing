/**
 * Conversion tracking.
 *
 * The page had none. Ahrefs' script counts pageviews and nothing else, so
 * there was no way to tell a visit that bounced off the hero from one that
 * read the whole page, opened the demo and then balked at the setup fee.
 * "The landing page converts badly" was unfalsifiable.
 *
 * This is deliberately provider-agnostic. Every event is pushed to
 * `window.dataLayer` as an object, which is the shape a Google Tag Manager
 * container reads, so pasting a GTM snippet needs no change here.
 *
 * GA4 is the trap, and this file used to describe it wrongly. gtag.js does
 * not read object pushes. It only processes entries shaped like an
 * `arguments` object, so the layout hands every event to gtag('event', ...)
 * as well. Setting PUBLIC_GA_ID without that bridge gives you pageviews and
 * not one of the events below, while looking configured from the dashboard.
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
