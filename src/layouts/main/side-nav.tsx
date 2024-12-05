import React, {
  ChangeEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import collapsedLogo from "public/logo/collapsed-logo.svg";
import expandedLogo from "public/logo/expanded-logo.svg";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon, icons } from "@/components/icons";
import { Bell, Search } from "lucide-react";
import { iconColors } from "../../../tailwind.config";
import { useHover } from "@/hooks/use-hover";
import { useAuthContext } from "@/auth/hooks";
import {
  CreateMenuItems,
  NavigationItems,
  NavMenuItem,
  SettingsMenuItems,
} from "./config-navigation";
import { cn } from "@/lib/utils";
import { workspaceItemType } from "./type";
import axiosInstance, { endpoints } from "@/lib/axios";
import axios from "axios";
import { useFetcher } from "@/hooks/use-fetcher";

type SideNavMenuProps = {
  isExpanded: boolean;
};

const workspaces = [{ name: "Lexington Ltd." }, { name: "Paul's workspace" }];

const SideNav = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  const RenderLogo = useCallback(() => {
    const logoSrc = isExpanded ? expandedLogo : collapsedLogo;
    const logoAlt = isExpanded ? "Expanded Logo" : "Collapsed Logo";
    const logoClass = isExpanded
      ? "py-3 px-4"
      : "flex justify-center items-center my-2";

    return (
      <div className={logoClass}>
        <Image src={logoSrc} alt={logoAlt} priority />
      </div>
    );
  }, [isExpanded]);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <RenderLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mb-5 mt-24 flex flex-col gap-8 p-0">
          <WorkspaceSwitcher />
          <NewMenu isExpanded={isExpanded} />
        </SidebarGroup>

        <SidebarGroup
          className={cn("p-0", {
            "border-b border-t border-logan-primary-300": isExpanded,
          })}
        >
          <SideNavMenu isExpanded={isExpanded} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-8 p-0 py-8">
        <FooterMenu isExpanded={isExpanded} />
        <UserInfo isExpanded={isExpanded} />
      </SidebarFooter>
    </Sidebar>
  );
};

// Memoized NewMenu for the "New" button and its dropdown items
const NewMenu = ({ isExpanded }: { isExpanded: boolean }) => (
  <div className="ml-6">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "flex h-11 w-auto items-center justify-center gap-4 rounded-xl bg-primary-gradient p-4 !text-white",
            { "aspect-square": !isExpanded },
          )}
        >
          <div
            className={cn("aspect-square size-6 rounded-md p-1", {
              "bg-white": isExpanded,
            })}
          >
            <Icon
              iconName="gradient-plus"
              fill={
                isExpanded
                  ? { from: iconColors.from, to: iconColors.to }
                  : "white"
              }
              iconClassName={cn({ "size-4": !isExpanded })}
            />
          </div>
          {isExpanded && (
            <span className="truncate text-sm font-bold">New</span>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={isExpanded ? "bottom" : "right"}
        sideOffset={4}
        className="flex flex-col gap-0.5 rounded-xl p-2"
      >
        {CreateMenuItems.map((item, key) => (
          <React.Fragment key={key}>
            {!!key && <DropdownMenuSeparator />}
            <RenderCreateItem {...item} />
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

// Refactor RenderCreateItem to use hover hook and cleanup
const RenderCreateItem = ({ iconName, fill, label }: NavMenuItem) => {
  const { hover, handleMouseOver, handleMouseOut } = useHover();

  return (
    <DropdownMenuItem
      className="rounded-lg p-2 hover:bg-logan-primary-200"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Icon iconName={iconName} fill={fill} />
      <span
        className={cn(
          "truncate text-sm font-semibold",
          hover ? "text-logan-blue" : "text-logan-black",
        )}
      >
        {label}
      </span>
    </DropdownMenuItem>
  );
};

const fetchWorkspaceList = async (): Promise<{
  data: workspaceItemType[];
  status: string;
}> => {
  const res = await axiosInstance.get(endpoints.workspace.workspaceList);
  return res.data;
};

const WorkspaceSwitcher = () => {
  const { data, loading } = useFetcher(fetchWorkspaceList, []);
  const workspaces = data?.data || [];
  const { workspace, setWorkspace } = useAuthContext();
  const [query, setQuery] = useState<string>("");
  const [activeTeam, setActiveTeam] = useState<workspaceItemType | null>(null);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      const activeWorkspace = workspaces.find((ws) => ws.id === workspace);
      setActiveTeam(activeWorkspace || workspaces[0]);
    }
  }, [workspaces]);

  const queryFn = (workspace: { name: string }) =>
    workspace.name.toLowerCase().includes(query.toLowerCase());

  const filteredWorkspaces = useMemo(() => {
    if (!query) return workspaces;
    return workspaces && workspaces.length > 0
      ? workspaces.filter(queryFn)
      : [];
  }, [query, workspaces]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div
      className={cn(
        "flex flex-col justify-center",
        { "mx-6": isExpanded },
        { "ml-6 mr-4": !isExpanded },
      )}
    >
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
              {isExpanded && (
                <span className="truncate text-xs font-bold">
                  {activeTeam?.name}
                </span>
              )}
            </div>
            <Icon
              iconName="gradient-arrowDown"
              fill={{ from: iconColors.from, to: iconColors.to }}
            />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side={isExpanded ? "bottom" : "right"}
          sideOffset={4}
          className="w-52 rounded-xl border border-logan-primary-300 bg-logan-primary-200"
        >
          <div className="relative p-2">
            <div className="absolute left-4 top-3.5 aspect-square size-4">
              <Search className="size-4 text-logan-black-foreground text-opacity-40" />
            </div>
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="search"
              className="h-7 rounded-lg px-2 py-1.5 pl-7 text-sm placeholder:text-logan-black-foreground placeholder:text-opacity-40 focus:border focus:border-logan-primary-300"
            />
          </div>
          <DropdownMenuSeparator className="bg-logan-primary-300" />
          {filteredWorkspaces?.map((workspace, key) => (
            <WorkspaceItem
              key={key}
              workspace={workspace}
              callback={(updatedWorkspace) => {
                setActiveTeam(updatedWorkspace);
                setWorkspace(updatedWorkspace?.id);
              }}
            />
          ))}
          <WorkspaceAdd />
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
    workspace: workspaceItemType;
    callback: (workspace: workspaceItemType) => void;
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

// Add Workspace Component
const WorkspaceAdd = React.memo(() => {
  const { hover, handleMouseOver, handleMouseOut } = useHover();
  return (
    <DropdownMenuItem
      className={cn(
        "mx-2 my-2 flex items-center gap-x-2 rounded-lg px-2 py-1.5",
        { "bg-primary-gradient": hover },
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Icon
        iconName="plus"
        fill={hover ? "white" : { from: iconColors.from, to: iconColors.to }}
      />
      <span
        className={cn(
          "truncate bg-primary-gradient bg-clip-text text-xs font-semibold text-transparent",
          { "text-white": hover },
        )}
      >
        Add a Workspace
      </span>
    </DropdownMenuItem>
  );
});
WorkspaceAdd.displayName = "WorkspaceAdd";

const SideNavMenu = React.memo(({ isExpanded }: SideNavMenuProps) => {
  const path = usePathname();
  const router = useRouter();

  return (
    <SidebarMenu className={cn("gap-0", { "gap-6": !isExpanded })}>
      {NavigationItems.map(({ iconName, fill, href, label }, key) => {
        const isSelected = path.startsWith(href ?? "");
        const icon = (
          isSelected ? iconName : `${iconName}-outlined`
        ) as keyof typeof icons;

        return (
          <React.Fragment key={key}>
            {isExpanded && key > 0 && <Separator />}
            <SidebarMenuItem
              className={isExpanded ? "px-4 py-2" : "pl-6"}
              onClick={() => router.push(href ?? "")}
            >
              <SidebarMenuButton
                className={cn(
                  "flex items-center gap-4 rounded-lg p-2 hover:bg-logan-primary-200",
                  {
                    "aspect-square h-11 w-auto justify-center bg-logan-primary-200":
                      !isExpanded,
                  },
                )}
              >
                <Icon iconName={icon} fill={fill} />
                {isExpanded && (
                  <span
                    className={cn(
                      "truncate text-sm font-semibold text-logan-black-foreground",
                      {
                        "bg-primary-gradient bg-clip-text text-transparent":
                          path.startsWith(href ?? ""),
                      },
                    )}
                  >
                    {label}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </React.Fragment>
        );
      })}
    </SidebarMenu>
  );
});
SideNavMenu.displayName = "SideNavMenu";

const FooterMenu = React.memo(({ isExpanded }: SideNavMenuProps) => {
  const router = useRouter();
  return (
    <SidebarMenu className="flex flex-col gap-1">
      <SidebarGroupLabel className="pl-6 text-logan-black-foreground">
        MORE
      </SidebarGroupLabel>
      {SettingsMenuItems.map(({ iconName, fill, href, label }, key) => {
        return (
          <SidebarMenuItem
            key={key}
            onClick={() => router.push(href ?? "")}
            className="!bg-none"
          >
            <SidebarMenuButton className="flex cursor-pointer items-center gap-4 rounded-lg p-2 !px-6 text-logan-black-foreground hover:bg-transparent hover:!text-logan-black group-data-[collapsible=icon]:!px-6">
              <Icon iconName={iconName} fill={fill} />
              {isExpanded && (
                <span className="truncate text-sm font-semibold">{label}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
});
FooterMenu.displayName = "FooterMenu";

const UserInfo = React.memo(({ isExpanded }: { isExpanded?: boolean }) => {
  const { user } = useAuthContext();

  return (
    <div
      className={cn("ml-6 flex items-center gap-2 rounded-xl", {
        "mr-6 justify-between border border-logan-primary-300 p-2.5":
          isExpanded,
      })}
    >
      <div className="flex shrink items-center justify-center gap-2">
        <Avatar className={isExpanded ? "size-8" : "size-7"}>
          <AvatarImage
            src={user?.profile_logo}
            className={isExpanded ? "size-8" : "size-7"}
          />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        {isExpanded && (
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-xs font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
            <span className="truncate text-[10px] font-medium">
              {user?.email}
            </span>
          </div>
        )}
      </div>
      <Bell size={20} color={iconColors.from} />
    </div>
  );
});
UserInfo.displayName = "UserInfo";

export default SideNav;
