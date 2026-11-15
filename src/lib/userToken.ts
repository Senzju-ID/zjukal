import { cookies } from "next/headers";

export function generateGuestToken(): string {
  return crypto.randomUUID();
}

export const GUEST_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 tahun
  path: "/",
};

export async function getGuestToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("guestToken")?.value || null;
}