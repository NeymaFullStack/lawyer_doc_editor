"use client";
import React, { ReactNode, useMemo } from "react";
import { useSettingsContext } from "./context/settings-context";
import { Card, CardContent } from "@/components/ui/card";
import { SettingEnum } from "./types";

function SettingsView() {
  const { setting } = useSettingsContext();
  const settingsContent: ReactNode = useMemo(() => {
    switch (setting) {
      case SettingEnum.USER_DETAILS:
        return <div>Details</div>;
      case SettingEnum.USER_PASSWORD:
        return <div>Password</div>;
      case SettingEnum.USER_NOTIFICATION_PREFERENCES:
        return <div>Notifications Preferences</div>;
      case SettingEnum.WORKSPACE:
        return <div>Workspace</div>;
      default:
        return <div>Details</div>;
    }
  }, [setting]);
  return (
    <Card className=" border-none shadow-none h-full">
      <CardContent className="p-6">{settingsContent}</CardContent>
    </Card>
  );
}

export default SettingsView;
