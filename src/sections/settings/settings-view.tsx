"use client";
import React, { ReactNode, useMemo } from "react";
import { useSettingsContext } from "./context/settings-context";
import { Card, CardContent } from "@/components/ui/card";
import { SettingEnum } from "./types";
import DetailsView from "./user/details-view";
import PasswordView from "./user/password-view";
import NotificationPreferences from "./user/notification-preferences-view";
import WorkplaceView from "./workplace/workplace-view";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function SettingsView() {
  const { setting } = useSettingsContext();

  const settingsContent: ReactNode = useMemo(() => {
    switch (setting) {
      case SettingEnum.USER_DETAILS:
        return <DetailsView />;
      case SettingEnum.USER_PASSWORD:
        return <PasswordView />;
      case SettingEnum.USER_NOTIFICATION_PREFERENCES:
        return <NotificationPreferences />;
      case SettingEnum.WORKSPACE:
        return <WorkplaceView />;
      default:
        return <div>Details</div>;
    }
  }, [setting]);

  return (
    <div className="relative flex h-full">
      {/* Notification Banner */}
      <div className="absolute -top-7 left-1/2 z-10 flex h-10 w-max -translate-x-1/2 items-center justify-start gap-2.5 rounded-lg bg-logan-yellow-foreground p-2 px-3 text-xs font-semibold text-logan-yellow shadow">
        Please save your changes to ensure your modifications are applied.
      </div>

      {/* Scrollable Area */}
      <ScrollArea className="flex-1 rounded-lg bg-white">
        <div className="h-full">
          <Card className="h-full border-none shadow-none">
            <CardContent className="p-6">{settingsContent}</CardContent>
          </Card>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default SettingsView;
