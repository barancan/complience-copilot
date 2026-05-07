"use client";

import type { Finding, ReviewResponse } from "@/lib/schema";

type State =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "results"; response: ReviewResponse };

type Props = { state: State };

const EXPOSURE_STYLES: Record<
  ReviewResponse["exposure"],
  { bg: string; text: string; label: string }
> = {
  none: {
    bg: "bg-surface-elevated",
    text: "text-text-secondary",
    label: "No exposure",
  },
  low: {
    bg: "bg-accent/15",
    text: "text-accent",
    label: "Low exposure",
  },
  medium: {
    bg: "bg-severity-warning/15",
    text: "text-severity-warning",
    label: "Medium exposure",
  },
  high: {
    bg: "bg-severity-blocker/15",
    text: "text-severity-blocker",
    label: "High exposure",
  },
};

const SEVERITY_STYLES: Record<
  Finding["severity"],
  { dot: string; text: string; label: string }
> = {
  blocker: {
    dot: "bg-severity-blocker",
    text: "text-severity-blocker",
    label: "Blocker",
  },
  warning: {
    dot: "bg-severity-warning",
    text: "text-severity-warning",
    label: "Warning",
  },
  info: {
    dot: "bg-severity-info",
    text: "text-severity-info",
    label: "Info",
  },
};

export default function FindingsPanel({ state }: Props) {
  if (state.kind === "empty") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-card border border-border bg-surface p-10">
        <p className="max-w-md text-center text-sm leading-6 text-text-secondary">
          Findings will appear here. Load a sample PRD or paste your own to get
          started.
        </p>
      </section>
    );
  }

  if (state.kind === "loading") {
    return (
      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-surface-elevated" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-elevated" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-card border border-border bg-surface-elevated"
            />
          ))}
        </div>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-card border border-severity-blocker/40 bg-severity-blocker/10 p-10">
        <p className="text-sm font-semibold text-severity-blocker">
          Review failed
        </p>
        <p className="max-w-md text-center text-sm text-text-secondary">
          {state.message}
        </p>
      </section>
    );
  }

  const { response } = state;
  const exposure = EXPOSURE_STYLES[response.exposure];

  return (
    <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-6">
      <header className="flex flex-col gap-3">
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${exposure.bg} ${exposure.text}`}
        >
          {exposure.label}
        </span>
        <p className="text-sm leading-6 text-text-primary">
          {response.summary}
        </p>
      </header>

      {response.findings.length === 0 ? (
        <p className="text-sm text-text-muted">
          No findings — the PRD as written has no regulatory implications under
          the current corpus.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {response.findings.map((f, i) => (
            <FindingCard key={i} finding={f} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const sev = SEVERITY_STYLES[finding.severity];

  return (
    <li className="relative flex flex-col gap-3 rounded-card border border-border bg-surface-elevated p-5">
      {finding.needsHumanReview ? (
        <span className="absolute right-4 top-4 rounded-full border border-severity-warning/40 bg-severity-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-severity-warning">
          Flag for human review
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={`inline-block h-2 w-2 rounded-full ${sev.dot}`}
        />
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${sev.text}`}
        >
          {sev.label}
        </span>
      </div>

      <h3 className="text-base font-semibold text-text-primary">
        {finding.title}
      </h3>
      <p className="text-sm leading-6 text-text-secondary">
        {finding.reasoning}
      </p>

      {finding.citations.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {finding.citations.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary"
              title={c.id}
            >
              {c.regulation} — {c.clause}
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-sm italic leading-6 text-text-secondary">
        <span className="not-italic font-medium text-text-primary">
          Suggested mitigation:
        </span>{" "}
        {finding.mitigation}
      </p>

      <p className="self-end text-[11px] text-text-muted">
        Confidence: {finding.confidence}
      </p>
    </li>
  );
}
