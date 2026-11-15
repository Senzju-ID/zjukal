import { prisma } from "@/lib/prisma";
import { getGuestToken } from "@/lib/userToken";

export async function POST(request: Request, {params}: {params: Promise<{id: string}>}) {
    try {
        const { id: threadId } = await params;
        const authorToken = await getGuestToken();

        if (!authorToken) {
            return Response.json({ error: "authorToken are required"}, {status: 400})
        }

        const [existingLike, existingDislike] = await Promise.all([
            prisma.like.findUnique({
                where: { threadId_authorToken: { threadId, authorToken } },
            }),
            prisma.dislike.findUnique({
                where: { threadId_authorToken: { threadId, authorToken } },
            }),
        ]);

        if (existingDislike) {
            await prisma.$transaction([
                prisma.dislike.delete({ where: { id: existingDislike.id } }),
                prisma.thread.update({
                    where: { id: threadId },
                    data: { dislikesCount: { decrement: 1}}
                })
            ]);
            
            return Response.json({ liked: false, disliked: false, message: "Undisliked thread"}, { status: 200})
        } 
        
        if (existingLike) {
            await prisma.$transaction([
                prisma.dislike.create({ data: { threadId, authorToken}}),
                prisma.like.delete({ where: {id : existingLike.id }}),
                prisma.thread.update({
                    where: { id: threadId },
                    data: {
                        dislikesCount: { increment: 1 },
                        likesCount: { decrement: 1}
                    }
                })
            ]);
            
            return Response.json({ liked: false, disliked: true, message: "Disliked thread and Unlike thread"}, {status: 200})
        } else {
            await prisma.$transaction([
                prisma.dislike.create({ data: { threadId, authorToken } }),
                prisma.thread.update({
                where: { id: threadId },
                data: {
                    dislikesCount: { increment: 1 }
                    },
                }),
            ]);

            return Response.json({ liked: false, disliked: true, message: "Disliked thread" }, { status: 200 });
        }
    } catch (err) {
        return Response.json({err, error: "Failed to toggle dislike"}, {status: 500})
    }
}