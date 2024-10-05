import Directory from "@/components/dashboard/Navigation/Directory";
import React from "react";

function Dashboard() {
  return (
    <main className=" h-full  w-full overflow-hidden rounded-tl-lg border-[0.063rem] border-secondary-blue bg-six pb-8 pr-3">
      <Directory isDashboard />
    </main>
  );
}

export default Dashboard;
