import { icons } from "@/components/icons";
import { iconColors } from "../../../tailwind.config";
import { paths } from "@/routes/path";

export type NavMenuItem = {
  iconName: keyof typeof icons;
  fill: string | { from: string; to: string };
  label: string;
  href?: string;
};

export const CreateMenuItems: NavMenuItem[] = [
  {
    iconName: "gradient-document",
    fill: { from: iconColors.from, to: iconColors.to },
    label: "New Document",
  },
  {
    iconName: "client",
    fill: iconColors.gray,
    label: "New Client",
  },
  {
    iconName: "gradient-template",
    fill: { from: iconColors["pink-from"], to: iconColors["pink-to"] },
    label: "New Template",
  },
];

export const NavigationItems: NavMenuItem[] = [
  {
    iconName: "gradient-dashboard",
    fill: { from: iconColors.from, to: iconColors.to },
    label: "Dashboard",
    href: paths.dashboard.root,
  },
  {
    iconName: "gradient-template",
    fill: { from: iconColors["pink-from"], to: iconColors["pink-to"] },
    label: "Templates",
    href: paths.templates.root,
  },
];

export const SettingsMenuItems: NavMenuItem[] = [
  {
    iconName: "setting",
    fill: iconColors["light-gray"],
    label: "Settings",
    href: paths.settings.root,
  },
  {
    iconName: "help",
    fill: iconColors["light-gray"],
    label: "Help",
    href: paths.support,
  },
  {
    iconName: "logout",
    fill: iconColors["light-gray"],
    label: "Logout",
    href: paths.logout,
  },
];
