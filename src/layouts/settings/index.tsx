"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { iconColors } from "../../../tailwind.config";
import { useSettingsContext } from "@/sections/settings/context/settings-context";
import { SettingEnum, SettingType } from "@/sections/settings/types";
import {
  userSettingNavigation,
  userSettingNavigationItem,
} from "./config-settings";

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  const { setting } = useSettingsContext();
  const isSettingsWorkspace = setting === SettingEnum.WORKSPACE;
  return (
    <div className="h-full w-full  overflow-hidden py-8 pl-9 pr-24  bg-logan-primary-200 flex gap-9">
      <div className="flex flex-col gap-9">
        <SettingsNavigationCard />
        {isSettingsWorkspace && <SettingsWorkspaceCard />}
      </div>
      {/* Main Content */}
      <div className="w-full">{children}</div>
    </div>
  );
}

const SettingsNavigationCard = React.memo(() => {
  const { setting, changeSetting } = useSettingsContext();
  const isSettingsWorkspace = setting === SettingEnum.WORKSPACE;

  const handleChangeSetting = useCallback(() => {
    isSettingsWorkspace
      ? changeSetting(SettingEnum.USER_DETAILS)
      : changeSetting(SettingEnum.WORKSPACE);
  }, [changeSetting, setting]);

  const handleChangeUserSetting = useCallback(
    (setting: Exclude<SettingType, SettingEnum.WORKSPACE>) => {
      changeSetting(setting);
    },
    [changeSetting]
  );
  console.log("setting", setting);
  return (
    <Card
      className={cn(
        "w-[15rem] border-none shadow-none",
        isSettingsWorkspace && "flex flex-col-reverse"
      )}
    >
      <CardHeader className={cn("", isSettingsWorkspace && "pt-0")}>
        <CardTitle className="text-2xl font-semibold">
          {isSettingsWorkspace ? "Workspace Settings" : "Settings"}
        </CardTitle>
      </CardHeader>
      <CardContent className={isSettingsWorkspace ? "pt-6" : "space-y-7"}>
        {!isSettingsWorkspace && (
          <ul className="space-y-7 py-2 text-xs font-semibold">
            {userSettingNavigation.map((item: userSettingNavigationItem) => (
              <li
                key={item.value as string}
                className="gap-4 cursor-pointer"
                onClick={() =>
                  handleChangeUserSetting(item.value as SettingType)
                }
              >
                <span
                  className={cn(
                    "text-logan-black",
                    setting === item.value && "text-logan-blue"
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Button
          onClick={handleChangeSetting}
          variant={"secondary"}
          className="flex w-full items-center justify-start gap-2  bg-logan-primary-200 text-logan-black text-xs"
        >
          <Icon
            iconName={"arrow"}
            fill={iconColors.gray}
            className={cn("", isSettingsWorkspace && "rotate-180")}
          />
          <span className="text-black-txt font-medium">
            {isSettingsWorkspace ? "Back to Settings" : "Workspace Settings"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
});
SettingsNavigationCard.displayName = "SettingsNavigationCard";

//ToDo workspace  switcher
const SettingsWorkspaceCard = React.memo(() => {
  return (
    <Card className="w-[15rem] border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Select Workspace
        </CardTitle>
      </CardHeader>
      <CardContent>WorkSpace Switcher</CardContent>
    </Card>
  );
});
SettingsWorkspaceCard.displayName = "SettingsWorkspaceCard";

// const SettingsMainContent = React.memo(({ children }: Props) => {
//   return (
//     <Card className=" border-none shadow-none h-full">
//       <CardContent className="p-6">{children}</CardContent>
//     </Card>
//   );
// });

// SettingsMainContent.displayName = "SettingsMainContent";
