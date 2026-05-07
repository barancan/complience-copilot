"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ApiKeyModal from "@/components/ApiKeyModal";
import PRDInput from "@/components/PRDInput";
import FindingsPanel from "@/components/FindingsPanel";
import { useApiKey, type Provider } from "@/hooks/useApiKey";
import { ANTHROPIC_MODEL, OPENAI_MODEL } from "@/lib/models";
import type { ReviewResponse } from "@/lib/schema";

function providerLabel(provider: Provider | null): string | undefined {
  if (provider === "anthropic") return `Anthropic / ${ANTHROPIC_MODEL}`;
  if (provider === "openai") return `OpenAI / ${OPENAI_MODEL}`;
  return undefined;
}

type ResultState =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "results"; response: ReviewResponse };

export default function Home() {
  const { provider, apiKey, isReady, hydrated, setKey } = useApiKey();
  const [modalOpen, setModalOpen] = useState(false);
  const [prd, setPrd] = useState("");
  const [result, setResult] = useState<ResultState>({ kind: "empty" });

  useEffect(() => {
    if (hydrated && !isReady) setModalOpen(true);
  }, [hydrated, isReady]);

  const isRunning = result.kind === "loading";

  async function runReview() {
    if (!provider || !apiKey || prd.trim().length === 0) return;
    setResult({ kind: "loading" });

    try {
      const res = await fetch("/api/v1/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Provider": provider,
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ prd }),
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setResult({
          kind: "error",
          message:
            errBody.error ?? `Request failed with status ${res.status}`,
        });
        return;
      }

      const data = (await res.json()) as ReviewResponse;
      setResult({ kind: "results", response: data });
    } catch (e) {
      setResult({
        kind: "error",
        message: (e as Error).message || "Network error",
      });
    }
  }

  return (
    <>
      <Header
        providerLabel={providerLabel(provider)}
        onOpenSettings={() => setModalOpen(true)}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 lg:grid lg:grid-cols-[2fr_3fr] lg:gap-8 lg:items-start">
        <PRDInput
          value={prd}
          onChange={setPrd}
          onRun={runReview}
          isRunning={isRunning}
          disabled={!isReady}
        />
        <FindingsPanel state={result} />
      </main>
      <ApiKeyModal
        open={modalOpen}
        initialProvider={provider}
        dismissible={isReady}
        onClose={() => setModalOpen(false)}
        onSubmit={(p, key) => {
          setKey(p, key);
          setModalOpen(false);
        }}
      />
    </>
  );
}
