
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

const normalize = (v) => (typeof v === "string" ? v.trim() : "");

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id")?.trim();
    const userEmail = request.headers.get("x-user-email")?.trim();
    const userRole = request.headers.get("x-user-role")?.trim()?.toLowerCase();

    if (!userId && !userEmail) return NextResponse.json({ success: false, message: "Missing identity headers" }, { status: 401 });
    if (userRole && userRole !== "client") return NextResponse.json({ success: false, message: "Only clients can access payments" }, { status: 403 });

    const db = await getAppDb();
    const paymentsColl = db.collection("payments");
    const tasksColl = db.collection("tasks");
    const usersColl = db.collection("users");

    const filter = { payment_status: "complete" };
    if (userEmail) filter.client_email = userEmail;
    else if (userId) filter.client_id = userId;

    const payments = await paymentsColl.find(filter).sort({ createdAt: -1 }).limit(200).toArray();

    // Fetch related tasks and freelancer users
    const taskIds = [...new Set(payments.map((p) => normalize(p.task_id || p.taskId)).filter(Boolean))];
    let tasks = [];
    if (taskIds.length) {
      const objectIds = taskIds.filter((id) => /^[a-fA-F0-9]{24}$/.test(id)).map((id) => new ObjectId(id));
      const orClauses = [];
      if (objectIds.length) orClauses.push({ _id: { $in: objectIds } });
      orClauses.push({ id: { $in: taskIds } });
      orClauses.push({ taskId: { $in: taskIds } });
      tasks = await tasksColl.find({ $or: orClauses }).toArray();
    }
    const taskMap = new Map();
    for (const t of tasks) {
      if (t._id) taskMap.set(String(t._id), t);
      if (t.id) taskMap.set(String(t.id), t);
      if (t.taskId) taskMap.set(String(t.taskId), t);
    }

    const freelancerEmails = [...new Set(payments.map((p) => normalize(p.freelancer_email)).filter(Boolean))];
    const freelancers = freelancerEmails.length ? await usersColl.find({ email: { $in: freelancerEmails } }).toArray() : [];
    const freelancerMap = new Map(freelancers.map((u) => [String(u.email).toLowerCase(), u]));

    const payload = payments.map((p) => {
      const task = taskMap.get(String(p.task_id)) || taskMap.get(String(p.taskId)) || null;
      const freelancer = freelancerMap.get(String((p.freelancer_email || "").toLowerCase())) || null;
      return {
        _id: String(p._id),
        client_email: p.client_email,
        freelancer_email: p.freelancer_email,
        freelancer_name: freelancer?.name || p.freelancer_name || "",
        task_id: p.task_id || p.taskId || null,
        task_title: task?.title || p.task_title || (p.metadata && p.metadata.taskTitle) || "",
        amount: p.amount,
        transaction_id: p.transaction_id || p.stripe_payment_intent || "",
        payment_status: p.payment_status,
        paid_at: p.paid_at || p.paidAt || null,
        stripe_session_id: p.stripe_session_id || p.stripeSessionId || null,
        createdAt: p.createdAt || null,
      };
    });

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load payments" }, { status: 500 });
  }
}
