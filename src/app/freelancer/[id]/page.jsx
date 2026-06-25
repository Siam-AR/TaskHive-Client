import Link from "next/link";
import { FiMapPin, FiMail, FiBriefcase, FiStar } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchFreelancerById } from "@/lib/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FreelancerDetailsPage({ params }) {
  const routeParams = await params;
  const freelancerId = routeParams?.id || routeParams?.freelancerId || routeParams?.slug;
  const freelancerResponse = await fetchFreelancerById(freelancerId);
  const freelancer = freelancerResponse?.data || null;

  if (!freelancer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-semibold text-sky-700 dark:bg-slate-900 dark:text-sky-300">
                {(freelancer.name || "F").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{freelancer.name}</h1>
                <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">{freelancer.headline || "Freelancer"}</p>
              </div>
            </div>

            <Link href="/browse-freelancers" className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500">
              Back to freelancers
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">About</h2>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
                {freelancer.bio || "This freelancer has not added a bio yet."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(freelancer.skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <FiMail className="text-sky-600" />
                <span>{freelancer.email || "Email not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <FiMapPin className="text-sky-600" />
                <span>{freelancer.location || "Location not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <FiBriefcase className="text-sky-600" />
                <span>{freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Rate not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <FiStar className="text-sky-600" />
                <span>{freelancer.role || "Freelancer"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
