"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBriefcase, FiDollarSign, FiFileText } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

const statItems = [
  { key: "totalUsers", label: "Total Users", icon: FiUsers, color: "text-sky-500" },
  { key: "totalTasks", label: "Total Tasks", icon: FiBriefcase, color: "text-emerald-500" },
  { key: "totalRevenue", label: "Total Revenue (USD)", icon: FiDollarSign, color: "text-amber-500" },
  { key: "activeTasks", label: "Active Tasks", icon: FiFileText, color: "text-violet-500" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await apiFetch("/api/admin/overview", { method: "GET" });
        if (isMounted) {
          setStats(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load admin stats");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/30">
        <h1 className="text-3xl font-semibold text-white">Admin Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Monitor core platform metrics in one place. This section is isolated to admin overview functionality only.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const value = stats?.[item.key] ?? 0;

          return (
            <div key={item.key} className="flex min-h-[170px] flex-col justify-between rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-6 shadow-sm shadow-slate-950/20">
              <div>
                <p className="text-sm font-medium text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-black text-white">{loading ? "..." : item.key === "totalRevenue" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value) : value}</p>
              </div>
              <div className="flex justify-end">
                <div className={`rounded-2xl bg-slate-800 p-3 text-white ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-800 bg-rose-950/60 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}
