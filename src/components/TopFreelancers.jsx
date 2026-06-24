import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { Card } from "@heroui/react";

export default function TopFreelancers({ freelancers }) {
  return (
    <section className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Top freelancers
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Hire top rated talent
          </h2>
        </div>

        <a
          href="/browse-freelancers"
          className="text-sm font-semibold text-sky-600 transition hover:text-sky-500"
        >
          Browse freelancers
        </a>
      </div>
    {/* Grid */}
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {freelancers.map((freelancer) => (
    <Card
      key={freelancer.email}
      className="
        group min-w-0
        rounded-[2rem]
        border border-slate-200
        bg-white
        p-5
        transition-all duration-300

        hover:-translate-y-1
        hover:border-cyan-400
        hover:shadow-[0_0_0_1px_rgb(34_211_238),0_12px_32px_rgba(34,211,238,0.12)]

        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* Top */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 p-[2px]">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
            {freelancer.image ? (
              <Image
                src={freelancer.image}
                alt={freelancer.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-lg font-bold text-slate-700 dark:text-slate-200">
                {freelancer.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
            {freelancer.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Available for work
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {freelancer.skills?.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="
              rounded-full
              bg-slate-100
              px-3 py-1
              text-[11px] font-medium
              text-slate-700

              dark:bg-slate-900
              dark:text-slate-300
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          <FiStar className="h-3.5 w-3.5 fill-current" />
          {freelancer.rating || 0}
          <span className="opacity-70">
            ({freelancer.reviewCount})
          </span>
        </div>

        <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
          {freelancer.finishedJobs} jobs
        </div>
      </div>
    </Card>
  ))}
</div>
    </section>
  );
}