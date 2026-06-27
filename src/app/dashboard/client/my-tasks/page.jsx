"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import EditTaskForm from "@/components/dashboard/EditTaskForm";
import { fetchMyTasks } from "@/lib/api";

const getStatusCount = (tasks, statusMatcher) =>
  tasks.filter((task) => statusMatcher(String(task.status || "").toLowerCase())).length;

export default function ClientMyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      try {
        const response = await fetchMyTasks();
        if (!mounted) return;
        const taskItems = Array.isArray(response?.data) ? response.data : [];
        setTasks(taskItems);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError?.message || "Unable to load your tasks. Please try again.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadTasks();
    return () => {
      mounted = false;
    };
  }, []);

  const [editingTask, setEditingTask] = useState(null);
  const [updateSuccessTask, setUpdateSuccessTask] = useState(null);

  const totalTasks = tasks.length;
  const openTasks = getStatusCount(tasks, (status) => status === "open");
  const inProgressTasks = getStatusCount(tasks, (status) => status.includes("progress"));
  const completedTasks = getStatusCount(tasks, (status) => status.includes("complete"));

  const handleTaskUpdated = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        String(item._id ?? item.id) === String(updatedTask._id ?? updatedTask.id) ? updatedTask : item
      )
    );
    setEditingTask(null);
    setUpdateSuccessTask(updatedTask);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">My tasks</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Client task workspace</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              View the tasks you have posted, check live status updates, and open task details for each job.
            </p>
          </div>
          <Link href="/dashboard/client/post-task" className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
            Post a new task
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total tasks</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{totalTasks}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Open tasks</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{openTasks}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">In progress</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{inProgressTasks}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{completedTasks}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          Loading your tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xl font-semibold text-slate-950 dark:text-white">No tasks found</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">You have not posted any tasks yet. Create a new task to see it here.</p>
          <Link href="/dashboard/client/post-task" className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
            Post your first task
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <div key={String(task._id ?? task.id ?? task.title)} className="group">
                <TaskCard
                  task={task}
                  actions={
                    String(task.status || "").toLowerCase() === "open" ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setEditingTask(task);
                        }}
                        className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        Edit
                      </button>
                    ) : null
                  }
                />
              </div>
            ))}
          </div>

          {editingTask ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
              <div className="w-full max-w-3xl overflow-auto rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-950">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Edit task</p>
                    <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Update your open task</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
                <EditTaskForm task={editingTask} onCancel={() => setEditingTask(null)} onUpdated={handleTaskUpdated} />
              </div>
            </div>
          ) : null}

          {updateSuccessTask ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
              <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 text-center shadow-2xl dark:bg-slate-950">
                <div className="mb-4 text-sky-600"></div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Task updated successfully</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your task {updateSuccessTask.title} has been saved.
                </p>
                <button
                  type="button"
                  onClick={() => setUpdateSuccessTask(null)}
                  className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
