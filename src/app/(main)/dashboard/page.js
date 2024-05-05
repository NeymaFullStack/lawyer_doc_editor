import { getClientFolderList } from "@/api/serverSideServiceActions/dashboardServiceActions";
import Directory from "@/components/dashboard/Navigation/Directory";
import RecentDocuments from "@/components/dashboard/Navigation/RecentDocuments";
import React from "react";

export const revalidate = 0;

async function Dashboard({ params }) {
  const clientFolderList = await getClientFolderList();
  return (
    <main className="flex w-full flex-1 overflow-hidden rounded-tl-lg border-[0.063rem]  border-secondary-blue bg-six pr-3">
      <div className="my-4 flex flex-col gap-6 overflow-y-auto px-6">
        <RecentDocuments />
        <Directory foldersList={clientFolderList} clientList />
      </div>
    </main>
  );
}

export default Dashboard;
