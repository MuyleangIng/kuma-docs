import type { ReactNode } from "react";

import Link from "next/link";

import { ApiReferenceDropdown } from "@/components/api-reference-dropdown";
import { DocsSidebar } from "@/components/docs-sidebar";
import { MobileMenuBtn } from "@/components/mobile-menu-btn";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDocGroups, type TocItem } from "@/lib/docs";

export function DocsShell({
  children,
  currentSlug,
  toc = [],
}: {
  children: ReactNode;
  currentSlug?: string;
  toc?: TocItem[];
}) {
  const groups = getDocGroups();

  return (
    <div className="site-shell">
      {/* ── IBM top bar ── */}
      <header className="site-header">
        <div className="site-topbar">
          <div className="site-topbar-left">
            <MobileMenuBtn />
            <Link className="site-brand" href="/">
              <span className="site-brand-mark">Koma KHQR</span>
            </Link>
          </div>

          <div className="site-topbar-right">
            <button className="site-search-btn" type="button">
              <svg className="site-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15.14 14.19l-3.32-3.32a6 6 0 1 0-.95.95l3.32 3.32a.67.67 0 0 0 .95-.95zM2 6.67a4.67 4.67 0 1 1 4.67 4.67A4.67 4.67 0 0 1 2 6.67z" />
              </svg>
              Search
            </button>
            <nav className="site-links">
              <a
                className="site-link"
                href="https://github.com/MuyleangIng/kuma-docs"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="site-link site-link-primary"
                href="https://www.npmjs.com/package/koma-khqr"
                rel="noreferrer"
                target="_blank"
              >
                npm
              </a>
              <ThemeToggle variant="navbar" />
            </nav>
          </div>
        </div>

        {/* ── IBM tab navigation ── */}
        <nav className="site-tabnav">
          <Link className="site-tab is-active" href="/docs">
            Documentation
          </Link>
          <ApiReferenceDropdown />
          <a
            className="site-tab"
            href="https://github.com/MuyleangIng/kuma-docs"
            rel="noreferrer"
            target="_blank"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      {/* ── 3-column layout ── */}
      <div className="docs-layout">
        <DocsSidebar currentSlug={currentSlug} groups={groups} />

        <main className="docs-content-panel">
          {toc.length > 0 ? (
            <details className="docs-mobile-toc">
              <summary>On This Page</summary>
              <div className="docs-toc-list">
                {toc.map((item) => (
                  <a
                    className={`docs-toc-item level-${item.level}`}
                    href={`#${item.id}`}
                    key={item.id}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </details>
          ) : null}

          {children}
        </main>

        <aside className="docs-toc">
          {toc.length > 0 ? (
            <>
              <h2>On this page</h2>
              <div className="docs-toc-list">
                {toc.map((item) => (
                  <a
                    className={`docs-toc-item level-${item.level}`}
                    href={`#${item.id}`}
                    key={item.id}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <p className="docs-page-copy" style={{ fontSize: "13px", color: "var(--muted)" }}>
              Use the left rail to navigate guides.
            </p>
          )}

          <div className="docs-toc-feedback">
            <span className="docs-toc-feedback-label">Was this page helpful?</span>
            <div className="docs-toc-feedback-btns">
              <button className="docs-toc-feedback-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 15H2V7h3v8zm9-8a2 2 0 0 0-2-2H8.33l.67-3.5V1l-.83-.83L7 1 3 5v10h9l2-6V7z" />
                </svg>
                Yes
              </button>
              <button className="docs-toc-feedback-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1H2L0 7v2a2 2 0 0 0 2 2h3.67l-.67 3.5V15l.83.83L7 15l4-4V1zm2 6H16V1h-3v6z" />
                </svg>
                No
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
