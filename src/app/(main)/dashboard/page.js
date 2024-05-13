import Directory from "@/components/dashboard/Navigation/Directory";
import RecentDocuments from "@/components/dashboard/Navigation/RecentDocuments";
import React from "react";

async function Dashboard() {
  return (
    <main className="flex w-full flex-1 overflow-hidden rounded-tl-lg border-[0.063rem]  border-secondary-blue bg-six pr-3">
      <div className="my-4 flex flex-col gap-8 overflow-y-auto px-6">
        <RecentDocuments />
        <Directory client />
      </div>
    </main>
  );
}

export default Dashboard;
