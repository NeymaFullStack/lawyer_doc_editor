export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: string;
  logo: string;
};

export enum userWorkspaceStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
}
