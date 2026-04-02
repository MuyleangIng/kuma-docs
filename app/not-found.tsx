import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Page not found"
      copy="The page you requested does not exist or may have moved. Use the docs index to keep navigating."
    />
  );
}
