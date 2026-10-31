import { NextResponse } from "next/server";
import { listProducts } from "@/lib/store-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listProducts());
  } catch {
    return NextResponse.json({ error: "The collection could not be loaded." }, { status: 503 });
  }
}
