"use client";

import Link from "next/link";

export type DocsSidebarEntry = {
  slug: string;
  title: string;
  description: string;
  entrypoint?: string;
  runtime?: string;
};

export type DocsSidebarGroup = {
  id: string;
  title: string;
  entries: DocsSidebarEntry[];
};

export function DocsSidebar({
  currentSlug,
  groups,
  isMobileOpen,
  isDesktopCollapsed,
  onCloseMobile,
}: {
  currentSlug?: string;
  groups: DocsSidebarGroup[];
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {isMobileOpen ? (
        <button
          aria-label="Close navigation"
          className="docs-sidebar-backdrop"
          type="button"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        aria-label="Documentation navigation"
        className={`docs-sidebar${isMobileOpen ? " is-mobile-open" : ""}`}
        data-collapsed={isDesktopCollapsed ? "true" : undefined}
        id="docs-sidebar"
      >
        <div className="docs-sidebar-body">
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
                    onClick={onCloseMobile}
                  >
                    <span className="docs-sidebar-item-title">{entry.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <div className="docs-sidebar-mobile-links">
            <span className="docs-sidebar-mobile-links-label">Quick links</span>
            <div className="docs-sidebar-mobile-links-grid">
              <Link className="docs-sidebar-mobile-link" href="/docs" onClick={onCloseMobile}>
                Docs home
              </Link>
              <a
                className="docs-sidebar-mobile-link"
                href="https://github.com/MuyleangIng/kuma-docs"
                rel="noreferrer"
                target="_blank"
                onClick={onCloseMobile}
              >
                GitHub ↗
              </a>
              <a
                className="docs-sidebar-mobile-link"
                href="https://www.npmjs.com/package/koma-khqr"
                rel="noreferrer"
                target="_blank"
                onClick={onCloseMobile}
              >
                npm package ↗
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
