// import { FiArrowRight, FiBriefcase, FiUsers, FiStar } from "react-icons/fi";
// import { Card } from "@heroui/react";

// function formatCurrency(amount) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// export default function StatsSection({ stats }) {
//   const items = [
//     { label: "Total users", value: stats.totalUsers, icon: FiUsers },
//     { label: "Open tasks", value: stats.openTasks, icon: FiBriefcase },
//     { label: "Total tasks", value: stats.totalTasks, icon: FiArrowRight },
//     { label: "Total payout", value: formatCurrency(stats.totalPayout), icon: FiStar },
//   ];

//   return (
//     <section className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
//       <div className="space-y-6">
//         <div>
//           <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Platform statistics</p>
//           <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Live performance metrics</h2>
//         </div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {items.map((item) => (
//             <Card key={item.label} className="space-y-3 rounded-[1.5rem] p-5">
//               <div className="flex items-center gap-3 text-slate-900 dark:text-white">
//                 <item.icon className="h-5 w-5 text-sky-600" />
//                 <p className="text-sm font-semibold">{item.label}</p>
//               </div>
//               <p className="text-3xl font-black text-slate-950 dark:text-white">{item.value}</p>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client"

import {
  FiArrowRight,
  FiUsers,
  FiStar,
} from "react-icons/fi";

import { Card } from "@heroui/react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StatsSection({ stats }) {
  const items = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: FiUsers,
      color: "text-sky-600",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: FiArrowRight,
      color: "text-emerald-600",
    },
    {
      label: "Total Payout Completed",
      value: formatCurrency(stats?.totalPayout ?? 0),
      icon: FiStar,
      color: "text-amber-600",
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Platform Statistics
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Live performance metrics
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.label}
              className="
                group
                rounded-[1.5rem]
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-3 dark:bg-slate-900">
                  <item.icon
                    className={`h-6 w-6 ${item.color}`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
