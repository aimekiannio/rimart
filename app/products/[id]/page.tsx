"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductDetailActions } from "@/features/products/product-detail-actions";
import { products as sampleProducts, type Product } from "@/features/products/data";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    params.then(({ id: productId }) => {
      if (!active) return;
      setId(productId);
      setProduct(sampleProducts.find((item) => String(item.id) === productId) ?? null);
      fetch("/api/products", { cache: "no-store" })
        .then((response) => response.ok ? response.json() as Promise<Product[]> : [])
        .then((items) => {
          if (active) setProduct(items.find((item) => String(item.id) === productId) ?? null);
        })
        .catch(() => undefined)
        .finally(() => { if (active) setLoading(false); });
    });
    return () => { active = false; };
  }, [params]);

  return (
    <MainLayout>
      <main className="cart-page">
        {product ? <>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          {product.description && <p className="mt-5 max-w-xl text-muted-foreground">{product.description}</p>}
          <p className="mt-5 text-2xl">₹{product.price.toLocaleString("en-IN")}</p>
          {typeof product.stock === "number" && <p className="mt-2 text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</p>}
          <ProductDetailActions product={product} />
        </> : loading ? <p>Loading piece…</p> : <>
          <h1>Piece not found</h1>
          <p className="mt-3 text-muted-foreground">{id ? "This piece may have been removed from the collection." : ""}</p>
          <Link href="/" className="button button-dark mt-5">Back to store</Link>
        </>}
      </main>
    </MainLayout>
  );
}
