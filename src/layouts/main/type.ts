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
