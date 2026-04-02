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

  const nextTheme = theme === "dark" ? "light" : "dark";

  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 13zM2.34 2.34a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1-.707.707l-.707-.707a.5.5 0 0 1 0-.707zm9.9 9.9a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1-.707.707l-.707-.707a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1A.5.5 0 0 1 0 8zm13 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1A.5.5 0 0 1 13 8zm-2.657-5.657a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 0 1-.707-.707l.707-.707a.5.5 0 0 1 .707 0zm-7.07 7.072a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 0 1-.707-.707l.707-.707a.5.5 0 0 1 .707 0z"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
    </svg>
  );

  return (
    <button
      aria-label={`Switch to ${nextTheme} mode`}
      className={`theme-toggle theme-toggle-${variant}`}
      onClick={() => changeTheme(nextTheme)}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {mounted ? (theme === "light" ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
      </span>
      {variant === "navbar" ? (
        <span className="theme-toggle-label">
          {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme"}
        </span>
      ) : null}
    </button>
  );
}
