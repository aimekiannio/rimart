"use client";

import { useCartStore } from "@/features/cart/cart-store";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      {/* Customer Information */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Customer Information
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-md border p-3"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full rounded-md border p-3"
          />

          <input
            type="email"
            placeholder="Email (Optional)"
            className="w-full rounded-md border p-3"
          />
        </div>
      </section>

      {/* Delivery Address */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Delivery Address
        </h2>

        <div className="space-y-4">
          <textarea
            placeholder="Full Address"
            className="h-24 w-full rounded-md border p-3"
          />

          <input
            type="text"
            placeholder="City"
            className="w-full rounded-md border p-3"
          />

          <input
            type="text"
            placeholder="State"
            className="w-full rounded-md border p-3"
          />

          <input
            type="text"
            placeholder="Pincode"
            className="w-full rounded-md border p-3"
          />
        </div>
      </section>

      {/* Payment */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Payment Method
        </h2>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            defaultChecked
          />
          Cash on Delivery
        </label>
      </section>

      {/* Order Summary */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Order Summary
        </h2>

        {cart.map((item) => (
          <div
            key={item.id}
            className="mb-3 flex justify-between"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-black py-3 text-white"
        >
          Place Order
        </button>
      </section>
    </main>
  );
}