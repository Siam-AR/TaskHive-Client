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

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const normalizeTaskStatus = (value) => {
  const status = normalizeStatus(value);

  if (["in progress", "in-progress", "in_progress", "active", "working"].includes(status)) {
    return "in progress";
  }

  if (["completed", "complete", "done", "finished"].includes(status)) {
    return "completed";
  }

  return status || "open";
};

const buildTaskQuery = (taskId) => {
  const normalized = normalizeId(taskId);
  const query = { $or: [{ id: normalized }, { taskId: normalized }] };

  if (/^[a-fA-F0-9]{24}$/.test(normalized)) {
    query.$or.unshift({ _id: new ObjectId(normalized) });
  }

  return query;
};

export async function getFreelancerActiveProjects(freelancerEmail) {
  const db = await getAppDb();
  const proposalsCollection = db.collection("proposals");
  const tasksCollection = db.collection("tasks");

  const normalizedEmail = String(freelancerEmail || "").trim().toLowerCase();
  const filter = normalizedEmail
    ? {
        $or: [
          { freelancerEmail: normalizedEmail },
          { freelancer_email: normalizedEmail },
          { freelancerEmail: freelancerEmail },
          { freelancer_email: freelancerEmail },
          { freelancerId: normalizedEmail },
          { freelancer_id: normalizedEmail },
        ],
      }
    : {};

  const acceptedProposals = await proposalsCollection
    .find({ ...filter, status: { $in: ["accepted", "Accepted", "ACCEPTED"] } })
    .sort({ createdAt: -1, submitted_at: -1 })
    .toArray();

  const taskIds = acceptedProposals
    .map((proposal) => normalizeId(proposal.taskId || proposal.task_id || proposal.task || ""))
    .filter(Boolean);

  const uniqueTaskIds = [...new Set(taskIds)];
  const objectIds = uniqueTaskIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

  const taskQuery = [];
  if (objectIds.length) {
    taskQuery.push({ _id: { $in: objectIds } });
  }

  if (uniqueTaskIds.length) {
    taskQuery.push({ id: { $in: uniqueTaskIds } });
    taskQuery.push({ taskId: { $in: uniqueTaskIds } });
  }

  const taskDocs = taskQuery.length ? await tasksCollection.find({ $or: taskQuery }).toArray() : [];
  const taskLookup = new Map();

  taskDocs.forEach((task) => {
    const key = normalizeId(task._id || task.id || task.taskId || "");
    if (key) {
      taskLookup.set(key, task);
    }
  });

  return acceptedProposals
    .map((proposal) => {
      const taskKey = normalizeId(proposal.taskId || proposal.task_id || proposal.task || "");
      const taskDoc = taskLookup.get(taskKey);

      if (!taskDoc) {
        return null;
      }

      const taskStatus = normalizeTaskStatus(taskDoc.status);
      if (!(["in progress", "completed"].includes(taskStatus))) {
        return null;
      }

      return {
        id: normalizeId(proposal._id || proposal.id || ""),
        proposalId: normalizeId(proposal._id || proposal.id || ""),
        taskId: taskKey,
        taskTitle: taskDoc.title || proposal.task_title || proposal.taskTitle || "Untitled task",
        taskStatus,
        clientName: taskDoc.clientName || taskDoc.client?.name || taskDoc.client?.fullName || taskDoc.clientEmail || taskDoc.client_email || "Client",
        clientEmail: taskDoc.clientEmail || taskDoc.client_email || taskDoc.client?.email || "",
        proposedBudget: Number(proposal.proposed_budget ?? proposal.proposedBudget ?? proposal.expectedAmount ?? proposal.budget ?? 0),
        estimatedDays: Number(proposal.estimated_days ?? proposal.estimatedDays ?? 0),
        submittedAt: proposal.createdAt ?? proposal.submitted_at ?? null,
        completedAt: taskDoc.completedAt || taskDoc.updatedAt || null,
        deliverableUrl: taskDoc.deliverable_url || taskDoc.deliverableUrl || taskDoc.deliverable || "",
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftDate = new Date(left.completedAt || left.submittedAt || 0);
      const rightDate = new Date(right.completedAt || right.submittedAt || 0);
      return rightDate - leftDate;
    });
}

export async function completeFreelancerProject({ taskId, deliverableUrl, freelancerEmail }) {
  const db = await getAppDb();
  const tasksCollection = db.collection("tasks");
  const proposalsCollection = db.collection("proposals");

  const normalizedTaskId = normalizeId(taskId);
  if (!normalizedTaskId) {
    throw new Error("A valid task id is required.");
  }

  const taskDoc = await tasksCollection.findOne(buildTaskQuery(normalizedTaskId));

  if (!taskDoc) {
    throw new Error("Task not found.");
  }

  const normalizedEmail = String(freelancerEmail || "").trim().toLowerCase();
  const acceptedProposal = await proposalsCollection.findOne({
    task_id: normalizeId(taskDoc._id || taskDoc.id || taskDoc.taskId || normalizedTaskId),
    status: { $in: ["accepted", "Accepted", "ACCEPTED"] },
    $or: [
      { freelancerEmail: normalizedEmail },
      { freelancer_email: normalizedEmail },
      { freelancerEmail: freelancerEmail },
      { freelancer_email: freelancerEmail },
      { freelancerId: normalizedEmail },
      { freelancer_id: normalizedEmail },
    ],
  });

  if (!acceptedProposal && normalizedEmail) {
    throw new Error("You do not have an accepted proposal for this task.");
  }

  const trimmedUrl = String(deliverableUrl || "").trim();
  if (!trimmedUrl) {
    throw new Error("Please provide a deliverable link.");
  }

  try {
    new URL(trimmedUrl);
  } catch {
    throw new Error("Please provide a valid http or https URL.");
  }

  const now = new Date();
  await tasksCollection.updateOne(buildTaskQuery(normalizedTaskId), {
    $set: {
      status: "complete",
      deliverable_url: trimmedUrl,
      deliverableUrl: trimmedUrl,
      completedAt: now,
      updatedAt: now,
    },
  });

  return {
    success: true,
    taskId: normalizeId(taskDoc._id || taskDoc.id || taskDoc.taskId || normalizedTaskId),
    deliverableUrl: trimmedUrl,
  };
}
