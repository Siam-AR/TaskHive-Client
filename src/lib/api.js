import { getSession } from "@/lib/auth-client";

const DEFAULT_SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${DEFAULT_SERVER}${path}`;

  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});

  if (typeof window !== "undefined") {
    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;

      if (sessionUser) {
        headers["X-User-Id"] = sessionUser.id || sessionUser._id || sessionUser.userId || "";
        headers["X-User-Email"] = sessionUser.email || "";
        headers["X-User-Role"] = sessionUser.role || "";
      }
    } catch (error) {
      console.warn("Unable to attach auth headers", error);
    }
  }

  const fetchOpts = Object.assign({}, opts, {
    headers,
    credentials: "include",
    cache: opts.cache ?? "no-store",
  });

  const res = await fetch(url, fetchOpts);

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let body = null;
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }

    const message =
      (body && typeof body === "object" && body.message) ||
      (typeof body === "string" && body) ||
      "Request failed";

    const err = new Error(message);
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
  return apiFetch(`/api/tasks${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export async function fetchTaskById(taskId) {
  return apiFetch(`/api/tasks/${encodeURIComponent(taskId)}`, { method: "GET" });
}

export async function fetchBrowseFreelancers(query = {}) {
  const qs = new URLSearchParams(query).toString();
  return apiFetch(`/api/freelancers${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export async function fetchFreelancerById(freelancerId) {
  return apiFetch(`/api/freelancers/${encodeURIComponent(freelancerId)}`, { method: "GET" });
}

export async function checkProposalStatus(taskId) {
  return apiFetch(`/api/proposals/check/${encodeURIComponent(taskId)}`, { method: "GET" });
}

export async function createTask(payload) {
  return apiFetch(`/api/tasks`, { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyTasks() {
  const response = await apiFetch(`/api/tasks/my`, { method: "GET" });

  if (response && Array.isArray(response.data)) {
    return {
      ...response,
      data: response.data.map(normalizeTaskData).filter(Boolean),
    };
  }

  return response;
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

const normalizeIdValue = (id) => {
  if (typeof id === "string") {
    return id.trim();
  }

  if (id && typeof id === "object") {
    if (typeof id.toHexString === "function") {
      return id.toHexString();
    }

    if (typeof id.toString === "function") {
      const stringValue = id.toString();
      if (stringValue.startsWith("ObjectId(\"") && stringValue.endsWith("\")")) {
        return stringValue.slice(9, -2);
      }
      return stringValue;
    }
  }

  return String(id ?? "").trim();
};

function normalizeTaskData(task) {
  if (!task || typeof task !== "object") {
    return null;
  }

  const normalizedId = normalizeIdValue(task._id ?? task.id ?? "");

  return {
    ...task,
    _id: normalizedId,
    id: normalizedId,
    status: String(task.status || "open").trim(),
    category: task.category || task.type || "General",
    budget: Number(task.budget ?? task.amount ?? 0),
  };
}

export async function createTransaction(payload) {
  return apiFetch(`/api/transactions`, { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchMyTransactions() {
  return apiFetch(`/api/transactions/my`, { method: "GET" });
}

const api = {
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

export default api;
