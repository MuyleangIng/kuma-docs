"use client";

import { useEffect, useState } from "react";

export function MobileMenuBtn() {
  const [open, setOpen] = useState(true);

  // Keep icon in sync with sidebar state
  useEffect(() => {
    function onToggle() { setOpen((o) => !o); }
    window.addEventListener("koma:toggle-sidebar", onToggle);
    return () => window.removeEventListener("koma:toggle-sidebar", onToggle);
  }, []);

  function handleClick() {
    window.dispatchEvent(new CustomEvent("koma:toggle-sidebar"));
  }

  return (
    <button
      aria-label={open ? "Collapse navigation" : "Expand navigation"}
      className="site-menu-btn"
      type="button"
      onClick={handleClick}
    >
      {open ? (
        /* hamburger */
        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20">
          <rect height="1.5" width="16" x="2" y="5" />
          <rect height="1.5" width="16" x="2" y="9.25" />
          <rect height="1.5" width="16" x="2" y="13.5" />
        </svg>
      ) : (
        /* close / expand */
        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 20 20" width="20">
          <line x1="5" x2="15" y1="5" y2="15" />
          <line x1="15" x2="5" y1="5" y2="15" />
        </svg>
      )}
    </button>
  );
}
