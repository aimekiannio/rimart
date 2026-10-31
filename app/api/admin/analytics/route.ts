import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { getStoreAnalytics, hasStoreDatabase } from "@/lib/store-api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in to view store analytics." }, { status: 401 });
  }
  if (!hasStoreDatabase) {
    return NextResponse.json({ error: "Connect the store database before viewing analytics." }, { status: 503 });
  }
  try {
    return NextResponse.json(await getStoreAnalytics());
  } catch {
    return NextResponse.json({ error: "Store analytics could not be loaded. Update the database schema and try again." }, { status: 503 });
  }
}
