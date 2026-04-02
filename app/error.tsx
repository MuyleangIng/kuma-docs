"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";

export default function Error({
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
    <ErrorState
      code="500"
      title="Something went wrong"
      copy="The page failed to load correctly. Try the request again or return to the docs home."
    >
      <button className="error-button" type="button" onClick={reset}>
        Try again
      </button>
    </ErrorState>
  );
}
