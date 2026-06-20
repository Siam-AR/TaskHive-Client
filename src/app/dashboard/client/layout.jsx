import { requireRole } from "@/lib/core/session";

const ClientDashboardLayout = async ({ children }) => {
  await requireRole("client");
  return children;
};

export default ClientDashboardLayout;