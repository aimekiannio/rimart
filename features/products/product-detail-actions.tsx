"use client";

import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "./data";

export function ProductDetailActions({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const soldOut = typeof product.stock === "number" && product.stock < 1;
  return <button type="button" disabled={soldOut} className="button button-dark mt-8 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}>{soldOut ? "Sold out" : "Add to cart +"}</button>;
}
