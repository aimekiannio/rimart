"use client";

import Link from "next/link";
import { useCartStore } from "@/features/cart/cart-store";
import { MainLayout } from "@/components/layout/main-layout";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <MainLayout><main className="cart-page">
      <p className="eyebrow">YOUR SELECTION</p>
      <h1>Your cart.</h1>

      {cart.length === 0 ? (
        <div className="cart-empty"><p>Your cart is waiting for its first orbit.</p><Link className="button button-dark" href="/#shop">Explore the collection ↗</Link></div>
      ) : (
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="cart-row"
            >
              <div><h2 className="text-xl font-semibold">{item.name}</h2><p>₹{item.price.toLocaleString("en-IN")} each</p></div>
              <div className="cart-controls">
                <button aria-label={`Decrease ${item.name} quantity`}
                  className="rounded border px-3 py-1"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button aria-label={`Increase ${item.name} quantity`}
                  className="rounded border px-3 py-1"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 rounded-lg border p-6">
            <h2 className="text-2xl font-bold">Total: ₹{total.toLocaleString("en-IN")}</h2>

            <Link
              href="/checkout"
              className="button button-dark mt-5"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      )}
    </main></MainLayout>
  );
}
