import { FiBriefcase, FiUsers, FiStar } from "react-icons/fi";

const steps = [
  {
    title: "Post a Task",
    description: "Describe your job and what you need done.",
    icon: FiBriefcase,
  },
  {
    title: "Get Proposals",
    description: "Receive proposals from skilled freelancers quickly.",
    icon: FiUsers,
  },
  {
    title: "Hire & Pay",
    description: "Choose the best proposal and complete payment securely.",
    icon: FiStar,
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-16 space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          How It Works
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Easy 3-step guide
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Post your project, connect with talented freelancers, and get work
          done efficiently with a secure hiring process.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="
              group relative overflow-hidden
              rounded-[2rem]
              border border-slate-200
              bg-white
              p-8
              transition-all duration-300

              hover:-translate-y-1
              hover:border-cyan-400
              hover:shadow-[0_0_0_1px_rgb(34_211_238),0_12px_32px_rgba(34,211,238,0.12)]

              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            {/* Step Number */}
<div className="absolute right-5 top-5 text-5xl font-extrabold text-sky-200 dark:text-slate-800">
  {String(index + 1).padStart(2, "0")}
</div>

            {/* Icon */}
            <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 text-white shadow-lg">
              <step.icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-6">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 transition-all duration-400 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}