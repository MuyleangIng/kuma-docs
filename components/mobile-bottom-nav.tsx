"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONTACT_ITEMS } from "@/lib/contact";

type InternalNavItem = {
  href: string;
  icon: string;
  label: string;
  kind: "internal";
  match: (pathname: string) => boolean;
};

type ExternalNavItem = {
  href: string;
  icon: string;
  label: string;
  kind: "external";
};

type ContactNavItem = {
  icon: string;
  label: string;
  kind: "contact";
};

type MobileNavItem = InternalNavItem | ExternalNavItem | ContactNavItem;
type SheetState =
  | { type: "confirm"; item: ExternalNavItem }
  | { type: "contact" }
  | null;

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    href: "/",
    icon: "⌂",
    label: "Home",
    kind: "internal",
    match: (pathname) => pathname === "/",
  },
  {
    href: "/docs",
    icon: "≣",
    label: "Docs",
    kind: "internal",
    match: (pathname) => pathname === "/docs" || pathname.startsWith("/docs/"),
  },
  {
    href: "https://github.com/MuyleangIng/kuma-docs",
    icon: "GH",
    label: "GitHub",
    kind: "external",
  },
  {
    href: "https://www.npmjs.com/package/koma-khqr",
    icon: "N",
    label: "npm",
    kind: "external",
  },
  {
    icon: "＋",
    label: "Contact",
    kind: "contact",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<SheetState>(null);

  useEffect(() => {
    setSheet(null);
  }, [pathname]);

  useEffect(() => {
    if (!sheet) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheet(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sheet]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSheet(null);
      }
    };

    if (mediaQuery.matches) {
      setSheet(null);
    }

    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  function openExternalConfirm(item: ExternalNavItem) {
    setSheet({ type: "confirm", item });
  }

  function continueToExternalLink() {
    if (sheet?.type !== "confirm") {
      return;
    }

    window.open(sheet.item.href, "_blank", "noopener,noreferrer");
    setSheet(null);
  }

  return (
    <>
      <nav aria-label="Mobile navigation" className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-shell">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = item.kind === "internal" ? item.match(pathname) : false;
            const className = `mobile-bottom-nav-item${isActive ? " is-active" : ""}`;

            if (item.kind === "internal") {
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                  href={item.href}
                  key={item.label}
                >
                  <span aria-hidden="true" className="mobile-bottom-nav-icon">
                    {item.icon}
                  </span>
                  <span className="mobile-bottom-nav-label">{item.label}</span>
                </Link>
              );
            }

            if (item.kind === "external") {
              return (
                <button
                  className={className}
                  key={item.label}
                  onClick={() => openExternalConfirm(item)}
                  type="button"
                >
                  <span aria-hidden="true" className="mobile-bottom-nav-icon">
                    {item.icon}
                  </span>
                  <span className="mobile-bottom-nav-label">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                className={`mobile-bottom-nav-item${sheet?.type === "contact" ? " is-active" : ""}`}
                key={item.label}
                onClick={() => setSheet({ type: "contact" })}
                type="button"
              >
                <span aria-hidden="true" className="mobile-bottom-nav-icon">
                  {item.icon}
                </span>
                <span className="mobile-bottom-nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {sheet ? (
        <div className="mobile-sheet-root">
          <button
            aria-label="Close mobile sheet"
            className="mobile-sheet-backdrop"
            onClick={() => setSheet(null)}
            type="button"
          />

          <div
            aria-labelledby={sheet.type === "contact" ? "mobile-contact-title" : "mobile-confirm-title"}
            aria-modal="true"
            className="mobile-sheet"
            role="dialog"
          >
            <div className="mobile-sheet-panel">
              <div aria-hidden="true" className="mobile-sheet-handle" />

              {sheet.type === "contact" ? (
                <div className="mobile-sheet-body">
                  <div className="mobile-sheet-header">
                    <p className="mobile-sheet-eyebrow">Contact</p>
                    <h2 className="mobile-sheet-title" id="mobile-contact-title">
                      Talk to the Koma KHQR team
                    </h2>
                    <p className="mobile-sheet-copy">
                      Choose the quickest way to reach us without leaving the docs flow.
                    </p>
                  </div>

                  <div className="mobile-sheet-link-list">
                    {CONTACT_ITEMS.map((item) => (
                      <a
                        className="mobile-sheet-link"
                        href={item.href}
                        key={item.label}
                        onClick={() => setSheet(null)}
                        rel={item.external ? "noreferrer" : undefined}
                        target={item.external ? "_blank" : undefined}
                      >
                        <span className="mobile-sheet-link-main">
                          <span aria-hidden="true" className="mobile-sheet-link-icon">
                            {item.icon}
                          </span>
                          <span className="mobile-sheet-link-label">{item.label}</span>
                        </span>
                        <span aria-hidden="true" className="mobile-sheet-link-arrow">
                          →
                        </span>
                      </a>
                    ))}
                  </div>

                  <button
                    className="mobile-sheet-button mobile-sheet-button-secondary"
                    onClick={() => setSheet(null)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="mobile-sheet-body">
                  <div className="mobile-sheet-header">
                    <p className="mobile-sheet-eyebrow">External Link</p>
                    <h2 className="mobile-sheet-title" id="mobile-confirm-title">
                      Are you sure you want to leave this site?
                    </h2>
                    <p className="mobile-sheet-copy">
                      You are about to open {sheet.item.label}. Continue when you are ready to leave
                      Koma KHQR.
                    </p>
                  </div>

                  <div className="mobile-sheet-actions">
                    <button
                      className="mobile-sheet-button mobile-sheet-button-secondary"
                      onClick={() => setSheet(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="mobile-sheet-button mobile-sheet-button-primary"
                      onClick={continueToExternalLink}
                      type="button"
                    >
                      Continue to {sheet.item.label}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
