import { userWorkspaceStatus } from "@/components/setting-manager/types";

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type WorkspaceType = {
  id: string | number;
  name: string;
};

export type SettingType =
  | "userDetails"
  | "userPassword"
  | "userNotificationsPreferences"
  | "workspace";

export type SettingsStateType = {
  setting: SettingType;
  workspace: WorkspaceType;
};

export type settingsContextProps = {
  changeSetting: (setting: SettingType) => void;
  changeWorkspace: (workspace: WorkspaceType) => void;
} & SettingsStateType;

export const enum SettingEnum {
  USER_DETAILS = "userDetails",
  USER_PASSWORD = "userPassword",
  USER_NOTIFICATION_PREFERENCES = "userNotificationsPreferences",
  WORKSPACE = "workspace",
}

export type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role?: string;
  legal_specialty?: string;
  country: string;
  language: string;
  country_code?: string;
};

export type UserPassword = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};

export enum UserNotificationPreferencesEnum {
  COMMENTS = "REPLIES_TO_COMMENTS_NOTIFICATIONS",
  TAGS = "TAGS_NOTIFICATIONS",
  TEAM_ACTIVITY = "TEAM_ACTIVITY_NOTIFICATIONS",
  OFFERS = "OFFERS_AND_PROMOTIONS_NOTIFICATIONS",
}

export type Toggle = {
  push_enabled?: boolean;
  email_enabled?: boolean;
};

export type UserNotificationPreferencesType = {
  [K in UserNotificationPreferencesEnum]: Toggle;
};

// workplace types

export enum UserRole {
  ADMIN = "ADMINISTRATOR",
  TEAM_MEMBER = "TEAM_MEMBER",
}

export type workplaceDetailsType = {
  name: string;
  code: string;
  company_email: string;
  company_website?: string;
  company_legal_specialty?: string;
  company_address?: string;
  company_country_code: string;
  company_tax_identification_number: string;
};

export type fetchUserNotificationsPreferencesType = {
  offers_and_promotions_notifications: Toggle;
  replies_to_comments_notifications: Toggle;
  tags_notifications: Toggle;
  team_activity_notifications: Toggle;
};

export type childFormRefProperties = {
  updateWorkplaceGeneralDetails: () => Promise<void>;
  isFormDirty: boolean;
};
