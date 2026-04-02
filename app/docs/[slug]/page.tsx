import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsShell } from "@/components/docs-shell";
import {
  DOC_ENTRIES,
  getDocEntry,
  getDocGroup,
  getDocNeighbors,
  getParsedDoc,
  renderCodeSnippet,
  renderMarkdownBlocks,
  toGitHubBlobHref,
  toGitHubTreeHref,
} from "@/lib/docs";

// These slugs have dedicated page routes that override this catch-all
const DEDICATED_ROUTES = new Set(["api-checkout", "api-webhooks", "api-status"]);

export async function generateStaticParams() {
  return DOC_ENTRIES.filter((entry) => !DEDICATED_ROUTES.has(entry.slug)).map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDocEntry(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = await getParsedDoc(slug);

  if (!parsed) {
    notFound();
  }

  const neighbors = getDocNeighbors(slug);
  const group = getDocGroup(parsed.entry.group);

  return (
    <DocsShell currentSlug={slug} toc={parsed.toc}>
      <div className="docs-page-meta">
        <div className="docs-breadcrumbs">
          <Link href="/docs">Docs</Link>
          <span aria-hidden="true">/</span>
          <span>{group?.title ?? parsed.entry.group}</span>
        </div>

        <div className="docs-badge-row">
          <span className="docs-badge">{group?.title ?? parsed.entry.group}</span>
          <span className={`docs-badge ${parsed.entry.status === "coming-soon" ? "is-muted" : ""}`}>
            {parsed.entry.status === "coming-soon" ? "Coming soon" : "Available now"}
          </span>
        </div>

        <h1 className="docs-page-title">{parsed.headline}</h1>
        <p className="docs-page-copy">{parsed.entry.description}</p>

        <div className="docs-action-row">
          {parsed.entry.examplePath ? (
            <a
              className="docs-action-button docs-action-primary"
              href={toGitHubTreeHref(parsed.entry.examplePath)}
              rel="noreferrer"
              target="_blank"
            >
              View example source
            </a>
          ) : null}
          <a
            className="docs-action-button"
            href={toGitHubBlobHref(`content/docs/${parsed.entry.fileName}`)}
            rel="noreferrer"
            target="_blank"
          >
            View public markdown
          </a>
        </div>
      </div>

      {parsed.entry.entrypoint || parsed.entry.runtime || parsed.entry.examplePath ? (
        <section className="docs-detail-grid">
          {parsed.entry.entrypoint ? (
            <div className="docs-detail-card">
              <span className="docs-detail-label">Entrypoint</span>
              <strong className="docs-detail-value">{parsed.entry.entrypoint}</strong>
              <p className="docs-detail-copy">Use this package surface for the main integration point.</p>
            </div>
          ) : null}

          {parsed.entry.runtime ? (
            <div className="docs-detail-card">
              <span className="docs-detail-label">Runtime Shape</span>
              <strong className="docs-detail-value">{parsed.entry.runtime}</strong>
              <p className="docs-detail-copy">This is the server/client split the guide assumes.</p>
            </div>
          ) : null}

          {parsed.entry.examplePath ? (
            <div className="docs-detail-card">
              <span className="docs-detail-label">Quick Test</span>
              <strong className="docs-detail-value">
                {parsed.entry.status === "coming-soon" ? "Guide only for now" : "Example source available"}
              </strong>
              <p className="docs-detail-copy">
                {parsed.entry.status === "coming-soon"
                  ? "This ecosystem page is directional and intentionally marked as coming soon."
                  : "Open the public example source to inspect the file layout and test shape."}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {parsed.entry.structure ? (
        <section className="docs-structure-section">
          <div className="docs-section-head">
            <p className="docs-section-label">Project Structure</p>
            <h2>Typical file layout</h2>
          </div>
          {renderCodeSnippet(parsed.entry.structure, "text", `${slug}-structure`)}
        </section>
      ) : null}

      <article className="docs-article">
        {renderMarkdownBlocks(parsed.blocks, `docs/${parsed.entry.fileName}`)}
      </article>

      <nav className="docs-footer-nav">
        {neighbors.previous ? (
          <Link className="docs-footer-card" href={`/docs/${neighbors.previous.slug}`}>
            <span className="docs-footer-card-label">Previous</span>
            <span className="docs-footer-card-title">{neighbors.previous.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {neighbors.next ? (
          <Link className="docs-footer-card" href={`/docs/${neighbors.next.slug}`}>
            <span className="docs-footer-card-label">Next</span>
            <span className="docs-footer-card-title">{neighbors.next.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </DocsShell>
  );
}
