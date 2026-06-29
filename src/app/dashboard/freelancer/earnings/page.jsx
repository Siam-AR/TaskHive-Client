import { getServerSession } from "@/lib/session";
import { getFreelancerEarnings } from "@/lib/dashboard-freelancer-earnings";

export default async function FreelancerEarningsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const earnings = freelancerEmail ? await getFreelancerEarnings(freelancerEmail) : [];

  const totalEarnings = earnings.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const completedProjects = earnings.length;

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Freelancer earnings</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Payout summary</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Review your completed work payouts and recent payments in one place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed projects</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{completedProjects}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total earnings</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Recent payouts</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Latest completed task payments from your delivered work.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Task</th>
                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Client</th>
                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Paid</th>
                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {earnings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No completed payouts found. Finish a deliverable to see earnings here.
                  </td>
                </tr>
              ) : (
                earnings.map((entry) => (
                  <tr key={`${entry.paymentId}-${entry.taskId}`} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">{entry.taskTitle}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{entry.clientName}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">${Number(entry.amount || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
