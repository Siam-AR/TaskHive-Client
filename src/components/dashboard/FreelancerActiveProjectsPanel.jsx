"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiExternalLink, FiFolder } from "react-icons/fi";
import { getSession } from "@/lib/auth-client";

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
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "Completed";
  if (normalized === "in progress") return "In Progress";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export default function FreelancerActiveProjectsPanel({ initialProjects = [], freelancerEmail = "" }) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inProgressCount = useMemo(() => projects.filter((project) => project.taskStatus === "in progress").length, [projects]);
  const completedCount = useMemo(() => projects.filter((project) => project.taskStatus === "completed").length, [projects]);

  const closeModal = () => {
    setSelectedProject(null);
    setDeliverableUrl("");
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProject) {
      return;
    }

    const trimmedUrl = deliverableUrl.trim();
    if (!trimmedUrl) {
      setFeedback({ type: "error", message: "Please enter a deliverable link before submitting." });
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setFeedback({ type: "error", message: "Please provide a valid http or https URL." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;

      const res = await fetch("/api/dashboard/freelancer/active-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": sessionUser?.email || freelancerEmail || "",
          "X-User-Role": sessionUser?.role || "Freelancer",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: selectedProject.taskId,
          deliverableUrl: trimmedUrl,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Unable to submit the deliverable.");
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.taskId === selectedProject.taskId
            ? { ...project, taskStatus: "completed", deliverableUrl: trimmedUrl }
            : project
        )
      );

      setFeedback({ type: "success", message: "Deliverable submitted. The task is now marked completed." });
      closeModal();
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Unable to submit the deliverable." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              <FiClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">In progress</p>
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Completed</p>
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/20 dark:text-rose-300"}`}>
          {feedback.message}
        </div>
      ) : null}

      {projects.length ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <article key={project.id || project.taskId} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${project.taskStatus === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"}`}>
                      {formatStatus(project.taskStatus)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <FiFolder className="h-3.5 w-3.5" />
                      {project.taskTitle}
                    </span>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Client</p>
                      <p className="mt-1 font-medium text-slate-950 dark:text-white">{project.clientName || "Client"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Budget</p>
                      <p className="mt-1 font-medium text-slate-950 dark:text-white">{formatCurrency(project.proposedBudget)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Updated</p>
                      <p className="mt-1 font-medium text-slate-950 dark:text-white">{formatDate(project.completedAt || project.submittedAt)}</p>
                    </div>
                  </div>

                  {project.taskStatus === "completed" && project.deliverableUrl ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <FiExternalLink className="h-4 w-4" />
                      <a href={project.deliverableUrl} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
                        View deliverable
                      </a>
                    </div>
                  ) : null}
                </div>

                {project.taskStatus === "in progress" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(project);
                      setDeliverableUrl(project.deliverableUrl || "");
                      setFeedback(null);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500"
                  >
                    Submit Deliverable
                  </button>
                ) : (
                  <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Waiting for client review
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">No active projects yet</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Accepted proposals will show up here once your work is in progress or completed.
          </p>
        </div>
      )}

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Submit deliverable</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{selectedProject.taskTitle}</h3>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Deliverable link
                <input
                  type="url"
                  value={deliverableUrl}
                  onChange={(event) => setDeliverableUrl(event.target.value)}
                  placeholder="https://github.com/your-work"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500">
                  {isSubmitting ? "Submitting..." : "Mark as completed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
