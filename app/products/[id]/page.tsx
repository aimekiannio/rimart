"use client";

import { use } from "react";
import { products } from "@/features/products/data";
import { useCartStore } from "@/features/cart/cart-store";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const addToCart = useCartStore((state) => state.addToCart);
  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <MainLayout><main className="cart-page"><h1>Piece not found</h1></main></MainLayout>
    );
  }

  return (
    <MainLayout><main className="cart-page">
      <p className="eyebrow">{product.category}</p><h1>{product.name}</h1>
      <p className="mt-5 text-2xl">₹{product.price.toLocaleString("en-IN")}</p>
      <div className="mt-8"><Button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}>Add to Cart</Button></div>
    </main></MainLayout>
  );
}
