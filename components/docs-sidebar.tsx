"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

type SidebarEntry = {
  slug: string;
  title: string;
  description: string;
  entrypoint?: string;
  runtime?: string;
};

type SidebarGroup = {
  id: string;
  title: string;
  entries: SidebarEntry[];
};

export function DocsSidebar({
  currentSlug,
  groups,
}: {
  currentSlug?: string;
  groups: SidebarGroup[];
}) {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) =>
          [entry.title, entry.description, group.title, entry.entrypoint, entry.runtime]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, query]);

  const resultCount = filteredGroups.reduce((count, group) => count + group.entries.length, 0);

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-search">
        <label className="docs-sidebar-search-label" htmlFor="docs-search">
          Search Docs
        </label>
        <div className="docs-search-input-wrap">
          <input
            className="docs-search-input"
            id="docs-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="React, FastAPI, Django, Laravel..."
            type="search"
            value={query}
          />
          {query ? (
            <button className="docs-search-clear" onClick={() => setQuery("")} type="button">
              Clear
            </button>
          ) : null}
        </div>
        <p className="docs-search-meta">
          {query ? `${resultCount} result${resultCount === 1 ? "" : "s"}` : "Search by stack, runtime, or entrypoint."}
        </p>
      </div>

      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <section className="docs-sidebar-group" key={group.id}>
            <h2 className="docs-sidebar-label">{group.title}</h2>
            <div className="docs-sidebar-list">
              {group.entries.map((entry) => (
                <Link
                  className={`docs-sidebar-item${currentSlug === entry.slug ? " is-active" : ""}`}
                  href={`/docs/${entry.slug}`}
                  key={entry.slug}
                >
                  <span className="docs-sidebar-item-title">{entry.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="docs-search-empty">
          <p>No guides match that search.</p>
          <p>Try `Next`, `React`, `FastAPI`, `Spring`, `Django`, or `Laravel`.</p>
        </div>
      )}
    </aside>
  );
}
