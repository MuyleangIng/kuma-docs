"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeToggleProps = {
  variant?: "navbar" | "fab";
};

export function ThemeToggle({ variant = "navbar" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const current = root.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  function changeTheme(nextTheme: Theme) {
    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    localStorage.setItem("kuma-docs-theme", nextTheme);
    setTheme(nextTheme);
  }

  const icon = mounted ? (theme === "light" ? "☀️" : "🌙") : "🌙";
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      aria-label={`Switch to ${nextTheme} mode`}
      className={`theme-toggle theme-toggle-${variant}`}
      onClick={() => changeTheme(nextTheme)}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {icon}
      </span>
      {variant === "navbar" ? (
        <span className="theme-toggle-label">{mounted ? `${theme} mode` : "theme"}</span>
      ) : null}
    </button>
  );
}
