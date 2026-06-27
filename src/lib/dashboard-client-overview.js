import { getSession } from "@/lib/auth-client";

const buildAuthHeaders = async () => {
  const headers = { "Content-Type": "application/json" };

  try {
    const sessionResult = await getSession();
    const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;

    if (sessionUser) {
      headers["X-User-Id"] = sessionUser.id || sessionUser._id || sessionUser.userId || "";
      headers["X-User-Email"] = sessionUser.email || "";
      headers["X-User-Role"] = sessionUser.role || "";
    }
  } catch (error) {
    console.warn("Unable to attach auth headers for dashboard overview", error);
  }

  return headers;
};

export async function getClientDashboardOverview() {
  const overview = {
    totalTasks: 0,
    openTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalSpent: 0,
    taskError: null,
    transactionError: null,
  };

  const headers = await buildAuthHeaders();
  const response = await fetch("/api/dashboard/client", {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Failed to load dashboard overview");
  }

  overview.totalTasks = Number(payload.data?.totalTasks ?? 0);
  overview.openTasks = Number(payload.data?.openTasks ?? 0);
  overview.inProgressTasks = Number(payload.data?.inProgressTasks ?? 0);
  overview.completedTasks = Number(payload.data?.completedTasks ?? 0);
  overview.totalSpent = Number(payload.data?.totalSpent ?? 0);

  return overview;
}
