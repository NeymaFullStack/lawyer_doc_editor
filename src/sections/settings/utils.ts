import React from "react";
import {
  fetchUserNotificationsPreferencesType,
  UserNotificationPreferencesEnum,
  UserNotificationPreferencesType,
} from "./types";

export function generateNotificationPreferencesParams(
  preferences: UserNotificationPreferencesType,
) {
  const preferencesArray = Object.entries(preferences).map(([key, value]) => ({
    preference_type: key,
    push_enabled: value.push_enabled || false,
    email_enabled: value.email_enabled || false,
  }));

  return {
    preferences: preferencesArray,
  };
}

export function autoFillSwitchData(
  data: fetchUserNotificationsPreferencesType,
  setNotificationPreferences: React.Dispatch<
    React.SetStateAction<UserNotificationPreferencesType>
  >,
) {
  setNotificationPreferences({
    [UserNotificationPreferencesEnum.COMMENTS]: {
      push_enabled: data.replies_to_comments_notifications.push_enabled,
      email_enabled: data.replies_to_comments_notifications.email_enabled,
    },
    [UserNotificationPreferencesEnum.TAGS]: {
      push_enabled: data.tags_notifications.push_enabled,
      email_enabled: data.tags_notifications.email_enabled,
    },
    [UserNotificationPreferencesEnum.TEAM_ACTIVITY]: {
      push_enabled: data.team_activity_notifications.push_enabled,
      email_enabled: data.team_activity_notifications.email_enabled,
    },
    [UserNotificationPreferencesEnum.OFFERS]: {
      email_enabled: data.offers_and_promotions_notifications.email_enabled,
    },
  });
}
