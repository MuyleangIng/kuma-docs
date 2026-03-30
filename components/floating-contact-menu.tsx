"use client";

import { useEffect, useState } from "react";

import { CONTACT_ITEMS } from "@/lib/contact";

export function FloatingContactMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`floating-contact${open ? " is-open" : ""}`}>
      <div className="floating-contact-menu" aria-hidden={!open}>
        {CONTACT_ITEMS.map((item, index) => (
          <a
            className="floating-contact-link"
            href={item.href}
            key={item.label}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
            target={item.href.startsWith("http") ? "_blank" : undefined}
          >
            <span className="floating-contact-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <button
        aria-expanded={open}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        className="floating-contact-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="floating-contact-trigger-ring" aria-hidden="true" />
        <span className="floating-contact-trigger-label" aria-hidden="true">
          {open ? "×" : "✉"}
        </span>
      </button>
    </div>
  );
}
