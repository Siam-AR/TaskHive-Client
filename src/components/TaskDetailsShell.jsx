"use client";

import Link from "next/link";
import { FiClock, FiDollarSign, FiTag, FiUser } from "react-icons/fi";
import TaskProposalForm from "@/components/TaskProposalForm";
import { useSession } from "@/lib/auth-client";

function formatDate(dateString) {
  if (!dateString) {
    return "No deadline";
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status) {
  const normalizedStatus = String(status || "open").trim().toLowerCase();

  if (normalizedStatus === "close" || normalizedStatus === "closed") {
    return {
      label: "Closed",
      classes: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    };
  }

  if (normalizedStatus === "in progress" || normalizedStatus === "in-progress" || normalizedStatus === "in_progress") {
    return {
      label: "In Progress",
      classes: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    };
  }

  if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    return {
      label: "Completed",
      classes: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    };
  }

  return {
    label: "Open",
    classes: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  };
}

export default function TaskDetailsShell({ task }) {
  const { data: sessionData } = useSession();
  const userRole = String(sessionData?.user?.role || "").trim();
  const showProposalSidebar = userRole === "Freelancer";

  const clientName = task?.client?.name || task?.clientName || null;
  const clientEmail = task?.clientEmail || task?.client?.email || null;
  const clientDisplayName = clientName || clientEmail || "Unknown client";
  const clientDisplayContact = clientName && clientEmail ? clientEmail : clientName ? "Contact available after application" : clientEmail || null;

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className={`grid gap-8 ${showProposalSidebar ? "lg:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:bg-slate-900">
              {task.category || "General"}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(task.status).classes}`}>
              {getStatusBadge(task.status).label}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold text-slate-950 dark:text-white">{task.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">{task.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <FiDollarSign className="text-sky-500" /> Budget
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">${task.budget}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <FiClock className="text-sky-500" /> Deadline
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{formatDate(task.deadline)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <FiTag className="text-sky-500" /> Category
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{task.category || "General"}</p>
            </div>
          </div>
        </div>

        {showProposalSidebar ? (
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Submit a proposal</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Share your offer and pitch to the client.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700 dark:bg-slate-900 dark:text-sky-300">
                {String((clientName || clientDisplayName || "C").charAt(0)).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{clientDisplayName}</p>
                {clientDisplayContact ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{clientDisplayContact}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-7 text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-300">
              <div className="flex items-center gap-2 font-semibold">
                <FiUser className="text-sky-600" /> Ready to take this on?
              </div>
              <p className="mt-3">
                Freelancers can review this task and submit a proposal once they are ready to start.
              </p>
            </div>

            <TaskProposalForm taskId={task._id} />

            <Link
              href="/browse-tasks"
              className="mt-8 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Back to browse tasks
            </Link>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
