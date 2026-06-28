"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";
import { createProposalCheckout, fetchClientProposals, submitClientProposalAction } from "@/lib/dashboard-client-proposals";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default function ClientProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [rejectedIds, setRejectedIds] = useState(new Set());

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchClientProposals();
      setProposals(data || []);
    } catch (err) {
      setError(err?.message || "Unable to load proposals right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadProposals();
    };
    void load();
  }, []);

  const pendingCount = useMemo(() => proposals.filter((proposal) => proposal.status === "pending").length, [proposals]);
  const acceptedCount = useMemo(() => proposals.filter((proposal) => proposal.status === "accepted").length, [proposals]);

  const handleAction = async (proposalId, action) => {
    if (action === "accept") {
      setUpdatingId(proposalId);

      try {
        const result = await createProposalCheckout(proposalId);
        if (result?.url) {
          window.location.assign(result.url);
          return;
        }

        setError(result?.message || "Unable to start checkout.");
      } catch (err) {
        setError(err?.message || "Unable to start checkout.");
      } finally {
        setUpdatingId("");
      }
      return;
    }

    try {
      setRejectedIds((prev) => new Set(prev).add(proposalId));
      setUpdatingId(proposalId);
      const result = await submitClientProposalAction(proposalId, action);
      if (result?.success) {
        await loadProposals();
      } else {
        setRejectedIds((prev) => {
          const next = new Set(prev);
          next.delete(proposalId);
          return next;
        });
        setError(result?.message || "Action could not be completed.");
      }
    } catch (err) {
      setRejectedIds((prev) => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
      setError(err?.message || "Action could not be completed.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Manage proposals</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Review and decide on incoming freelancer applications</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Review each application, accept the best match, or reject the rest. Only one proposal can be accepted per task.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <p className="font-semibold">Pending: {pendingCount}</p>
          <p className="mt-1">Accepted: {acceptedCount}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white/80 p-10 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <FiLoader className="h-5 w-5 animate-spin" />
            Loading proposals...
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          No proposals have been submitted for your tasks yet.
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      {proposal.taskTitle}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[proposal.status] || statusStyles.pending}`}>
                      {proposal.status}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Freelancer</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{proposal.freelancerName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{proposal.freelancerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Budget</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">${proposal.proposedBudget}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Completion days</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{proposal.estimatedDays} days</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Submitted</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{proposal.submittedAt ? new Date(proposal.submittedAt).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Message</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{proposal.coverNote || "No cover note provided."}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col xl:min-w-45">
                  {proposal.status === "pending" && !rejectedIds.has(proposal._id) ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(proposal._id, "accept")}
                        disabled={!proposal.canAccept || updatingId === proposal._id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {updatingId === proposal._id ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiCheckCircle className="h-4 w-4" />}
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(proposal._id, "reject")}
                        disabled={updatingId === proposal._id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                      >
                        {updatingId === proposal._id ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiXCircle className="h-4 w-4" />}
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
