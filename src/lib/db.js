import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const authDbName = process.env.AUTH_DB_NAME || "skill-swap";
const appDbName = process.env.APP_DB_NAME || authDbName;

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

let clientPromise;

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

export async function getHomepageData() {
  const client = await clientPromise;
  const authDb = client.db(authDbName);
  const appDb = client.db(appDbName);

  const usersCollection = authDb.collection("user");
  const tasksCollection = appDb.collection("tasks");
  const reviewsCollection = appDb.collection("reviews");
  const paymentsCollection = appDb.collection("payments");

  const latestTasks = await tasksCollection
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  const clientEmails = [...new Set(latestTasks.map((task) => task.client_email).filter(Boolean))];
  const clientUsers = await usersCollection
    .find({ email: { $in: clientEmails } })
    .project({ email: 1, name: 1 })
    .toArray();
  const clientByEmail = new Map(clientUsers.map((user) => [user.email, user]));

  const latestTasksWithClient = latestTasks.map((task) => ({
    ...task,
    client: clientByEmail.get(task.client_email) || {
      name: task.client_email || "Unknown client",
    },
  }));

  const freelancerUsers = await usersCollection
    .find({ role: { $regex: /^freelancer$/i } })
    .project({ name: 1, email: 1, image: 1, skills: 1 })
    .toArray();

  const reviewDocs = await reviewsCollection.find({}).toArray();
  const reviewStats = reviewDocs.reduce((acc, review) => {
    if (!review.reviewee_email) {
      return acc;
    }

    const key = review.reviewee_email;
    const current = acc[key] || { total: 0, count: 0 };
    acc[key] = {
      total: current.total + Number(review.rating || 0),
      count: current.count + 1,
    };
    return acc;
  }, {});

  const topFreelancers = freelancerUsers
    .map((freelancer) => {
      const stats = reviewStats[freelancer.email] || { total: 0, count: 0 };
      const averageRating = stats.count ? stats.total / stats.count : 0;
      return {
        ...freelancer,
        skills: freelancer.skills || [],
        rating: Number(averageRating.toFixed(1)),
        reviewCount: stats.count,
        finishedJobs: stats.count,
      };
    })
    .sort((a, b) => b.rating - a.rating || b.finishedJobs - a.finishedJobs)
    .slice(0, 6);

  const totalUsers = await usersCollection.countDocuments();
  const totalTasks = await tasksCollection.countDocuments();

  const payoutAggregation = await paymentsCollection
    .aggregate([
      { $match: { payment_status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    .toArray();

  const totalPayout = payoutAggregation.length ? payoutAggregation[0].total : 0;
  const openTasksCount = await tasksCollection.countDocuments({ status: "open" });

  return {
    latestTasks: latestTasksWithClient,
    topFreelancers,
    stats: {
      totalUsers,
      totalTasks,
      totalPayout,
      openTasks: openTasksCount,
    },
  };
}
//homepage