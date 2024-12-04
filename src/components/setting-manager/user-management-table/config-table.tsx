import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Minus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { User, userWorkspaceStatus } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const roleOrder = ["Administrator", "Team Member", "Guest"];
export const customRoleSort = (rowA: any, rowB: any) => {
  const indexA = roleOrder.indexOf(rowA.original.role);
  const indexB = roleOrder.indexOf(rowB.original.role);
  return indexA - indexB;
};
export const statusOrder = ["Active", "Inactive", "Pending"];
const customStatusSort = (rowA: any, rowB: any) => {
  const indexA = statusOrder.indexOf(rowA.original.status);
  const indexB = statusOrder.indexOf(rowB.original.status);
  return indexA - indexB;
};

export const userManagementTableColumns = (): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-logan-black-foreground data-[state=checked]:border-none data-[state=checked]:bg-logan-blue"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-logan-black-foreground data-[state=checked]:border-none data-[state=checked]:bg-logan-blue"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center font-normal text-logan-black-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <span className="ml-2">
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>
    ),
    cell: ({ row: { original } }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage src={original?.logo} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{original.name}</span>
          <span className="text-xs text-logan-black-foreground">
            {original.email}
          </span>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center font-normal text-logan-black-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <span className="ml-2">
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>
    ),
    enableSorting: true,
    sortingFn: customRoleSort,

    cell: ({ row }) => (
      <Select defaultValue={"administrator"}>
        <SelectTrigger className="h-8 max-w-[9rem] !py-0 [&>span]:font-medium">
          <SelectValue className="font-semibold" placeholder={"Your Role"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="administrator">Administrator</SelectItem>
          <SelectItem value="teamMember">Team Member</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "lastActive",
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center font-normal text-logan-black-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Active
        <span className="ml-2">
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>
    ),
    enableSorting: true,
    sortingFn: "datetime",
    meta: {
      className: "text-logan-black-foreground",
    },
    cell: ({ row }) => row.original.lastActive,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center font-normal text-logan-black-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <span className="ml-2">
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>
    ),
    enableSorting: true,
    cell: ({ row: { original } }) => (
      <Badge
        variant={
          original.status === userWorkspaceStatus.ACTIVE ? "active" : "inactive"
        }
      >
        {original.status}
      </Badge>
    ),
    sortingFn: customStatusSort,
  },
];
