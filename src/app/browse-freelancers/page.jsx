import Link from "next/link";
import { FiStar } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskPagination from "@/components/TaskPagination";
import { fetchBrowseFreelancers } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowseFreelancersPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const search = typeof params.search === "string" ? params.search : "";
  const page = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10);

  let response = null;
  let error = null;

  try {
    response = await fetchBrowseFreelancers({ search, page, limit: 6 });
  } catch (err) {
    error = err?.message || "Unable to load freelancers from the database.";
  }

  const freelancers = Array.isArray(response?.data) ? response.data : [];
  const totalFreelancers = response?.pagination?.totalFreelancers ?? freelancers.length;
  const totalPages = response?.pagination?.totalPages ?? 1;
  const currentPage = response?.pagination?.page ?? 1;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Browse freelancers</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
                Meet skilled freelancers ready to work
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Browse freelancer profiles, review their skills, and open their full profile.
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 dark:bg-slate-900 dark:text-sky-300">
              {totalFreelancers} freelancer{totalFreelancers === 1 ? "" : "s"} available
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-rose-300 bg-white p-10 text-center shadow-sm dark:border-rose-700 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Unable to load freelancers</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{error}</p>
          </div>
        ) : freelancers.length ? (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {freelancers.map((freelancer) => (
                <Link
                  key={freelancer._id}
                  href={`/freelancer/${encodeURIComponent(freelancer._id)}`}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-lg font-semibold text-sky-700 dark:bg-slate-900 dark:text-sky-300">
                      {(freelancer.name || "F").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{freelancer.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{freelancer.headline || "Freelancer"}</p>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {freelancer.bio || "No bio provided yet."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(freelancer.skills || []).slice(0, 4).map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <FiStar className="h-3.5 w-3.5 fill-current" />
                      {Number(freelancer.rating || 0).toFixed(1)}
                      <span className="opacity-70">({freelancer.reviewCount || 0})</span>
                    </div>
                    <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                      {freelancer.finishedJobs || 0} jobs
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{freelancer.location || ""}</span>
                    <span className="font-semibold text-sky-600 transition group-hover:text-sky-700">View profile →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <TaskPagination currentPage={currentPage} totalPages={totalPages} basePath="/browse-freelancers" />
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">No freelancers match your search yet</h2>
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