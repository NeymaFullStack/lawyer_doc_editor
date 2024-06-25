import DocumentActionBar from "@/components/dashboard/DocumentEditor/documentAction/DocumentActionBar";
import LoganTools from "@/components/dashboard/DocumentEditor/documentAction/LoganTools";
import React from "react";
import dynamic from "next/dynamic";
import TipTapEditor from "@/components/dashboard/DocumentEditor/loganTipTap/TiptapEditor";

const LoganEditor = dynamic(
  () => import("@/components/dashboard/DocumentEditor/loganEditor/LoganEditor"),
  { ssr: false },
);

async function Page() {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <main className="flex h-full flex-1 rounded-t-lg border-[0.063rem] border-secondary-blue bg-six">
        <section className="h-full flex-1">
          <TipTapEditor />
        </section>
        <section className="border-l-[0.063rem] border-secondary-blue">
          <LoganTools />
        </section>
      </main>
      <aside>
        <DocumentActionBar />
      </aside>
    </div>
  );
}

export default Page;
