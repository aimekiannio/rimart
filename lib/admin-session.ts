import { cookies } from "next/headers";

const COOKIE_NAME = "galactic-admin";
const SESSION_LENGTH_SECONDS = 60 * 60 * 8;

function sessionKey() {
  const secret = process.env.GALACTIC_SESSION_SECRET;
  if (!secret) throw new Error("Admin session secret is not configured.");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function makeAdminSession(email: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_LENGTH_SECONDS;
  const payload = `${email.toLowerCase()}.${expires}`;
  const signature = await crypto.subtle.sign("HMAC", await sessionKey(), new TextEncoder().encode(payload));
  return `${toBase64Url(new TextEncoder().encode(email.toLowerCase()))}.${expires}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function isAdminRequest() {
  try {
    const expectedEmail = process.env.GALACTIC_ADMIN_EMAIL?.toLowerCase();
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!expectedEmail || !token) return false;
    const [encodedEmail, expiresText, signatureText] = token.split(".");
    const email = new TextDecoder().decode(fromBase64Url(encodedEmail));
    const expires = Number(expiresText);
    if (email !== expectedEmail || !Number.isFinite(expires) || expires <= Date.now() / 1000) return false;
    const payload = `${email}.${expires}`;
    return await crypto.subtle.verify(
      "HMAC",
      await sessionKey(),
      fromBase64Url(signatureText),
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_LENGTH_SECONDS,
};
