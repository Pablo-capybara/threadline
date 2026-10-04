"use client";

import * as React from "react";
import { CornerDownLeft, X } from "lucide-react";

import { SparkleIcon } from "@/components/icons";
import { ASK_EXAMPLES } from "@/lib/clients/ask";
import { cn } from "@/lib/utils";

/**
 * "Ask Threadline" input. Submitting hands the raw text to `onAsk`; the parent
 * turns it into filter chips. Press "/" anywhere on the page to focus it.
 */
export function AskBar({ onAsk }: { onAsk: (query: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLFormElement>(null);
  const [value, setValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  // Hide suggestions after a submit until the user focuses or types again.
  const [examplesDismissed, setExamplesDismissed] = React.useState(false);
  const listId = React.useId();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, [contenteditable=true]");
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (query: string) => {
    if (!query.trim()) return;
    onAsk(query);
    setValue("");
    setExamplesDismissed(true);
  };

  const showExamples = focused && !examplesDismissed && value.trim() === "";

  return (
    <form
      ref={containerRef}
      role="search"
      className="relative w-full sm:w-[480px]"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      onFocus={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setExamplesDismissed(false);
        setFocused(true);
      }}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <label
        className={cn(
          "flex h-[33px] cursor-text items-center gap-2 rounded-sm border border-border bg-background px-3",
          "transition-[border-color,box-shadow] duration-150 ease-out hover:border-floating-border",
          "focus-within:border-ai/60 focus-within:shadow-[0_0_0_3px_rgb(59_130_246/0.12)]",
        )}
      >
        <SparkleIcon className="shrink-0 text-ai" />
        <span className="sr-only">Ask Threadline</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setExamplesDismissed(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (showExamples || value) {
                setValue("");
                setExamplesDismissed(true);
              } else inputRef.current?.blur();
            }
          }}
          placeholder="Ask Threadline: show renewals due this month"
          aria-describedby={showExamples ? listId : undefined}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-subtle-foreground"
        />
        {value ? (
          <span className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setValue("");
                inputRef.current?.focus();
              }}
              className="flex size-5 items-center justify-center rounded-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <X className="size-3" strokeWidth={2} />
            </button>
            <kbd className="flex h-5 items-center rounded-xs border border-border px-1 text-muted-foreground">
              <CornerDownLeft className="size-3" strokeWidth={2} aria-label="Enter" />
            </kbd>
          </span>
        ) : (
          <kbd
            aria-hidden
            className="flex h-5 min-w-5 items-center justify-center rounded-xs border border-border px-1 text-meta text-subtle-foreground"
          >
            /
          </kbd>
        )}
      </label>

      {showExamples && (
        <div
          id={listId}
          className={cn(
            "absolute inset-x-0 top-[calc(100%+6px)] z-40 rounded-md border border-border bg-popover p-1 shadow-popover",
            "origin-top animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1 duration-150 ease-out",
          )}
        >
          <p className="px-2 pt-1.5 pb-1 text-label font-semibold uppercase tracking-[0.04em] text-subtle-foreground">
            Try asking
          </p>
          <ul>
            {ASK_EXAMPLES.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    submit(example);
                    inputRef.current?.blur();
                  }}
                  className="flex w-full items-center gap-2 rounded-xs px-2 py-1.5 text-left text-body text-foreground transition-colors duration-100 hover:bg-surface-hover"
                >
                  <SparkleIcon width={12} height={12} className="shrink-0 text-subtle-foreground" />
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
