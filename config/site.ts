export const siteConfig = {
  name: "GALACTIC",
  company: "GALACTIC",
  description: "A considered collection of clothing, accessories and electronics. Made for wherever you’re headed.",
  tagline: "Objects for a new orbit.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
