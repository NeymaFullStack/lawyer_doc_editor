import { getFolderDetails } from "@/api/serverSideServiceActions/dashboardServiceActions";
import Directory from "@/components/dashboard/Navigation/Directory";
import RecentDocuments from "@/components/dashboard/Navigation/RecentDocuments";
import React from "react";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

async function Page() {
  return (
    <main
      className={
        "flex w-full flex-1 overflow-hidden rounded-tl-lg border-[0.063rem]  border-secondary-blue bg-six pr-3"
      }
    >
      <div className=" my-4 mt-6 flex w-full flex-col overflow-y-auto px-6">
        <Directory />
      </div>
    </main>
  );
}

export default Page;
