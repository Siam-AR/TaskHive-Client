import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

const buildProposalQuery = (proposalId) => {
  const normalized = normalizeId(proposalId);
  const query = { $or: [{ _id: normalized }, { id: normalized }] };

  if (/^[a-fA-F0-9]{24}$/.test(normalized)) {
    query.$or.unshift({ _id: new ObjectId(normalized) });
  }

  return query;
};

const buildTaskQuery = (taskId) => {
  const normalized = normalizeId(taskId);
  const query = { $or: [{ _id: normalized }, { id: normalized }, { taskId: normalized }] };

  if (/^[a-fA-F0-9]{24}$/.test(normalized)) {
    query.$or.unshift({ _id: new ObjectId(normalized) });
  }

  return query;
};

export async function PATCH(request, { params }) {
  try {
    const proposalId = normalizeId((await params)?.proposalId || "");
    const payload = await request.json();
    const action = String(payload?.action || "").trim().toLowerCase();
    const userId = request.headers.get("x-user-id")?.trim();
    const userEmail = request.headers.get("x-user-email")?.trim();
    const userRole = request.headers.get("x-user-role")?.trim().toLowerCase();

    if (!proposalId) {
      return NextResponse.json({ success: false, message: "Proposal ID is required" }, { status: 400 });
    }

    if (!userId && !userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity headers" }, { status: 401 });
    }

    if (userRole && userRole !== "client") {
      return NextResponse.json({ success: false, message: "Only clients can manage proposals" }, { status: 403 });
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ success: false, message: "Unsupported action" }, { status: 400 });
    }

    const db = await getAppDb();
    const proposalsCollection = db.collection("proposals");
    const tasksCollection = db.collection("tasks");

    const proposal = await proposalsCollection.findOne({
      $or: [{ _id: proposalId }, { _id: /^[a-fA-F0-9]{24}$/.test(proposalId) ? new ObjectId(proposalId) : proposalId }],
    });
    if (!proposal) {
      return NextResponse.json({ success: false, message: "Proposal not found" }, { status: 404 });
    }

    const taskId = normalizeId(proposal.task_id || proposal.taskId || "");
    const task = await tasksCollection.findOne({
      $and: [
        buildTaskQuery(taskId),
        {
          $or: [
            { clientId: userId },
            { clientEmail: userEmail },
            { client_email: userEmail },
          ],
        },
      ],
    });

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found for this proposal" }, { status: 404 });
    }

    if (action === "reject") {
      await proposalsCollection.updateOne(buildProposalQuery(proposalId), { $set: { status: "rejected", updatedAt: new Date() } });
      return NextResponse.json({ success: true, message: "Proposal rejected successfully" });
    }

    await proposalsCollection.updateMany(
      {
        task_id: taskId,
        _id: { $ne: /^[a-fA-F0-9]{24}$/.test(proposalId) ? new ObjectId(proposalId) : proposalId },
      },
      {
        $set: {
          status: "rejected",
          updatedAt: new Date(),
        },
      },
    );

    await proposalsCollection.updateOne(buildProposalQuery(proposalId), { $set: { status: "accepted", updatedAt: new Date() } });
    await tasksCollection.updateOne(
      { _id: task._id },
      {
        $set: {
          status: "in progress",
          assigned_freelancer_email: proposal.freelancer_email || "",
          accepted_proposal_id: proposalId,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true, message: "Proposal accepted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to update proposal" }, { status: 500 });
  }
}
