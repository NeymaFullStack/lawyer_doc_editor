"use client";
import Directory from "@/components/dashboard/Navigation/Directory";
import RecentDocuments from "@/components/dashboard/Navigation/RecentDocuments";
import React, { useState } from "react";
import Loader from "@/components/generic/Loader";
import { usePathname } from "next/navigation";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  console.log("vedu", pathname);
  return (
    <main className=" h-full  w-full overflow-hidden rounded-tl-lg border-[0.063rem]  border-secondary-blue bg-six pr-3">
      {loading && <Loader />}

      <div className="my-4 flex h-full flex-col gap-8 overflow-y-auto px-6 py-1">
        <RecentDocuments />
        <Directory client setLoading={setLoading} loading={loading} />
      </div>
    </main>
  );
}

export default Dashboard;
