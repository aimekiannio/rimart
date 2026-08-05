"use client";

import { useCartStore } from "@/features/cart/cart-store";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Your cart is empty.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border p-4"
            >
              <h2 className="text-xl font-semibold">
                {item.name}
              </h2>

              <p>
                ₹{item.price}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() =>
                    decreaseQuantity(item.id)
                  }
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                >
                  +
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold">
            Total: ₹{total}
          </h2>
        </div>
      )}
    </main>
  );
}