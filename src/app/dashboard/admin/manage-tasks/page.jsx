"use client";

import { useEffect, useMemo, useState } from "react";
import { FiFileText, FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import { deleteAdminTask, fetchAdminTasks } from "@/lib/api";

const statusStyles = {
  open: "bg-sky-500/10 text-sky-200",
  inprogress: "bg-amber-500/10 text-amber-200",
  completed: "bg-emerald-500/10 text-emerald-200",
  paid: "bg-emerald-500/10 text-emerald-200",
  cancelled: "bg-rose-500/10 text-rose-200",
  closed: "bg-slate-500/10 text-slate-200",
};

const normalizeStatus = (status) => {
  const value = String(status || "open").trim().toLowerCase();

  if (value.includes("complete")) return "completed";
  if (value.includes("paid")) return "paid";
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("close")) return "closed";
  if (value.includes("progress")) return "inprogress";

  return "open";
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminTasks({ status: "all" });
      setTasks(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      const message = err?.message || "Unable to load tasks.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadTasks();
    };

    void load();
  }, []);

  const handleDeleteTask = async (task) => {
    const confirmation = typeof window !== "undefined" ? window.confirm(`Delete task "${task.title || "Untitled task"}"? This action cannot be undone.`) : true;
    if (!confirmation) {
      return;
    }

    setSavingIds((current) => [...current, task.id]);
    setError(null);

    try {
      await deleteAdminTask(task.id);
      setTasks((current) => current.filter((currentTask) => currentTask.id !== task.id));
      setNotification({ open: true, message: `Task "${task.title || "Untitled task"}" deleted successfully.`, type: "success" });
    } catch (err) {
      const message = err?.message || "Unable to delete task.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setSavingIds((current) => current.filter((id) => id !== task.id));
    }
  };

  const liveTasksCount = useMemo(() => {
    return tasks.filter((task) => !["completed", "paid", "cancelled", "closed"].includes(normalizeStatus(task.status))).length;
  }, [tasks]);

  const closeNotification = () => {
    setNotification((current) => ({ ...current, open: false }));
  };

  const notificationClasses =
    notification.type === "success"
      ? "border-emerald-400 bg-emerald-950 text-emerald-200"
      : notification.type === "error"
      ? "border-rose-400 bg-rose-950 text-rose-200"
      : "border-sky-400 bg-sky-950 text-sky-200";

  return (
    <div className="space-y-6">
      {notification.open ? (
        <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border p-4 shadow-xl shadow-slate-950/40 ${notificationClasses}`}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-6">{notification.message}</p>
            <button type="button" onClick={closeNotification} className="text-slate-300 hover:text-white">
              ×
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage Tasks</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review every published task on the platform. Delete any task that violates guidelines or contains unsafe content.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadTasks}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Total tasks:</span> {tasks.length}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Live tasks:</span> {liveTasksCount}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-800 bg-rose-950/60 p-4 text-sm text-rose-200">{error}</div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-sm shadow-slate-950/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
            <thead className="bg-slate-950/90 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Task</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Posted</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const normalizedStatus = normalizeStatus(task.status);
                  const statusClass = statusStyles[normalizedStatus] ?? statusStyles.open;
                  const isSaving = savingIds.includes(task.id);

                  return (
                    <tr key={task.id} className="bg-slate-950/50 transition hover:bg-slate-900/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
                            <FiFileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{task.title || "Untitled task"}</p>
                            <p className="text-xs text-slate-500">{task.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{task.category || "General"}</td>
                      <td className="px-6 py-4 text-slate-300">{task.clientEmail || task.clientId || "Unknown"}</td>
                      <td className="px-6 py-4 text-slate-300">${Number(task.budget ?? task.amount ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{formatDate(task.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task)}
                          disabled={isSaving}
                          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            isSaving
                              ? "cursor-not-allowed bg-slate-700 text-slate-300 opacity-70"
                              : "bg-rose-500 text-white hover:bg-rose-400"
                          }`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                          {isSaving ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
