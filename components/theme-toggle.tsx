"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
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

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="theme-toggle"
      onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {mounted && theme === "light" ? "☀" : "◐"}
      </span>
      <span className="theme-toggle-label">{mounted ? `${theme} mode` : "theme"}</span>
    </button>
  );
}
