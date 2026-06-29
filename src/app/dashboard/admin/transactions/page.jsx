"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminTransactions } from "@/lib/api";

function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminTransactionsPage() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminTransactions({ limit: 50 });
      setTx(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const totalCount = useMemo(() => tx.length, [tx]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <div className="text-sm text-slate-400">
          Showing {totalCount} records
        </div>
      </div>

      {error ? (
        <div className="rounded-md bg-rose-900 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/80">
        <table className="w-full table-fixed text-left text-sm text-slate-200">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead className="bg-slate-950/90 text-slate-400">
            <tr>
              <th className="px-3 py-2">Client Email</th>
              <th className="px-3 py-2">Freelancer Email</th>
              <th className="px-3 py-2">Payout</th>
              <th className="px-3 py-2">Payment Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            ) : tx.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-slate-400"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              tx.map((t) => (
                <tr
                  key={t._id || t.id || JSON.stringify(t)}
                  className="hover:bg-slate-900/60"
                >
                  <td className="px-3 py-3 truncate">
                    {t.client_email || t.clientEmail || t.client || "-"}
                  </td>
                  <td className="px-3 py-3 truncate">
                    {t.freelancer_email ||
                      t.freelancerEmail ||
                      t.freelancer ||
                      "-"}
                  </td>
                  <td className="px-3 py-3 text-green-500 font-bold">
                    ${Number(t.amount ?? t.payout ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    {formatDate(
                      t.paid_at || t.paidAt || t.createdAt || t.created_at,
                    )}
                  </td>
                  {/* <td className="px-3 py-3">{String(t.payment_status || t.status || t.paymentStatus || "unknown")}</td> */}
                  <td
                    className={`px-3 py-3 font-medium ${
                      String(
                        t.payment_status ||
                          t.status ||
                          t.paymentStatus ||
                          "unknown",
                      ).toLowerCase() === "complete" ||
                      String(
                        t.payment_status ||
                          t.status ||
                          t.paymentStatus ||
                          "unknown",
                      ).toLowerCase() === "completed"
                        ? "text-green-400"
                        : String(
                              t.payment_status ||
                                t.status ||
                                t.paymentStatus ||
                                "unknown",
                            ).toLowerCase() === "pending"
                          ? "text-orange-400"
                          : "text-slate-300"
                    }`}
                  >
                    {String(
                      t.payment_status ||
                        t.status ||
                        t.paymentStatus ||
                        "unknown",
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
