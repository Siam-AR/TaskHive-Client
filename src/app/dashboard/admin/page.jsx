import React from "react";

const AdminDashboardHomePage = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Admin Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          This is the admin overview page. Use the navigation panel to manage users, tasks, and transactions.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;