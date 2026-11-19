import { getOrCreateAnonymousUser } from "@/lib/userToken";

export async function GET() {
  try {
    const user = await getOrCreateAnonymousUser();
    return Response.json({ userId: user.id }, { status: 200 });
  } catch (err) {
    return Response.json({err , error: "Failed to get user" }, { status: 500 });
  }
}