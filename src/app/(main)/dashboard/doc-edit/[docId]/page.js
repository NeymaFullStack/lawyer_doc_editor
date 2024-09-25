import DocumentActionBar from "@/components/dashboard/DocumentEditor/documentAction/DocumentActionBar";
import LoganTools from "@/components/dashboard/DocumentEditor/documentAction/LoganTools";
import TipTapEditor from "@/components/dashboard/DocumentEditor/loganTipTap/TiptapEditor";

async function Page() {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <main className="flex h-full flex-1 overflow-x-auto rounded-t-lg border-[0.063rem] border-secondary-blue bg-six">
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
