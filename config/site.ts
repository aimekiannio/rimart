export const siteConfig = {
  name: "RiMart",
  company: "Niovex",
  description:
    "RiMart helps local businesses become digitally accessible. Search for products and discover nearby local sellers who have them.",
  tagline: "Your Local Market, Digitally Connected.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
