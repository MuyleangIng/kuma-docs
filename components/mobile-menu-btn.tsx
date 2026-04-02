"use client";

type MobileMenuBtnProps = {
  className?: string;
  isOpen: boolean;
  labelClosed: string;
  labelOpen: string;
  onToggle: () => void;
};

export function MobileMenuBtn({
  className,
  isOpen,
  labelClosed,
  labelOpen,
  onToggle,
}: MobileMenuBtnProps) {
  return (
    <button
      aria-controls="docs-sidebar"
      aria-expanded={isOpen}
      aria-label={isOpen ? labelOpen : labelClosed}
      className={`site-menu-btn${isOpen ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      onClick={onToggle}
    >
      <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20">
        <rect height="1.5" width="16" x="2" y="5" />
        <rect height="1.5" width="16" x="2" y="9.25" />
        <rect height="1.5" width="16" x="2" y="13.5" />
      </svg>
    </button>
  );
}
