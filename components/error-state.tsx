import Link from "next/link";

type ErrorStateProps = {
  code: string;
  title: string;
  copy: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: React.ReactNode;
};

export function ErrorState({
  code,
  title,
  copy,
  primaryHref = "/docs",
  primaryLabel = "Back to docs",
  secondaryHref = "/",
  secondaryLabel = "Home",
  children,
}: ErrorStateProps) {
  return (
    <main className="error-shell">
      <section className="error-panel">
        <span className="error-code">{code}</span>
        <h1 className="error-title">{title}</h1>
        <p className="error-copy">{copy}</p>
        <div className="error-actions">
          <Link className="error-button error-button-primary" href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className="error-button" href={secondaryHref}>
            {secondaryLabel}
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
