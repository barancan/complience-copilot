"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useApiKey, type Provider } from "@/hooks/useApiKey";
import { ANTHROPIC_MODEL, OPENAI_MODEL } from "@/lib/models";

function providerLabel(provider: Provider | null): string | undefined {
  if (provider === "anthropic") return `Anthropic / ${ANTHROPIC_MODEL}`;
  if (provider === "openai") return `OpenAI / ${OPENAI_MODEL}`;
  return undefined;
}

export default function Home() {
  const { provider, isReady, hydrated, setKey } = useApiKey();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !isReady) setModalOpen(true);
  }, [hydrated, isReady]);

  return (
    <>
      <Header
        providerLabel={providerLabel(provider)}
        onOpenSettings={() => setModalOpen(true)}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 lg:grid lg:grid-cols-[2fr_3fr] lg:gap-8">
        <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Product Requirements Document
          </h2>
          <p className="text-sm text-text-muted">
            PRD input will appear here.
          </p>
        </section>
        <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-card border border-border bg-surface p-10">
          <p className="max-w-md text-center text-sm leading-6 text-text-secondary">
            Findings will appear here. Load a sample PRD or paste your own to
            get started.
          </p>
        </section>
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
