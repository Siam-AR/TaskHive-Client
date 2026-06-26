import { FiBriefcase, FiClipboard, FiDollarSign, FiFolder } from "react-icons/fi";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";

const stats = [
  { title: "Total tasks", value: "0", subtitle: "All tasks you have posted", icon: FiBriefcase },
  { title: "Open tasks", value: "0", subtitle: "Waiting for the right freelancer", icon: FiFolder },
  { title: "In progress", value: "0", subtitle: "Tasks currently underway", icon: FiClipboard },
  { title: "Total spent", value: "$0", subtitle: "Your total project spend", icon: FiDollarSign },
];

export default function ClientDashboardHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Welcome back</p>
        <h2 className="mt-2 text-3xl font-semibold">Your client workspace is ready</h2>
        <p className="mt-3 max-w-2xl text-sm text-sky-50/90 sm:text-base">
          Post new tasks, manage live projects, and review freelancer proposals from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="/dashboard/client/post-task" className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Post a new task</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a fresh job and start receiving proposals.</p>
            </a>
            <a href="/dashboard/client/my-tasks" className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold text-slate-900 dark:text-white">Track your tasks</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review open, active, and completed work.</p>
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Next step</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Start by creating a task. Once freelancers submit proposals, you can review each one and move the best fit into progress.
          </p>
        </div>
      </div>
    </div>
  );
}