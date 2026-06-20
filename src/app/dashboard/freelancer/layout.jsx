import { requireRole } from "@/lib/session";

const FreelancerDashboardLayout = async ({ children }) => {
  await requireRole("freelancer");
  return children;
};

export default FreelancerDashboardLayout;