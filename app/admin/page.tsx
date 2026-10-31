"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import type { Product } from "@/features/products/data";
import type { StoreAnalytics, StoreOrder } from "@/lib/store-api";

const categories = ["Clothing", "Accessories", "Electronics"] as const;
const orderStatuses: StoreOrder["status"][] = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const emptyProduct = { name: "", description: "", category: "Clothing", price: "", stock: "", image: "/orbit-tee.png", badge: "New" };
const emptyAnalytics: StoreAnalytics = {
  salesToday: 0,
  sales30Days: 0,
  ordersToday: 0,
  orders30Days: 0,
  lifetimeSales: 0,
  lifetimeOrders: 0,
  averageOrderValue: 0,
  ordersToFulfill: 0,
  lowStockProducts: 0,
  totalProducts: 0,
  dailySales: [],
};

async function readError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return typeof body.error === "string" ? body.error : "That action could not be completed.";
}

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="rounded-2xl border p-5 sm:p-6">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    <p className="mt-2 text-xs text-muted-foreground">{note}</p>
  </article>;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [analytics, setAnalytics] = useState<StoreAnalytics>(emptyAnalytics);
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [productsResponse, ordersResponse, analyticsResponse] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
      fetch("/api/admin/analytics", { cache: "no-store" }),
    ]);
    if (!productsResponse.ok) throw new Error(await readError(productsResponse));
    if (!ordersResponse.ok) throw new Error(await readError(ordersResponse));
    if (!analyticsResponse.ok) throw new Error(await readError(analyticsResponse));
    const [nextProducts, nextOrders, nextAnalytics] = await Promise.all([
      productsResponse.json() as Promise<Product[]>,
      ordersResponse.json() as Promise<StoreOrder[]>,
      analyticsResponse.json() as Promise<StoreAnalytics>,
    ]);
    setProducts(nextProducts);
    setOrders(nextOrders);
    setAnalytics(nextAnalytics);
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (result: { authenticated: boolean }) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) await loadDashboard();
      })
      .catch((loadError) => {
        if (loadError instanceof Error) setError(loadError.message);
      })
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
    setAuthenticated(false); setProducts([]); setOrders([]); setAnalytics(emptyAnalytics);
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
    setMessage("Order status updated."); await loadDashboard();
  }

  const chartMaximum = Math.max(...analytics.dailySales.map((day) => day.sales), 1);

  return <MainLayout><main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-6">
      <div><p className="eyebrow">GALACTIC COMMERCE</p><h1 className="text-4xl font-medium tracking-tight sm:text-5xl">Store manager</h1><p className="mt-2 text-sm text-muted-foreground">Your sales, products, stock, and customer orders.</p></div>
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
      <div className="mt-8 flex gap-2 border-b" role="tablist" aria-label="Store manager sections">
        {(["overview", "products", "orders"] as const).map((section) => <button key={section} role="tab" aria-selected={tab === section} onClick={() => setTab(section)} className={`px-4 py-3 text-sm capitalize ${tab === section ? "border-b-2 border-black font-semibold" : "text-muted-foreground"}`}>
          {section === "overview" ? "Overview" : section === "products" ? `Products (${products.length})` : `Orders (${orders.length})`}
        </button>)}
      </div>

      {tab === "overview" ? <section className="py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold">Store overview</h2><p className="mt-1 text-sm text-muted-foreground">Sales totals exclude cancelled orders.</p></div><button onClick={() => { setBusy(true); loadDashboard().catch((e) => setError(e.message)).finally(() => setBusy(false)); }} className="rounded-full border px-4 py-2 text-sm" disabled={busy}>{busy ? "Refreshing…" : "Refresh"}</button></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Sales · last 30 days" value={money(analytics.sales30Days)} note={`${money(analytics.salesToday)} today`} />
          <StatCard label="Orders · last 30 days" value={String(analytics.orders30Days)} note={`${analytics.ordersToday} placed today`} />
          <StatCard label="Needs fulfillment" value={String(analytics.ordersToFulfill)} note="New or confirmed orders" />
          <StatCard label="Low-stock products" value={String(analytics.lowStockProducts)} note={`At 5 or fewer units · ${analytics.totalProducts} products listed`} />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-2"><div><h3 className="text-lg font-semibold">Sales over the last 7 days</h3><p className="mt-1 text-sm text-muted-foreground">Daily order totals in Indian rupees</p></div><p className="text-sm font-medium">{money(analytics.lifetimeSales)} all time</p></div>
            <div className="mt-7 grid h-48 grid-cols-7 items-end gap-3" aria-label="Bar chart of sales during the last seven days">
              {analytics.dailySales.map((day) => <div key={day.date} className="flex h-full flex-col items-center justify-end gap-2" title={`${day.date}: ${money(day.sales)} from ${day.orders} orders`}>
                <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-md bg-black" style={{ height: `${day.sales === 0 ? 4 : Math.max(8, (day.sales / chartMaximum) * 100)}%` }} /></div>
                <span className="text-xs text-muted-foreground">{new Date(`${day.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}</span>
              </div>)}
            </div>
          </section>
          <section className="rounded-2xl border p-5 sm:p-6"><h3 className="text-lg font-semibold">Store at a glance</h3><dl className="mt-4 divide-y text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">All-time orders</dt><dd className="font-medium">{analytics.lifetimeOrders}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Average order value</dt><dd className="font-medium">{money(analytics.averageOrderValue)}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Products in catalog</dt><dd className="font-medium">{analytics.totalProducts}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Orders to fulfill</dt><dd className="font-medium">{analytics.ordersToFulfill}</dd></div>
          </dl></section>
        </div>
        <section className="mt-5 rounded-2xl border p-5 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">Latest orders</h3><button onClick={() => setTab("orders")} className="text-sm underline">View all orders</button></div>
          {orders.length ? <div className="divide-y">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{order.order_number} · {order.customer_name}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN")} · {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><div className="flex items-center gap-3"><span className="text-sm font-medium">{money(order.total)}</span><span className="rounded-full border px-2.5 py-1 text-xs capitalize">{order.status}</span></div></div>)}</div> : <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">Your first customer orders will appear here.</p>}
        </section>
      </section> : tab === "products" ? <div className="grid gap-8 py-8 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
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
        <section><h2 className="mb-4 text-xl font-semibold">Your catalog</h2>{products.length ? <div className="divide-y rounded-2xl border">{products.map((product) => <article key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="mt-1 text-sm text-muted-foreground">{product.category} · {money(product.price)} · {product.stock ?? 0} in stock</p></div><div className="flex gap-2"><button onClick={() => editProduct(product)} className="rounded-full border px-3 py-1.5 text-sm">Edit</button><button onClick={() => removeProduct(product.id)} className="rounded-full border px-3 py-1.5 text-sm">Remove</button></div></article>)}</div> : <p className="rounded-2xl border p-6 text-sm text-muted-foreground">No products yet.</p>}</section>
      </div> : <section className="py-8"><h2 className="mb-4 text-xl font-semibold">All orders</h2>{orders.length ? <div className="space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold">{order.order_number} <span className="font-normal text-muted-foreground">· {new Date(order.created_at).toLocaleString("en-IN")}</span></p><p className="mt-2">{order.customer_name} · {order.phone}</p><p className="mt-1 text-sm text-muted-foreground">{order.address}, {order.city}, {order.state} {order.pincode}</p></div><div className="text-right"><p className="font-semibold">{money(order.total)} · COD</p><label className="mt-2 flex items-center gap-2 text-sm">Status<select value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value as StoreOrder["status"])} className="rounded-md border bg-white px-2 py-1">{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div></div><div className="mt-4 border-t pt-4 text-sm text-muted-foreground">{order.order_items.map((item, index) => <p key={`${order.id}-${index}`}>{item.product_name} × {item.quantity} — {money(item.unit_price * item.quantity)}</p>)}</div></article>)}</div> : <p className="rounded-2xl border p-6 text-sm text-muted-foreground">No orders yet. Customer orders will appear here.</p>}</section>}
    </>}
  </main></MainLayout>;
}
