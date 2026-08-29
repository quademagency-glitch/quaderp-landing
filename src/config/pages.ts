/**
 * Every URL this site publishes, in one place.
 *
 * The site was a single page for a long time, and that was defensible while
 * there was one thing to say. It stopped being defensible once the page was
 * carrying a comparison against three foreign products, two worked examples
 * and a loss-prevention pitch, all inside one URL that could only ever rank
 * for the brand name. These are those sections given somewhere to live.
 *
 * This record feeds the footer, the related-links block and the sitemap, so a
 * page cannot exist without appearing in all three. Adding a file under
 * src/pages/ and forgetting to link it is the normal way an orphan page
 * happens, and an orphan page is one nothing crawls and nobody finds.
 *
 * A note on what is not here: the homepage owns "shop management software"
 * and "store management software". No page below repeats that, because a
 * second page aimed at the same phrase would compete with the strongest URL
 * on the site rather than adding to it.
 */

export interface PageMeta {
  /** Always with a trailing slash. Astro emits directories, so a link without
      one takes the visitor through a redirect for no reason. */
  path: string;
  title: string;
  description: string;
  h1: string;
  /** The sentence under the h1. Also the fallback social description. */
  intro: string;
  /** Short label for the footer. */
  nav: string;
  group: "solutions" | "compare" | "company";
  /** Other pages worth reading next, by key. */
  related: string[];
}

export const PAGES: Record<string, PageMeta> = {
  "pos-system-ghana": {
    path: "/pos-system-ghana/",
    title: "POS System for Shops in Ghana | QuadERP",
    description:
      "A point of sale that runs in the browser on the phone or laptop you already own. Mobile Money, cedis, and it sells when the network drops. Free 30 days.",
    h1: "A POS System Built for How Ghanaian Shops Actually Sell",
    intro:
      "No terminal to buy, no card reader to wait for. It runs in the browser on the phone or laptop you already have, records Mobile Money beside cash and card, and keeps working when the network goes.",
    nav: "POS system",
    group: "solutions",
    related: ["inventory-management-software", "accounting-software-ghana", "security-and-uptime"],
  },
  "inventory-management-software": {
    path: "/inventory-management-software/",
    title: "Inventory Management Software for Small Businesses | QuadERP",
    description:
      "Know what is in stock, in every branch, without counting. Reorder alerts, stock takes on a phone, and transfers between shops. For small retail in Ghana.",
    h1: "Stop Finding Out You Are Out of Stock From a Customer",
    intro:
      "Counts that match the shelf, alerts before a fast mover runs dry, and one number for stock across every branch you run.",
    nav: "Inventory",
    group: "solutions",
    related: ["pos-system-ghana", "accounting-software-ghana", "security-and-uptime"],
  },
  "accounting-software-ghana": {
    path: "/accounting-software-ghana/",
    title: "Accounting Software for Ghanaian Retail Businesses | QuadERP",
    description:
      "Invoices, who owes you, what you owe, expenses with approval, and a profit and loss you can read. Priced in cedis. Read what it does not do before you buy.",
    h1: "The Money Side, Without a Second System",
    intro:
      "Invoices go out, debts get chased, expenses need approving, and profit stops being a number you work out at the end of the month with a calculator.",
    nav: "Accounting",
    group: "solutions",
    related: ["pos-system-ghana", "inventory-management-software", "security-and-uptime"],
  },
  "quickbooks-alternative-ghana": {
    path: "/quickbooks-alternative-ghana/",
    title: "A QuickBooks Alternative for Ghanaian Shops | QuadERP",
    description:
      "QuickBooks does your books. It does not run your till, your stock or your branches. QuadERP is one system for the shop floor and the money, priced in cedis.",
    h1: "QuickBooks Does the Books. It Does Not Run the Shop.",
    intro:
      "If you sell across a counter, accounting software is only half of what you need. Here is the honest difference, and where QuickBooks is still the better answer.",
    nav: "vs QuickBooks",
    group: "compare",
    related: ["odoo-alternative-ghana", "sage-alternative-ghana", "accounting-software-ghana"],
  },
  "odoo-alternative-ghana": {
    path: "/odoo-alternative-ghana/",
    title: "An Odoo Alternative for Ghanaian Retail | QuadERP",
    description:
      "Odoo can do almost anything, once someone configures it. QuadERP does retail, set up by us, working the same week. An honest comparison for Ghanaian shops.",
    h1: "Odoo Can Do Anything. That Is the Problem.",
    intro:
      "Odoo is a serious system with a serious setup. If you have an implementation partner and a budget for one, it may well beat this. If you have a shop to run, read on.",
    nav: "vs Odoo",
    group: "compare",
    related: ["quickbooks-alternative-ghana", "sage-alternative-ghana", "pos-system-ghana"],
  },
  "sage-alternative-ghana": {
    path: "/sage-alternative-ghana/",
    title: "A Sage Alternative for Shops in Ghana | QuadERP",
    description:
      "Sage is built for accountants. QuadERP is built for the person behind the counter and the owner checking takings from home. Priced in cedis, set up by us.",
    h1: "Sage Was Built for Your Accountant, Not for You",
    intro:
      "That is not a criticism of Sage. It is a question of who has to use the thing every day, and what happens on the shop floor while they do.",
    nav: "vs Sage",
    group: "compare",
    related: ["quickbooks-alternative-ghana", "odoo-alternative-ghana", "accounting-software-ghana"],
  },
  "security-and-uptime": {
    path: "/security-and-uptime/",
    title: "Security, Outages and Your Data | QuadERP",
    description:
      "What happens when the network drops or the power goes, who can see your data, where it is kept, and how to take it with you. Including the limits.",
    h1: "What Happens When the Network Goes Down",
    intro:
      "Putting your till in a browser raises fair questions. Here are the answers, including the parts that are not reassuring.",
    nav: "Security and uptime",
    group: "company",
    related: ["pos-system-ghana", "inventory-management-software", "accounting-software-ghana"],
  },
};

/** Ordered list, for the sitemap and anywhere else that wants all of them. */
export const ALL_PAGES: PageMeta[] = Object.values(PAGES);

export function pagesInGroup(group: PageMeta["group"]): PageMeta[] {
  return ALL_PAGES.filter((p) => p.group === group);
}
