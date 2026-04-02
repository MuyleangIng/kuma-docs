"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html data-theme="dark" lang="en">
      <body>
        <ErrorState
          code="500"
          title="Application error"
          copy="A critical error interrupted the app shell. Try again or return to the docs home."
        >
          <button className="error-button" type="button" onClick={reset}>
            Try again
          </button>
        </ErrorState>
      </body>
    </html>
  );
}
