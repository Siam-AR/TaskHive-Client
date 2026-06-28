import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";
import { getStripe } from "@/lib/stripe";

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

const buildProposalQuery = (id) => {
  const normalized = normalizeId(id);
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

const createFallbackCheckoutUrl = ({ proposalId, taskTitle, freelancerEmail, amount }) => {
  return `/payment/checkout?proposalId=${encodeURIComponent(proposalId)}&taskTitle=${encodeURIComponent(taskTitle)}&freelancerEmail=${encodeURIComponent(freelancerEmail)}&amount=${encodeURIComponent(amount)}`;
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const proposalId = normalizeId(payload?.proposalId || "");
    if (!proposalId) {
      return NextResponse.json({ success: false, message: "Proposal ID is required" }, { status: 400 });
    }

    const db = await getAppDb();
    const proposalsCollection = db.collection("proposals");
    const proposal = await proposalsCollection.findOne(buildProposalQuery(proposalId));
    if (!proposal) {
      return NextResponse.json({ success: false, message: "Proposal not found" }, { status: 404 });
    }

    const taskId = normalizeId(proposal.task_id || proposal.taskId || "");
    const tasksCollection = db.collection("tasks");
    const task = await tasksCollection.findOne(buildTaskQuery(taskId));
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found for proposal" }, { status: 404 });
    }

    const budget = Number(proposal.proposed_budget ?? proposal.budget ?? 0);
    const amountCents = Math.round(budget * 100);
    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const successUrl = `${origin}/payment/success?proposalId=${encodeURIComponent(proposalId)}`;
    const cancelUrl = `${origin}/dashboard/client/proposals?canceled=true`;
    const fallbackUrl = createFallbackCheckoutUrl({
      proposalId,
      taskTitle: task.title || "",
      freelancerEmail: proposal.freelancer_email || "",
      amount: budget,
    });

    if (amountCents <= 0) {
      return NextResponse.json({ success: true, url: fallbackUrl });
    }

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: task.title || "TaskHive project payment",
                description: proposal.cover_note || proposal.message || "Proposal payment",
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          proposalId,
          taskId,
          clientEmail: task.clientEmail || task.client_email || "",
          freelancerEmail: proposal.freelancer_email || "",
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      if (session?.url) {
        return NextResponse.json({ success: true, url: session.url });
      }
    } catch (stripeError) {
      console.warn("Stripe checkout creation failed, falling back to local checkout.", stripeError);
    }

    return NextResponse.json({ success: true, url: fallbackUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to start checkout" }, { status: 500 });
  }
}
