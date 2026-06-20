"use client";

import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { getSession, signIn } from "@/lib/auth-client";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const pageTheme = useMemo(
        () => ({
            shell: "bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef8ff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]",
            card: "border-sky-100 bg-white/90 shadow-[0_16px_50px_rgba(14,165,233,0.08)] dark:border-slate-800 dark:bg-slate-900/85",
            primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500",
            secondary: "border-sky-200 bg-white text-sky-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950 dark:text-sky-300",
        }),
        []
    );

    const redirectByRole = (role) => {
        if (role === "Freelancer") return "/dashboard/freelancer";
        if (role === "Admin") return "/dashboard/admin";
        if (role === "Client") return "/dashboard/client";
        return redirectTo;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            await signIn.email({
                email,
                password,
                callbackURL: redirectTo,
            });

            const sessionResponse = await getSession();
            const role = sessionResponse?.data?.user?.role || "Client";
            setMessage("Sign in successful. Redirecting...");
            router.push(redirectByRole(role));
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Unable to sign in. Check your email and password.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            await signIn.social({
                provider: "google",
                callbackURL: redirectTo,
                requestSignUp: true,
                additionalData: { role: "Client" },
            });
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Google sign in failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${pageTheme.shell}`}>
            <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 p-8 text-white shadow-lg shadow-sky-500/20 sm:p-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Welcome back</p>
                    <h1 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Sign in to manage tasks, proposals, and earnings</h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 sm:text-base">
                        Access your role-based dashboard with a clean blue marketplace experience designed for clients, freelancers, and admins.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/browse-tasks" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5">
                            Browse Tasks
                        </Link>
                        <Link href="/auth/signup" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                            Create Account
                        </Link>
                    </div>
                </section>

                <Card className={`rounded-[2rem] border p-8 ${pageTheme.card}`}>
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Sign In</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Use your email and password or continue with Google.</p>
                    </div>

                    {message ? (
                        <div
                            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                                messageType === "error"
                                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                                    : "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200"
                            }`}
                        >
                            {message}
                        </div>
                    ) : null}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                required
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Your password"
                                className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                required
                            />
                        </label>

                        <div className="pt-2">
                            <Button type="submit" className={`w-full rounded-full font-semibold ${pageTheme.primary}`} isDisabled={isLoading} isLoading={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </div>
                    </form>

                    <div className="my-6 flex items-center gap-4 text-slate-400">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs uppercase tracking-[0.2em]">Or continue with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>

                    <Button
                        type="button"
                        className={`w-full rounded-full border font-semibold ${pageTheme.secondary}`}
                        isDisabled={isLoading}
                        onPress={handleGoogleSignIn}
                    >
                        Continue with Google
                    </Button>

                    <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        Don&apos;t have an account?{" "}
                        <Link href={`/auth/signup${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`} className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </main>
        </div>
    );
}

export default function SignInPage() {
    return <Suspense fallback={<div className="p-6 text-center text-sm text-slate-600">Loading sign in page...</div>}><SignInContent /></Suspense>;
}