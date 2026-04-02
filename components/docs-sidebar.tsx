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
  // mobile accordion open/closed
  const [mobileOpen, setMobileOpen] = useState(false);
  // desktop sidebar collapsed/expanded (false = visible by default)
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [currentSlug]);

  // Header hamburger button toggles:
  //   - on mobile  → accordion open/close
  //   - on desktop → sidebar collapse/expand
  useEffect(() => {
    function onToggle() {
      if (window.innerWidth <= 900) {
        setMobileOpen((o) => !o);
      } else {
        setCollapsed((c) => !c);
      }
    }
    window.addEventListener("koma:toggle-sidebar", onToggle);
    return () => window.removeEventListener("koma:toggle-sidebar", onToggle);
  }, []);

  return (
    <aside
      className="docs-sidebar"
      data-collapsed={collapsed ? "true" : undefined}
    >
      {/* Mobile accordion trigger */}
      <button
        aria-controls="docs-sidebar-body"
        aria-expanded={mobileOpen}
        className="docs-sidebar-trigger"
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span className="docs-sidebar-trigger-copy">
          <span className="docs-sidebar-trigger-label">Documentation</span>
        </span>
        <span
          aria-hidden="true"
          className={`docs-sidebar-trigger-icon${mobileOpen ? " is-open" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        className={`docs-sidebar-body${mobileOpen ? " is-open" : ""}`}
        id="docs-sidebar-body"
      >
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
                  onClick={() => setMobileOpen(false)}
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
