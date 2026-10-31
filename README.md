# GALACTIC

GALACTIC is a monochrome storefront with an owner dashboard, inventory tracking, shared orders, and cash-on-delivery checkout.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, copy `.env.example` to `.env.local` and add the connection details for your Supabase project. Keep `.env.local` private; it is ignored by Git.
3. Run `npm install` once.
4. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
5. Open `/admin` to sign in, add products, and manage orders.

## Database setup

Create a Supabase project, open **SQL Editor**, and run the complete contents of `supabase/schema.sql`. The script creates the product, order, and order-item tables, adds sample products, and creates the server-side order function.

Use the project URL and **secret API key** as server-only secrets. Never put the secret key in a `NEXT_PUBLIC_` variable or commit it to Git. Set the owner email, a long unique admin password, and a random session secret too. Supabase is transitioning away from its old `service_role` keys, so use the new secret key for this project.

For local development, put these values in `.env.local`. For Cloudflare, add them as encrypted Worker secrets in **Workers & Pages → galactic-storefront → Settings → Variables and Secrets**:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `GALACTIC_ADMIN_EMAIL`
- `GALACTIC_ADMIN_PASSWORD`
- `GALACTIC_SESSION_SECRET`

## Hosting

The live GitHub Pages version is a static storefront. It cannot run the secure API routes required for shared product inventory, owner sign-in, and saved orders. The full store uses the Cloudflare Workers adapter for this Next.js app. Cloudflare's current Free Workers plan includes up to 100,000 requests per day; check its limits before relying on it for a busy shop. Supabase Free includes 500 MB for the database, but projects can pause after a week of low activity, so it is suitable for a pilot rather than a guaranteed always-on shop.

Cloudflare deployment configuration is in `wrangler.jsonc`, `open-next.config.ts`, and `.github/workflows/deploy-cloudflare.yml`. Once Cloudflare account secrets and the `CF_DEPLOY_ENABLED=true` repository variable are set, pushes to `main` deploy the full-stack store. GitHub Pages stays on its current published version during setup.

## Current checkout

Orders use cash on delivery. The order function validates prices and stock in the database transaction so visitors cannot change the price in their browser or order more stock than is available. Online card payments, shipping integrations, tax configuration, and customer accounts are not included yet.
