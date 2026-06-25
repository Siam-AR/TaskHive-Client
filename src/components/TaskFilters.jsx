"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function TaskFilters({ categories, initialSearch = "", initialCategory = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(`/browse-tasks${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 lg:grid-cols-[1.7fr_0.8fr_auto]">
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <FiSearch className="text-slate-400" />
        <input
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, category, or keyword"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </label>

      <select
        name="category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        Apply filters
      </button>
    </form>
  );
}
