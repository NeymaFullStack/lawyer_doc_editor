import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { General } from "./general";
import UserManagement from "./user-management";
import { cn } from "@/lib/utils";

const tabs: { label: string; value: string }[] = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "User Management",
    value: "userManagement",
  },
  {
    label: "Subscription",
    value: "subscription",
  },
  {
    label: "Billing",
    value: "billing",
  },
];

const tabsContentList = [
  {
    key: "general",
    value: <General />,
  },
  {
    key: "userManagement",
    value: <UserManagement />,
  },
  {
    key: "subscription",
    value: <div>Subscription</div>,
  },
  {
    key: "billing",
    value: <div>Billing</div>,
  },
];
function WorkplaceView() {
  const [activeTab, setActiveTab] = useState<string>("general");

  return (
    <Tabs
      defaultValue={"general"}
      className="!h-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <div className="flex items-center justify-between">
        <TabsList className="space-x-3 bg-white">
          {tabs.map((tab, key) => (
            <TabsTrigger
              className={cn("!shadow-none aria-selected:!text-logan-blue")}
              value={tab.value}
              key={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* <Button
          onClick={() => {
            if (
              formRef.current &&
              "updateWorkplaceGeneralDetails" in formRef.current
            ) {
              setIsLoading(true);
              formRef.current.updateWorkplaceGeneralDetails().finally(() => {
                setIsLoading(false);
              });
            }
          }}
          disabled={!formRef.current?.isFormDirty}
          variant={"primary-blue"}
          className="flex items-center transition-all duration-300 ease-in-out"
        >
          Save Changes
          {isLoading && <LoadingSpinner className="ml-1" />}
        </Button> */}
      </div>
      <Separator className="my-4 bg-logan-primary-200" />
      {tabsContentList.map((tabContent) => {
        return (
          <TabsContent
            className="h-full"
            value={tabContent.key}
            key={tabContent.key}
          >
            {tabContent.value}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
export default WorkplaceView;
