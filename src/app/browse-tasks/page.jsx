import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskCard from "@/components/TaskCard";
import TaskPagination from "@/components/TaskPagination";
import TaskFilters from "@/components/TaskFilters";
import { fetchBrowseTasks } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowseTasksPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const page = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10);

  let response = null;
  let error = null;

  try {
    response = await fetchBrowseTasks({ search, category, page, limit: 3 });
  } catch (err) {
    error = err?.message || "Unable to load tasks from the database.";
  }

  const tasks = Array.isArray(response?.data) ? response.data : [];
  const totalTasks = response?.pagination?.totalTasks ?? tasks.length;
  const totalPages = response?.pagination?.totalPages ?? 1;
  const currentPage = response?.pagination?.page ?? 1;
  const categories = Array.isArray(response?.categories) ? response.categories : [];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Browse tasks</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
                Find the right micro-task for you
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Search open tasks, filter by category, and jump into a project that fits your skills.
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 dark:bg-slate-900 dark:text-sky-300">
              {totalTasks} open tasks available
            </div>
          </div>

          <TaskFilters categories={categories} initialSearch={search} initialCategory={category} />

          {(search || category) && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Showing results for <span className="font-semibold text-slate-900 dark:text-white">{search || "all tasks"}</span>
              {category ? ` in ${category}` : ""}.
            </p>
          )}
        </div>

        {error ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-rose-300 bg-white p-10 text-center shadow-sm dark:border-rose-700 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Unable to load tasks</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              {error}
            </p>
          </div>
        ) : tasks.length ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id.toString()} task={task} />
              ))}
            </div>

            <div className="mt-10">
              <TaskPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">No tasks match these filters yet</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Try a broader search or visit the homepage to see the latest opportunities.
            </p>
            <Link href="/" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700">
              Back to home
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}