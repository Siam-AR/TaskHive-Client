import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

const normalizeString = (value) => {
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

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const normalizeDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildTaskQuery = (taskId) => {
  const normalized = normalizeString(taskId);
  const query = { $or: [{ id: normalized }, { taskId: normalized }] };
  if (/^[a-fA-F0-9]{24}$/.test(normalized)) {
    query.$or.unshift({ _id: new ObjectId(normalized) });
  }
  return query;
};

export async function getFreelancerEarnings(freelancerEmail) {
  const db = await getAppDb();
  const paymentsCollection = db.collection("payments");
  const tasksCollection = db.collection("tasks");
  const usersCollection = db.collection("users");

  const normalizedEmail = normalizeEmail(freelancerEmail);
  const filter = {
    payment_status: { $in: ["complete", "completed"] },
    ...(normalizedEmail ? { freelancer_email: normalizedEmail } : {}),
  };

  const paymentDocs = await paymentsCollection
    .find(filter)
    .sort({ paid_at: -1, createdAt: -1 })
    .limit(200)
    .toArray();

  const taskIds = [...new Set(paymentDocs.map((payment) => normalizeString(payment.task_id || payment.taskId)).filter(Boolean))];
  const objectIds = taskIds.filter((id) => /^[a-fA-F0-9]{24}$/.test(id)).map((id) => new ObjectId(id));

  const taskQuery = [];
  if (objectIds.length) {
    taskQuery.push({ _id: { $in: objectIds } });
  }
  if (taskIds.length) {
    taskQuery.push({ id: { $in: taskIds } });
    taskQuery.push({ taskId: { $in: taskIds } });
  }

  const taskDocs = taskQuery.length ? await tasksCollection.find({ $or: taskQuery }).toArray() : [];
  const taskMap = new Map();
  taskDocs.forEach((task) => {
    if (task._id) taskMap.set(String(task._id), task);
    if (task.id) taskMap.set(String(task.id), task);
    if (task.taskId) taskMap.set(String(task.taskId), task);
  });

  const clientEmails = [...new Set(paymentDocs.map((payment) => normalizeEmail(payment.client_email)).filter(Boolean))];
  const clientDocs = clientEmails.length ? await usersCollection.find({ email: { $in: clientEmails } }).project({ email: 1, name: 1 }).toArray() : [];
  const clientMap = new Map(clientDocs.map((client) => [normalizeEmail(client.email), client]));

  return paymentDocs.map((payment) => {
    const taskId = normalizeString(payment.task_id || payment.taskId);
    const task = taskMap.get(taskId) || null;
    const clientEmail = normalizeEmail(payment.client_email);
    const client = clientMap.get(clientEmail) || null;

    const completedAt = normalizeDateValue(payment.paid_at ?? payment.paidAt ?? payment.createdAt ?? payment.created_at);

    return {
      paymentId: normalizeString(payment._id || payment.id),
      taskId,
      taskTitle: task?.title || payment.task_title || payment.metadata?.taskTitle || "Untitled task",
      clientName: client?.name || payment.client_name || payment.clientName || clientEmail || "Client",
      clientEmail,
      amount: Number(payment.amount ?? payment.amountPaid ?? payment.total ?? 0),
      completedAt,
    };
  });
}
