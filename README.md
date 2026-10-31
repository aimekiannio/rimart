# GALACTIC

A lean, monochrome storefront for clothing, accessories and electronics. Product listings are local sample data and the cart is saved in the browser; no paid service or account is needed to run the storefront.

## Run locally

1. Install Node.js 20 or newer.
2. Open a terminal in this project folder.
3. Run `npm install` once.
4. Run `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).

Edit the catalog in `features/products/data.ts`. The storefront layout and styling are in `app/page.tsx` and `app/globals.css`.

## Publish on GitHub Pages

The `main` branch builds and deploys the static site through GitHub Actions. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The next successful workflow run publishes the site at `https://aimekiannio.github.io/rimart/`.

The Pages version is a static storefront. Product browsing and the cart run in the visitor’s browser; server-backed checkout and accounts are not included.
