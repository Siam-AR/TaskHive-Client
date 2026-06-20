import { requireRole } from "@/lib/core/session";

const FreelancerDashboardLayout = async ({ children }) => {
  await requireRole("freelancer");
  return children;
};

export default FreelancerDashboardLayout;