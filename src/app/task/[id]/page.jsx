import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskDetailsShell from "@/components/TaskDetailsShell";
import { fetchTaskById } from "@/lib/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TaskDetailsPage({ params }) {
  const routeParams = await params;
  const taskId = routeParams?.id || routeParams?.taskId || routeParams?.slug;
  const taskResponse = await fetchTaskById(taskId);
  const task = taskResponse?.data || null;

  if (!task) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <TaskDetailsShell task={task} />
      <Footer />
    </main>
  );
}