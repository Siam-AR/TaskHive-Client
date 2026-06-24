import { Card, Badge } from "@heroui/react";
import { FiClock, FiUser, FiArrowRight } from "react-icons/fi";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCategoryColor(category) {
  const map = {
    Design:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200",
    Development:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
    Writing:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    Marketing:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
  };

  return (
    map[category] ||
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"
  );
}

export default function LatestTasks({ tasks }) {
  return (
    <section className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Latest featured tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Explore current open jobs
          </h2>
        </div>

        <a
          href="/browse-tasks"
          className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:text-sky-500"
        >
          View all tasks <FiArrowRight />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className="
              group relative overflow-hidden rounded-[2rem]
              border border-slate-200 bg-white p-6
              transition-all duration-300

              hover:-translate-y-1
              hover:border-cyan-400
              hover:shadow-[0_0_0_1px_rgb(34_211_238),0_8px_30px_rgba(34,211,238,0.15)]

              dark:border-slate-800
              dark:bg-slate-950
              dark:hover:shadow-none
            "
          >
            {/* Gradient Hover Border - Dark Mode Only */}
            <div className="pointer-events-none absolute inset-0 hidden rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:block">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 p-[1px]">
                <div className="h-full w-full rounded-[2rem] bg-slate-950" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Top Row */}
              <div className="flex items-center justify-between gap-4">
                <Badge
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(
                    task.category
                  )}`}
                >
                  {task.category}
                </Badge>

                <p className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <FiClock className="text-slate-500" />
                  {task.deadline}
                </p>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
                {task.title}
              </h3>

              {/* Description */}
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {task.description}
              </p>

              {/* Bottom */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                {/* Client */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
                    <FiUser />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {task.client?.name || "Client"}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Budget:{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(task.budget)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action */}
                <a
                  href={`/task/${task._id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-200 dark:hover:bg-sky-900/50"
                >
                  View task <FiArrowRight />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}