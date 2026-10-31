import { products as sampleProducts, type Product } from "@/features/products/data";

type ProductInput = Omit<Product, "id"> & { id?: string | number };

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasStoreDatabase = Boolean(supabaseUrl && supabaseKey);

function supabaseHeaders(extra?: HeadersInit): HeadersInit {
  if (!supabaseKey) throw new Error("Store database is not configured.");
  return {
    apikey: supabaseKey,
    ...(supabaseKey.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${supabaseKey}` }),
    "Content-Type": "application/json",
    ...extra,
  };
}

async function databaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl) throw new Error("Store database is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: supabaseHeaders(init?.headers),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Store database request failed (${response.status}): ${message}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function listProducts(includeUnpublished = false): Promise<Product[]> {
  if (!hasStoreDatabase) return sampleProducts;
  const visibility = includeUnpublished ? "" : "&published=eq.true";
  return databaseRequest<Product[]>(
    `products?select=id,name,description,price,category,image,badge,stock,published,created_at&order=created_at.desc${visibility}`,
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const [product] = await databaseRequest<Product[]>("products?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: input.name,
      description: input.description ?? "",
      price: input.price,
      category: input.category,
      image: input.image,
      badge: input.badge,
      stock: input.stock ?? 0,
      published: true,
    }),
  });
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const [product] = await databaseRequest<Product[]>(`products?id=eq.${encodeURIComponent(id)}&select=*`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: input.name,
      description: input.description ?? "",
      price: input.price,
      category: input.category,
      image: input.image,
      badge: input.badge,
      stock: input.stock ?? 0,
      published: true,
    }),
  });
  if (!product) throw new Error("That product could not be found.");
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  await databaseRequest<void>(`products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export type StoreOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  order_items: { product_name: string; unit_price: number; quantity: number }[];
};

export type StoreAnalytics = {
  salesToday: number;
  sales30Days: number;
  ordersToday: number;
  orders30Days: number;
  lifetimeSales: number;
  lifetimeOrders: number;
  averageOrderValue: number;
  ordersToFulfill: number;
  lowStockProducts: number;
  totalProducts: number;
  dailySales: { date: string; sales: number; orders: number }[];
};

export async function getStoreAnalytics(): Promise<StoreAnalytics> {
  return databaseRequest<StoreAnalytics>("rpc/get_store_analytics", {
    method: "POST",
    body: "{}",
  });
}

export async function listOrders(): Promise<StoreOrder[]> {
  return databaseRequest<StoreOrder[]>(
    "orders?select=id,order_number,customer_name,phone,email,address,city,state,pincode,total,status,created_at,order_items(product_name,unit_price,quantity)&order=created_at.desc&limit=100",
  );
}

export async function updateOrderStatus(
  id: string,
  status: StoreOrder["status"],
): Promise<void> {
  await databaseRequest<void>("rpc/update_order_status", {
    method: "POST",
    body: JSON.stringify({ p_order_id: id, p_status: status }),
  });
}

export async function createCashOrder(input: {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { productId: string | number; quantity: number }[];
}): Promise<{ orderNumber: string; total: number }> {
  const [order] = await databaseRequest<{ order_number: string; total: number }[]>(
    "rpc/create_cash_order",
    {
      method: "POST",
      body: JSON.stringify({
        p_customer_name: input.customerName,
        p_phone: input.phone,
        p_email: input.email || null,
        p_address: input.address,
        p_city: input.city,
        p_state: input.state,
        p_pincode: input.pincode,
        p_items: input.items.map((item) => ({
          product_id: String(item.productId),
          quantity: item.quantity,
        })),
      }),
    },
  );
  if (!order) throw new Error("The order was not created.");
  return { orderNumber: order.order_number, total: order.total };
}
