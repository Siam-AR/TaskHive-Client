"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard, FiArrowRight } from "react-icons/fi";
import { getDashboardHeaders } from "@/lib/dashboard-client-proposals";

function PaymentRow({ p }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.task_title || "Untitled Task"}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Freelancer: <span className="font-medium text-slate-900 dark:text-white">{p.freelancer_name || p.freelancer_email}</span></p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Transaction: {p.transaction_id || "—"}</p>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-lg font-semibold text-slate-900 dark:text-white">${p.amount}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.paid_at ? new Date(p.paid_at).toLocaleString() : (p.createdAt ? new Date(p.createdAt).toLocaleString() : "—")}</div>
      </div>
    </div>
  );
}

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const headers = await getDashboardHeaders();
        const res = await fetch("/api/dashboard/client/payments", { headers: { ...headers }, cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load payments");
        setPayments(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(err?.message || "Unable to load payments");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-600 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Payments</p>
        <h2 className="mt-2 text-3xl font-semibold">Manage your payment activity</h2>
        <p className="mt-3 max-w-2xl text-sm text-sky-50/90 sm:text-base">
          Review completed transactions and keep your billing information organized.
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
            <FiCreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Payment center</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Below is a list of your successfully completed payments.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-600">Loading payments...</div>
          ) : error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-600">No completed payments found.</div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <PaymentRow key={p._id} p={p} />
              ))}
            </div>
          )}

          <Link
            href="/dashboard/client"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Back to overview
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
