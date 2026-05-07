import OpenAI from "openai";
import { OPENAI_MODEL } from "@/lib/models";

export async function call(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const client = new OpenAI({ apiKey, timeout: 60_000 });

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not contain message content");
  }
  return content;
}
