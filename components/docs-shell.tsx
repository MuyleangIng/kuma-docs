import type { ReactNode } from "react";

import Link from "next/link";

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
              href="https://github.com/KhmerStack/koma-khqr"
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
          </nav>
        </div>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          {groups.map((group) => (
            <section className="docs-sidebar-group" key={group.id}>
              <h2 className="docs-sidebar-label">{group.title}</h2>
              <div className="docs-sidebar-list">
                {group.entries.map((entry) => (
                  <Link
                    className={`docs-sidebar-item${currentSlug === entry.slug ? " is-active" : ""}`}
                    href={`/docs/${entry.slug}`}
                    key={entry.slug}
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </aside>

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
