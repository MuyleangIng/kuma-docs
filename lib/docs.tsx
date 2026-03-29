import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";

import Link from "next/link";

const DOCS_DIR = path.join(process.cwd(), "..", "docs");
const GITHUB_BLOB_BASE = "https://github.com/KhmerStack/koma-khqr/blob/main/";

export type DocGroupId = "overview" | "frameworks" | "reference";

export interface DocEntry {
  slug: string;
  fileName: string;
  title: string;
  description: string;
  group: DocGroupId;
}

export interface TocItem {
  id: string;
  level: 2 | 3;
  text: string;
}

type CodeTokenKind =
  | "plain"
  | "comment"
  | "keyword"
  | "string"
  | "number"
  | "operator"
  | "punctuation"
  | "function"
  | "property"
  | "type"
  | "constant"
  | "tag"
  | "command"
  | "flag"
  | "variable"
  | "path"
  | "key";

interface CodeToken {
  type: CodeTokenKind;
  value: string;
}

type MarkdownBlock =
  | { type: "heading"; id: string; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: Array<{ checked: boolean | null; text: string }> }
  | { type: "ordered-list"; items: string[] }
  | { type: "code"; code: string; language: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export const DOC_GROUPS = [
  {
    id: "overview" as const,
    title: "Start Here",
    description: "Architecture, support, and testing guides for the whole package.",
  },
  {
    id: "frameworks" as const,
    title: "Framework Guides",
    description: "Framework-by-framework setup guides and runnable example references.",
  },
  {
    id: "reference" as const,
    title: "Reference",
    description: "Provider rules, sandbox notes, and operational details.",
  },
] satisfies Array<{ id: DocGroupId; title: string; description: string }>;

export const DOC_ENTRIES: DocEntry[] = [
  {
    slug: "framework-recipes",
    fileName: "framework-recipes.md",
    title: "Framework Recipes",
    description: "Choose the right package entrypoint and app shape for each supported framework.",
    group: "overview",
  },
  {
    slug: "framework-support-checklist",
    fileName: "framework-support-checklist.md",
    title: "Framework Support Checklist",
    description: "The release-grade support matrix, runtime floors, and verification state.",
    group: "overview",
  },
  {
    slug: "testing-matrix",
    fileName: "testing-matrix.md",
    title: "Testing Matrix",
    description: "What is build-verified, route-probed, and live-session verified today.",
    group: "overview",
  },
  {
    slug: "sandbox-testing",
    fileName: "sandbox-testing.md",
    title: "Sandbox Testing",
    description: "The shared env contract and local sandbox rules used across every example.",
    group: "overview",
  },
  {
    slug: "next-typescript",
    fileName: "next-typescript.md",
    title: "Next.js TypeScript",
    description: "Use the first-class Next helpers with App Router and TypeScript.",
    group: "frameworks",
  },
  {
    slug: "next-javascript",
    fileName: "next-javascript.md",
    title: "Next.js JavaScript",
    description: "Use the same App Router flow in plain JavaScript.",
    group: "frameworks",
  },
  {
    slug: "react",
    fileName: "react.md",
    title: "React",
    description: "Understand the React UI layer and the server runtime it still needs.",
    group: "frameworks",
  },
  {
    slug: "react-vite-typescript",
    fileName: "react-vite-typescript.md",
    title: "React + Vite TypeScript",
    description: "Vite frontend plus Express backend with TypeScript-ready structure.",
    group: "frameworks",
  },
  {
    slug: "react-vite-javascript",
    fileName: "react-vite-javascript.md",
    title: "React + Vite JavaScript",
    description: "The same Vite pattern in plain JavaScript.",
    group: "frameworks",
  },
  {
    slug: "vue",
    fileName: "vue.md",
    title: "Vue",
    description: "Use Vue with a small backend or move to Nuxt for a stronger full-stack fit.",
    group: "frameworks",
  },
  {
    slug: "nuxt",
    fileName: "nuxt.md",
    title: "Nuxt",
    description: "Nuxt pages and server routes for a full-stack KHQR integration.",
    group: "frameworks",
  },
  {
    slug: "express",
    fileName: "express.md",
    title: "Express",
    description: "Ready-made backend endpoints for client-only frontends.",
    group: "frameworks",
  },
  {
    slug: "nest",
    fileName: "nest.md",
    title: "NestJS",
    description: "Controller and service layering for a more structured Node backend.",
    group: "frameworks",
  },
  {
    slug: "angular",
    fileName: "angular.md",
    title: "Angular",
    description: "Angular frontend plus Express or Nest backend for secure signing.",
    group: "frameworks",
  },
  {
    slug: "pi-integration",
    fileName: "pi-integration.md",
    title: "PI Integration Reference",
    description: "Provider request shape, signing rules, and operational notes.",
    group: "reference",
  },
  {
    slug: "webcontainer-sandboxes",
    fileName: "webcontainer-sandboxes.md",
    title: "WebContainer Sandboxes",
    description: "How to keep StackBlitz-style sandboxes aligned with the main integration contract.",
    group: "reference",
  },
];

const DOC_ENTRY_BY_SLUG = new Map(DOC_ENTRIES.map((entry) => [entry.slug, entry]));

const SCRIPT_KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "of",
  "return",
  "static",
  "super",
  "switch",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "void",
  "while",
]);

const SCRIPT_CONSTANTS = new Set([
  "false",
  "null",
  "true",
  "undefined",
  "readonly",
  "public",
  "private",
  "protected",
]);

const SHELL_KEYWORDS = new Set([
  "case",
  "do",
  "done",
  "elif",
  "else",
  "esac",
  "export",
  "fi",
  "for",
  "function",
  "if",
  "in",
  "local",
  "then",
  "unset",
  "while",
]);

const SHELL_COMMANDS = new Set([
  "bash",
  "bun",
  "cd",
  "cp",
  "curl",
  "git",
  "mkdir",
  "node",
  "npm",
  "npx",
  "pnpm",
  "rm",
  "sed",
  "touch",
  "ts-node",
  "vite",
  "yarn",
]);

export function getDocGroups() {
  return DOC_GROUPS.map((group) => ({
    ...group,
    entries: DOC_ENTRIES.filter((entry) => entry.group === group.id),
  }));
}

export function getDocGroup(groupId: DocGroupId) {
  return DOC_GROUPS.find((group) => group.id === groupId) ?? null;
}

export function getDocEntry(slug: string) {
  return DOC_ENTRY_BY_SLUG.get(slug) ?? null;
}

export function getDocNeighbors(slug: string) {
  const index = DOC_ENTRIES.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    return { previous: null, next: null } as const;
  }

  return {
    previous: index > 0 ? DOC_ENTRIES[index - 1] : null,
    next: index < DOC_ENTRIES.length - 1 ? DOC_ENTRIES[index + 1] : null,
  } as const;
}

export async function getParsedDoc(slug: string) {
  const entry = getDocEntry(slug);

  if (!entry) {
    return null;
  }

  const source = await fs.readFile(path.join(DOCS_DIR, entry.fileName), "utf8");
  const { blocks, toc } = parseMarkdown(source, `docs/${entry.fileName}`);
  const headline =
    blocks[0]?.type === "heading" && blocks[0].level === 1 ? blocks[0].text : entry.title;

  return {
    entry,
    headline,
    blocks:
      blocks[0]?.type === "heading" && blocks[0].level === 1 ? blocks.slice(1) : blocks,
    toc,
  };
}

export function renderMarkdownBlocks(blocks: MarkdownBlock[], currentFilePath: string) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case "heading":
        if (block.level === 2) {
          return (
            <h2 id={block.id} key={key}>
              {renderInline(block.text, currentFilePath, key)}
            </h2>
          );
        }

        return (
          <h3 id={block.id} key={key}>
            {renderInline(block.text, currentFilePath, key)}
          </h3>
        );

      case "paragraph":
        return <p key={key}>{renderInline(block.text, currentFilePath, key)}</p>;

      case "unordered-list":
        return (
          <ul key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                {item.checked !== null ? (
                  <span aria-hidden="true">{item.checked ? "[x] " : "[ ] "}</span>
                ) : null}
                {renderInline(item.text, currentFilePath, `${key}-${itemIndex}`)}
              </li>
            ))}
          </ul>
        );

      case "ordered-list":
        return (
          <ol key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                {renderInline(item, currentFilePath, `${key}-${itemIndex}`)}
              </li>
            ))}
          </ol>
        );

      case "code":
        return (
          <div className="docs-code-block" key={key}>
            <div className="docs-code-header">
              <div className="docs-code-header-main">
                <span className="docs-code-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="docs-code-language">
                  {formatCodeLanguage(block.language || "code")}
                </span>
              </div>
              <span className="docs-code-caption">{getCodeCaption(block.language)}</span>
            </div>
            <pre className="docs-code-pre">
              <code>
                {renderCodeLines(block.code, block.language || "text", `${key}-code`)}
              </code>
            </pre>
          </div>
        );

      case "table":
        return (
          <div className="docs-table-wrap" key={key}>
            <table>
              <thead>
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={`${key}-header-${headerIndex}`}>
                      {renderInline(header, currentFilePath, `${key}-header-${headerIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${key}-row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>
                        {renderInline(cell, currentFilePath, `${key}-cell-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  });
}

function parseMarkdown(source: string, currentFilePath: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  const toc: TocItem[] = [];
  const headingCounts = new Map<string, number>();

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const codeFenceMatch = trimmed.match(/^```([\w-]*)/);
    if (codeFenceMatch) {
      const codeLines: string[] = [];
      const language = codeFenceMatch[1] ?? "";
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      blocks.push({ type: "code", code: codeLines.join("\n"), language });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      const text = headingMatch[2].trim();
      const id = createHeadingId(text, headingCounts);

      blocks.push({ type: "heading", id, level, text });

      if (level === 2 || level === 3) {
        toc.push({ id, level, text });
      }

      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(lines[index]);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (trimmed.match(/^-\s+/)) {
      const items: Array<{ checked: boolean | null; text: string }> = [];

      while (index < lines.length) {
        const listLine = lines[index].trim();
        const taskMatch = listLine.match(/^- \[( |x|X)\]\s+(.*)$/);
        const bulletMatch = listLine.match(/^- (.*)$/);

        if (!taskMatch && !bulletMatch) {
          break;
        }

        if (taskMatch) {
          items.push({
            checked: taskMatch[1].toLowerCase() === "x",
            text: taskMatch[2].trim(),
          });
        } else if (bulletMatch) {
          items.push({
            checked: null,
            text: bulletMatch[1].trim(),
          });
        }

        index += 1;
      }

      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (trimmed.match(/^\d+\.\s+/)) {
      const items: string[] = [];

      while (index < lines.length) {
        const orderedMatch = lines[index].trim().match(/^\d+\.\s+(.*)$/);

        if (!orderedMatch) {
          break;
        }

        items.push(orderedMatch[1].trim());
        index += 1;
      }

      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const nextLine = lines[index];
      const nextTrimmed = nextLine.trim();

      if (
        !nextTrimmed ||
        nextTrimmed.match(/^```/) ||
        nextTrimmed.match(/^(#{1,3})\s+/) ||
        nextTrimmed.match(/^-\s+/) ||
        nextTrimmed.match(/^\d+\.\s+/) ||
        isTableStart(lines, index)
      ) {
        break;
      }

      paragraphLines.push(nextTrimmed);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return { blocks, toc, currentFilePath };
}

function createHeadingId(text: string, counts: Map<string, number>) {
  const base =
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
  const count = counts.get(base) ?? 0;

  counts.set(base, count + 1);

  return count === 0 ? base : `${base}-${count + 1}`;
}

function isTableStart(lines: string[], index: number) {
  const line = lines[index]?.trim();
  const divider = lines[index + 1]?.trim();

  return Boolean(
    line?.startsWith("|") &&
      divider?.startsWith("|") &&
      divider
        .split("|")
        .filter(Boolean)
        .every((cell) => /^:?-{3,}:?$/.test(cell.trim())),
  );
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderInline(text: string, currentFilePath: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      const resolved = resolveMarkdownHref(match[3], currentFilePath);
      const content = renderInline(match[2], currentFilePath, `${keyPrefix}-${match.index}`);

      nodes.push(
        resolved.internal ? (
          <Link href={resolved.href} key={`${keyPrefix}-${match.index}`}>
            {content}
          </Link>
        ) : (
          <a
            href={resolved.href}
            key={`${keyPrefix}-${match.index}`}
            rel="noreferrer"
            target={resolved.external ? "_blank" : undefined}
          >
            {content}
          </a>
        ),
      );
    } else if (match[4]) {
      nodes.push(<code key={`${keyPrefix}-${match.index}`}>{match[4]}</code>);
    } else if (match[5]) {
      nodes.push(<strong key={`${keyPrefix}-${match.index}`}>{match[5]}</strong>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function resolveMarkdownHref(href: string, currentFilePath: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return { href, external: true, internal: false };
  }

  if (href.startsWith("#")) {
    return { href, external: false, internal: false };
  }

  const normalized = href.startsWith("/")
    ? href.replace(/^\//, "")
    : path.posix.normalize(path.posix.join(path.posix.dirname(currentFilePath), href));

  if (normalized.startsWith("docs/") && normalized.endsWith(".md")) {
    return {
      href: `/docs/${path.posix.basename(normalized, ".md")}`,
      external: false,
      internal: true,
    };
  }

  return {
    href: `${GITHUB_BLOB_BASE}${normalized}`,
    external: true,
    internal: false,
  };
}

function renderCodeLines(code: string, language: string, keyPrefix: string) {
  const family = normalizeCodeLanguage(language);
  const lines = code.replace(/\n$/, "").split("\n");

  return lines.map((line, index) => (
    <span className="docs-code-line" key={`${keyPrefix}-${index}`}>
      <span className="docs-code-gutter" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="docs-code-content">
        {line.length > 0
          ? renderCodeTokens(tokenizeCodeLine(line, family), `${keyPrefix}-${index}`)
          : "\u00A0"}
      </span>
    </span>
  ));
}

function renderCodeTokens(tokens: CodeToken[], keyPrefix: string) {
  return tokens.map((token, index) => (
    <span className={`token token-${token.type}`} key={`${keyPrefix}-${index}`}>
      {token.value}
    </span>
  ));
}

function tokenizeCodeLine(line: string, language: string): CodeToken[] {
  switch (language) {
    case "shell":
      return tokenizeShellLine(line);
    case "env":
      return tokenizeEnvLine(line);
    case "script":
      return tokenizeScriptLine(line);
    default:
      return [{ type: "plain", value: line }];
  }
}

function tokenizeScriptLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const pattern =
    /\/\/.*$|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][\w:-]*|[A-Za-z_$][\w$]*|0x[\da-fA-F]+|\b\d+(?:\.\d+)?\b|===|!==|=>|==|!=|<=|>=|&&|\|\||[=+\-*/%<>!&|?:]+|[{}[\]().,;,]|\s+|./g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    const value = match[0];

    if (/^\s+$/.test(value)) {
      tokens.push({ type: "plain", value });
      continue;
    }

    if (value.startsWith("//") || value.startsWith("/*")) {
      tokens.push({ type: "comment", value });
      continue;
    }

    if (/^["'`]/.test(value)) {
      tokens.push({ type: "string", value });
      continue;
    }

    if (/^<\/?[A-Za-z]/.test(value)) {
      tokens.push({ type: "tag", value });
      continue;
    }

    if (/^(0x[\da-fA-F]+|\d+(\.\d+)?)$/.test(value)) {
      tokens.push({ type: "number", value });
      continue;
    }

    if (/^[{}[\]().,;]+$/.test(value)) {
      tokens.push({ type: "punctuation", value });
      continue;
    }

    if (/^(===|!==|=>|==|!=|<=|>=|&&|\|\||[=+\-*/%<>!&|?:]+)$/.test(value)) {
      tokens.push({ type: "operator", value });
      continue;
    }

    const previousChar = getPreviousNonWhitespace(line, match.index);
    const nextChar = getNextNonWhitespace(line, match.index + value.length);

    if (SCRIPT_KEYWORDS.has(value)) {
      tokens.push({ type: "keyword", value });
    } else if (SCRIPT_CONSTANTS.has(value)) {
      tokens.push({ type: "constant", value });
    } else if (previousChar === ".") {
      tokens.push({ type: "property", value });
    } else if (nextChar === "(") {
      tokens.push({ type: "function", value });
    } else if (/^[A-Z]/.test(value)) {
      tokens.push({ type: "type", value });
    } else {
      tokens.push({ type: "plain", value });
    }
  }

  return tokens;
}

function tokenizeShellLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const pattern =
    /#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\$[A-Za-z_][A-Za-z0-9_]*|--[\w-]+|-[A-Za-z]+|[A-Za-z_][A-Za-z0-9_]*=|\.{0,2}\/[^\s]+|\/[^\s]+|[A-Za-z_][A-Za-z0-9_-]*|&&|\|\||[=:+]|[{}()[\],;]|\s+|./g;
  let match: RegExpExecArray | null;
  let seenCommand = false;

  while ((match = pattern.exec(line)) !== null) {
    const value = match[0];

    if (/^\s+$/.test(value)) {
      tokens.push({ type: "plain", value });
      continue;
    }

    if (value.startsWith("#")) {
      tokens.push({ type: "comment", value });
      continue;
    }

    if (/^["'`]/.test(value)) {
      tokens.push({ type: "string", value });
      continue;
    }

    if (value.startsWith("$")) {
      tokens.push({ type: "variable", value });
      continue;
    }

    if (value.startsWith("--") || /^-[A-Za-z]+$/.test(value)) {
      tokens.push({ type: "flag", value });
      continue;
    }

    if (value.endsWith("=") && /^[A-Za-z_][A-Za-z0-9_]*=$/.test(value)) {
      tokens.push({ type: "key", value: value.slice(0, -1) });
      tokens.push({ type: "operator", value: "=" });
      continue;
    }

    if (value.startsWith("./") || value.startsWith("../") || value.startsWith("/")) {
      tokens.push({ type: "path", value });
      continue;
    }

    if (/^(&&|\|\||[=:+])$/.test(value)) {
      tokens.push({ type: "operator", value });
      continue;
    }

    if (/^[{}()[\],;]$/.test(value)) {
      tokens.push({ type: "punctuation", value });
      continue;
    }

    if (SHELL_KEYWORDS.has(value)) {
      tokens.push({ type: "keyword", value });
      seenCommand = true;
      continue;
    }

    if (!seenCommand && /^[A-Za-z_][A-Za-z0-9_-]*$/.test(value)) {
      tokens.push({
        type: SHELL_COMMANDS.has(value) ? "command" : "plain",
        value,
      });
      seenCommand = true;
      continue;
    }

    if (/^(true|false|null)$/.test(value)) {
      tokens.push({ type: "constant", value });
      continue;
    }

    tokens.push({ type: "plain", value });
  }

  return tokens;
}

function tokenizeEnvLine(line: string): CodeToken[] {
  const commentMatch = line.match(/^(\s*#.*)$/);

  if (commentMatch) {
    return [{ type: "comment", value: commentMatch[1] }];
  }

  const assignmentMatch = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)(=)(.*)$/);

  if (!assignmentMatch) {
    return [{ type: "plain", value: line }];
  }

  const [, leading, key, operator, rawValue] = assignmentMatch;
  const tokens: CodeToken[] = [];

  if (leading) {
    tokens.push({ type: "plain", value: leading });
  }

  tokens.push({ type: "key", value: key });
  tokens.push({ type: "operator", value: operator });
  tokens.push(...tokenizeEnvValue(rawValue));

  return tokens;
}

function tokenizeEnvValue(value: string): CodeToken[] {
  if (!value) {
    return [];
  }

  const tokens: CodeToken[] = [];
  const pattern =
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$[A-Za-z_][A-Za-z0-9_]*|https?:\/\/[^\s]+|[A-Za-z0-9_./:@-]+|\s+|./g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    const token = match[0];

    if (/^\s+$/.test(token)) {
      tokens.push({ type: "plain", value: token });
    } else if (/^["']/.test(token)) {
      tokens.push({ type: "string", value: token });
    } else if (token.startsWith("$")) {
      tokens.push({ type: "variable", value: token });
    } else if (token.includes("://") || token.startsWith("./") || token.startsWith("../")) {
      tokens.push({ type: "path", value: token });
    } else if (/^\d+(\.\d+)?$/.test(token)) {
      tokens.push({ type: "number", value: token });
    } else if (/^(true|false|null)$/.test(token)) {
      tokens.push({ type: "constant", value: token });
    } else {
      tokens.push({ type: "plain", value: token });
    }
  }

  return tokens;
}

function normalizeCodeLanguage(language: string) {
  const value = language.trim().toLowerCase();

  if (["bash", "shell", "sh", "zsh"].includes(value)) {
    return "shell";
  }

  if (["env", "dotenv"].includes(value)) {
    return "env";
  }

  if (["js", "jsx", "ts", "tsx", "mjs", "cjs"].includes(value)) {
    return "script";
  }

  return "text";
}

function formatCodeLanguage(language: string) {
  const normalized = language.trim().toLowerCase();

  switch (normalized) {
    case "ts":
      return "TypeScript";
    case "tsx":
      return "TypeScript + JSX";
    case "js":
      return "JavaScript";
    case "jsx":
      return "JavaScript + JSX";
    case "bash":
    case "sh":
    case "zsh":
      return "Shell";
    case "env":
      return ".env";
    case "":
      return "Code";
    default:
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
}

function getCodeCaption(language: string) {
  switch (normalizeCodeLanguage(language)) {
    case "script":
      return "Application snippet";
    case "shell":
      return "Terminal command";
    case "env":
      return "Environment config";
    default:
      return "Reference snippet";
  }
}

function getPreviousNonWhitespace(value: string, index: number) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (value[cursor] !== " " && value[cursor] !== "\t") {
      return value[cursor];
    }
  }

  return "";
}

function getNextNonWhitespace(value: string, index: number) {
  for (let cursor = index; cursor < value.length; cursor += 1) {
    if (value[cursor] !== " " && value[cursor] !== "\t") {
      return value[cursor];
    }
  }

  return "";
}
