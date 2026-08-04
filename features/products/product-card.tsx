import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  seller: string;
  location: string;
  stock: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold">
          {product.name}
        </h2>

        <p className="mt-2 text-lg font-medium">
          ₹{product.price}
        </p>

        <p className="text-sm text-muted-foreground">
          Category: {product.category}
        </p>

        <p className="text-sm text-muted-foreground">
          Seller: {product.seller}
        </p>

        <p className="text-sm text-muted-foreground">
          Location: {product.location}
        </p>

        <p className="mt-2 text-sm">
          Stock: {product.stock}
        </p>
      </CardContent>
    </Card>
  );
}