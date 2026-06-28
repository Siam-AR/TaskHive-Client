"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { getDashboardHeaders } from "@/lib/dashboard-client-proposals";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId") || "";
  const [statusMessage, setStatusMessage] = useState("Finalizing your proposal...");
  const [isProcessing, setIsProcessing] = useState(Boolean(proposalId));

  useEffect(() => {
    if (!proposalId) {
      setIsProcessing(false);
      setStatusMessage("No proposal selected.");
      return;
    }

    const finalizeProposal = async () => {
      try {
        const headers = await getDashboardHeaders();
        const response = await fetch(`/api/dashboard/client/proposals/${encodeURIComponent(proposalId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ action: "accept" }),
          cache: "no-store",
        });
        const result = await response.json();

        if (result?.success) {
          setStatusMessage("The proposal was accepted and the task is now marked as in progress.");
        } else {
          setStatusMessage(result?.message || "The proposal could not be finalized.");
        }
      } catch (error) {
        setStatusMessage(error?.message || "The proposal could not be finalized.");
      } finally {
        setIsProcessing(false);
      }
    };

    finalizeProposal();
  }, [proposalId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-xl dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          {isProcessing ? <FiLoader className="h-8 w-8 animate-spin" /> : <FiCheckCircle className="h-8 w-8" />}
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">Payment completed successfully</h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">{statusMessage}</p>
        {proposalId ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Proposal ID: {proposalId}</p> : null}
        <Link href="/dashboard/client/proposals" className="mt-8 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
          Go to proposals
        </Link>
      </div>
    </main>
  );
}