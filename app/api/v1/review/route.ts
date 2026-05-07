import { CORPUS } from "@/lib/corpus";
import { buildSystemPrompt } from "@/lib/prompt";
import { parseLLMResponse } from "@/lib/schema";
import { verifyAndCleanCitations } from "@/lib/verifier";
import * as anthropic from "@/lib/providers/anthropic";
import * as openai from "@/lib/providers/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Provider = "anthropic" | "openai";

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

function statusFromProviderError(e: unknown): number {
  if (typeof e === "object" && e !== null && "status" in e) {
    const status = (e as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return 500;
}

export async function POST(request: Request) {
  const provider = request.headers.get("x-provider") as Provider | null;
  const apiKey = request.headers.get("x-api-key");

  if (provider !== "anthropic" && provider !== "openai") {
    return jsonError(400, "X-Provider must be 'anthropic' or 'openai'");
  }
  if (!apiKey) {
    return jsonError(400, "X-API-Key header is required");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Request body must be valid JSON");
  }

  const prd =
    typeof body === "object" && body !== null && "prd" in body
      ? (body as { prd: unknown }).prd
      : undefined;

  if (typeof prd !== "string" || prd.trim().length === 0) {
    return jsonError(400, "Request body must contain a non-empty 'prd' string");
  }

  const systemPrompt = buildSystemPrompt(CORPUS);
  const userPrompt = `Review the following PRD and return the JSON response described in your instructions.\n\nPRD:\n${prd}`;

  let raw: string;
  try {
    raw =
      provider === "anthropic"
        ? await anthropic.call(apiKey, systemPrompt, userPrompt)
        : await openai.call(apiKey, systemPrompt, userPrompt);
  } catch (e) {
    const status = statusFromProviderError(e);
    if (status === 401 || status === 403) {
      return jsonError(401, "Provider rejected the API key");
    }
    if (status === 429) {
      return jsonError(429, "Provider rate limit reached");
    }
    return jsonError(502, "Provider call failed");
  }

  let parsed;
  try {
    parsed = parseLLMResponse(raw);
  } catch (e) {
    return jsonError(
      500,
      `Model output could not be parsed: ${(e as Error).message}`,
    );
  }

  const cleaned = verifyAndCleanCitations(parsed, CORPUS);
  return Response.json(cleaned);
}
