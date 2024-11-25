import { Icon } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { iconColors } from "../../../tailwind.config";
import { paths as routes } from "@/routes/path";
import React from "react";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { FolderHierarchyType } from "./type";
import Link from "next/link";

type FolderNavigatorProps = {
  paths: FolderHierarchyType[];
  loading: boolean;
};

export const FolderNavigator = ({ paths, loading }: FolderNavigatorProps) => {
  if (loading) return <FolderNavigatorShimmer />;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard Icon */}
        <BreadcrumbItem>
          <Link href={routes.dashboard.root}>
            <div className="px-2.5 py-1.5 bg-logan-primary-200 rounded-lg h-8 flex items-center">
              <Icon
                iconName="gradient-dashboard"
                iconClassName="size-4"
                fill={{ from: iconColors.from, to: iconColors.to }}
              />
            </div>
          </Link>
        </BreadcrumbItem>

        {/* Paths */}
        {paths.map((path, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === paths.length - 1 || idx === paths.length - 2;

          if (!isFirst && idx < paths.length - 2) {
            return (
              <React.Fragment key={idx}>
                <BreadcrumbSeparator
                  key={`separator-${idx}`}
                  className="text-logan-black-foreground"
                />
                <BreadcrumbEllipsis className="rounded-lg bg-logan-primary-200 px-2.5 py-1.5 flex gap-2 items-center h-8" />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={idx}>
              <BreadcrumbSeparator
                key={`separator-${idx}`}
                className="text-logan-black-foreground"
              />
              <FolderNavigatorItem
                key={path.id}
                path={path.id}
                label={path.title}
                isFirst={isFirst}
                isLast={isLast}
              />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const FolderNavigatorItem = ({
  path,
  label,
  isFirst,
  isLast,
}: {
  path?: string;
  label: string;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const resolvedPath = `${routes.dashboard.root}/${path ?? ""}`;
  if (isFirst) {
    return (
      <div className="flex items-stretch gap-2">
        {/* First Item */}
        <BreadcrumbItem>
          <Link href={resolvedPath}>
            <div className="rounded-lg bg-logan-black px-2.5 py-1.5 flex gap-2 items-center h-8">
              <Icon iconName="client" fill="#fff" iconClassName="size-4" />
              <span className="text-white text-sm font-bold">{label}</span>
            </div>
          </Link>
        </BreadcrumbItem>
        {/* Client Page Button */}
        <Button className="bg-primary-gradient px-2.5 py-1.5 rounded-lg !bg-logan-blue opacity-90 flex gap-2 items-center h-auto hover:opacity-100">
          <UserRound className="size-4" color="#fff" />
          <span className="text-white text-sm font-bold">Client Page</span>
        </Button>
      </div>
    );
  }

  if (isLast) {
    return (
      <BreadcrumbItem>
        <Link href={resolvedPath}>
          <div className="rounded-lg bg-logan-primary-200 px-2.5 py-1.5 flex gap-2 items-center h-8">
            <Icon
              iconName="folder"
              fill={iconColors["light-gray"]}
              iconClassName="size-4"
            />
            <span className="text-logan-black-foreground text-sm font-bold">
              {label}
            </span>
          </div>
        </Link>
      </BreadcrumbItem>
    );
  }

  return null; // Middle items (only ellipsis rendered)
};

const FolderNavigatorShimmer = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Shimmer for Dashboard Icon */}
        <BreadcrumbItem>
          <div className="w-8 h-8 bg-gradient-to-r from-logan-primary-200 to-logan-primary-300 rounded-lg animate-pulse" />
        </BreadcrumbItem>

        {/* Shimmer for Breadcrumb Path */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbSeparator className="text-logan-black-foreground animate-pulse" />
            <div className="w-20 h-8 bg-gradient-to-r from-logan-primary-200 to-logan-primary-300 rounded-lg animate-pulse" />
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
