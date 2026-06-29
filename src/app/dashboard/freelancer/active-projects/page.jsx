import { getServerSession } from "@/lib/session";
import { getFreelancerActiveProjects } from "@/lib/dashboard-freelancer-active-projects";
import FreelancerActiveProjectsPanel from "@/components/dashboard/FreelancerActiveProjectsPanel";

export default async function FreelancerActiveProjectsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const projects = freelancerEmail ? await getFreelancerActiveProjects(freelancerEmail) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Freelancer workspace</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Active Projects</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Track accepted projects, submit deliverable links, and review completed work in one place.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {projects.length} project{projects.length === 1 ? "" : "s"} in your queue
          </div>
        </div>
      </div>

      <FreelancerActiveProjectsPanel initialProjects={projects} freelancerEmail={freelancerEmail} />
    </div>
  );
}
