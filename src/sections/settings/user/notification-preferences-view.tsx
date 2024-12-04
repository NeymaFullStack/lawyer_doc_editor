import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import axiosInstance, { endpoints } from "@/lib/axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  UserNotificationPreferencesType,
  UserNotificationPreferencesEnum,
  Toggle,
  fetchUserNotificationsPreferencesType,
} from "../types";
import { useFetcher } from "@/hooks/use-fetcher";
import {
  autoFillSwitchData,
  generateNotificationPreferencesParams,
} from "../utils";

const deafaultNotificationPreferences = {
  [UserNotificationPreferencesEnum.COMMENTS]: {
    push_enabled: true,
    email_enabled: true,
  },
  [UserNotificationPreferencesEnum.TAGS]: {
    push_enabled: true,
    email_enabled: true,
  },
  [UserNotificationPreferencesEnum.TEAM_ACTIVITY]: {
    push_enabled: true,
    email_enabled: true,
  },
  [UserNotificationPreferencesEnum.OFFERS]: {
    email_enabled: true,
  },
};

const fetchNotificationPreferenceData = async (): Promise<{
  data: fetchUserNotificationsPreferencesType;
  status: string;
}> => {
  const res = await axiosInstance.get(
    endpoints.settings.user.notificationPreferences,
  );
  return res.data;
};

function NotificationPreferences() {
  const { data } = useFetcher(fetchNotificationPreferenceData, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationPreferences, setNotificationPreferences] =
    useState<UserNotificationPreferencesType>(deafaultNotificationPreferences);

  useEffect(() => {
    if (data?.data) {
      autoFillSwitchData(data.data, setNotificationPreferences);
    }
  }, [data]);

  const saveNotificationPreferences = useCallback(
    async (preferenceParams: any) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post(
          endpoints.settings.user.notificationPreferences,
          preferenceParams,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [axiosInstance],
  );

  const handleSaveNotificationPreferences = useCallback(() => {
    const params = generateNotificationPreferencesParams(
      notificationPreferences,
    );
    saveNotificationPreferences(params);
  }, [notificationPreferences, saveNotificationPreferences]);

  const handleSwitchToggle = useCallback(
    (
      notificationPreference: keyof UserNotificationPreferencesType,
      toggle: { [k in keyof Toggle]?: boolean },
    ) => {
      setNotificationPreferences((prev: UserNotificationPreferencesType) => {
        return {
          ...prev,
          [notificationPreference]: {
            ...prev[notificationPreference],
            ...toggle,
          },
        };
      });
    },
    [],
  );

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="inline-block text-xl font-bold">
            Notification Settings
          </h1>
          <Button
            onClick={handleSaveNotificationPreferences}
            variant={"primary-blue"}
            className="flex items-center transition-all duration-300 ease-in-out"
          >
            Save Changes
            {isLoading && <LoadingSpinner className="ml-1" />}
          </Button>
        </div>
        <p className="text-sm text-logan-black-foreground">
          We may still send you important notification about your account.
        </p>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Replies to Comments</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-logan-black-foreground">
              Receive notifications for replies to comments in which you are
              involved.
            </p>
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(UserNotificationPreferencesEnum.COMMENTS, {
                    push_enabled: checked,
                  })
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.COMMENTS
                  ].push_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(UserNotificationPreferencesEnum.COMMENTS, {
                    email_enabled: checked,
                  })
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.COMMENTS
                  ].email_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Tags</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-logan-black-foreground">
              These notifications alert you when someone tags you in a comment.
            </p>
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(UserNotificationPreferencesEnum.TAGS, {
                    push_enabled: checked,
                  })
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.TAGS
                  ].push_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(UserNotificationPreferencesEnum.TAGS, {
                    email_enabled: checked,
                  })
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.TAGS
                  ].email_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Team Activity</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-logan-black-foreground">
              Be notified when a collaborator is added or removed from any of
              your workspaces.
            </p>
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(
                    UserNotificationPreferencesEnum.TEAM_ACTIVITY,
                    {
                      push_enabled: checked,
                    },
                  )
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.TEAM_ACTIVITY
                  ].push_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  handleSwitchToggle(
                    UserNotificationPreferencesEnum.TEAM_ACTIVITY,
                    {
                      email_enabled: checked,
                    },
                  )
                }
                checked={
                  notificationPreferences?.[
                    UserNotificationPreferencesEnum.TEAM_ACTIVITY
                  ].email_enabled
                }
                className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Offers and Promotions</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-logan-black-foreground">
              Stay informed about special offers, promotions, and discounts
              tailored for you.{" "}
            </p>
          </Label>
          <div className="flex items-center gap-3">
            <Switch
              onCheckedChange={(checked) =>
                handleSwitchToggle(UserNotificationPreferencesEnum.OFFERS, {
                  email_enabled: checked,
                })
              }
              checked={
                notificationPreferences?.[
                  UserNotificationPreferencesEnum.OFFERS
                ].email_enabled
              }
              className="data-[state=checked]:bg-logan-blue data-[state=unchecked]:bg-logan-primary-300"
            />
            <span className="text-xs font-medium">Push</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NotificationPreferences;
