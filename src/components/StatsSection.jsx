// "use client"

// import {
//   FiArrowRight,
//   FiUsers,
//   FiStar,
// } from "react-icons/fi";

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
//     {
//       label: "Total Users",
//       value: stats?.totalUsers ?? 0,
//       icon: FiUsers,
//       color: "text-sky-600",
//     },
//     {
//       label: "Total Tasks",
//       value: stats?.totalTasks ?? 0,
//       icon: FiArrowRight,
//       color: "text-emerald-600",
//     },
//     {
//       label: "Total Payout Completed",
//       value: formatCurrency(stats?.totalPayout ?? 0),
//       icon: FiStar,
//       color: "text-amber-600",
//     },
//   ];

//   return (
//     <section className="mt-16">
//       <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
//         {/* Header */}
//         <div className="mb-8">
//           <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
//             Platform Statistics
//           </p>

//           <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
//             Live performance metrics
//           </h2>
//         </div>

//         <div className="grid gap-4 lg:grid-cols-3">
//           {items.map((item) => (
//             <Card
//               key={item.label}
//               className="
//                 group
//                 rounded-[1.5rem]
//                 border border-slate-200
//                 bg-white
//                 p-5
//                 transition-all duration-300

//                 hover:-translate-y-1
//                 hover:border-cyan-400
//                 hover:shadow-[0_0_0_1px_rgb(34_211_238),0_12px_32px_rgba(34,211,238,0.12)]

//                 dark:border-slate-800
//                 dark:bg-slate-950
//               "
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     {item.label}
//                   </p>

//                   <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
//                     {item.value}
//                   </p>
//                 </div>

//                 <div className="rounded-2xl bg-sky-50 p-3 dark:bg-slate-900">
//                   <item.icon
//                     className={`h-6 w-6 ${item.color}`}
//                   />
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { FiArrowRight, FiUsers, FiStar } from "react-icons/fi";
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
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: FiArrowRight,
    },
    {
      label: "Total Payout Completed",
      value: formatCurrency(stats?.totalPayout ?? 0),
      icon: FiStar,
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
            Platform Statistics
          </p>

          <h2 className="mt-2 text-3xl font-bold text-black dark:text-white">
            Live performance metrics
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.label}
              classNames={{
                base: `
      group
      rounded-[1.5rem]
      border border-gray-200
      bg-white
      dark:bg-slate-950

      transition-all duration-300
      hover:-translate-y-1
      hover:border-sky-400
      hover:shadow-[0_0_0_1px_rgb(14_165_233),0_12px_32px_rgba(14,165,233,0.15)]

      dark:border-slate-800
    `,
              }}
            >
              <div className="flex items-center justify-between p-5">
                {/* TEXT */}
                <div>
                  <p className="text-sm font-medium text-black dark:text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-black text-black dark:text-white">
                    {item.value}
                  </p>
                </div>

                {/* ICON BOX */}
                <div className="rounded-2xl bg-gray-100 p-3 dark:bg-slate-900">
                  <item.icon className="h-6 w-6 text-black dark:text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
