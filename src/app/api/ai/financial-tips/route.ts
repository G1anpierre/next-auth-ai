import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("prompt", prompt);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful financial advisor. Provide concise, actionable financial advice based on the given information.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    maxTokens: 512,
    temperature: 0.3,
  });

  console.log("result", result);

  return result.toDataStreamResponse();
}
