import { getSession } from "@/lib/auth-client";

export async function getDashboardHeaders() {
  const headers = {};

  try {
    const sessionResult = await getSession();
    const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;

    if (sessionUser) {
      headers["X-User-Id"] = sessionUser.id || sessionUser._id || sessionUser.userId || "";
      headers["X-User-Email"] = sessionUser.email || "";
      headers["X-User-Role"] = sessionUser.role || "";
    }
  } catch (error) {
    console.warn("Unable to attach dashboard proposal headers", error);
  }

  return headers;
}

async function requestDashboardProposals(path, options = {}) {
  const headers = await getDashboardHeaders();
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof body === "object" && body && body.message) ||
      (typeof body === "string" && body) ||
      "Request failed";
    throw new Error(message);
  }

  return typeof body === "object" && body !== null ? body : { data: body };
}

export async function fetchClientProposals() {
  const result = await requestDashboardProposals("/api/dashboard/client/proposals", { method: "GET" });
  return Array.isArray(result?.data) ? result.data : [];
}

export async function updateClientProposal(proposalId, action) {
  const result = await requestDashboardProposals(`/api/dashboard/client/proposals/${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
  return result;
}

export async function submitClientProposalAction(proposalId, action) {
  const headers = await getDashboardHeaders();
  const response = await fetch(`/api/dashboard/client/proposals/${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ action }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error((typeof body === "object" && body?.message) || (typeof body === "string" && body) || "Request failed");
  }

  return typeof body === "object" && body !== null ? body : { data: body };
}

export async function createProposalCheckout(proposalId) {
  const headers = await getDashboardHeaders();
  const response = await fetch(`/api/dashboard/client/proposals/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ proposalId }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error((typeof body === "object" && body?.message) || (typeof body === "string" && body) || "Request failed");
  }

  return typeof body === "object" && body !== null ? body : { data: body };
}
