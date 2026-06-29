"use client";

import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiLock, FiRefreshCcw, FiUser } from "react-icons/fi";
import { fetchAdminUsers, updateAdminUserBlockStatus } from "@/lib/api";
import { getSession } from "@/lib/auth-client";

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminUsers();
      setUsers(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      const message = err?.message || "Unable to load users.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
      setCurrentUser(sessionUser);
    } catch (err) {
      console.warn("Unable to resolve current user session", err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadCurrentUser();
      await loadUsers();
    };

    void initialize();
  }, []);

  const handleToggleBlock = async (user) => {
    if (currentUser?.id && currentUser.id === user.id) {
      const message = "You cannot change block status for your own account.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
      return;
    }

    const nextBlocked = !user.isBlocked;
    setSavingIds((current) => [...current, user.id]);
    setError(null);

    try {
      const response = await updateAdminUserBlockStatus(user.id, nextBlocked);
      const updated = response?.data;
      if (updated) {
        setUsers((current) => current.map((currentUser) => (currentUser.id === updated.id ? updated : currentUser)));
        setNotification({
          open: true,
          message: `User ${updated.name || updated.email} has been ${updated.isBlocked ? "blocked" : "unblocked"}.`,
          type: updated.isBlocked ? "warning" : "success",
        });
      }
    } catch (err) {
      const message = err?.message || "Unable to update user status.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setSavingIds((current) => current.filter((id) => id !== user.id));
    }
  };

  const blockedCount = useMemo(() => users.filter((user) => user.isBlocked).length, [users]);

  const closeNotification = () => {
    setNotification((current) => ({ ...current, open: false }));
  };

  const notificationClasses = notification.type === "success"
    ? "border-emerald-400 bg-emerald-950 text-emerald-200"
    : notification.type === "warning"
    ? "border-amber-400 bg-amber-950 text-amber-200"
    : "border-rose-400 bg-rose-950 text-rose-200";

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
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage Users</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review and manage user accounts across the platform. Block or unblock access directly from this admin view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Blocked users:</span> {blockedCount}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-800 bg-rose-950/60 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-sm shadow-slate-950/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
            <thead className="bg-slate-950/90 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSaving = savingIds.includes(user.id);
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="bg-slate-950/50 transition hover:bg-slate-900/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-sky-400">
                            <FiUser className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user.name || "Unknown"}</p>
                            <p className="text-xs text-slate-500">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{user.email || "-"}</td>
                      <td className="px-6 py-4 capitalize text-slate-300">{user.role || "Client"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isBlocked ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user)}
                          disabled={isSaving || isSelf}
                          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            isSelf
                              ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                              : user.isBlocked
                              ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                              : "bg-rose-500 text-white hover:bg-rose-400"
                          } ${isSaving ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          {user.isBlocked ? <FiArrowRight className="h-4 w-4" /> : <FiLock className="h-4 w-4" />}
                          {isSaving ? "Saving..." : isSelf ? "Your account" : user.isBlocked ? "Unblock" : "Block"}
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
