"use client";

import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { getSession, signIn, signUp } from "@/lib/auth-client";

function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Client");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const pageTheme = useMemo(
        () => ({
            shell: "bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_36%),linear-gradient(180deg,_#f7fbff_0%,_#edf7ff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_36%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]",
            card: "border-sky-100 bg-white/90 shadow-[0_16px_50px_rgba(14,165,233,0.08)] dark:border-slate-800 dark:bg-slate-900/85",
            primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500",
            secondary: "border-sky-200 bg-white text-sky-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950 dark:text-sky-300",
        }),
        []
    );

    const redirectByRole = (selectedRole) => {
        if (selectedRole === "Freelancer") return "/dashboard/freelancer";
        if (selectedRole === "Admin") return "/dashboard/admin";
        return "/dashboard/client";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            await signUp.email({
                name,
                email,
                password,
                image: image || undefined,
                role,
                callbackURL: redirectTo,
            });

            const sessionResponse = await getSession();
            const selectedRole = sessionResponse?.data?.user?.role || role;
            setMessage("Account created successfully. Redirecting...");
            router.push(redirectByRole(selectedRole));
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Unable to create your account right now.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
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
            setMessage(error?.message || "Google sign up failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${pageTheme.shell}`}>
            <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <Card className={`rounded-[2rem] border p-8 ${pageTheme.card}`}>
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Join SkillSwap</p>
                        <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Create your account</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Pick a role and get started with the marketplace.</p>
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
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Full name</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Your name"
                                className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                required
                            />
                        </label>

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
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile image URL</span>
                            <input
                                type="url"
                                value={image}
                                onChange={(event) => setImage(event.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Create a password"
                                className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">At least 6 characters with uppercase and lowercase letters.</p>
                        </label>

                        <div className="space-y-3 pt-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Select your role</span>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { value: "Client", label: "Client", description: "Post tasks and manage proposals." },
                                    { value: "Freelancer", label: "Freelancer", description: "Apply to tasks and earn from projects." },
                                ].map((item) => (
                                    <label
                                        key={item.value}
                                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                                            role === item.value
                                                ? "border-sky-300 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-950/30"
                                                : "border-sky-100 bg-white dark:border-slate-700 dark:bg-slate-950"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={item.value}
                                            checked={role === item.value}
                                            onChange={(event) => setRole(event.target.value)}
                                            className="sr-only"
                                        />
                                        <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" className={`w-full rounded-full font-semibold ${pageTheme.primary}`} isDisabled={isLoading} isLoading={isLoading}>
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-4 text-slate-400">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs uppercase tracking-[0.2em]">Or sign up with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>

                    <Button
                        type="button"
                        className={`w-full rounded-full border font-semibold ${pageTheme.secondary}`}
                        isDisabled={isLoading}
                        onPress={handleGoogleSignUp}
                    >
                        Continue with Google
                    </Button>

                    <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        Already have an account?{" "}
                        <Link href={`/auth/signin${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`} className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300">
                            Sign in
                        </Link>
                    </div>
                </Card>

                <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 p-8 text-white shadow-lg shadow-sky-500/20 sm:p-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Role-based access</p>
                    <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Choose the account type that matches your work style</h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 sm:text-base">
                        Clients can post tasks and approve proposals. Freelancers can browse tasks, apply, and manage earnings. Google sign-up defaults to Client as required.
                    </p>
                    <div className="mt-8 space-y-3 text-sm text-sky-50/90">
                        <p>• Client role for task posting and management</p>
                        <p>• Freelancer role for proposals and earnings</p>
                        <p>• Google OAuth creates a Client account automatically</p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/browse-tasks" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5">
                            Browse Tasks
                        </Link>
                        <Link href="/auth/signin" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                            Already registered?
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function SignUpPage() {
    return <Suspense fallback={<div className="p-6 text-center text-sm text-slate-600">Loading sign up page...</div>}><SignUpContent /></Suspense>;
}