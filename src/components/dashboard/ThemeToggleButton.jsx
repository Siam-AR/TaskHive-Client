"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("skillswap-theme");
    const initialTheme = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDarkMode(initialTheme);
    setHasMounted(true);
    document.documentElement.classList.toggle("dark", initialTheme);
    window.localStorage.setItem("skillswap-theme", initialTheme ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("skillswap-theme", isDarkMode ? "dark" : "light");
  }, [hasMounted, isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDarkMode ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
    </button>
  );
}
