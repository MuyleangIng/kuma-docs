"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ApiReferenceDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="site-tab-dropdown" ref={ref}>
      <button
        className={`site-tab site-tab-btn${open ? " is-open" : ""}`}
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        API Reference
        <svg
          className="site-tab-chevron"
          fill="none"
          height="12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="12"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="site-tab-menu" role="menu">
          {/* SDK section */}
          <div className="site-tab-menu-section">
            <span className="site-tab-menu-label">SDK</span>
            <a
              className="site-tab-menu-item"
              href="https://www.npmjs.com/package/koma-khqr"
              rel="noreferrer"
              role="menuitem"
              target="_blank"
              onClick={() => setOpen(false)}
            >
              <span className="site-tab-menu-item-icon">
                <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
                  <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zM5.8 5.8h12.4v12.4H5.8V5.8zm0 0" opacity=".2"/>
                  <path d="M0 0v24h24V0H0zm3 3h18v18H3V3zm2.8 2.8v12.4h12.4V5.8H5.8zm2.8 2.8h3.6v6.8h1.6V8.6h1.6v8.4H8.6V8.6z"/>
                </svg>
              </span>
              <span>
                <span className="site-tab-menu-item-title">npm SDK</span>
                <span className="site-tab-menu-item-desc">koma-khqr package</span>
              </span>
              <span className="site-tab-menu-item-arrow">↗</span>
            </a>
            <div className="site-tab-menu-item is-disabled" role="menuitem">
              <span className="site-tab-menu-item-icon">
                <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </span>
              <span>
                <span className="site-tab-menu-item-title">PHP Composer</span>
                <span className="site-tab-menu-item-desc">Coming soon</span>
              </span>
              <span className="site-tab-menu-badge">Soon</span>
            </div>
          </div>

          <div className="site-tab-menu-divider" />

          {/* REST API section */}
          <div className="site-tab-menu-section">
            <span className="site-tab-menu-label">REST API</span>
            <Link
              className="site-tab-menu-item"
              href="/docs/api-checkout"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="site-tab-menu-item-icon">
                <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                  <rect height="11" rx="2" width="18" x="3" y="11" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span>
                <span className="site-tab-menu-item-title">QR Checkout</span>
                <span className="site-tab-menu-item-desc">POST /api/payment/checkout</span>
              </span>
            </Link>
            <Link
              className="site-tab-menu-item"
              href="/docs/api-status"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="site-tab-menu-item-icon">
                <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              <span>
                <span className="site-tab-menu-item-title">Check Transaction</span>
                <span className="site-tab-menu-item-desc">POST /api/payment/status</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
