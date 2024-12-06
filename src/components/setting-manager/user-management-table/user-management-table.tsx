"use client";

import React, { memo } from "react";
import { SortingState, flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { workSpaceUserDetailType } from "../types";
import { userManagementTableColumns } from "./config-table";
import { cn } from "@/lib/utils";

const UserManagementTable = memo(
  ({ data }: { data: workSpaceUserDetailType[] }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
      data,
      columns: userManagementTableColumns(),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        rowSelection,
      },
    });

    return (
      <Table>
        <TableHeader className="bg-logan-primary-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-none" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className="h-10 py-1 text-logan-black-foreground"
                  key={header.id}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow className="border-none hover:bg-white" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  className={cn(
                    "py-3",
                    (cell.column.columnDef.meta as { className?: string })
                      ?.className,
                  )}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
);
export default UserManagementTable;
