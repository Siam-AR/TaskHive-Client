import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { requireRole, getServerSession } from "@/lib/session";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

const AdminDashboardLayout = async ({ children }) => {
  await requireRole("admin");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.1),transparent_32%),linear-gradient(135deg,#f8fbff_0%,#f8fafc_100%)] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),linear-gradient(135deg,#020617_0%,#020617_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Admin dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Manage your admin workspace</h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar user={user} />
          <section className="flex-1 rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:p-6 lg:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardLayout;