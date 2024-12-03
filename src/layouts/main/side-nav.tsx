import React, { ChangeEvent, useCallback, useState } from "react";
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
        <SidebarGroup className="p-0 flex flex-col gap-8 mt-24 mb-5">
          <WorkspaceSwitcher workspaces={workspaces} />
          <NewMenu isExpanded={isExpanded} />
        </SidebarGroup>

        <SidebarGroup
          className={cn("p-0", {
            "border-t border-b border-logan-primary-300": isExpanded,
          })}
        >
          <SideNavMenu isExpanded={isExpanded} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0 py-8 flex flex-col gap-8">
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
            "h-11 p-4 flex items-center gap-4 justify-center w-auto rounded-xl bg-primary-gradient !text-white",
            { "aspect-square": !isExpanded }
          )}
        >
          <div
            className={cn("aspect-square size-6 p-1 rounded-md", {
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
            <span className="truncate font-bold text-sm">New</span>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={isExpanded ? "bottom" : "right"}
        sideOffset={4}
        className="rounded-xl p-2 flex flex-col gap-0.5"
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
      className="p-2 rounded-lg hover:bg-logan-primary-200"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Icon iconName={iconName} fill={fill} />
      <span
        className={cn(
          "truncate font-semibold text-sm",
          hover ? "text-logan-blue" : "text-logan-black"
        )}
      >
        {label}
      </span>
    </DropdownMenuItem>
  );
};

const WorkspaceSwitcher = ({
  workspaces,
}: {
  workspaces: { name: string }[];
}) => {
  const [query, setQuery] = useState<string>("");
  const [activeTeam, setActiveTeam] = useState(workspaces[0]);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  const queryFn = (workspace: { name: string }) =>
    workspace.name.toLowerCase().includes(query.toLowerCase());
  const filteredWorkspaces = workspaces.filter(queryFn);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div
      className={cn(
        "flex flex-col justify-center",
        { "mx-6": isExpanded },
        { "ml-6 mr-4": !isExpanded }
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="border w-full rounded-xl border-logan-primary-300 h-9 hover:bg-logan-primary-200 data-[state=open]:bg-logan-primary-200">
            <div className="flex items-center gap-2 grow">
              <div className="flex aspect-square size-5 items-center justify-center">
                <Icon
                  iconName="gradient-workspace"
                  fill={{ from: iconColors.from, to: iconColors.to }}
                />
              </div>
              {isExpanded && (
                <span className="truncate font-bold text-xs">
                  {activeTeam.name}
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
          className="bg-logan-primary-200 border border-logan-primary-300 w-52 rounded-xl"
        >
          <div className="relative p-2">
            <div className="absolute left-4 top-3.5 aspect-square size-4">
              <Search className="size-4 text-logan-black-foreground text-opacity-40" />
            </div>
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="search"
              className="rounded-lg px-2 py-1.5 pl-7 h-7 placeholder:text-logan-black-foreground placeholder:text-opacity-40 text-sm focus:border focus:border-logan-primary-300"
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
        className="mx-2 px-2 py-1.5 my-2 focus:bg-logan-primary-300 rounded-lg focus:text-logan-blue flex justify-between"
      >
        <span className="truncate font-semibold text-xs">{workspace.name}</span>
        {hover && (
          <Icon
            iconName="gradient-switch"
            fill={{ from: iconColors.from, to: iconColors.to }}
          />
        )}
      </DropdownMenuItem>
    );
  }
);
WorkspaceItem.displayName = "WorkspaceItem";

// Add Workspace Component
const WorkspaceAdd = React.memo(() => {
  const { hover, handleMouseOver, handleMouseOut } = useHover();
  return (
    <DropdownMenuItem
      className={cn(
        "mx-2 px-2 py-1.5 my-2 rounded-lg flex items-center gap-x-2",
        { "bg-primary-gradient": hover }
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
          "truncate font-semibold text-xs bg-clip-text bg-primary-gradient text-transparent",
          { "text-white": hover }
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
              className={isExpanded ? "px-4 py-2" : "pl-6 "}
              onClick={() => router.push(href ?? "")}
            >
              <SidebarMenuButton
                className={cn(
                  "flex items-center gap-4 p-2 hover:bg-logan-primary-200 rounded-lg",
                  {
                    "aspect-square h-11 w-auto justify-center bg-logan-primary-200":
                      !isExpanded,
                  }
                )}
              >
                <Icon iconName={icon} fill={fill} />
                {isExpanded && (
                  <span
                    className={cn(
                      "truncate font-semibold text-sm text-logan-black-foreground",
                      {
                        "bg-clip-text text-transparent bg-primary-gradient":
                          path.startsWith(href ?? ""),
                      }
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
      <SidebarGroupLabel className="text-logan-black-foreground pl-6">
        MORE
      </SidebarGroupLabel>
      {SettingsMenuItems.map(({ iconName, fill, href, label }, key) => {
        return (
          <SidebarMenuItem
            key={key}
            onClick={() => router.push(href ?? "")}
            className="!bg-none"
          >
            <SidebarMenuButton className="flex items-center gap-4 p-2 rounded-lg !px-6 text-logan-black-foreground hover:!text-logan-black hover:bg-transparent group-data-[collapsible=icon]:!px-6  cursor-pointer">
              <Icon iconName={iconName} fill={fill} />
              {isExpanded && (
                <span className="truncate font-semibold text-sm">{label}</span>
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
      className={cn("ml-6 rounded-xl flex items-center gap-2", {
        "p-2.5 border border-logan-primary-300 mr-6 justify-between":
          isExpanded,
      })}
    >
      <div className="flex justify-center gap-2 items-center shrink">
        <Avatar className={isExpanded ? "size-8" : "size-7"}>
          <AvatarImage
            src={user?.profile_logo}
            className={isExpanded ? "size-8" : "size-7"}
          />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        {isExpanded && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold truncate">{`${user?.first_name} ${user?.last_name}`}</span>
            <span className="text-[10px] font-medium truncate">
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
