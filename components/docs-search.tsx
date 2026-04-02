"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";

type DocsSearchEntry = {
  href: string;
  title: string;
  description: string;
  group: string;
  body: string;
};

function scoreEntry(entry: DocsSearchEntry, query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return 0;
  }

  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const group = entry.group.toLowerCase();
  const body = entry.body.toLowerCase();

  let score = 0;

  for (const term of terms) {
    if (!title.includes(term) && !description.includes(term) && !group.includes(term) && !body.includes(term)) {
      return -1;
    }

    if (title.includes(term)) {
      score += 100;
    }
    if (description.includes(term)) {
      score += 45;
    }
    if (group.includes(term)) {
      score += 25;
    }
    if (body.includes(term)) {
      score += 15;
    }
  }

  return score;
}

export function DocsSearch({
  entries,
  isOffline,
  onClose,
  open,
}: {
  entries: DocsSearchEntry[];
  isOffline: boolean;
  onClose: () => void;
  open: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const results = useMemo(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      return entries.slice(0, 8);
    }

    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
      .filter((item) => item.score >= 0)
      .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title))
      .slice(0, 12)
      .map((item) => item.entry);
  }, [entries, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="docs-search-root" role="dialog" aria-modal="true" aria-label="Search documentation">
      <button className="docs-search-backdrop" type="button" aria-label="Close search" onClick={onClose} />
      <div className="docs-search-dialog">
        <div className="docs-search-head">
          <div className="docs-search-input-wrap">
            <svg className="docs-search-panel-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.14 14.19l-3.32-3.32a6 6 0 1 0-.95.95l3.32 3.32a.67.67 0 0 0 .95-.95zM2 6.67a4.67 4.67 0 1 1 4.67 4.67A4.67 4.67 0 0 1 2 6.67z" />
            </svg>
            <input
              ref={inputRef}
              className="docs-search-input"
              type="search"
              placeholder="Search docs, API reference, guides..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button className="docs-search-clear" type="button" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : null}
          </div>
          <button className="docs-search-close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="docs-search-meta">
          <span>{query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Start typing to search"}</span>
          {isOffline ? <span className="docs-search-offline-note">You lost internet. Local docs search still works.</span> : null}
        </div>

        <div className="docs-search-results">
          {results.length > 0 ? (
            results.map((entry) => (
              <Link className="docs-search-result" href={entry.href} key={entry.href} onClick={onClose}>
                <span className="docs-search-result-group">{entry.group}</span>
                <strong className="docs-search-result-title">{entry.title}</strong>
                <span className="docs-search-result-copy">{entry.description}</span>
              </Link>
            ))
          ) : (
            <div className="docs-search-empty">
              <p>No matching docs found.</p>
              <span>Try a framework name, endpoint, event, or runtime keyword.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
