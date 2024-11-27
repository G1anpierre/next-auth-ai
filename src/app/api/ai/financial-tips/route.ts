import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: openai("gpt-3.5-turbo"),
    schema: z.object({
      tips: z.array(
        z.object({
          number: z.number().describe("The tip number"),
          title: z.string().describe("The tip title"),
          content: z.string().describe("The tip content"),
        })
      ),
    }),
    prompt: `You are a helpful financial advisor. ${context}`,
    maxTokens: 512,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
