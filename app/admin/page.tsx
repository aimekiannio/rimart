"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import type { Product } from "@/features/products/data";
import type { StoreOrder } from "@/lib/store-api";

const categories = ["Clothing", "Accessories", "Electronics"] as const;
const orderStatuses: StoreOrder["status"][] = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const emptyProduct = { name: "", description: "", category: "Clothing", price: "", stock: "", image: "/orbit-tee.png", badge: "New" };

async function readError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return typeof body.error === "string" ? body.error : "That action could not be completed.";
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [productsResponse, ordersResponse] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
    ]);
    if (!productsResponse.ok) throw new Error(await readError(productsResponse));
    if (!ordersResponse.ok) throw new Error(await readError(ordersResponse));
    setProducts(await productsResponse.json() as Product[]);
    setOrders(await ordersResponse.json() as StoreOrder[]);
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (result: { authenticated: boolean }) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) await loadDashboard();
      })
      .catch(() => undefined)
      .finally(() => setChecking(false));
  }, [loadDashboard]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error(await readError(response));
      setAuthenticated(true); setPassword(""); await loadDashboard();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Could not sign in.");
    } finally { setBusy(false); }
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false); setProducts([]); setOrders([]);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId, price: Number(form.price), stock: Number(form.stock) }),
      });
      if (!response.ok) throw new Error(await readError(response));
      setMessage(editingId ? "Product updated." : "Product added to your store.");
      setEditingId(null); setForm(emptyProduct); await loadDashboard();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Product could not be saved.");
    } finally { setBusy(false); }
  }

  function editProduct(product: Product) {
    setEditingId(String(product.id));
    setForm({ name: product.name, description: product.description ?? "", category: product.category, price: String(product.price), stock: String(product.stock ?? 0), image: product.image, badge: product.badge });
    setMessage(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeProduct(id: string | number) {
    setError(""); setMessage("");
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!response.ok) { setError(await readError(response)); return; }
    setMessage("Product removed from the store."); await loadDashboard();
  }

  async function changeOrderStatus(id: string, status: StoreOrder["status"]) {
    setError("");
    const response = await fetch("/api/admin/orders", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }),
    });
    if (!response.ok) { setError(await readError(response)); return; }
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setMessage("Order status updated.");
  }

  return <MainLayout><main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-6">
      <div><p className="eyebrow">GALACTIC COMMERCE</p><h1 className="text-4xl font-medium tracking-tight sm:text-5xl">Store manager</h1><p className="mt-2 text-sm text-muted-foreground">Products, stock, and customer orders.</p></div>
      {authenticated && <button onClick={signOut} className="rounded-full border px-4 py-2 text-sm">Sign out</button>}
    </div>

    {checking ? <p className="py-12 text-sm text-muted-foreground">Opening your store manager…</p> : !authenticated ? <section className="mx-auto mt-12 max-w-md rounded-2xl border p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">Owner sign-in</h2><p className="mt-2 text-sm text-muted-foreground">Use the owner email and password configured for this store.</p>
      <form className="mt-6 space-y-4" onSubmit={signIn}>
        <label className="grid gap-2 text-sm">Owner email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-md border px-3 py-3" /></label>
        <label className="grid gap-2 text-sm">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border px-3 py-3" /></label>
        {error && <p role="alert" className="rounded-md bg-gray-100 p-3 text-sm">{error}</p>}
        <button disabled={busy} className="button button-dark w-full justify-center disabled:opacity-50">{busy ? "Signing in…" : "Sign in →"}</button>
      </form>
    </section> : <>
      {error && <p role="alert" className="mt-5 rounded-md bg-gray-100 p-3 text-sm">{error}</p>}
      {message && <p role="status" className="mt-5 rounded-md border p-3 text-sm">{message}</p>}
      <div className="mt-8 flex gap-2 border-b">
        <button onClick={() => setTab("products")} className={`px-4 py-3 text-sm ${tab === "products" ? "border-b-2 border-black font-semibold" : "text-muted-foreground"}`}>Products ({products.length})</button>
        <button onClick={() => setTab("orders")} className={`px-4 py-3 text-sm ${tab === "orders" ? "border-b-2 border-black font-semibold" : "text-muted-foreground"}`}>Orders ({orders.length})</button>
      </div>

      {tab === "products" ? <div className="grid gap-8 py-8 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
        <section className="h-fit rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{editingId ? "Edit product" : "Add a product"}</h2>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }} className="text-sm underline">Cancel edit</button>}</div>
          <form onSubmit={saveProduct} className="space-y-4">
            <label className="grid gap-2 text-sm">Product name<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-md border px-3 py-2.5" /></label>
            <label className="grid gap-2 text-sm">Description<textarea rows={3} maxLength={1000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-md border px-3 py-2.5" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-md border bg-white px-3 py-2.5">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="grid gap-2 text-sm">Badge<input maxLength={40} value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} className="rounded-md border px-3 py-2.5" /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm">Price (₹)<input type="number" min="1" max="10000000" step="1" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="rounded-md border px-3 py-2.5" /></label>
              <label className="grid gap-2 text-sm">Stock count<input type="number" min="0" max="1000000" step="1" required value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="rounded-md border px-3 py-2.5" /></label>
            </div>
            <label className="grid gap-2 text-sm">Image path<input required maxLength={500} placeholder="/orbit-tee.png" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="rounded-md border px-3 py-2.5" /><span className="text-xs text-muted-foreground">Use an image already in the store’s public folder, such as /orbit-tee.png.</span></label>
            <button disabled={busy} className="button button-dark w-full justify-center disabled:opacity-50">{busy ? "Saving…" : editingId ? "Save changes →" : "Add product →"}</button>
          </form>
        </section>
        <section><h2 className="mb-4 text-xl font-semibold">Your catalog</h2>{products.length ? <div className="divide-y rounded-2xl border">{products.map((product) => <article key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="mt-1 text-sm text-muted-foreground">{product.category} · ₹{product.price.toLocaleString("en-IN")} · {product.stock ?? 0} in stock</p></div><div className="flex gap-2"><button onClick={() => editProduct(product)} className="rounded-full border px-3 py-1.5 text-sm">Edit</button><button onClick={() => removeProduct(product.id)} className="rounded-full border px-3 py-1.5 text-sm">Remove</button></div></article>)}</div> : <p className="rounded-2xl border p-6 text-sm text-muted-foreground">No products yet.</p>}</section>
      </div> : <section className="py-8"><h2 className="mb-4 text-xl font-semibold">Recent orders</h2>{orders.length ? <div className="space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold">{order.order_number} <span className="font-normal text-muted-foreground">· {new Date(order.created_at).toLocaleString("en-IN")}</span></p><p className="mt-2">{order.customer_name} · {order.phone}</p><p className="mt-1 text-sm text-muted-foreground">{order.address}, {order.city}, {order.state} {order.pincode}</p></div><div className="text-right"><p className="font-semibold">₹{order.total.toLocaleString("en-IN")} · COD</p><label className="mt-2 flex items-center gap-2 text-sm">Status<select value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value as StoreOrder["status"])} className="rounded-md border bg-white px-2 py-1">{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div></div><div className="mt-4 border-t pt-4 text-sm text-muted-foreground">{order.order_items.map((item, index) => <p key={`${order.id}-${index}`}>{item.product_name} × {item.quantity} — ₹{(item.unit_price * item.quantity).toLocaleString("en-IN")}</p>)}</div></article>)}</div> : <p className="rounded-2xl border p-6 text-sm text-muted-foreground">No orders yet. Customer orders will appear here.</p>}</section>}
    </>}
  </main></MainLayout>;
}
