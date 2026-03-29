import type { ReactNode } from "react";

import Link from "next/link";

import { DocsSidebar } from "@/components/docs-sidebar";
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
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/">
            <span className="site-brand-mark">Kuma Docs</span>
            <span className="site-brand-title">Documentation for koma-khqr</span>
          </Link>

          <nav className="site-links">
            <Link className="site-link" href="/docs">
              Docs Home
            </Link>
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
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div className="docs-layout">
        <DocsSidebar currentSlug={currentSlug} groups={groups} />

        <main className="docs-content-panel">{children}</main>

        <aside className="docs-toc">
          <h2>On This Page</h2>
          {toc.length > 0 ? (
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
          ) : (
            <p className="docs-page-copy">Use the left rail to jump between framework guides.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
