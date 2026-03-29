import Link from "next/link";

import { CopyButton } from "@/components/copy-button";
import { DocsShell } from "@/components/docs-shell";
import { getDocGroups } from "@/lib/docs";

export default function DocsIndexPage() {
  const groups = getDocGroups();

  return (
    <DocsShell>
      <div className="docs-hero">
        <span className="docs-eyebrow">Framework Documentation</span>
        <h1 className="docs-title">Use koma-khqr with the framework you already ship.</h1>
        <p className="docs-lead">
          This site follows a product-docs style layout: overview guides first, then framework
          pages, then deeper reference material. Everything here is backed by the existing root
          markdown docs so the content stays in sync.
        </p>
        <div className="docs-pill-row">
          <span className="docs-pill">Node ecosystem guides</span>
          <span className="docs-pill">Custom ecosystem notes</span>
          <span className="docs-pill">Spring, Python, Laravel coming soon</span>
          <span className="docs-pill">Live session verification complete</span>
        </div>
      </div>

      <div className="docs-split">
        <div className="docs-callout">
          <h2>Start with dashboard setup</h2>
          <p>
            Before you open any framework guide, get your merchant info and secret key from the
            Koma dashboard. The new first-setup guide shows exactly where to log in, where to copy
            the secret key, and where Merchant Name and Merchant ID come from.
          </p>
          <div className="docs-action-row">
            <Link className="docs-action-button docs-action-primary" href="/docs/first-setup">
              Open first setup
            </Link>
          </div>
        </div>

        <div className="docs-install">
          <div className="docs-install-head">
            <h2>Install</h2>
            <CopyButton label="Copy install" text="npm install koma-khqr" />
          </div>
          <p>The package itself stays small. Pick the guide that matches your stack.</p>
          <pre>{`npm install koma-khqr`}</pre>
        </div>
      </div>

      <section className="docs-section">
        <div className="docs-section-head">
          <p className="docs-section-label">Structure</p>
          <h2>Choose the integration shape first</h2>
        </div>

        <div className="docs-detail-grid">
          <div className="docs-detail-card">
            <span className="docs-detail-label">Full-stack</span>
            <strong className="docs-detail-value">Next.js or Nuxt</strong>
            <p className="docs-detail-copy">Use the framework’s own server routes. You do not need Express just to get KHQR working.</p>
          </div>
          <div className="docs-detail-card">
            <span className="docs-detail-label">Client-only frontend</span>
            <strong className="docs-detail-value">React, Vite, Vue, Angular</strong>
            <p className="docs-detail-copy">Keep the UI in the frontend and pair it with a small backend that owns `KOMA_SECRET_KEY`.</p>
          </div>
          <div className="docs-detail-card">
            <span className="docs-detail-label">Backend-first</span>
            <strong className="docs-detail-value">Express or NestJS</strong>
            <p className="docs-detail-copy">Use the server adapter directly when you want to plug KHQR into an existing Node backend.</p>
          </div>
          <div className="docs-detail-card">
            <span className="docs-detail-label">Custom ecosystems</span>
            <strong className="docs-detail-value">Spring Boot or Python</strong>
            <p className="docs-detail-copy">Use the setup and signing reference guides when your secure backend is outside the npm runtime family.</p>
          </div>
          <div className="docs-detail-card">
            <span className="docs-detail-label">Coming soon</span>
            <strong className="docs-detail-value">Laravel / PHP</strong>
            <p className="docs-detail-copy">The ecosystem section now includes placeholder direction pages for non-Node runtimes that are not implemented as package entrypoints yet.</p>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section className="docs-section" key={group.id}>
          <div className="docs-section-head">
            <p className="docs-section-label">{group.title}</p>
            <h2>{group.description}</h2>
          </div>

          <div className="docs-card-grid">
            {group.entries.map((entry) => (
              <Link className="docs-card" href={`/docs/${entry.slug}`} key={entry.slug}>
                <span className="docs-card-kicker">{group.title}</span>
                <h3 className="docs-card-title">{entry.title}</h3>
                <p className="docs-card-copy">{entry.description}</p>
                <span className="docs-card-arrow">Read guide →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </DocsShell>
  );
}
