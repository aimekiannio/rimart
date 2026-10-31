# GALACTIC store setup

This guide connects the code to a real database and the full-stack host. The current GitHub Pages site stays online while this is being set up.

## 1. Create the database

1. Create a Supabase account and a project named **GALACTIC**.
2. In the project, open **SQL Editor** → **New query**.
3. Open `supabase/schema.sql` in this repository, copy the whole file into the query, and click **Run**. This creates the tables, adds the four sample products, and installs the protected cash-order transaction.
4. Open **Project Settings → API Keys**. Copy the **Project URL** and the new **Secret key**. The secret key begins with `sb_secret_`. Keep it private; it grants full database access.

## 2. Try the manager on this computer

1. Copy `.env.example` to a new file named `.env.local` in the project folder.
2. Fill in `SUPABASE_URL` and `SUPABASE_SECRET_KEY` from Supabase.
3. Choose an owner email, a long unique password, and a random secret of at least 32 characters for `GALACTIC_SESSION_SECRET`.
4. In Terminal, open the project folder and run `npm run dev`.
5. Visit `http://localhost:3000/admin` to sign in. Add or update products there. Place a test order from the storefront; it should appear under **Orders**.

Never send the Supabase secret key or owner password in chat or commit `.env.local` to Git. The project ignores that file.

## 3. Prepare Cloudflare deployment

The Cloudflare Worker runs the server endpoints that GitHub Pages cannot run.

1. Create a Cloudflare account and a Workers API token with permission to edit Workers for your account. Find your account ID in the Cloudflare dashboard.
2. In GitHub, open the repository’s **Settings → Secrets and variables → Actions**. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets.
3. After the existing Pages workflow has been replaced, add a repository variable named `CF_DEPLOY_ENABLED` with value `true`. The workflow in `.github/workflows/deploy-cloudflare.yml` will create the Worker on its first successful run.
4. In Cloudflare, open **Workers & Pages → galactic-storefront → Settings → Variables and Secrets**. Add the five values from `.env.local` as encrypted secrets. Redeploy once after adding them.

Do not enable the Cloudflare deploy workflow or merge this full-stack version to `main` until the existing Pages publishing workflow has been replaced. The Pages workflow only builds static files and cannot build this server-backed app.

## Free-plan limits

Cloudflare Workers Free currently allows up to 100,000 requests per day. Supabase Free currently includes 500 MB of database storage, but pauses projects after a week of low activity. These free plans are useful for trying the system; a shop that needs to stay available all the time should use a paid database plan and review the latest limits before accepting real orders.
