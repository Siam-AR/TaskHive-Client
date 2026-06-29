import Link from "next/link";

export default function FreelancerDashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-600 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Freelancer dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold">Welcome to your freelancer workspace</h1>
        <p className="mt-3 max-w-3xl text-sm text-sky-50/90 sm:text-base">
          This is the freelancer dashboard overview. Use the sidebar to browse open tasks, manage proposals, track active projects, view earnings, and update your profile.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Dashboard snapshot</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            This area will show your total proposals, pending requests, accepted projects, and earnings once the freelancer dashboard is fully implemented.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Next steps</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Start by browsing tasks and sending proposals to clients. You can track all submitted work and earnings from the sidebar navigation.
          </p>
          <Link href="/browse-tasks" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700">
            Browse public tasks
          </Link>
        </div>
      </div>
    </div>
  );
}