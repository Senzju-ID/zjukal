import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateGuestToken, GUEST_COOKIE_OPTIONS } from "@/lib/guestUser";

export function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const guestToken = request.cookies.get("guestToken")?.value;

    if (!guestToken) {
        const newToken = generateGuestToken();
        response.cookies.set("guestToken", newToken, GUEST_COOKIE_OPTIONS)
    }

    if (request.nextUrl.pathname.startsWith("/api")) {
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");

        if (origin && !origin.includes(host || "")) {
            return Response.json(
                {error: "Forbidden cross-origin request" },
                {status: 403 }
            );
        }
    }
    return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};