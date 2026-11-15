import { prisma } from "@/lib/prisma";
import { getGuestToken } from "@/lib/userToken";

export async function POST(request: Request, {params}: {params: Promise<{id: string}>}) {
    try {
        const { id: threadId } = await params;
        const authorToken = await getGuestToken();

        if (!authorToken) {
            return Response.json({ error: "authorToken are required"}, {status: 400})
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                threadId_authorToken: { threadId, authorToken},
            },
        });

        if (existingLike) {
            await prisma.$transaction([
                prisma.like.delete({ where: { id: existingLike.id } }),
                prisma.thread.update({
                    where: { id: threadId },
                    data: { likesCount: { decrement: 1}}
                })
            ]);
            
            return Response.json({ liked: false, message: "Unliked thread"}, { status: 200})
        } else {
            await prisma.$transaction([
                prisma.like.create({ data: { threadId, authorToken}}),
                prisma.thread.update({
                    where: { id: threadId },
                    data: { likesCount: { increment:1 }}
                })
            ]);
            
            return Response.json({ liked: true, message: "Liked thread"}, { status: 200})
        }
    } catch (err) {
        return Response.json({err, error: "Failed to toggle like"}, {status: 500})
    }
}