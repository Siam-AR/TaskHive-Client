import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";
import { getStripe } from "@/lib/stripe";

const normalizeId = (value) => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.toString === "function") {
    const s = value.toString();
    return s.startsWith("ObjectId(") && s.endsWith(")") ? s.slice(9, -1) : s;
  }
  return String(value ?? "").trim();
};

const buildProposalQuery = (proposalId) => {
  const normalized = normalizeId(proposalId);
  const query = { $or: [{ _id: normalized }, { id: normalized }] };
  if (/^[a-fA-F0-9]{24}$/.test(normalized)) query.$or.unshift({ _id: new ObjectId(normalized) });
  return query;
};

const buildTaskQuery = (taskId) => {
  const normalized = normalizeId(taskId);
  const query = { $or: [{ _id: normalized }, { id: normalized }, { taskId: normalized }] };
  if (/^[a-fA-F0-9]{24}$/.test(normalized)) query.$or.unshift({ _id: new ObjectId(normalized) });
  return query;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionId = String(body?.sessionId || "").trim();
    if (!sessionId) return NextResponse.json({ success: false, message: "Missing sessionId" }, { status: 400 });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
    if (!session) return NextResponse.json({ success: false, message: "Stripe session not found" }, { status: 404 });

    // Prefer payment_intent status when available
    const paymentIntent = session.payment_intent && typeof session.payment_intent === 'object' ? session.payment_intent : null;
    const paymentIntentStatus = paymentIntent?.status;
    const chargeStatus = paymentIntent?.charges?.data?.[0]?.status;
    const paid = paymentIntentStatus === 'succeeded' || chargeStatus === 'succeeded' || session.payment_status === "paid" || session.status === "complete";

    const amountCents = session.amount_total ?? (paymentIntent?.amount ?? 0) ?? 0;
    const amount = Math.round((amountCents || 0) / 100);
    const transactionId = paymentIntent?.id || paymentIntent?.charges?.data?.[0]?.id || session.payment_intent || session.id;
    const metadata = session.metadata || {};
    const proposalId = metadata.proposalId || body.proposalId || "";
    const taskId = metadata.taskId || metadata.task_id || "";
    const clientEmail = metadata.clientEmail || metadata.client_email || "";
    const freelancerEmail = metadata.freelancerEmail || metadata.freelancer_email || "";

    const db = await getAppDb();
    const paymentsColl = db.collection("payments");
    const proposalsColl = db.collection("proposals");
    const tasksColl = db.collection("tasks");

    // idempotency: check existing payment by stripe_session_id or transaction id
    const existing = await paymentsColl.findOne({ $or: [{ stripe_session_id: session.id }, { transaction_id: transactionId }] });

    let paymentDoc;
    let insertResult = null;
    if (existing) {
      // If existing record is pending but payment now completed, update it
      if ((existing.payment_status === 'pending' || !existing.payment_status) && paid) {
        await paymentsColl.updateOne(
          { _id: existing._id },
          { $set: { payment_status: 'complete', paid_at: new Date(), amount, transaction_id: transactionId, metadata } }
        );
        const updated = await paymentsColl.findOne({ _id: existing._id });
        paymentDoc = updated;
      } else {
        paymentDoc = existing;
      }
    } else {
      paymentDoc = {
        client_email: clientEmail,
        freelancer_email: freelancerEmail,
        task_id: taskId,
        amount,
        transaction_id: transactionId,
        payment_status: paid ? "complete" : "pending",
        paid_at: paid ? new Date() : null,
        stripe_session_id: session.id,
        metadata,
        createdAt: new Date(),
      };
      insertResult = await paymentsColl.insertOne(paymentDoc);
      paymentDoc._id = insertResult.insertedId;
    }

    // If payment confirmed, mark proposal accepted and reject others, update task
    if (paid) {
      // Try to resolve the proposal. Prefer explicit proposalId, else fallback to taskId + freelancer email
      let proposal = null;
      if (proposalId) proposal = await proposalsColl.findOne(buildProposalQuery(proposalId));

      if (!proposal && taskId) {
        const fallbackQuery = { task_id: taskId };
        if (freelancerEmail) fallbackQuery.freelancer_email = freelancerEmail;
        // prefer recently submitted or matching amount
        proposal = await proposalsColl.findOne(fallbackQuery, { sort: { submitted_at: -1, updatedAt: -1 } });
      }

      if (proposal) {
        const normalizedTaskId = normalizeId(proposal.task_id || proposal.taskId || taskId || "");
        await proposalsColl.updateMany({ task_id: normalizedTaskId, _id: { $ne: proposal._id } }, { $set: { status: "rejected", updatedAt: new Date() } });
        await proposalsColl.updateOne({ _id: proposal._id }, { $set: { status: "accepted", updatedAt: new Date() } });
        await tasksColl.updateOne(buildTaskQuery(normalizedTaskId), { $set: { status: "in progress", assigned_freelancer_email: proposal.freelancer_email || "", accepted_proposal_id: proposal._id ? normalizeId(proposal._id) : proposalId, updatedAt: new Date() } });
      }
    }

    return NextResponse.json({ success: true, data: paymentDoc });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to confirm payment" }, { status: 500 });
  }
}
