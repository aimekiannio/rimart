import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { hasStoreDatabase, listOrders, updateOrderStatus, type StoreOrder } from "@/lib/store-api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Please sign in to view orders." }, { status: 401 });
  if (!hasStoreDatabase) return NextResponse.json({ error: "Connect the store database before viewing orders." }, { status: 503 });
  try {
    return NextResponse.json(await listOrders());
  } catch {
    return NextResponse.json({ error: "Orders could not be loaded." }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Please sign in to update orders." }, { status: 401 });
  if (!hasStoreDatabase) return NextResponse.json({ error: "Connect the store database before updating orders." }, { status: 503 });
  try {
    const body = await request.json();
    const allowed: StoreOrder["status"][] = ["new", "confirmed", "shipped", "delivered", "cancelled"];
    if (typeof body.id !== "string" || !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Choose a valid order status." }, { status: 400 });
    }
    await updateOrderStatus(body.id, body.status);
    return NextResponse.json({ updated: true });
  } catch {
    return NextResponse.json({ error: "Order status could not be updated." }, { status: 400 });
  }
}
