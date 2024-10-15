"use client";
import { useState } from "react";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/ui/card";
import { Button } from "@/components/shadcn-components/ui/button";
import UserSettings from "@/components/settings/UserSettings/UserSettings";

import RemSizeImage from "@/components/generic/RemSizeImage";

const Page = () => {
  const [activeTab, setActiveTab] = useState("myAccount");

  return (
    <main className="h-full w-full  overflow-hidden border-[0.063rem] border-secondary-blue bg-six p-7">
      <div className=" flex h-full flex-col space-x-9 md:flex-row">
        {/* Sidebar Navigation */}
        <Card className="h-[19rem] w-[15rem] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <ul className="space-y-7 py-2 text-xs font-semibold">
              <li
                className={`mb-2 cursor-pointer ${
                  activeTab === "myAccount" ? " text-primary-blue" : ""
                }`}
                onClick={() => setActiveTab("myAccount")}
              >
                My Account
              </li>
              <li
                className={`mb-2 cursor-pointer ${
                  activeTab === "password" ? " text-primary-blue" : ""
                }`}
                onClick={() => setActiveTab("password")}
              >
                Password
              </li>
              <li
                className={`mb-2 cursor-pointer ${
                  activeTab === "communication" ? " text-primary-blue" : ""
                }`}
                onClick={() => setActiveTab("communication")}
              >
                Communication Preferences
              </li>
            </ul>
            <Button
              variant="secondary"
              className="flex w-full items-center justify-start gap-2 px-3 py-5"
            >
              <RemSizeImage
                imagePath={"/assets/icons/up-arrow.svg"}
                remWidth={1.2}
                remHeight={1.2}
                alt={"Go To"}
                className="rotate-90"
              />

              <span className="text-black-txt">Workspace Settings</span>
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <UserSettings activeTab={activeTab} />
      </div>
    </main>
  );
};
export default Page;
