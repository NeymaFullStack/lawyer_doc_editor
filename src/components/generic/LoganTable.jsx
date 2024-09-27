import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import { cn } from "@/utils/shadcn-utils";
import LoganContextMenu from "./LoganContextMenu";

function LoganTable({
  enableContextMenu = false,
  onOpenChange,
  contextMenuItems,
  tableColumns,
  listData,
  hideHeader,
  headerClass = "",
  bodyClass = "",
  className = "",
  onDoubleClickRow = undefined,
  onClickRow,
  rowKey,
  selectedFolders,
  selectedDocs,
}) {
  return (
    <Table className={cn("", className)}>
      {!hideHeader && (
        <MemoizedTableHeader
          headTitles={tableColumns}
          headerClass={headerClass}
        />
      )}
      <TableBody
        onClick={(e) => e.stopPropagation()}
        className={cn("text-xs", bodyClass)}
      >
        {listData &&
          listData.map((row, rIndex) =>
            enableContextMenu ? (
              <LoganContextMenu
                onOpenChange={(open) => onOpenChange(open, row)}
                contextMenuItems={contextMenuItems}
              >
                <TableRow
                  key={row[rowKey]}
                  className={cn("bg-white", onClickRow && "cursor-pointer")}
                  onDoubleClick={() => {
                    onDoubleClickRow(row);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickRow(row);
                  }}
                >
                  {tableColumns &&
                    tableColumns.map((column, cIndex) => {
                      // Check if it's the first or last row and first or last column
                      const isFirstRow = rIndex === 0;
                      const isLastRow = rIndex === listData.length - 1;
                      const isFirstColumn = cIndex === 0;
                      const isLastColumn = cIndex === tableColumns.length - 1;

                      // Determine the classes to apply
                      const classes = `${isFirstRow && isFirstColumn ? "rounded-tl-xl" : ""} ${isFirstRow && isLastColumn ? "rounded-tr-xl" : ""} ${isLastRow && isFirstColumn ? "rounded-bl-xl" : ""} ${isLastRow && isLastColumn ? "rounded-br-xl" : ""} 
            `;
                      return (
                        (column.customView && (
                          <TableCell
                            key={cIndex}
                            className={cn(
                              `px-3 py-3 text-left ${classes}`,
                              (selectedFolders?.find(
                                (item) => item?.id === row?.id,
                              ) ||
                                selectedDocs?.find(
                                  (item) => item?.id === row?.id,
                                )) &&
                                " bg-secondary-blue text-primary-blue",
                              column?.class && column.class(row[column.id]),
                            )}
                          >
                            {column.customView(row)}
                          </TableCell>
                        )) ||
                        (column?.format && (
                          <TableCell
                            // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                            key={cIndex}
                            className={cn(
                              `px-3 py-3 text-left ${classes}`,
                              (selectedFolders?.find(
                                (item) => item?.id === row?.id,
                              ) ||
                                selectedDocs?.find(
                                  (item) => item?.id === row?.id,
                                )) &&
                                " bg-secondary-blue text-primary-blue",
                              column?.class && column.class(row[column.id]),
                            )}
                          >
                            {column?.format(row)}
                          </TableCell>
                        )) || (
                          <TableCell
                            // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                            key={cIndex}
                            className={cn(
                              `px-3 py-3 text-left ${classes}`,
                              (selectedFolders?.find(
                                (item) => item?.id === row?.id,
                              ) ||
                                selectedDocs?.find(
                                  (item) => item?.id === row?.id,
                                )) &&
                                " bg-secondary-blue text-primary-blue",
                              column?.class && column.class(row[column.id]),
                            )}
                          >
                            {row[column.id] || "NA"}
                          </TableCell>
                        )
                      );
                    })}
                </TableRow>
              </LoganContextMenu>
            ) : (
              <TableRow
                key={row[rowKey]}
                className={cn("bg-white", onClickRow && "cursor-pointer")}
                onDoubleClick={() => {
                  onDoubleClickRow(row);
                }}
                onClick={() => {
                  onClickRow(row);
                }}
              >
                {tableColumns &&
                  tableColumns.map((column, cIndex) => {
                    // Check if it's the first or last row and first or last column
                    const isFirstRow = rIndex === 0;
                    const isLastRow = rIndex === listData.length - 1;
                    const isFirstColumn = cIndex === 0;
                    const isLastColumn = cIndex === tableColumns.length - 1;

                    // Determine the classes to apply
                    const classes = `${isFirstRow && isFirstColumn ? "rounded-tl-xl" : ""} ${isFirstRow && isLastColumn ? "rounded-tr-xl" : ""} ${isLastRow && isFirstColumn ? "rounded-bl-xl" : ""} ${isLastRow && isLastColumn ? "rounded-br-xl" : ""} 
              `;
                    return (
                      (column.customView && (
                        <TableCell
                          key={cIndex}
                          className={cn(
                            `px-3 py-3 text-left ${classes}`,
                            column?.class && column.class(row[column.id]),
                          )}
                        >
                          {column.customView(row)}
                        </TableCell>
                      )) ||
                      (column?.format && (
                        <TableCell
                          // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                          key={cIndex}
                          className={cn(
                            `px-3 py-3 text-left ${classes}`,
                            column?.class && column.class(row[column.id]),
                          )}
                        >
                          {column?.format(row)}
                        </TableCell>
                      )) || (
                        <TableCell
                          // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                          key={cIndex}
                          className={cn(
                            `px-3 py-3 text-left ${classes}`,
                            column?.class && column.class(row[column.id]),
                          )}
                        >
                          {row[column.id] || "NA"}
                        </TableCell>
                      )
                    );
                  })}
              </TableRow>
            ),
          )}
      </TableBody>
    </Table>
  );
}
export default LoganTable;

const LoganTableHeader = ({ headTitles, headerClass }) => {
  return (
    <TableHeader
      className={` text-[0.813rem] font-semibold  text-black-txt ${headerClass}`}
    >
      <TableRow className=" border-none">
        {headTitles &&
          headTitles?.map((column, index) => (
            <TableHead
              key={index}
              className={cn(
                `px-3 py-3 text-left`,
                column.class && column.class(),
              )}
            >
              {column.customHead ? column.customHead(column) : column.label}
            </TableHead>
          ))}
      </TableRow>
    </TableHeader>
  );
};

const MemoizedTableHeader = React.memo(LoganTableHeader);
