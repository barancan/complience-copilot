import { z } from "zod";

export const CitationSchema = z.object({
  id: z.string(),
  regulation: z.string(),
  clause: z.string(),
});

export const FindingSchema = z.object({
  severity: z.enum(["blocker", "warning", "info"]),
  title: z.string(),
  reasoning: z.string(),
  citations: z.array(CitationSchema),
  mitigation: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  needsHumanReview: z.boolean(),
});

export const ReviewResponseSchema = z.object({
  exposure: z.enum(["none", "low", "medium", "high"]),
  summary: z.string(),
  findings: z.array(FindingSchema),
});

export type Citation = z.infer<typeof CitationSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

export function parseLLMResponse(raw: string): ReviewResponse {
  const trimmed = raw.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : extractFirstJsonObject(trimmed);

  if (!candidate) {
    throw new Error("LLM response did not contain a JSON object");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (e) {
    throw new Error(
      `LLM response was not valid JSON: ${(e as Error).message}`,
    );
  }

  const result = ReviewResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `LLM response did not match expected schema: ${result.error.message}`,
    );
  }

  return result.data;
}

function extractFirstJsonObject(input: string): string | null {
  const start = input.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < input.length; i++) {
    const ch = input[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return input.slice(start, i + 1);
    }
  }
  return null;
}
