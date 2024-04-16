import RemSizeImage from "@/components/generic/RemSizeImage";
import { documenetVersionHistoryListColumns } from "@/constants/tableColumns/dashboardTableColumns";
import { Button, Table } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LoganDocVersionHistoryTool() {
  const [activeDocument, setActiveD] = useState(null);
  const hoverVersionHistoryDocument = useSelector(
    (state) => state?.documentReduceer?.hoverVersionHistoryDocument
  );
  const selectedVersionHistoryDocument = useSelector(
    (state) => state.documentReduceer?.selectedVersionHistoryDocument
  );
  const currentVersionDocument = useSelector(
    (state) => state.documentReduceer?.currentVersionDocument
  );

  useEffect(() => {
    // for checking which document is active in
    // if (
    //   hoverVersionHistoryDocument?.id &&
    //   record.id === hoverVersionHistoryDocument?.id
    // ) {
    //   isActive = true;
    // } else if (
    //   selectedVersionHistoryDocument?.id &&
    //   record.id === selectedVersionHistoryDocument?.id
    // ) {
    //   isActive = true;
    // } else if (record.id === currentVersionDocument?.id) {
    //   isActive = true;
    // }
  }, []);

  const onHoverRow = debounce(() => {
    // set hover version
  }, [1500]);

  return (
    <div
      className="h-full w-[26.5rem] overflow-hidden bg-white"
      aria-label="Logan Document Version History"
    >
      <div className="w-full flex justify-between border-b-[0.063rem] border-secondary-blue h-[3.3rem] items-center px-[0.8rem]">
        <h2 className="text-primary-gray text-sm font-semibold">
          Document Version History
        </h2>
        <div className="flex items-center gap-1 ">
          <Button
            className="btn btn--secondary !py-4"
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/sort-icon.svg"}
                remWidth={1.343}
                remHeight={1.343}
                alt={"Sort"}
              />
              // <Image
              //   src={"/assets/icons/sort-icon.svg"}
              //   height={21.49}
              //   width={21.49}
              //   alt="New"
              // />
            }
          >
            By Date
          </Button>
          <Button
            className="btn btn--secondary !py-4"
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/all-doc.svg"}
                remWidth={1.343}
                remHeight={1.343}
                alt={"All Doc"}
              />
              // <Image
              //   src={"/assets/icons/all-doc.svg"}
              //   height={21.49}
              //   width={21.49}
              //   alt="New"
              // />
            }
          >
            All
          </Button>
        </div>
      </div>
      <div className="ln-version-table m-1 mt-2 overflow-hidden h-[100%]">
        <div className="p-1 pr-3  overflow-y-scroll h-[92%]">
          <Table
            onRow={(data, index) => {
              return {
                onMouseEnter: () => onHoverRow(data, true),
                onMouseLeave: () => {
                  data.active && onMouseLeaveVersion(data, false);
                },
                onClick: onClickVersion,
              };
            }}
            showHeader={false}
            pagination={false}
            rowKey={"id"}
            columns={documenetVersionHistoryListColumns(activeDocument)}
            // rowClassName={(record,index)=>{
            //    if(record.active){
            //       return
            //    }
            // }}
            dataSource={[
              {
                docName: "Updated By Laws",
                time: "Today",
                version: "current",
                active: true,
                id: 1,
              },
              {
                docName: "Updated By Laws",
                time: "2023-03-25 · 4:25pm",
                version: "draft",
                exported: true,
                active: false,
                id: 2,
              },
              {
                docName: "Updated By Laws",
                time: "2023-03-25 · 4:25pm",
                version: "finalized",
                exported: true,
                active: false,
                id: 3,
              },
              {
                docName: "Updated By Laws",
                time: "Today",
                version: "current",
                active: false,
                id: 4,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );

  function onMouseLeaveVersion() {}

  function onClickVersion() {
    // set versionDocument
  }
}

export default LoganDocVersionHistoryTool;
