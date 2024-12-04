"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { iconColors } from "../../../tailwind.config";
import { useSettingsContext } from "@/sections/settings/context/settings-context";
import {
  SettingEnum,
  SettingType,
  UserNotificationPreferencesType,
} from "@/sections/settings/types";
import {
  userSettingNavigation,
  userSettingNavigationItem,
} from "./config-settings-nav";

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  return (
    <div className="flex h-screen max-h-screen min-h-screen w-full gap-9 overflow-hidden bg-logan-primary-200 py-8 pl-9 pr-24 pt-11">
      <div className="flex flex-col gap-9">
        <SettingsNavigationCard />
      </div>
      {/* Main Content */}
      <div className="h-full w-full">{children}</div>
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
    (changedSetting: Exclude<SettingType, SettingEnum.WORKSPACE>) => {
      changeSetting(changedSetting);
    },
    [changeSetting, setting],
  );
  return (
    <Card
      className={cn(
        "w-[15rem] border-none shadow-none",
        isSettingsWorkspace && "flex flex-col-reverse",
      )}
    >
      <CardHeader className={cn("", isSettingsWorkspace && "pt-0")}>
        <CardTitle className="text-3xl font-semibold">
          {isSettingsWorkspace ? "Workspace Settings" : "Settings"}
        </CardTitle>
      </CardHeader>
      <CardContent className={isSettingsWorkspace ? "pt-6" : "space-y-7"}>
        {!isSettingsWorkspace && (
          <ul className="space-y-5 py-2 text-xs font-semibold">
            {userSettingNavigation.map((item: userSettingNavigationItem) => (
              <li
                key={item.value as string}
                className="cursor-pointer gap-4"
                onClick={() =>
                  handleChangeUserSetting(item.value as SettingType)
                }
              >
                <span
                  className={cn(
                    "text-sm text-logan-black",
                    setting === item.value && "text-logan-blue",
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
          className="flex w-full items-center justify-start gap-3 bg-logan-primary-200 text-xs text-logan-black"
        >
          <Icon
            iconName={"arrow"}
            fill={iconColors.gray}
            className={cn("", isSettingsWorkspace && "rotate-180")}
          />
          <span className="text-black-txt text-sm !font-medium">
            {isSettingsWorkspace ? "Back to Settings" : "Workspace Settings"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
});
SettingsNavigationCard.displayName = "SettingsNavigationCard";
