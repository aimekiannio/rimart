import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductDetailActions } from "@/features/products/product-detail-actions";
import { products } from "@/features/products/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === Number(id));

  return (
    <MainLayout>
      <main className="cart-page">
        {product ? <>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="mt-5 text-2xl">₹{product.price.toLocaleString("en-IN")}</p>
          <ProductDetailActions product={product} />
        </> : <>
          <h1>Piece not found</h1>
          <Link href="/" className="button button-dark mt-5">Back to store</Link>
        </>}
      </main>
    </MainLayout>
  );
}
