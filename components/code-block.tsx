"use client";

import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";

export function CodeBlock({
  children,
  code,
  languageLabel,
  caption,
}: {
  children: ReactNode;
  code: string;
  languageLabel: string;
  caption: string;
}) {
  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <div className="docs-code-header-main">
          <span className="docs-code-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="docs-code-language">{languageLabel}</span>
        </div>

        <div className="docs-code-actions">
          <span className="docs-code-caption">{caption}</span>
          <CopyButton className="copy-button-code" label="Copy code" text={code} />
        </div>
      </div>

      <pre className="docs-code-pre">
        <code>{children}</code>
      </pre>
    </div>
  );
}
