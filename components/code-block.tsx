"use client";

import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";

export function CodeBlock({
  children,
  code,
  languageLabel: _languageLabel,
  caption: _caption,
}: {
  children: ReactNode;
  code: string;
  languageLabel: string;
  caption: string;
}) {
  return (
    <div className="docs-code-block">
      <CopyButton className="copy-button-code copy-button-icon" label="" text={code} />
      <pre className="docs-code-pre">
        <code>{children}</code>
      </pre>
    </div>
  );
}
