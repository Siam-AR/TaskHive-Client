"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse-tasks", label: "Browse Tasks" },
  { href: "/browse-freelancers", label: "Browse Freelancers" },
];

const Navbar = ({ isAuthenticated = false, user = null, onLogout = () => {} }) => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem("skillswap-theme");

    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("skillswap-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const themeClasses = useMemo(
    () => ({
      shell: isDarkMode
        ? "border-slate-800 bg-slate-950/90 text-slate-100 shadow-[0_14px_40px_rgba(2,8,23,0.4)]"
        : "border-sky-100 bg-white/90 text-slate-900 shadow-[0_14px_40px_rgba(14,165,233,0.14)]",
      panel: isDarkMode ? "bg-slate-900/90" : "bg-white/95",
      link: (active) =>
        [
          "relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
          active
            ? isDarkMode
              ? "text-sky-300"
              : "text-sky-700"
            : isDarkMode
              ? "text-slate-300 hover:text-sky-300"
              : "text-slate-600 hover:text-sky-700",
        ].join(" "),
      button: isDarkMode
        ? "border-slate-700 bg-slate-900 text-slate-100 hover:border-sky-500 hover:text-sky-200"
        : "border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50",
      primaryButton: "border-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500",
      mobileItem: (active) =>
        [
          "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
          active
            ? isDarkMode
              ? "bg-sky-500/15 text-sky-300"
              : "bg-sky-50 text-sky-700"
            : isDarkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-sky-200"
              : "text-slate-600 hover:bg-slate-50 hover:text-sky-700",
        ].join(" "),
    }),
    [isDarkMode]
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${themeClasses.shell}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 transition-transform duration-200 group-hover:-translate-y-0.5">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 7.5h12a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5V9A1.5 1.5 0 0 1 6 7.5Z" />
              <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-xl font-bold tracking-tight sm:text-2xl">SkillSwap</p>
            <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Freelance micro-tasks
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={themeClasses.link(isActive(item.href))}>
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
              ) : null}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={themeClasses.link(isActive("/dashboard"))}>
                Dashboard
              </Link>
              <Link href="/profile" className={themeClasses.link(isActive("/profile"))}>
                Profile
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${themeClasses.button}`}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className={`flex items-center gap-3 rounded-full border px-3 py-2 ${themeClasses.button}`}>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                    isDarkMode
                      ? "border-sky-400/30 bg-sky-500/15 text-sky-200"
                      : "border-sky-200 bg-sky-50 text-sky-700"
                  }`}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold leading-none">{user?.name || "Account"}</p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {user?.email || "Signed in"}
                  </p>
                </div>
              </div>
              <Button className={themeClasses.primaryButton} radius="full" size="sm" onPress={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/signin">
                <Button className={themeClasses.button} radius="full" size="sm" variant="bordered">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className={themeClasses.primaryButton} radius="full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${themeClasses.button}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t transition-[max-height,opacity] duration-300 lg:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${isDarkMode ? "border-slate-800" : "border-sky-100"} ${themeClasses.panel}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={themeClasses.mobileItem(isActive(item.href))}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={themeClasses.mobileItem(isActive("/dashboard"))}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={themeClasses.mobileItem(isActive("/profile"))}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className={themeClasses.mobileItem(false)}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className={themeClasses.button + " w-full"} radius="full" size="sm" variant="bordered">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className={themeClasses.primaryButton + " w-full"} radius="full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
