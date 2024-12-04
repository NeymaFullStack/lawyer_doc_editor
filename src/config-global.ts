import { paths } from "./routes/path";
import { SelectDropDownItemType } from "./types";

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;

export const PATH_AFTER_LOGIN = paths.dashboard.root;

export const userRoles: SelectDropDownItemType[] = [
  { label: "Admin", value: "admin" },
  { label: "Team Member", value: "member" },
];
