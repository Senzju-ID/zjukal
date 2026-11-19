import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

const AUTH_SALT = process.env.AUTH_SALT || "zjukal-default-salt-change-me-in-production";

export function generateGuestToken(): string {
  return crypto.randomUUID();
}

export const GUEST_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(`${AUTH_SALT}:${token}`).digest("hex");
}

export const getOrCreateAnonymousUser = async () => {
  const cookieStore = await cookies();
  let rawToken = cookieStore.get("guestToken")?.value;

  if (!rawToken) {
    rawToken = generateGuestToken();
  }

  const tokenHash = hashToken(rawToken);

  try {
    const user = await prisma.anonymousUser.upsert({
      where: { tokenHash },
      update: {},
      create: { tokenHash },
    });
    return user;
  } catch (err) {
    const existingUser = await prisma.anonymousUser.findUnique({
      where: { tokenHash },
    });
    if (existingUser) return existingUser;
    throw err;
  }
}