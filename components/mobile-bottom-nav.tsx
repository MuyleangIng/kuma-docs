"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavItem = {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
  match?: (pathname: string) => boolean;
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    href: "/",
    icon: "⌂",
    label: "Home",
    match: (pathname) => pathname === "/",
  },
  {
    href: "/docs",
    icon: "≣",
    label: "Docs",
    match: (pathname) => pathname === "/docs" || pathname.startsWith("/docs/"),
  },
  {
    href: "https://github.com/MuyleangIng/kuma-docs",
    icon: "GH",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://www.npmjs.com/package/koma-khqr",
    icon: "N",
    label: "npm",
    external: true,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-shell">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = item.match ? item.match(pathname) : false;
          const className = `mobile-bottom-nav-item${isActive ? " is-active" : ""}`;

          if (item.external) {
            return (
              <a
                className={className}
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="mobile-bottom-nav-icon">
                  {item.icon}
                </span>
                <span className="mobile-bottom-nav-label">{item.label}</span>
              </a>
            );
          }

          return (
            <Link className={className} href={item.href} key={item.label}>
              <span aria-hidden="true" className="mobile-bottom-nav-icon">
                {item.icon}
              </span>
              <span className="mobile-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
