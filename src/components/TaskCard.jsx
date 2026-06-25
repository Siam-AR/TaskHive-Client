import Link from "next/link";
import { FiClock, FiDollarSign, FiUser } from "react-icons/fi";

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

export default function TaskCard({ task }) {
  return (
    <Link href={`/task/${task._id}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:bg-slate-900">
            {task.category || "General"}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(task.status).classes}`}>
            {getStatusBadge(task.status).label}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold text-slate-950 transition group-hover:text-sky-600 dark:text-white">
          {task.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {task.description}
        </p>

        <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FiDollarSign className="h-4 w-4 text-sky-500" />
            <span>${task.budget}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="h-4 w-4 text-sky-500" />
            <span>Due {formatDate(task.deadline)}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiUser className="h-4 w-4 text-sky-500" />
            <span>Client: {task.client?.name || "Unknown client"}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 text-sm font-semibold text-sky-600">
          View Details →
        </div>
      </div>
    </Link>
  );
}
