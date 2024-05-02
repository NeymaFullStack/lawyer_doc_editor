import React from "react";

function LoganTable({
  tableColumns,
  listData,
  hideHeader,
  headerClass = "",
  bodyClass = "",
  className = "",
  onClickRow = undefined,
  rowKey,
}) {
  return (
    <table
      className={`w-full table-auto border-collapse  text-primary-gray ${className}`}
    >
      {!hideHeader && (
        <MemoizedTableHeader
          headTitles={tableColumns}
          headerClass={headerClass}
        />
      )}
      <tbody className={`rounded-lg text-xs ${bodyClass}`}>
        {listData &&
          listData.map((row, rindex) => (
            <tr
              key={row[rowKey]}
              className={`border-b-[0.094rem] border-secondary-blue bg-white ${
                onClickRow ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                onClickRow(row);
              }}
            >
              {tableColumns &&
                tableColumns.map(
                  (column, cindex) =>
                    (column.customView && (
                      <td
                        key={cindex}
                        className={`px-3 py-4 text-left  ${
                          column?.class ? column.class(row[column.id]) : ""
                        }`}
                      >
                        {column.customView(row)}
                      </td>
                    )) ||
                    (column?.format && (
                      <td
                        // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                        key={cindex}
                        className={`px-3 py-4 text-left  ${
                          column?.class ? column.class(row[column.id]) : ""
                        }`}
                      >
                        {column?.format(row)}
                      </td>
                    )) || (
                      <td
                        // onClick={onClickRow ? () => onClickRow(row) : () => {}}
                        key={cindex}
                        className={`px-3 py-4 text-left  ${
                          column?.class ? column.class(row[column.id]) : ""
                        }`}
                      >
                        {row[column.id] || "NA"}
                      </td>
                    ),
                )}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
export default LoganTable;

const TableHeader = ({ headTitles, headerClass }) => {
  return (
    <thead
      className={` border-secondary-blue text-[0.813rem] font-semibold  text-black-txt ${headerClass}`}
    >
      <tr>
        {headTitles &&
          headTitles?.map((column, index) => (
            <th key={index} className={`px-3 py-4 text-left`}>
              {column.customHead ? column.customHead(column) : column.label}
            </th>
          ))}
      </tr>
    </thead>
  );
};

const MemoizedTableHeader = React.memo(TableHeader);
