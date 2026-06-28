"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard } from "react-icons/fi";

export default function PaymentCheckoutPage() {
  const [proposalId, setProposalId] = useState("");
  const [taskTitle, setTaskTitle] = useState("Unknown task");
  const [freelancerEmail, setFreelancerEmail] = useState("Unknown freelancer");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setProposalId(params.get("proposalId") || "");
    setTaskTitle(params.get("taskTitle") || "Unknown task");
    setFreelancerEmail(params.get("freelancerEmail") || "Unknown freelancer");
    setAmount(Number(params.get("amount") || 0));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-3 text-sky-600">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-xl">💳</div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-500">TaskHive</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Secure Checkout</p>
              </div>
            </div>

            <div className="mt-10 text-6xl font-semibold text-slate-950 dark:text-white">${amount}</div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Total due today</p>

            <div className="mt-8 space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
              <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Task</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{taskTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Freelancer</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{freelancerEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Amount</span>
                  <span className="font-semibold text-slate-950 dark:text-white">${amount}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-100/80 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span>Payment placeholder ready</span>
                <span className="font-semibold">Demo card 4242 4242 4242 4242</span>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Payment Details</p>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Cardholder Name</label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">John Doe</div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Card Number</label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">4242 4242 4242 4242</div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Expiry Date</label>
                    <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">12/28</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">CVC</label>
                    <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">123</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                Test Mode: Use card number <span className="font-semibold">4242 4242 4242 4242</span> with any future expiry and any 3-digit CVC.
              </div>

              <Link href={`/payment/success?proposalId=${encodeURIComponent(proposalId)}`} className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Pay ${amount}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
