import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/ui/card";
import { Label } from "@/components/shadcn-components/ui/label";
import { Switch } from "@/components/shadcn-components/ui/switch";
import { Separator } from "@/components/shadcn-components/ui/separator";
import {
  getUserNotificationPreferences,
  UpdateNotificationPreferences,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import Loader from "@/components/generic/Loader";
import { set } from "react-hook-form";
import { notificationPreference } from "@/constants/enums";

function NotificationPreference() {
  const [preferenceData, setPreferenceData] = useState(null);
  useEffect(() => {
    fetchUserNotificationPreferences();
  }, []);

  // if (isLoading || !preferenceData) {
  //   return <Loader />;
  // }
  return (
    <Card className="h-full space-y-2 border-none px-1 py-2 shadow-none">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription className="text-xs font-normal text-primary-gray">
          We may still send you important notification about your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid  gap-6">
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Replies to Comments</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-primary-gray">
              Receive notifications for replies to comments in which you are
              involved.
            </p>
          </Label>
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "repliesToCommentsNotifications",
                    "push_enabled",
                    checked,
                  )
                }
                checked={
                  preferenceData?.repliesToCommentsNotifications?.push_enabled
                }
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "repliesToCommentsNotifications",
                    "email_enabled",
                    checked,
                  )
                }
                checked={
                  preferenceData?.repliesToCommentsNotifications?.email_enabled
                }
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Tags</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-primary-gray">
              These notifications alert you when someone tags you in a comment.
            </p>
          </Label>
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "tagsNotifications",
                    "push_enabled",
                    checked,
                  )
                }
                checked={preferenceData?.tagsNotifications?.push_enabled}
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "tagsNotifications",
                    "email_enabled",
                    checked,
                  )
                }
                checked={preferenceData?.tagsNotifications?.email_enabled}
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Team Activity</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-primary-gray">
              Be notified when a collaborator is added or removed from any of
              your workspaces.
            </p>
          </Label>
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "teamActivityNotifications",
                    "push_enabled",
                    checked,
                  )
                }
                checked={
                  preferenceData?.teamActivityNotifications?.push_enabled
                }
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Push</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                onCheckedChange={(checked) =>
                  updateUserNotificationPreferences(
                    "teamActivityNotifications",
                    "email_enabled",
                    checked,
                  )
                }
                checked={
                  preferenceData?.teamActivityNotifications?.email_enabled
                }
                className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
              />
              <span className="text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
        <Separator className="bg-six" />
        <div className="flex w-[70%] items-center justify-between space-x-4">
          <Label className="flex flex-col space-y-1">
            <span>Offers and Promotions</span>
            <p className="w-[80%] text-xs font-normal leading-snug text-primary-gray">
              Stay informed about special offers, promotions, and discounts
              tailored for you.{" "}
            </p>
          </Label>
          <div className="flex items-center gap-3">
            <Switch
              onCheckedChange={(checked) =>
                updateUserNotificationPreferences(
                  "offersAndPromotionsNotifications",
                  "push_enabled",
                  checked,
                )
              }
              checked={
                preferenceData?.offersAndPromotionsNotifications?.email_enabled
              }
              className="data-[state=checked]:bg-primary-blue data-[state=unchecked]:bg-secondary-blue"
            />
            <span className="text-xs font-medium">Push</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  async function fetchUserNotificationPreferences() {
    let response = await getUserNotificationPreferences();
    if (response.status === "success") {
      setPreferenceData(response.data);
    }
  }

  async function updateUserNotificationPreferences(fieldKey, typeKey, value) {
    let updatedData = [];
    [
      "REPLIES_TO_COMMENTS_NOTIFICATIONS",
      "TAGS_NOTIFICATIONS",
      "TEAM_ACTIVITY_NOTIFICATIONS",
      "OFFERS_AND_PROMOTIONS_NOTIFICATIONS",
    ].forEach((field) => {
      let fieldData = {
        preference_type: field,
        push_enabled:
          fieldKey === notificationPreference[field] &&
          typeKey === "push_enabled"
            ? value
            : preferenceData[notificationPreference[field]]?.push_enabled,
        email_enabled:
          fieldKey === notificationPreference[field] &&
          typeKey === "email_enabled"
            ? value
            : preferenceData[notificationPreference[field]]?.email_enabled,
      };

      updatedData.push(fieldData);
    });
    let response = await UpdateNotificationPreferences({
      preferences: updatedData,
    });
    if (response.status === "success") {
      setPreferenceData(response.data);
    }
  }
}

export default NotificationPreference;
