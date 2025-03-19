import { createDeepSeek } from "@ai-sdk/deepseek";

import { wrapLanguageModel, extractReasoningMiddleware, streamText } from 'ai';
import { auth } from "@/auth";
import { prisma } from "@/prisma";


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const model = wrapLanguageModel({
  model: deepSeek("deepseek-chat"),
  middleware: extractReasoningMiddleware({ tagName: 'think' })
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, financialData } = await req.json();

    // Find or create a chat session for this user
    let chat = await prisma.chat.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
        }
      });
    }

    // Save the new user message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        content: messages[messages.length - 1].content,
        role: 'user',
      }
    });

    // Create a placeholder message for the assistant's response
    await prisma.message.create({
      data: {
        chatId: chat.id,
        content: '',
        role: 'assistant',
      }
    });

    // Stream the response
    const result = streamText({
      model,
      messages: [
        {
          role: "system",
          content: `You are a Senior Financial Advisor assistant,Only answer questions related to the user's financial data and expenses. If the user asks questions unrelated to their finances, politely redirect them to ask finance-related questions. in order to help the user to get out of the economic rat race that most of the people is involved but also to help them to save money and invest in order to get rich and retire early, if you see that the user is not using the money wisely, you should tell them to change their behavior. based on the user data, you should give them the best financial advice. this is the user data: ${financialData}`,
        },
        ...messages,
      ],
      maxTokens: 512,
      temperature: 0,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
