import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, financialData } = await req.json();

  const result = streamText({
    model: xai("grok-beta"),
    messages: [
      {
        role: "system",
        content: `You are a Senior Financial Advisor assistant,Only answer questions related to the user's financial data and expenses. If the user asks questions unrelated to their finances, politely redirect them to ask finance-related questions. in order to help the user to get out of the economic rat race that most of the people is involved but also to help them to save money and invest in order to get rich and retire early, if you see that the user is not using the money wisely, you should tell them to change their behavior. based on the user data, you should give them the best financial advice. this is the user data: ${financialData}`,
      },
      ...messages,
    ],
    maxTokens: 512,
    temperature: 0,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
