import Link from "next/link";

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
          <span className="docs-pill">8 framework targets</span>
          <span className="docs-pill">7 npm entrypoints</span>
          <span className="docs-pill">Live session verification complete</span>
        </div>
      </div>

      <div className="docs-split">
        <div className="docs-callout">
          <h2>Support summary</h2>
          <p>
            Next.js, React, React + Vite, Vue + Vite, Nuxt, Express, NestJS, and Angular all have
            runnable examples and live checkout-session verification. The only manual step left is
            scanning and completing a real payment if you want final proof screenshots.
          </p>
        </div>

        <div className="docs-install">
          <h2>Install</h2>
          <p>The package itself stays small. Pick the guide that matches your stack.</p>
          <pre>{`npm install koma-khqr`}</pre>
        </div>
      </div>

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
