export type RefreshContextType = {
  workspaceRefresh: boolean;
  triggerWorkspaceRefresh: () => void;
};

export type RefreshStateType = {
  workspaceRefresh: boolean;
};

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

export enum workplaceType {
  PERSONAL = "PERSONAL",
  TEAM = "TEAM",
}

export type workspaceItemType = {
  id: string;
  name: string;
  type: keyof workplaceType;
  created_by: string;
  created_at: Date;
  updated_at: Date;
};
