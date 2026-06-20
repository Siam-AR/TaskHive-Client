import { requireSession } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  await requireSession();
  return children;
}