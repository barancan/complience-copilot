"use client";

type Props = {
  providerLabel?: string;
  onOpenSettings?: () => void;
};

export default function Header({ providerLabel, onOpenSettings }: Props) {
  return (
    <header className="w-full border-b border-border/80 bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-button bg-accent text-bg font-semibold">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-text-primary">
              Compliance Co-pilot
            </span>
            <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
              POC
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-secondary sm:inline">
            {providerLabel ?? "No provider configured"}
          </span>
          <button
            type="button"
            aria-label="Open settings"
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
