import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { createProduct, deleteProduct, hasStoreDatabase, listProducts, updateProduct } from "@/lib/store-api";

export const dynamic = "force-dynamic";

async function authorize() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in to manage the store." }, { status: 401 });
  }
  if (!hasStoreDatabase) {
    return NextResponse.json({ error: "Connect the store database before managing products." }, { status: 503 });
  }
  return null;
}

function productInput(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const category = body.category;
  const image = typeof body.image === "string" ? body.image.trim().slice(0, 500) : "";
  const badge = typeof body.badge === "string" ? body.badge.trim().slice(0, 40) : "";
  const description = typeof body.description === "string" ? body.description.trim().slice(0, 1000) : "";
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!name || !image || !["Clothing", "Accessories", "Electronics"].includes(String(category))) {
    throw new Error("Add a name, image path, and choose a category.");
  }
  if (!Number.isInteger(price) || price < 1 || price > 10000000 || !Number.isInteger(stock) || stock < 0 || stock > 1000000) {
    throw new Error("Enter a valid whole-number price and stock amount.");
  }
  return { name, category: category as "Clothing" | "Accessories" | "Electronics", image, badge: badge || "New", description, price, stock };
}

export async function GET() {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await listProducts(true));
  } catch {
    return NextResponse.json({ error: "Products could not be loaded." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await createProduct(productInput(await request.json())), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Product could not be saved." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    if (typeof body.id !== "string") return NextResponse.json({ error: "Product ID is missing." }, { status: 400 });
    return NextResponse.json(await updateProduct(body.id, productInput(body)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Product could not be updated." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Product ID is missing." }, { status: 400 });
  try {
    await deleteProduct(id);
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Product could not be deleted." }, { status: 400 });
  }
}
