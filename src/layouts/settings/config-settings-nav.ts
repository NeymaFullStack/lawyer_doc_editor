import { SettingEnum, SettingType } from "@/sections/settings/types";

export type userSettingNavigationItem = {
  label: string;
  value: Omit<SettingType, SettingEnum.WORKSPACE>;
};

export const userSettingNavigation: userSettingNavigationItem[] = [
  {
    label: "Account",
    value: "userDetails",
  },
  {
    label: "Password",
    value: "userPassword",
  },
  {
    label: "Notifications",
    value: "userNotificationsPreferences",
  },
];
