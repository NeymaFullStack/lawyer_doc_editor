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
