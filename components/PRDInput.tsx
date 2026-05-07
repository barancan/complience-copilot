"use client";

import { SAMPLE_PRDS } from "@/lib/samplePRDs";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  isRunning: boolean;
  disabled?: boolean;
};

const SHORT_LABEL: Record<string, string> = {
  "Clean PRD": "Clean",
  "Mixed-findings PRD": "Mixed",
  "Blocker PRD": "Blocker",
};

export default function PRDInput({
  value,
  onChange,
  onRun,
  isRunning,
  disabled,
}: Props) {
  const canRun = value.trim().length > 0 && !isRunning && !disabled;

  return (
    <section className="flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Product Requirements Document
        </h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRDS.map((prd) => (
            <button
              key={prd.id}
              type="button"
              onClick={() => onChange(prd.body)}
              className="rounded-button border border-border bg-surface-elevated px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
            >
              Load: {SHORT_LABEL[prd.label] ?? prd.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your PRD here..."
        spellCheck={false}
        className="min-h-[400px] flex-1 resize-none rounded-input border border-border bg-bg p-4 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
      />

      <button
        type="button"
        onClick={onRun}
        disabled={!canRun}
        className={`rounded-button px-4 py-3 text-sm font-semibold transition-colors ${
          canRun
            ? "bg-accent text-bg hover:bg-accent-hover"
            : "cursor-not-allowed bg-surface-elevated text-text-muted"
        } ${isRunning ? "animate-pulse" : ""}`}
      >
        {isRunning ? "Reviewing..." : "Run review"}
      </button>
    </section>
  );
}
