import { ProductList } from "@/features/products/product-list";
import { MainLayout } from "@/components/layout/main-layout";

export default function ProductsPage() {
  return (
    <MainLayout><main className="shop-section">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">The collection</h1>

        <p className="mt-2 text-muted-foreground">
          Clothing, accessories and electronics for your everyday orbit.
        </p>
      </div>

      <ProductList />
    </main></MainLayout>
  );
}
