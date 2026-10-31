"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/features/cart/cart-store";
import { MainLayout } from "@/components/layout/main-layout";

type OrderReceipt = { orderNumber: string; total: number };

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !cart.length) return;
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          items: cart.map((item) => ({ productId: String(item.id), quantity: item.quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not place your order.");
      setReceipt(result as OrderReceipt);
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not place your order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MainLayout>
      <main className="cart-page max-w-4xl">
        {receipt ? <section className="rounded-2xl border p-8 sm:p-12">
          <p className="eyebrow">ORDER RECEIVED</p>
          <h1>Thanks for your order.</h1>
          <p className="mt-5 text-lg">Order <strong>{receipt.orderNumber}</strong></p>
          <p className="mt-2 text-muted-foreground">Pay ₹{receipt.total.toLocaleString("en-IN")} in cash when your order arrives.</p>
          <Link className="button button-dark mt-8" href="/">Continue shopping →</Link>
        </section> : <>
          <p className="eyebrow">SECURE CHECKOUT</p>
          <h1>Delivery details.</h1>
          {!cart.length ? <div className="cart-empty"><p>Your cart is empty.</p><Link className="button button-dark" href="/#shop">Explore the collection ↗</Link></div> :
            <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border p-5 sm:p-7">
                  <h2 className="mb-5 text-xl font-semibold">Where should we deliver?</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm sm:col-span-2">Full name<input name="customerName" autoComplete="name" required maxLength={100} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm">Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={30} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm">Email (optional)<input name="email" type="email" autoComplete="email" maxLength={200} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm sm:col-span-2">Street address<textarea name="address" autoComplete="street-address" required maxLength={400} rows={3} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm">City<input name="city" autoComplete="address-level2" required maxLength={100} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm">State<input name="state" autoComplete="address-level1" required maxLength={100} className="rounded-md border px-3 py-3" /></label>
                    <label className="grid gap-2 text-sm">PIN code<input name="pincode" autoComplete="postal-code" required maxLength={12} className="rounded-md border px-3 py-3" /></label>
                  </div>
                </section>
                <section className="rounded-2xl border p-5 sm:p-7">
                  <h2 className="text-xl font-semibold">Payment</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Cash on delivery. Pay when your order arrives.</p>
                </section>
              </div>
              <aside className="h-fit rounded-2xl border p-5 sm:p-7">
                <h2 className="mb-5 text-xl font-semibold">Your order</h2>
                <div className="space-y-4">{cart.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span>{item.name} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>)}</div>
                <div className="my-5 border-t" />
                <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
                {error && <p role="alert" className="mt-4 rounded-md bg-gray-100 p-3 text-sm">{error}</p>}
                <button type="submit" disabled={busy} className="button button-dark mt-6 w-full justify-center disabled:opacity-50">{busy ? "Placing order…" : "Place COD order →"}</button>
              </aside>
            </form>}
        </>}
      </main>
    </MainLayout>
  );
}
