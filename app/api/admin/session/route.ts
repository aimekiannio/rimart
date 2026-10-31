import { NextRequest, NextResponse } from "next/server";
import { adminCookie, isAdminRequest, makeAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest() });
}

export async function POST(request: NextRequest) {
  const configuredEmail = process.env.GALACTIC_ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.GALACTIC_ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword || !process.env.GALACTIC_SESSION_SECRET) {
    return NextResponse.json({ error: "The owner login has not been configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (email !== configuredEmail || password !== configuredPassword) {
      return NextResponse.json({ error: "That email and password do not match." }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(adminCookie.name, await makeAdminSession(email), {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "strict",
      path: "/",
      maxAge: adminCookie.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Please try signing in again." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(adminCookie.name, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
