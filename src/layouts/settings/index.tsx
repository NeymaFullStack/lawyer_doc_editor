"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import React, { ChangeEvent, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { iconColors } from "../../../tailwind.config";
import { useSettingsContext } from "@/sections/settings/context/settings-context";
import { SettingEnum, SettingType } from "@/sections/settings/types";
import {
  userSettingNavigation,
  userSettingNavigationItem,
} from "./config-settings-nav";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useHover } from "@/hooks/use-hover";

type Props = {
  children: React.ReactNode;
};

const workspaces = [{ name: "Lexington Ltd." }, { name: "Paul's workspace" }];

export default function SettingsLayout({ children }: Props) {
  const { setting } = useSettingsContext();
  const isSettingsWorkspace = setting === SettingEnum.WORKSPACE;
  return (
    <div className="flex h-screen max-h-screen min-h-screen w-full gap-9 overflow-hidden bg-logan-primary-200 py-8 pl-9 pr-24 pt-11">
      <div className="flex flex-col gap-9">
        <SettingsNavigationCard />
        {isSettingsWorkspace && <SettingsWorkspaceCard />}
      </div>
      {/* Main Content */}
      <div className="h-full w-full">{children}</div>
    </div>
  );
}

const SettingsNavigationCard = React.memo(() => {
  const { setting, changeSetting } = useSettingsContext();
  const isSettingsWorkspace = setting === SettingEnum.WORKSPACE;

  const handleChangeSetting = useCallback(() => {
    isSettingsWorkspace
      ? changeSetting(SettingEnum.USER_DETAILS)
      : changeSetting(SettingEnum.WORKSPACE);
  }, [changeSetting, setting]);

  const handleChangeUserSetting = useCallback(
    (changedSetting: Exclude<SettingType, SettingEnum.WORKSPACE>) => {
      changeSetting(changedSetting);
    },
    [changeSetting, setting],
  );
  return (
    <Card
      className={cn(
        "w-[15rem] border-none shadow-none",
        isSettingsWorkspace && "flex flex-col-reverse",
      )}
    >
      <CardHeader className={cn("", isSettingsWorkspace && "pt-0")}>
        <CardTitle className="text-3xl font-semibold">
          {isSettingsWorkspace ? "Workspace Settings" : "Settings"}
        </CardTitle>
      </CardHeader>
      <CardContent className={isSettingsWorkspace ? "pt-6" : "space-y-7"}>
        {!isSettingsWorkspace && (
          <ul className="space-y-5 py-2 text-xs font-semibold">
            {userSettingNavigation.map((item: userSettingNavigationItem) => (
              <li
                key={item.value as string}
                className="cursor-pointer gap-4"
                onClick={() =>
                  handleChangeUserSetting(item.value as SettingType)
                }
              >
                <span
                  className={cn(
                    "text-sm text-logan-black",
                    setting === item.value && "text-logan-blue",
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Button
          onClick={handleChangeSetting}
          variant={"secondary"}
          className="flex w-full items-center justify-start gap-3 bg-logan-primary-200 text-xs text-logan-black"
        >
          <Icon
            iconName={"arrow"}
            fill={iconColors.gray}
            className={cn("", isSettingsWorkspace && "rotate-180")}
          />
          <span className="text-black-txt text-sm !font-medium">
            {isSettingsWorkspace ? "Back to Settings" : "Workspace Settings"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
});
SettingsNavigationCard.displayName = "SettingsNavigationCard";

//ToDo workspace  switcher
const SettingsWorkspaceCard = React.memo(() => {
  return (
    <Card className="w-[15rem] border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Select Workspace
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <WorkspaceSwitcher workspaces={workspaces} />
      </CardContent>
    </Card>
  );
});
SettingsWorkspaceCard.displayName = "SettingsWorkspaceCard";

const WorkspaceSwitcher = ({
  workspaces,
}: {
  workspaces: { name: string }[];
}) => {
  const [query, setQuery] = useState<string>("");
  const [activeTeam, setActiveTeam] = useState(workspaces[0]);
  const { state } = useSidebar();

  const queryFn = (workspace: { name: string }) =>
    workspace.name.toLowerCase().includes(query.toLowerCase());
  const filteredWorkspaces = workspaces.filter(queryFn);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div className={cn("flex flex-col justify-center")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="h-9 w-full rounded-xl border border-logan-primary-300 hover:bg-logan-primary-200 data-[state=open]:bg-logan-primary-200">
            <div className="flex grow items-center gap-2">
              <div className="flex aspect-square size-5 items-center justify-center">
                <Icon
                  iconName="gradient-workspace"
                  fill={{ from: iconColors.from, to: iconColors.to }}
                />
              </div>
              <span className="truncate text-xs font-bold">
                {activeTeam.name}
              </span>
            </div>
            <Icon iconName="logan-selct-dropdown-arrow" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side={"bottom"}
          sideOffset={4}
          className="w-48 rounded-xl border border-logan-primary-300 bg-logan-primary-200"
        >
          <div className="group relative p-2">
            <div className="absolute left-4 top-3.5 aspect-square size-4">
              <Search className="size-4 text-logan-black-foreground text-opacity-40 group-focus-within:text-logan-blue" />
            </div>
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="search"
              className="h-7 rounded-lg px-2 py-1.5 pl-7 text-sm placeholder:text-logan-black-foreground placeholder:text-opacity-40 focus:border focus:border-logan-primary-300"
            />
          </div>
          <DropdownMenuSeparator className="bg-logan-primary-300" />
          {filteredWorkspaces.map((workspace, key) => (
            <WorkspaceItem
              key={key}
              workspace={workspace}
              callback={setActiveTeam}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
// Reusable Workspace Item Component
const WorkspaceItem = React.memo(
  ({
    workspace,
    callback,
  }: {
    workspace: { name: string };
    callback: React.Dispatch<React.SetStateAction<{ name: string }>>;
  }) => {
    const { hover, handleMouseOver, handleMouseOut } = useHover();

    return (
      <DropdownMenuItem
        onClick={() => {
          callback(workspace);
          handleMouseOut();
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="mx-2 my-2 flex justify-between rounded-lg px-2 py-1.5 focus:bg-logan-primary-300 focus:text-logan-blue"
      >
        <span className="truncate text-xs font-semibold">{workspace.name}</span>
        {hover && (
          <Icon
            iconName="gradient-switch"
            fill={{ from: iconColors.from, to: iconColors.to }}
          />
        )}
      </DropdownMenuItem>
    );
  },
);
WorkspaceItem.displayName = "WorkspaceItem";
