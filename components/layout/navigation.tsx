"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { useCartStore } from "@/features/cart/cart-store";
import { assetPath } from "@/lib/asset-path";

export function Navigation() {
  const count = useCartStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="GALACTIC home">
        <Image src={assetPath("galactic-logo.png")} alt="GALACTIC" width={794} height={410} priority className="brand-logo" />
      </Link>
      <nav className="header-nav" aria-label="Main navigation">
        <Link className="nav-home" href="/">Home</Link>
        <Link href="/#shop">Shop <span className="chevron">⌄</span></Link>
        <Link className="nav-categories" href="/#shop">Categories <span className="chevron">⌄</span></Link>
        <Link className="nav-about" href="/#about">About</Link>
        <Link className="nav-contact" href="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <Link href="/#shop" aria-label="Search the collection"><Search size={21} strokeWidth={1.8} /></Link>
        <span className="action-divider" />
        <Link href="/login" aria-label="Your account"><UserRound size={21} strokeWidth={1.8} /></Link>
        <span className="action-divider" />
        <Link href="/cart" className="bag-action" aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={21} strokeWidth={1.8} /><span className="bag-count">{count}</span></Link>
      </div>
    </header>
  );
}
