"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse-tasks", label: "Browse Tasks" },
  { href: "/browse-freelancers", label: "Browse Freelancers" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const user = sessionData?.user || null;
  const isAuthenticated = Boolean(user);
  const dashboardHref =
    isAuthenticated && user?.role
      ? `/dashboard/${user.role.toLowerCase()}`
      : "/auth/signin";
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialTheme = true;

    setIsDarkMode(initialTheme);
    setHasMounted(true);
    document.documentElement.classList.add("dark");
    window.localStorage.setItem("skillswap-theme", "dark");
  }, []);

  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") {
      return;
    }

    document.documentElement.classList.add("dark");
    window.localStorage.setItem("skillswap-theme", "dark");
  }, [hasMounted]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const avatarSrc =
    user?.image || user?.avatar || user?.profileImage || user?.picture || "";
  const avatarLabel = user?.name || user?.email || "Account";
  const avatarInitial = avatarLabel.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const themeClasses = useMemo(
    () => ({
      shell: isDarkMode
        ? "bg-slate-950 text-slate-100"
        : "bg-white text-slate-900",
      panel: isDarkMode ? "bg-slate-900/90" : "bg-white/95",
      profileCard: isDarkMode
        ? "border-slate-700 bg-slate-900 text-slate-100"
        : "border-slate-200 bg-white text-slate-900",
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
        ? "bg-slate-900 text-slate-100 hover:text-sky-200"
        : "bg-white text-slate-700 hover:text-sky-700",
      primaryButton:
        "border-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500",
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
    [isDarkMode],
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors ${themeClasses.shell}`}
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 transition-transform duration-200 group-hover:-translate-y-0.5">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 7.5h12a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5V9A1.5 1.5 0 0 1 6 7.5Z" />
              <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-xl font-bold tracking-tight sm:text-2xl">
              SkillSwap
            </p>
            <p
              className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Freelance micro-tasks
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={themeClasses.link(isActive(item.href))}
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-linear-to-r from-sky-500 to-blue-500" />
              ) : null}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className={themeClasses.link(isActive("/dashboard"))}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={themeClasses.link(isActive("/profile"))}
              >
                Profile
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-hidden="true"
            tabIndex={-1}
            className="invisible pointer-events-none flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-transparent transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {isDarkMode ? (
              <FiMoon className="h-5 w-5 shrink-0" />
            ) : (
              <FiSun className="h-5 w-5 shrink-0" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden md:flex w-full items-center justify-end gap-3">
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileCard((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full pr-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-200">
                    {avatarSrc && !avatarError ? (
                      <Image
                        src={avatarSrc}
                        alt={avatarLabel}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-full w-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span className="text-sm font-semibold">{avatarInitial}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{avatarLabel}</span>
                </button>

                {showProfileCard ? (
                  <div className={`absolute right-0 top-[calc(100%+0.6rem)] w-64 rounded-2xl border p-4 shadow-xl ${themeClasses.profileCard}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-200">
                        {avatarSrc && !avatarError ? (
                          <Image
                            src={avatarSrc}
                            alt={avatarLabel}
                            width={48}
                            height={48}
                            unoptimized
                            className="h-full w-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span className="text-sm font-semibold">{avatarInitial}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{avatarLabel}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || "Member"}</p>
                      </div>
                    </div>
                    <p className="mt-3 truncate text-sm text-slate-600 dark:text-slate-300">{user?.email || "No email provided"}</p>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/signin">
                <Button
                  className={themeClasses.button}
                  radius="full"
                  size="sm"
                  variant="bordered"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className={themeClasses.primaryButton}
                  radius="full"
                  size="sm"
                >
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
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
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
                href={dashboardHref}
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
                  handleLogout();
                }}
                className={themeClasses.mobileItem(false)}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className={themeClasses.button + " w-full"}
                  radius="full"
                  size="sm"
                  variant="bordered"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className={themeClasses.primaryButton + " w-full"}
                  radius="full"
                  size="sm"
                >
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
