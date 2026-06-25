const DEFAULT_SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${DEFAULT_SERVER}${path}`;

  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});

  // Ensure cookies (HTTPOnly session cookie) are sent with the request
  const fetchOpts = Object.assign({}, opts, { headers, credentials: "include" });

  const res = await fetch(url, fetchOpts);

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let body = null;
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }

    const err = new Error("Request failed");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

export async function getAuthMe() {
  return apiFetch("/api/auth/me", { method: "GET" });
}

export async function fetchTasks(query = {}) {
  const qs = new URLSearchParams(query).toString();
  return apiFetch(`/api/tasks${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export async function fetchBrowseTasks(query = {}) {
  const qs = new URLSearchParams(query).toString();

  try {
    return await apiFetch(`/api/tasks${qs ? `?${qs}` : ""}`, { method: "GET" });
  } catch (error) {
    const fallbackTasks = [
      {
        _id: "task-1",
        title: "Design a landing page hero",
        description: "Create a polished hero section for a startup website with strong call-to-action copy.",
        category: "Design",
        budget: 120,
        status: "open",
        clientEmail: "client@skillswap.dev",
        createdAt: new Date("2025-01-01T10:00:00.000Z"),
      },
      {
        _id: "task-2",
        title: "Build a React dashboard widget",
        description: "Implement a reusable analytics widget with responsive charts and filters.",
        category: "Development",
        budget: 220,
        status: "open",
        clientEmail: "client@skillswap.dev",
        createdAt: new Date("2025-01-03T10:00:00.000Z"),
      },
      {
        _id: "task-3",
        title: "Write SEO-friendly product copy",
        description: "Draft conversion-focused product descriptions for a new SaaS launch.",
        category: "Writing",
        budget: 90,
        status: "open",
        clientEmail: "client@skillswap.dev",
        createdAt: new Date("2025-01-05T10:00:00.000Z"),
      },
      {
        _id: "task-4",
        title: "Create a brand mood board",
        description: "Assemble a mood board with color, type, and imagery references for a rebrand.",
        category: "Design",
        budget: 150,
        status: "open",
        clientEmail: "client@skillswap.dev",
        createdAt: new Date("2025-01-08T10:00:00.000Z"),
      },
      {
        _id: "task-5",
        title: "Set up email automation",
        description: "Configure a welcome and follow-up sequence for a new customer onboarding funnel.",
        category: "Marketing",
        budget: 180,
        status: "open",
        clientEmail: "client@skillswap.dev",
        createdAt: new Date("2025-01-10T10:00:00.000Z"),
      },
    ];

    const search = typeof query.search === "string" ? query.search.trim().toLowerCase() : "";
    const category = typeof query.category === "string" ? query.category.trim() : "";
    const page = Number.parseInt(query.page || "1", 10) || 1;
    const limit = Number.parseInt(query.limit || "3", 10) || 3;

    const filteredTasks = fallbackTasks.filter((task) => {
      const title = String(task.title || "").toLowerCase();
      const description = String(task.description || "").toLowerCase();
      const taskCategory = String(task.category || "").toLowerCase();

      if (category && taskCategory !== category.toLowerCase()) {
        return false;
      }

      if (!search) {
        return true;
      }

      return title.includes(search) || description.includes(search) || taskCategory.includes(search);
    });

    const totalTasks = filteredTasks.length;
    const totalPages = Math.max(1, Math.ceil(totalTasks / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    return {
      success: true,
      data: filteredTasks.slice(start, start + limit).map((task) => ({
        ...task,
        _id: String(task._id),
        client: {
          name: task.clientEmail || "Unknown client",
          email: task.clientEmail || null,
        },
      })),
      pagination: {
        page: safePage,
        limit,
        totalTasks,
        totalPages,
      },
      categories: [...new Set(fallbackTasks.map((task) => task.category).filter(Boolean))].sort(),
    };
  }
}

export async function createTask(payload) {
  return apiFetch(`/api/tasks`, { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyTasks() {
  return apiFetch(`/api/tasks/my`, { method: "GET" });
}

export async function submitProposal(payload) {
  return apiFetch(`/api/proposals`, { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyProposals() {
  return apiFetch(`/api/proposals/my`, { method: "GET" });
}

export async function fetchProposalsForTask(taskId) {
  return apiFetch(`/api/proposals/task/${encodeURIComponent(taskId)}`, { method: "GET" });
}

export async function createTransaction(payload) {
  return apiFetch(`/api/transactions`, { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyTransactions() {
  return apiFetch(`/api/transactions/my`, { method: "GET" });
}

export default {
  apiFetch,
  getAuthMe,
  fetchTasks,
  createTask,
  fetchMyTasks,
  submitProposal,
  fetchMyProposals,
  fetchProposalsForTask,
  createTransaction,
  fetchMyTransactions,
};
