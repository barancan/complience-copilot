"use client";

import { useCallback, useEffect, useState } from "react";

export type Provider = "anthropic" | "openai";

type Stored = {
  provider: Provider;
  apiKey: string;
  expiresAt: number;
};

const STORAGE_KEY = "cc.apiKey";
const TTL_MS = 24 * 60 * 60 * 1000;

function readStorage(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (
      (parsed.provider !== "anthropic" && parsed.provider !== "openai") ||
      typeof parsed.apiKey !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed as Stored;
  } catch {
    return null;
  }
}

export function useApiKey() {
  const [hydrated, setHydrated] = useState(false);
  const [stored, setStored] = useState<Stored | null>(null);

  useEffect(() => {
    setStored(readStorage());
    setHydrated(true);
  }, []);

  const setKey = useCallback((provider: Provider, apiKey: string) => {
    const next: Stored = {
      provider,
      apiKey,
      expiresAt: Date.now() + TTL_MS,
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    setStored(next);
  }, []);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setStored(null);
  }, []);

  return {
    provider: stored?.provider ?? null,
    apiKey: stored?.apiKey ?? null,
    expiresAt: stored?.expiresAt ?? null,
    isReady: hydrated && stored !== null,
    hydrated,
    setKey,
    clear,
  };
}
