import { FiArrowRight } from "react-icons/fi";
import { Button } from "@heroui/react";

export default function HomeHero() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-50 py-20 px-10 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-200/80 dark:bg-sky-900/60 dark:text-sky-200">
          <FiArrowRight className="h-4 w-4" />
          Find freelancers and complete tasks faster
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Get your tasks done by skilled freelancers.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Post a task, receive proposals, and hire vetted freelancers to finish your project without delay.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">
            <a href="/dashboard/client">Post a Task</a>
          </Button>
          <Button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900">
            <a href="/browse-tasks" className="text-slate-900 dark:text-white">
              Browse Tasks
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
