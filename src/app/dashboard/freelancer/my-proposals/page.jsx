import { getServerSession } from "@/lib/session";
import { getFreelancerProposals } from "@/lib/dashboard-freelancer-proposals";

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  const normalized = String(status || "pending").toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export default async function FreelancerMyProposalsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const proposals = freelancerEmail ? await getFreelancerProposals(freelancerEmail) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Freelancer proposals</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">My Proposals</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Review your submitted proposals with task title, offered budget, submission date, and current status.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {proposals.length} proposals submitted
          </div>
        </div>
      </div>

      {proposals.length ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-sm dark:border-slate-800">
          <table className="min-w-full border-collapse bg-white text-left text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <thead className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Task Title</th>
                <th className="px-6 py-4 font-semibold">Budget Bid</th>
                <th className="px-6 py-4 font-semibold">Date Sent</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-6 py-4 font-medium text-slate-950 dark:text-white">{proposal.taskTitle}</td>
                  <td className="px-6 py-4">{formatCurrency(proposal.proposedBudget)}</td>
                  <td className="px-6 py-4">{formatDate(proposal.submittedAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      proposal.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : proposal.status === "rejected"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}>
                      {formatStatus(proposal.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">No proposals found</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            You have not submitted any proposals yet. Browse tasks and send your first proposal to start working.
          </p>
        </div>
      )}
    </div>
  );
}
