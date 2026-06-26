"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiBarChart2, FiBriefcase, FiClipboard, FiCreditCard, FiLogOut, FiMenu, FiPlusCircle, FiUser, FiX } from "react-icons/fi";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/dashboard/client", label: "Overview", icon: FiBarChart2 },
  { href: "/dashboard/client/post-task", label: "Post Task", icon: FiPlusCircle },
  { href: "/dashboard/client/my-tasks", label: "My Tasks", icon: FiBriefcase },
  { href: "/dashboard/client/proposals", label: "Proposals", icon: FiClipboard },
  { href: "/dashboard/client/payments", label: "Payments", icon: FiCreditCard },
];

export default function ClientSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard/client") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const initials = (user?.name || "Client")
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
            {initials || <FiUser className="h-4 w-4" />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              {user?.name || "Welcome back"}
            </h2>
            <p className="text-sm capitalize text-slate-600 dark:text-slate-400">
              {user?.role || "client"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <FiMenu className="h-4 w-4" />
          Dashboard menu
        </button>
      </div>

      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          {sidebarContent}
        </div>
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="h-full w-80 max-w-[85vw] bg-white p-4 shadow-xl dark:bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Navigation</p>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <FiX className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}
