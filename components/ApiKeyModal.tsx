"use client";

import { useEffect, useState } from "react";
import type { Provider } from "@/hooks/useApiKey";

type Props = {
  open: boolean;
  initialProvider?: Provider | null;
  onSubmit: (provider: Provider, apiKey: string) => void;
  onClose?: () => void;
  dismissible?: boolean;
};

export default function ApiKeyModal({
  open,
  initialProvider,
  onSubmit,
  onClose,
  dismissible = false,
}: Props) {
  const [provider, setProvider] = useState<Provider | null>(
    initialProvider ?? null,
  );
  const [apiKey, setApiKey] = useState("");
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (open) {
      setProvider(initialProvider ?? null);
      setApiKey("");
      setReveal(false);
    }
  }, [open, initialProvider]);

  if (!open) return null;

  const canSubmit = provider !== null && apiKey.trim().length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configure your AI provider"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className="w-full max-w-md rounded-card border border-border bg-surface-elevated p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Configure your AI provider
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Your API key is stored only in your browser and auto-deletes after 24
          hours. It is never sent to our servers.
        </p>

        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Provider
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["anthropic", "openai"] as Provider[]).map((p) => {
              const selected = provider === p;
              const label = p === "anthropic" ? "Anthropic" : "OpenAI";
              return (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center justify-center rounded-button border px-4 py-3 text-sm transition-colors ${
                    selected
                      ? "border-accent bg-accent/10 text-text-primary"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p}
                    checked={selected}
                    onChange={() => setProvider(p)}
                    className="sr-only"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5">
          <label
            htmlFor="cc-api-key"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            API key
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-input border border-border bg-surface px-3 focus-within:border-accent">
            <input
              id="cc-api-key"
              type={reveal ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                provider === "openai"
                  ? "sk-..."
                  : provider === "anthropic"
                    ? "sk-ant-..."
                    : "Select a provider first"
              }
              className="flex-1 bg-transparent py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="text-xs text-text-secondary hover:text-text-primary"
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {dismissible && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-button border border-border bg-surface px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (canSubmit && provider) onSubmit(provider, apiKey.trim());
            }}
            className="rounded-button bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
