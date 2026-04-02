"use client";

import { useEffect, useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const isIcon = className.includes("copy-button-icon");

  return (
    <button
      aria-label={copied ? "Copied!" : "Copy code"}
      className={`copy-button${className ? ` ${className}` : ""}`}
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy code"}
      type="button"
    >
      {isIcon ? (
        copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 12L2 7.5l1.4-1.4L6.5 9.2l6.1-6.1 1.4 1.4z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1H4a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1V4l-2-3zm0 11H3V4h1v7a1 1 0 0 0 1 1h6v1zm2-3H5V3h5v2h3v5z" />
          </svg>
        )
      ) : (
        copied ? "Copied" : label
      )}
    </button>
  );
}
