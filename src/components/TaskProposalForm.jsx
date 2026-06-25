"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

const DEFAULT_SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${DEFAULT_SERVER}${path}`;
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const res = await fetch(url, Object.assign({}, opts, { headers, credentials: "include" }));

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error("Request failed");
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
}

export default function TaskProposalForm({ taskId }) {
  const { data: sessionData, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({
    expectedAmount: "",
    estimatedDays: "",
    coverLetter: "",
  });

  const getAuthHeaders = () => {
    const currentUser = sessionData?.user || user;

    return {
      "X-User-Id": currentUser?.id || "",
      "X-User-Email": currentUser?.email || "",
      "X-User-Role": currentUser?.role || "",
    };
  };

  useEffect(() => {
    async function loadState() {
      try {
        if (!sessionData?.user) {
          setUser(null);
          setHasSubmitted(false);
          return;
        }

        const [authResponse, proposalResponse] = await Promise.all([
          apiFetch("/api/auth/me", { headers: getAuthHeaders() }),
          apiFetch(`/api/proposals/check/${encodeURIComponent(taskId)}`, { headers: getAuthHeaders() }),
        ]);

        setUser(authResponse?.user || sessionData.user || null);
        setHasSubmitted(Boolean(proposalResponse?.hasSubmitted));
      } catch (error) {
        setUser(sessionData?.user || null);
        setHasSubmitted(false);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending) {
      loadState();
    }
  }, [taskId, sessionData, isPending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await apiFetch("/api/proposals", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          taskId,
          expectedAmount: Number(form.expectedAmount),
          estimatedDays: Number(form.estimatedDays),
          coverLetter: form.coverLetter,
        }),
      });

      if (response?.success) {
        setHasSubmitted(true);
        setFeedback({ type: "success", message: "Proposal submitted successfully." });
        setForm({ expectedAmount: "", estimatedDays: "", coverLetter: "" });
      }
    } catch (error) {
      const message = error?.body?.message || error?.message || "Failed to submit proposal.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isPending) {
    return <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">Checking your access...</div>;
  }

  const normalizedRole = String(user?.role || sessionData?.user?.role || "").trim();

  if (!user || normalizedRole !== "Freelancer") {
    return (
      <div className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm text-sky-700 dark:bg-slate-900 dark:text-sky-300">
        Please sign in as a freelancer to submit a proposal.
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
        Your proposal is already on the list for this task.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Task ID</label>
        <input value={taskId} readOnly className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Freelancer Email</label>
        <input value={user?.email || ""} readOnly className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Proposed Budget (USD)</label>
        <input
          name="expectedAmount"
          type="number"
          min="1"
          required
          value={form.expectedAmount}
          onChange={(event) => setForm((current) => ({ ...current, expectedAmount: event.target.value }))}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Days</label>
        <input
          name="estimatedDays"
          type="number"
          min="1"
          required
          value={form.estimatedDays}
          onChange={(event) => setForm((current) => ({ ...current, estimatedDays: event.target.value }))}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Cover Note Message</label>
        <textarea
          name="coverLetter"
          rows="5"
          required
          value={form.coverLetter}
          onChange={(event) => setForm((current) => ({ ...current, coverLetter: event.target.value }))}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {feedback ? (
        <div className={`rounded-2xl p-3 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"}`}>
          {feedback.message}
        </div>
      ) : null}

      <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? "Submitting..." : "Submit proposal"}
      </button>
    </form>
  );
}
