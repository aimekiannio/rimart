import { NextRequest, NextResponse } from "next/server";
import { createCashOrder, hasStoreDatabase } from "@/lib/store-api";

export const dynamic = "force-dynamic";

const cleanText = (value: unknown, max = 250) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  if (!hasStoreDatabase) {
    return NextResponse.json(
      { error: "Orders are not connected yet. The store owner needs to finish the database setup." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const customerName = cleanText(body.customerName, 100);
    const phone = cleanText(body.phone, 30);
    const email = cleanText(body.email, 200);
    const address = cleanText(body.address, 400);
    const city = cleanText(body.city, 100);
    const state = cleanText(body.state, 100);
    const pincode = cleanText(body.pincode, 12);
    const items = Array.isArray(body.items)
      ? body.items.map((item: { productId?: unknown; quantity?: unknown }) => ({
          productId: typeof item?.productId === "string" ? item.productId : "",
          quantity: Number(item?.quantity),
        }))
      : [];

    if (!customerName || !phone || !address || !city || !state || !pincode || items.length === 0 || items.length > 30) {
      return NextResponse.json({ error: "Please complete the delivery details and add an item." }, { status: 400 });
    }
    if (items.some((item: { productId: string; quantity: number }) =>
      !/^\d+$/.test(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20,
    )) {
      return NextResponse.json({ error: "Each item can have a quantity from 1 to 20. Please update your cart." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const order = await createCashOrder({ customerName, phone, email, address, city, state, pincode, items });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not place the order. Please try again.";
    return NextResponse.json({ error: message.includes("stock") ? message : "We could not place the order. Please check the stock and try again." }, { status: 400 });
  }
}
