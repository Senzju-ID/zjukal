import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import fs from "node:fs/promises";
import path from "node:path";

export async function PATCH(request: Request, { params }: {params:  Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const updateData: { title?: string; description?: string} = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updateThread = await prisma.thread.update({
      where: { id },
      data: updateData,
    })

    return Response.json({...updateThread, message: "Successfully changed "}, {status: 200})
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return Response.json({error: "Thread not found"}, {status: 404 })
    }
    return Response.json({err, error: "Failed to update thread"}, {status: 500})
  }
}

export async function DELETE(request: Request, { params }: {params:  Promise<{ id: string }>}) {
  try {
    const { id } = await params;

    const thread = await prisma.thread.findUnique({
      where: { id },
      select: { mediaUrl: true }
    })

    if (!thread) {
      return Response.json({error: "Thread not found"}, {status: 404 })
    }

    if (thread.mediaUrl) {
      const filePath = path.join(process.cwd(), "public", thread.mediaUrl);
      try {
        await fs.unlink(filePath)
      } catch (fileErr) {
        console.error("Failed to delete local file:", fileErr)
      }
    }

    await prisma.thread.delete({
      where: { id }
    }
  )

    return Response.json({ message:  "Successfully deleted thread "}, { status: 200 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    return Response.json({err, error: "Failed to delete threads"}, { status: 500})
  }
}