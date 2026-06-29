import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

const normalizeId = (value) => {
  if (!value && value !== 0) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    if (typeof value.toHexString === "function") {
      return value.toHexString();
    }

    if (typeof value.toString === "function") {
      return value.toString().trim();
    }
  }

  return String(value).trim();
};

const normalizeDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
};

export async function getFreelancerProposals(freelancerEmail) {
  const db = await getAppDb();
  const proposalsCollection = db.collection("proposals");
  const tasksCollection = db.collection("tasks");

  const proposals = await proposalsCollection
    .find({ freelancerEmail })
    .sort({ createdAt: -1, submitted_at: -1 })
    .toArray();

  const taskIds = proposals
    .map((proposal) => normalizeId(proposal.taskId))
    .filter(Boolean);

  const uniqueTaskIds = [...new Set(taskIds)];
  const objectIds = uniqueTaskIds
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const taskQuery = [];
  if (objectIds.length) {
    taskQuery.push({ _id: { $in: objectIds } });
  }

  if (uniqueTaskIds.length) {
    taskQuery.push({ id: { $in: uniqueTaskIds } });
  }

  const taskDocs = taskQuery.length
    ? await tasksCollection.find({ $or: taskQuery }).project({ _id: 1, id: 1, title: 1 }).toArray()
    : [];

  const taskTitleById = new Map();
  taskDocs.forEach((task) => {
    const key = normalizeId(task._id) || normalizeId(task.id);
    taskTitleById.set(key, task.title || "Unknown task");
  });

  return proposals.map((proposal) => {
    const taskKey = normalizeId(proposal.taskId);
    const submittedAt = normalizeDateValue(proposal.createdAt ?? proposal.submitted_at);

    return {
      id: normalizeId(proposal._id),
      taskTitle: taskTitleById.get(taskKey) || "Unknown task",
      proposedBudget: Number(proposal.expectedAmount ?? proposal.proposed_budget ?? proposal.budget ?? 0),
      submittedAt,
      status: String(proposal.status || "pending").toLowerCase(),
    };
  });
}
