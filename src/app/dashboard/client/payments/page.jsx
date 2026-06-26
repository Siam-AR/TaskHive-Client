import Link from "next/link";
import { FiCreditCard, FiArrowRight } from "react-icons/fi";

export default function ClientPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-600 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Payments</p>
        <h2 className="mt-2 text-3xl font-semibold">Manage your payment activity</h2>
        <p className="mt-3 max-w-2xl text-sm text-sky-50/90 sm:text-base">
          Review upcoming payments, completed transactions, and keep your billing information organized.
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
              This section will hold your billing history and payment controls.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            Connect your preferred payment method and track completed payouts for each task once the billing flow is enabled.
          </p>
          <Link
            href="/dashboard/client"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Back to overview
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
