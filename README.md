# Compliance Co-pilot

A regulatory pre-review service for product requirements documents (PRDs) at a regulated EU financial institution. Submit a PRD, and a `POST /api/v1/review` endpoint returns structured, citation-backed findings — exposure level, blockers/warnings, mitigations, and confidence flags — drawn from a hand-curated corpus of EU AI Act, GDPR, BaFin MaRisk, and DORA clauses.

This repository is a portfolio piece for the Scalable Capital Product Manager (AI Platform) interview. The written submission discusses the production framing, eval strategy, and roadmap; this codebase is the working POC referenced there.

## Architectural choices and why

**Prompt-injected corpus over RAG.** The corpus is 12 hand-picked clauses, embedded directly into the system prompt. At this scale, retrieval adds infrastructure complexity without quality gain. A production deployment with hundreds of clauses would use vector retrieval — but the discipline that actually matters for safety is *citation verification*, and that is already in place: every citation the model emits is checked against the corpus before being returned to the caller. The shape of the safety check does not change when retrieval is introduced; only the candidate set does.

**Browser-direct calls were considered but rejected.** The UI does not call Anthropic or OpenAI directly. It calls our `/api/v1/review` endpoint, which calls the provider. This is deliberate: the API is the product; the UI is one consumer. Postman is another. Future tools — a PR review service, a Comms review service — would be additional consumers of the same endpoint, with only the rubric and corpus changing.

**User-supplied API keys.** A POC must not require the candidate to provide credentials. Keys are passed per-request via the `X-API-Key` header, never persisted server-side, and stored client-side in `localStorage` with a 24-hour expiry. This keeps the deploy-and-share story trivial — there are no environment variables to set on Vercel.

## API documentation

### `POST /api/v1/review`

Headers:
- `Content-Type: application/json`
- `X-Provider: anthropic | openai`
- `X-API-Key: <user's API key for the chosen provider>`

Body:

```json
{ "prd": "<PRD text>" }
```

Success response (200):

```json
{
  "exposure": "none" | "low" | "medium" | "high",
  "summary": "string (1-2 sentences)",
  "findings": [
    {
      "severity": "blocker" | "warning" | "info",
      "title": "string",
      "reasoning": "string",
      "citations": [
        { "id": "AIA-006", "regulation": "EU AI Act", "clause": "Article 6(2) and Annex III" }
      ],
      "mitigation": "string",
      "confidence": "high" | "medium" | "low",
      "needsHumanReview": true
    }
  ]
}
```

Error responses: `400` (validation), `401` (provider rejected the key), `429` (provider rate limit), `502` (provider call failed), `500` (model output unparseable). The `X-API-Key` header is never logged or echoed in error messages.

### curl example

```bash
curl -X POST http://localhost:3000/api/v1/review \
  -H "Content-Type: application/json" \
  -H "X-Provider: anthropic" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -d '{"prd":"Add a button to the homepage."}'
```

A Postman collection is included at [postman_collection.json](postman_collection.json).

## The platform thesis

The endpoint above is the product. V2 (PR review) and V3 (Comms review) would consume it unchanged — only the rubric and corpus change. The same shape holds:

1. Take a piece of work product (PRD, PR diff, marketing copy).
2. Apply a domain rubric (regulatory clauses, code-style guide, brand guardrails).
3. Return structured, citation-backed findings.
4. Verify every citation against the source-of-truth corpus before returning.

That last step is the one that lets the surface be trustworthy enough to ship. The verifier in [lib/verifier.ts](lib/verifier.ts) is small but is the load-bearing piece — without it, a confidently-cited hallucination is indistinguishable from a real finding.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

On first visit, you'll be asked to choose a provider (Anthropic or OpenAI) and paste an API key. The key lives in `localStorage` and auto-expires after 24 hours. Use the gear icon in the header to swap providers or reset the key.

## Vercel deployment

```bash
npx vercel --prod
```

No environment variables are required — the user's API key is supplied per-request from the browser, not from the server.

## Limitations

These are deliberate scope cuts for the POC, called out so a reviewer doesn't have to guess what was elided.

- **No real RAG.** The corpus is 12 clauses, embedded in the prompt. See the architecture section.
- **No persistent eval pipeline.** The citation verifier is the only runtime quality check. A production system would need offline regression tests against a labeled set of PRDs, plus an LLM-as-judge faithfulness check on a sample of live traffic.
- **No corpus governance.** Regulations are static in this repo. A production system would need a versioned corpus with a refresh process, owners per regulation, and a change-log surfaced into the response.
- **No multi-tenancy or user auth.** Out of POC scope.
- **No cost or rate limiting.** Each call goes directly to the user's own provider quota.
- **LLM-as-judge faithfulness check not implemented.** Explored and skipped to stay within the time budget. The written submission discusses it as part of the production evaluation framework.

## Repository layout

```
app/
  page.tsx                  # Single-page UI
  layout.tsx
  globals.css               # Design tokens
  api/v1/review/route.ts    # POST endpoint
lib/
  corpus.ts                 # 12 regulatory excerpts
  samplePRDs.ts             # 3 example PRDs
  prompt.ts                 # System prompt builder
  schema.ts                 # Zod schema + parse helper
  verifier.ts               # Citation existence check
  models.ts                 # Provider model name constants
  providers/
    anthropic.ts
    openai.ts
components/
  Header.tsx
  ApiKeyModal.tsx
  PRDInput.tsx
  FindingsPanel.tsx
hooks/
  useApiKey.ts
postman_collection.json
```
