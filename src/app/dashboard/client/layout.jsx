import { requireRole } from "@/lib/session";

const ClientDashboardLayout = async ({ children }) => {
  await requireRole("client");
  return children;
};

export default ClientDashboardLayout;