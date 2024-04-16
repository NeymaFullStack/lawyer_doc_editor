import React from "react";
import LoganEditor from "./loganEditor/LoganEditor";
import LoganTools from "./documentAction/LoganTools";
import DocumentActionBar from "./documentAction/DocumentActionBar";

function DocumentEditor() {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <main className="flex h-full flex-1 rounded-t-lg border-[0.063rem] border-secondary-blue bg-six">
        <section className="h-full flex-1">
          <LoganEditor />
        </section>
        <section className=" border-l-[0.063rem] border-secondary-blue">
          <LoganTools />
        </section>
      </main>
      <aside>
        <DocumentActionBar />
      </aside>
    </div>
  );
}

export default DocumentEditor;
