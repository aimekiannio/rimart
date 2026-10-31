"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "./data";
import { assetPath } from "@/lib/asset-path";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  function add() {
    addToCart({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="product-card">
      <div className="product-visual"><Image src={assetPath(product.image)} alt={product.name} fill sizes="(max-width: 680px) 48vw, 25vw" className="product-image" /></div>
      <div className="product-info"><div><h3 className="product-name">{product.name}</h3><p className="product-price">₹{product.price.toLocaleString("en-IN")}</p></div><button className="add-button" type="button" onClick={add} aria-label={`Add ${product.name} to cart`}>{added ? <Check size={19} /> : <Plus size={19} />}</button></div>
    </article>
  );
}
