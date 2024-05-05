import { getDocumentData } from "@/api/serverSideServiceActions/dashboardServiceActions";
import { getDocumentDataUrl } from "@/api/serviceUrl";
import DocumentActionBar from "@/components/dashboard/DocumentEditor/documentAction/DocumentActionBar";
import LoganTools from "@/components/dashboard/DocumentEditor/documentAction/LoganTools";
import React from "react";
import dynamic from "next/dynamic";

const LoganEditor = dynamic(
  () => import("@/components/dashboard/DocumentEditor/loganEditor/LoganEditor"),
  { ssr: false },
);

async function Page({ params: { docId } }) {
  const documentData =
    docId && (await getDocumentData(`${getDocumentDataUrl}/${docId}`));
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <main className="flex h-full flex-1 rounded-t-lg border-[0.063rem] border-secondary-blue bg-six">
        <section className="h-full flex-1">
          <LoganEditor docDetails={documentData} />
        </section>
        <section className="border-l-[0.063rem] border-secondary-blue">
          <LoganTools docDetails={documentData} />
        </section>
      </main>
      <aside>
        <DocumentActionBar />
      </aside>
    </div>
  );
}

export default Page;
