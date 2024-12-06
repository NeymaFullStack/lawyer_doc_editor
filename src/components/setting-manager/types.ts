import { UserRole } from "@/sections/settings/types";

export type workSpaceUserDetailType = {
  user_email: string;
  workspace_id: string;
  invite_status: userWorkspaceStatus;
  role: UserRole;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  last_active: Date;
  user_details: {
    name: string;
    profile_logo: string;
    id: string;
  } | null;
};

export enum userWorkspaceStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
}
