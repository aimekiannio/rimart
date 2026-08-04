import { ProductList } from "@/features/products/product-list";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Search and discover products from local sellers across Meghalaya.
        </p>
      </div>

      <ProductList />
    </main>
  );
}