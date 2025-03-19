import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get the most recent chat for this user
    const chat = await prisma.chat.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!chat) {
      return Response.json({ messages: [] });
    }

    return Response.json({ messages: chat.messages });
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}