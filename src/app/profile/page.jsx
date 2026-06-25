"use client";

import Image from "next/image";
import Link from "next/link";
import { FiBriefcase, FiClock, FiMail, FiMapPin, FiShield, FiUser } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";

function getInitials(name, email) {
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  if (email) {
    return email.charAt(0).toUpperCase();
  }

  return "U";
}

export default function ProfilePage() {
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user || null;
  const isAuthenticated = Boolean(user);

  const avatarLabel = user?.name || user?.email || "Account";
  const avatarInitials = getInitials(user?.name, user?.email);
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Member";
  const dashboardHref = user?.role ? `/dashboard/${user.role.toLowerCase()}` : "/auth/signin";

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-56 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Sign in to view your profile</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Your account details will appear here once you sign in.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/auth/signin" className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                Sign in
              </Link>
              <Link href="/auth/signup" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">
                Create account
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_36%),linear-gradient(135deg,_#f8fbff_0%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#020617_100%)]">
      <Navbar />

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 p-8 text-white dark:border-slate-800">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/15 text-3xl font-semibold text-white shadow-lg">
                  {user?.image ? (
                    <Image src={user.image} alt={avatarLabel} width={80} height={80} unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <span>{avatarInitials}</span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">My profile</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">
                    {avatarLabel}
                  </h1>
                  <p className="mt-2 max-w-2xl text-lg text-sky-50/90">
                    {user?.headline || (user?.role === "freelancer" ? "Freelancer account" : "Client account")}
                  </p>
                </div>
              </div>

              <Link
                href={dashboardHref}
                className="inline-flex rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
              >
                Go to dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">About</h2>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    {roleLabel}
                  </span>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
                  {user?.bio || "Your profile details will appear here as soon as you add them to your account."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <FiClock className="text-sky-600" />
                    <span className="text-sm font-medium">Member since</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently joined"}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <FiShield className="text-sky-600" />
                    <span className="text-sm font-medium">Account status</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Verified account</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <FiUser className="text-sky-600" />
                <span className="font-medium">{avatarLabel}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <FiMail className="text-sky-600" />
                <span className="truncate">{user?.email || "No email available"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <FiShield className="text-sky-600" />
                <span>{roleLabel}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <FiMapPin className="text-sky-600" />
                <span>{user?.location || "Location not provided"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                <FiBriefcase className="text-sky-600" />
                <span>{user?.headline || "Ready to work"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}