import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { requireRole, getServerSession } from "@/lib/session";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

const AdminDashboardLayout = async ({ children }) => {
  await requireRole("admin");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),linear-gradient(135deg,#020617_0%,#050b1a_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-lg shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">Admin dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Manage your admin workspace</h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar user={user} />
          <section className="flex-1 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-4 shadow-lg shadow-slate-950/20 sm:p-6 lg:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardLayout;