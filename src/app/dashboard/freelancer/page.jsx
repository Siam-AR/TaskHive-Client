import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { getFreelancerOverviewStats } from "@/lib/dashboard-freelancer-overview";

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

export default async function FreelancerDashboardOverviewPage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const stats = await getFreelancerOverviewStats(userEmail);

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-600 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Freelancer dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold">Welcome to your freelancer workspace</h1>
        <p className="mt-3 max-w-3xl text-sm text-sky-50/90 sm:text-base">
          This is the freelancer dashboard overview. Use the sidebar to browse open tasks, manage proposals, track active projects, view earnings, and update your profile.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total proposals</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.totalProposals}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pending proposals</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.pendingProposals}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Accepted proposals</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{stats.acceptedProposals}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total earnings</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>
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