import Link from "next/link";

import { CopyButton } from "@/components/copy-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-brand">
            <span className="site-brand-mark">Kuma Docs</span>
            <span className="site-brand-title">Documentation website for koma-khqr</span>
          </div>
          <nav className="site-links">
            <Link className="site-link site-link-primary" href="/docs">
              Open Docs
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="docs-layout" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        <section className="docs-content-panel">
          <div className="docs-hero">
            <span className="docs-eyebrow">Documentation Website</span>
            <h1 className="docs-title">Framework guides for Koma KHQR.</h1>
            <p className="docs-lead">
              This standalone site turns the package guides into a real docs experience with
              framework navigation, testing references, and a docs-reading layout similar to a
              product documentation site.
            </p>
            <div className="docs-pill-row">
              <span className="docs-pill">Next.js</span>
              <span className="docs-pill">React</span>
              <span className="docs-pill">Vite</span>
              <span className="docs-pill">Vue</span>
              <span className="docs-pill">Nuxt</span>
              <span className="docs-pill">Express</span>
              <span className="docs-pill">NestJS</span>
              <span className="docs-pill">Angular</span>
              <span className="docs-pill">Spring</span>
              <span className="docs-pill">Python</span>
            </div>
          </div>

          <div className="docs-split">
            <div className="docs-callout">
              <h2>Start with Koma dashboard setup</h2>
              <p>
                The docs now include a first-setup guide for getting your API secret key,
                Merchant Name, and Merchant ID before you touch framework code.
              </p>
              <div className="docs-action-row">
                <Link className="docs-action-button docs-action-primary" href="/docs/first-setup">
                  Open first setup
                </Link>
              </div>
            </div>

            <div className="docs-install">
              <div className="docs-install-head">
                <h2>Start browsing</h2>
                <CopyButton label="Copy commands" text={`cd kuma-docs\nnpm install\nnpm run dev`} />
              </div>
              <p>Jump into the finished framework documentation site.</p>
              <pre>{`cd kuma-docs\nnpm install\nnpm run dev`}</pre>
            </div>
          </div>

          <section className="docs-section">
            <div className="docs-section-head">
              <p className="docs-section-label">Open</p>
              <h2>Read the documentation</h2>
            </div>

            <div className="docs-card-grid">
              <Link className="docs-card" href="/docs">
                <span className="docs-card-kicker">Docs Home</span>
                <h3 className="docs-card-title">Documentation Index</h3>
                <p className="docs-card-copy">
                  Browse all framework guides, testing references, and integration notes.
                </p>
                <span className="docs-card-arrow">Open →</span>
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
