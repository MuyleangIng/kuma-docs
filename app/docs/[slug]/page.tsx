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
  renderMarkdownBlocks,
} from "@/lib/docs";

export async function generateStaticParams() {
  return DOC_ENTRIES.map((entry) => ({ slug: entry.slug }));
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
          <a
            className="docs-badge"
            href={`https://github.com/KhmerStack/koma-khqr/blob/main/docs/${parsed.entry.fileName}`}
            rel="noreferrer"
            target="_blank"
          >
            Source
          </a>
        </div>

        <h1 className="docs-page-title">{parsed.headline}</h1>
        <p className="docs-page-copy">{parsed.entry.description}</p>
      </div>

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
