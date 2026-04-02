"use client";

import { useEffect, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentSlug]);

  return (
    <aside className="docs-sidebar">
      <button
        aria-controls="docs-sidebar-body"
        aria-expanded={menuOpen}
        className="docs-sidebar-trigger"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span className="docs-sidebar-trigger-copy">
          <span className="docs-sidebar-trigger-label">Documentation</span>
        </span>
        <span
          aria-hidden="true"
          className={`docs-sidebar-trigger-icon${menuOpen ? " is-open" : ""}`}
        >
          ▾
        </span>
      </button>

      <div className={`docs-sidebar-body${menuOpen ? " is-open" : ""}`} id="docs-sidebar-body">
        <p className="docs-sidebar-title">Documentation</p>

        {groups.map((group) => (
          <section className="docs-sidebar-group" key={group.id}>
            <h2 className="docs-sidebar-label">{group.title}</h2>
            <div className="docs-sidebar-list">
              {group.entries.map((entry) => (
                <Link
                  className={`docs-sidebar-item${currentSlug === entry.slug ? " is-active" : ""}`}
                  href={`/docs/${entry.slug}`}
                  key={entry.slug}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="docs-sidebar-item-title">{entry.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
