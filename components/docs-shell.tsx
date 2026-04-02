import type { ReactNode } from "react";

import { DocsShellClient } from "@/components/docs-shell-client";
import { getDocGroups, getDocsSearchEntries, type TocItem } from "@/lib/docs";

export async function DocsShell({
  children,
  currentSlug,
  toc = [],
}: {
  children: ReactNode;
  currentSlug?: string;
  toc?: TocItem[];
}) {
  return (
    <DocsShellClient
      currentSlug={currentSlug}
      groups={getDocGroups()}
      searchEntries={await getDocsSearchEntries()}
      toc={toc}
    >
      {children}
    </DocsShellClient>
  );
}
