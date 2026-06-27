import { NextResponse } from "next/server";
import { getAppDb } from "@/lib/server-db";

const normalizeStatus = (status) => String(status || "").trim().toLowerCase();
const isOpenTask = (status) => status === "open" || status === "pending" || status === "available";
const isInProgressTask = (status) => status.includes("progress") || status === "in progress" || status === "active";
const isCompletedTask = (status) => status.includes("complete") || status.includes("finished") || status === "done";
const isPaidRecord = (status) => {
  const normalized = normalizeStatus(status);
  // Only consider explicitly completed/complete as paid for dashboard totals
  return ["completed", "complete"].includes(normalized);
};

const safeNumber = (value) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id")?.trim();
    const userEmail = request.headers.get("x-user-email")?.trim();
    const userRole = request.headers.get("x-user-role")?.trim().toLowerCase();

    if (!userId && !userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity headers" }, { status: 401 });
    }

    if (userRole && userRole !== "client") {
      return NextResponse.json({ success: false, message: "Only clients can access dashboard overview" }, { status: 403 });
    }

    const db = await getAppDb();
    const tasksCollection = db.collection("tasks");
    const transactionsCollection = db.collection("transactions");
    const paymentsCollection = db.collection("payments");

    const taskQuery = { $or: [] };
    if (userId) taskQuery.$or.push({ clientId: userId });
    if (userEmail) taskQuery.$or.push({ clientEmail: userEmail });

    if (taskQuery.$or.length === 0) {
      return NextResponse.json({ success: false, message: "Missing client identity" }, { status: 401 });
    }

    const tasks = await tasksCollection.find(taskQuery).toArray();
    const taskIds = tasks.map((task) => String(task._id || task.id || task.taskId || "")).filter(Boolean);

    const transactionQuery = { $or: [] };
    if (userId) transactionQuery.$or.push({ clientId: userId });
    if (taskIds.length) transactionQuery.$or.push({ taskId: { $in: taskIds } });

    const transactions = transactionQuery.$or.length ? await transactionsCollection.find(transactionQuery).toArray() : [];

    const paymentQuery = { $or: [] };
    if (userEmail) paymentQuery.$or.push({ client_email: userEmail });
    if (taskIds.length) paymentQuery.$or.push({ task_id: { $in: taskIds } });

    const payments = paymentQuery.$or.length ? await paymentsCollection.find(paymentQuery).toArray() : [];

    const transactionSpent = transactions.reduce((sum, transaction) => {
      if (!transaction) return sum;
      if (!isPaidRecord(transaction.status)) return sum;
      return sum + safeNumber(transaction.amount ?? transaction.total ?? transaction.value ?? 0);
    }, 0);

    const paymentSpent = payments.reduce((sum, payment) => {
      if (!payment) return sum;
      if (!isPaidRecord(payment.payment_status ?? payment.status)) return sum;
      return sum + safeNumber(payment.amount ?? payment.total ?? payment.value ?? 0);
    }, 0);

    const overview = {
      totalTasks: tasks.length,
      openTasks: tasks.filter((task) => isOpenTask(normalizeStatus(task.status))).length,
      inProgressTasks: tasks.filter((task) => isInProgressTask(normalizeStatus(task.status))).length,
      completedTasks: tasks.filter((task) => isCompletedTask(normalizeStatus(task.status))).length,
      // If there are any payment records, rely on payments (but only count completed payments).
      // Do NOT fall back to transactions when payments exist but are pending.
      totalSpent: payments.length ? paymentSpent : transactionSpent,
      transactionTotal: transactionSpent,
      paymentTotal: paymentSpent,
    };

    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load dashboard data" }, { status: 500 });
  }
}
