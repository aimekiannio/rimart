"use client";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "./data";

export function ProductDetailActions({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  return <button type="button" className="button button-dark mt-8" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}>Add to cart +</button>;
}
