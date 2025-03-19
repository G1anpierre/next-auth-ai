import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { message } = await req.json();

    // Find the most recent chat for this user
    const chat = await prisma.chat.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    // Find and update the most recent assistant message
    const assistantMessage = await prisma.message.findFirst({
      where: {
        chatId: chat.id,
        role: 'assistant',
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!assistantMessage) {
      return new Response('Assistant message not found', { status: 404 });
    }

    // Update the message with the complete content
    await prisma.message.update({
      where: {
        id: assistantMessage.id,
      },
      data: {
        content: message.content,
      }
    });

    return new Response('Message saved', { status: 200 });
  } catch (error) {
    console.error('Error saving message:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 