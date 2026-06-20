import { requireRole } from "@/lib/session";

const AdminDashboardLayout = async ({ children }) => {
  await requireRole("admin");
  return children;
};

export default AdminDashboardLayout;