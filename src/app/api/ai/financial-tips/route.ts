import { xai } from "@ai-sdk/xai";

import { streamObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const prompt = await req.json();

  const result = streamObject({
    model: xai("grok-beta"),
    schema: z.object({
      tips: z.array(
        z.object({
          number: z.number().describe("The tip number"),
          title: z.string().describe("The tip title"),
          content: z.string().describe("The tip content"),
        })
      ),
    }),
    // prompt: `You are a helpful financial advisor. ${context}`,
    messages: [
      {
        role: "system",
        content: `You are a Senior Financial Advisor, in order to help the user to get out of the economic rat race that most of the people is involved but also to help them to save money and invest in order to get rich and retire early, if you see that the user is not using the money wisely, you should tell them to change their behavior.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    maxTokens: 512,
    temperature: 0,
    maxRetries: 3,
  });

  return result.toTextStreamResponse();
}
