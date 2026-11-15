import { prisma } from "@/lib/prisma"
import { getGuestToken } from "@/lib/userToken";

export async function GET(request: Request, { params }: {params: Promise<{id: string}>}) {
    try {
        const { id } = await params;

        const comments = await prisma.comment.findMany({
            where: { threadId : id },
            orderBy: { createdAt: "asc" },
        })

        return Response.json({comments, message: "Successfully fetch comments"}, {status: 200})
    } catch (err) {
        return Response.json({err ,error: "Failed to fetch comments"}, {status: 500})
    }
}

export async function POST(request : Request, { params }: {params: Promise<{id: string}>}) {
    try {
        const { id } = await params;
        const authorToken = await getGuestToken();
        const formData = await request.formData();
        const context = formData.get("context") as string;

        if (!context || !authorToken) {
            return Response.json(
                {error: "Context and authorToken are required"},
                {status: 400})
        }

        const newComment = await prisma.$transaction([
            prisma.comment.create({
                data: {
                threadId: id,
                context,
                authorToken, 
                }
            }),
            prisma.thread.update({
                where: { id },
                data: { 
                    commentsCount: { increment: 1 }
                }
            })
        ])

        return Response.json(
            { comment: newComment, message: "Comment added successfully" },
            { status: 201 }
        );
    } catch (err) {
        return Response.json({err, error: "Failed to add comment" }, { status: 500 });
    }
}
