import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="max-w-xl rounded-3xl border border-sky-100 bg-white p-10 text-center shadow-[0_16px_50px_rgba(14,165,233,0.08)] dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">The page you requested does not exist, but the marketplace is still ready to explore.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          Go home
        </Link>
      </div>
    </div>
  );
}