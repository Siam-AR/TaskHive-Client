import { NextResponse } from "next/server";
import { getAppDb } from "@/lib/server-db";

const normalizeId = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    if (typeof value.toString === "function") {
      const stringValue = value.toString();
      return stringValue.startsWith("ObjectId(") && stringValue.endsWith(")") ? stringValue.slice(9, -1) : stringValue;
    }
  }

  return String(value ?? "").trim();
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id")?.trim();
    const userEmail = request.headers.get("x-user-email")?.trim();
    const userRole = request.headers.get("x-user-role")?.trim().toLowerCase();

    if (!userId && !userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity headers" }, { status: 401 });
    }

    if (userRole && userRole !== "client") {
      return NextResponse.json({ success: false, message: "Only clients can access proposal management" }, { status: 403 });
    }

    const db = await getAppDb();
    const tasksCollection = db.collection("tasks");
    const proposalsCollection = db.collection("proposals");
    const usersCollection = db.collection("users");

    const taskQuery = { $or: [] };
    if (userId) taskQuery.$or.push({ clientId: userId });
    if (userEmail) {
      taskQuery.$or.push({ clientEmail: userEmail });
      taskQuery.$or.push({ client_email: userEmail });
    }

    const tasks = taskQuery.$or.length ? await tasksCollection.find(taskQuery).toArray() : [];
    const taskIdSet = new Set(tasks.map((task) => normalizeId(task._id || task.id || task.taskId || "")));

    const proposals = await proposalsCollection.find({}).toArray();
    const clientProposals = proposals.filter((proposal) => taskIdSet.has(normalizeId(proposal.task_id || proposal.taskId || "")));

    const freelancerEmails = [...new Set(clientProposals.map((proposal) => proposal.freelancer_email || ""))].filter(Boolean);
    const freelancerUsers = freelancerEmails.length
      ? await usersCollection.find({ email: { $in: freelancerEmails } }).toArray()
      : [];
    const freelancerMap = new Map(freelancerUsers.map((user) => [String(user.email || "").toLowerCase(), user]));

    const proposalPayload = clientProposals.map((proposal) => {
      const task = tasks.find((item) => normalizeId(item._id || item.id || item.taskId || "") === normalizeId(proposal.task_id || proposal.taskId || ""));
      const freelancerUser = freelancerMap.get(String(proposal.freelancer_email || "").toLowerCase());
      const taskStatus = normalizeStatus(task?.status || "open");
      const proposalStatus = normalizeStatus(proposal.status || "pending");
      const acceptedForTask = clientProposals.some((item) => normalizeId(item.task_id || item.taskId || "") === normalizeId(proposal.task_id || proposal.taskId || "") && normalizeStatus(item.status || "pending") === "accepted");

      return {
        _id: normalizeId(proposal._id || proposal.id || ""),
        taskId: normalizeId(proposal.task_id || proposal.taskId || ""),
        taskTitle: task?.title || proposal.task_title || "Untitled Task",
        taskStatus,
        freelancerName: freelancerUser?.name || proposal.freelancer_name || proposal.freelancer_email || "Freelancer",
        freelancerEmail: proposal.freelancer_email || "",
        proposedBudget: Number(proposal.proposed_budget ?? proposal.budget ?? 0),
        estimatedDays: Number(proposal.estimated_days ?? proposal.days ?? 0),
        coverNote: proposal.cover_note || proposal.message || "",
        status: proposalStatus,
        submittedAt: proposal.submitted_at || proposal.createdAt || null,
        canAccept: proposalStatus === "pending" && taskStatus !== "in progress" && taskStatus !== "completed" && !acceptedForTask,
      };
    });

    return NextResponse.json({ success: true, data: proposalPayload });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load proposals" }, { status: 500 });
  }
}
