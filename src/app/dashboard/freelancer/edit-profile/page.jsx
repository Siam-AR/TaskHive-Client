"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSave } from "react-icons/fi";
import { getSession } from "@/lib/auth-client";

const normalizeSkills = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((skill) => String(skill).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

export default function FreelancerEditProfilePage() {
  const [formState, setFormState] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
    hourlyRate: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setFeedback(null);

      try {
        const sessionResult = await getSession();
        const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
        const email = sessionUser?.email;

        if (!email) {
          setFeedback({ type: "error", message: "Unable to determine your account email." });
          setLoading(false);
          return;
        }

        const res = await fetch("/api/dashboard/freelancer/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-User-Email": email,
            "X-User-Role": sessionUser?.role || "freelancer",
          },
        });

        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Failed to load profile.");

        const user = payload.data || {};
        setFormState({
          name: user.name || "",
          image: user.image || "",
          skills: Array.isArray(user.skills) ? user.skills.join(", ") : String(user.skills || ""),
          bio: user.bio || "",
          hourlyRate: user.hourlyRate != null ? String(user.hourlyRate) : "",
        });
      } catch (error) {
        setFeedback({ type: "error", message: error?.message || "Unable to load profile details." });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const skillList = useMemo(() => normalizeSkills(formState.skills), [formState.skills]);

  const handleChange = (field) => (event) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const trimmedName = String(formState.name || "").trim();
    const trimmedImage = String(formState.image || "").trim();
    const trimmedBio = String(formState.bio || "").trim();
    const hourlyRateValue = Number(formState.hourlyRate || 0);

    if (!trimmedName) {
      setFeedback({ type: "error", message: "Name is required." });
      return;
    }

    if (isNaN(hourlyRateValue) || hourlyRateValue < 0) {
      setFeedback({ type: "error", message: "Hourly rate must be a valid positive number." });
      return;
    }

    setIsSaving(true);

    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
      const email = sessionUser?.email;

      if (!email) {
        throw new Error("Unable to determine your account email.");
      }

      const res = await fetch("/api/dashboard/freelancer/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": email,
          "X-User-Role": sessionUser?.role || "freelancer",
        },
        body: JSON.stringify({
          name: trimmedName,
          image: trimmedImage,
          skills: skillList,
          bio: trimmedBio,
          hourlyRate: hourlyRateValue,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Unable to save profile.");

      setFormState((current) => ({ ...current, skills: Array.isArray(payload.data.skills) ? payload.data.skills.join(", ") : String(payload.data.skills || "") }));
      setFeedback({ type: "success", message: "Profile updated successfully." });
      setShowSuccessModal(true);
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Unable to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Freelancer profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Edit your public profile</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Update your display name, profile photo, skills, bio, and hourly rate anytime.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {loading ? "Loading profile..." : `Current skills: ${skillList.length}`}
          </div>
        </div>
      </div>

      {feedback ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/20 dark:text-rose-300"}`}>
          {feedback.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full name
            <input
              type="text"
              value={formState.name}
              onChange={handleChange("name")}
              placeholder="Your full name"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Profile photo URL
            <input
              type="url"
              value={formState.image}
              onChange={handleChange("image")}
              placeholder="https://example.com/avatar.jpg"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Skills (comma separated)
          <input
            type="text"
            value={formState.skills}
            onChange={handleChange("skills")}
            placeholder="Design, Writing, Development"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Bio
          <textarea
            value={formState.bio}
            onChange={handleChange("bio")}
            rows={5}
            placeholder="A short description about your skills and experience."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Hourly rate (USD)
          <input
            type="number"
            min="0"
            step="0.01"
            value={formState.hourlyRate}
            onChange={handleChange("hourlyRate")}
            placeholder="50"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formState.hourlyRate ? `Current hourly rate: ${formatCurrency(formState.hourlyRate)}` : "Enter your hourly rate in USD."}</p>
        </label>

        <button
          type="submit"
          disabled={isSaving || loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          <FiSave className="h-4 w-4" />
          {isSaving ? "Saving profile..." : "Save profile"}
        </button>
      </form>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Profile updated</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Your freelancer profile has been updated successfully.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
