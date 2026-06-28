"use client";

import { useEffect, useState } from "react";
import { FiBriefcase, FiClipboard, FiDollarSign, FiFolder } from "react-icons/fi";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import { getClientDashboardOverview } from "@/lib/dashboard-client-overview";

const loadingStats = [
  { title: "Total tasks", value: "...", subtitle: "All tasks you have posted", icon: FiBriefcase },
  { title: "Open tasks", value: "...", subtitle: "Waiting for the right freelancer", icon: FiFolder },
  { title: "In progress", value: "...", subtitle: "Tasks currently underway", icon: FiClipboard },
  { title: "Total spent", value: "$...", subtitle: "Your total project spend", icon: FiDollarSign },
];

export default function ClientDashboardHomePage() {
  const [overview, setOverview] = useState({
    totalTasks: 0,
    openTasks: 0,
    inProgressTasks: 0,
    totalSpent: 0,
    taskError: null,
    transactionError: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        const data = await getClientDashboardOverview();
        if (!mounted) return;

        setOverview({
          totalTasks: data.totalTasks,
          openTasks: data.openTasks,
          inProgressTasks: data.inProgressTasks,
          totalSpent: data.totalSpent,
          taskError: data.taskError || null,
          transactionError: data.transactionError || null,
        });

        const combinedError = [data.taskError, data.transactionError].filter(Boolean).join(" • ");
        if (combinedError) {
          setError(combinedError);
        }
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || "Unable to load dashboard overview.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    { title: "Total tasks", value: overview.totalTasks.toString(), subtitle: "All tasks you have posted", icon: FiBriefcase },
    { title: "Open tasks", value: overview.openTasks.toString(), subtitle: "Waiting for the right freelancer", icon: FiFolder },
    { title: "In progress", value: overview.inProgressTasks.toString(), subtitle: "Tasks currently underway", icon: FiClipboard },
    { title: "Total spent", value: `$${overview.totalSpent.toFixed(2)}`, subtitle: "Your total project spend", icon: FiDollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-600 p-6 text-white shadow-sm">
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

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

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