import Link from "next/link";

export default function TaskIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-10 text-center dark:bg-slate-950">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Task details are available from the browse page</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Select a task card to open its full details and proposal form.
        </p>
        <Link href="/browse-tasks" className="mt-8 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500">
          Back to browse tasks
        </Link>
      </div>
    </main>
  );
}
