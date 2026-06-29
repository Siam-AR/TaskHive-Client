import { getAppDb } from "@/lib/server-db";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export async function getFreelancerOverviewStats(freelancerEmail) {
  const db = await getAppDb();
  const proposalsCollection = db.collection("proposals");
  const paymentsCollection = db.collection("payments");
  const email = normalizeEmail(freelancerEmail);

  if (!email) {
    return {
      totalProposals: 0,
      pendingProposals: 0,
      acceptedProposals: 0,
      totalEarnings: 0,
    };
  }

  const [proposalCounts, earningsResult] = await Promise.all([
    proposalsCollection.aggregate([
      { $match: { freelancer_email: email } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).toArray(),
    paymentsCollection.aggregate([
      {
        $match: {
          freelancer_email: email,
          payment_status: { $in: ["complete", "completed", "paid"] },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $convert: {
                input: "$amount",
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
      },
    ]).toArray(),
  ]);

  const statusMap = proposalCounts.reduce(
    (acc, item) => ({
      ...acc,
      [String(item._id || "").toLowerCase()]: item.count,
    }),
    {}
  );

  return {
    totalProposals: proposalCounts.reduce((sum, item) => sum + (item.count || 0), 0),
    pendingProposals: statusMap.pending || statusMap["pending"] || 0,
    acceptedProposals: statusMap.accepted || statusMap["accepted"] || 0,
    totalEarnings: earningsResult[0]?.total ?? 0,
  };
}
