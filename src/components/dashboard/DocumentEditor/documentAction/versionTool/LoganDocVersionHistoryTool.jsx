import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import DocumentVersion from "./DocumentVersion";
import { useSelector } from "react-redux";
import { getDocumentVersionList } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { Collapse } from "antd";
import LoganDropDown from "@/components/generic/LoganDropDown";
import { vesionFilterMenuList } from "@/constants/list";
import { versionHistoryFilter } from "@/constants/enums";

function LoganDocVersionHistoryTool() {
  const { currentDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const [filters, setFilters] = useState({
    value: "all",
    label: "All Versions",
  });
  const [versionList, setVersionList] = useState([]);
  useEffect(() => {
    currentDocument?.id && fetchDocumentVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocumentVersion, filters]);

  // console.log(
  //   versionList.map((item) => {
  //     if (item.details) {
  //     } else if (item?.version_details && item?.version_details.length > 0) {
  //       debugger;
  //       let collapseItem = {
  //         key: item.label,
  //         label: item.label,
  //         children: (
  //           <ul>
  //             {item?.version_details.map((version) => {
  //               console.log("version", version);
  //               return (
  //                 <li key={version.version_id}>
  //                   <DocumentVersion docVersion={version} />
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         ),
  //       };
  //       console.log("items", collapseItem);
  //       return collapseItem;
  //     }
  //   }),
  // );

  return (
    <div aria-label="Logan Document Version History">
      <div className="flex h-[2.997rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">Versioning</h2>
        <div className="flex items-center gap-1 ">
          {/* <Button
            className="btn btn--secondary !py-4"
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/sort-icon.svg"}
                remWidth={1.343}
                remHeight={1.343}
                alt={"Sort"}
              />
            }
          >
            By Date
          </Button> */}
          <LoganDropDown
            trigger={["hover"]}
            placement="bottomRight"
            dropDownMenu={{
              items: vesionFilterMenuList(filters),
              onClick: onFilter,
            }}
            baseElement={
              <Button
                className="btn btn--secondary !py-4"
                icon={
                  <RemSizeImage
                    imagePath={"/assets/icons/all-doc.svg"}
                    remWidth={1.343}
                    remHeight={1.343}
                    alt={"All Doc"}
                  />
                }
              >
                {filters?.label}
              </Button>
            }
          />
        </div>
      </div>
      <div className="m-1 mt-2 h-[100%] overflow-hidden">
        <div className="h-[92%] overflow-y-scroll  p-1 pr-3">
          <DocumentVersion docVersion={currentDocumentVersion} />
          <Collapse
            expandIcon={(panelProps) => {
              return (
                <RemSizeImage
                  className={panelProps.isActive ? " rotate-90" : ""}
                  imagePath={"/assets/icons/docaction/expand-icon.svg"}
                  remWidth={0.45}
                  remHeight={0.5}
                  alt={"Expand"}
                />
              );
            }}
            bordered={false}
            items={versionList
              .slice(1)
              .map((item) => {
                if (item?.details && item?.details.length > 0) {
                  let collapseItem = {
                    key: item.label,
                    label: (
                      <div className="text-sm font-semibold text-primary-gray">
                        {item.label}
                      </div>
                    ),
                    children: item?.details.map((item) => {
                      return (
                        <div key={item.label}>
                          <div className="text-xs font-semibold text-primary-gray">
                            {item.label}
                          </div>
                          <ul className="mt-1">
                            {item?.version_details.map((version) => {
                              return (
                                <li key={version.version_id}>
                                  <DocumentVersion docVersion={version} />
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    }),
                  };
                  return collapseItem;
                } else if (
                  item?.version_details &&
                  item?.version_details.length > 0
                ) {
                  let collapseItem = {
                    key: item.label,
                    label: (
                      <div className="text-sm font-semibold text-primary-gray">
                        {item.label}
                      </div>
                    ),
                    children: (
                      <ul>
                        {item?.version_details.map((version) => {
                          return (
                            <li key={version.version_id}>
                              <DocumentVersion docVersion={version} />
                            </li>
                          );
                        })}
                      </ul>
                    ),
                  };
                  return collapseItem;
                }
              })
              .filter((item) => item !== undefined)}
          />
        </div>
      </div>
    </div>
  );

  function onFilter({ key }) {
    setFilters({ value: key, label: versionHistoryFilter[key] });
  }

  async function fetchDocumentVersions() {
    let filterParams = {};
    if (filters.value !== "all") {
      if (filters.value == "autoSaved") {
        filterParams.is_auto_saved = true;
      } else if (filters.value == "manualSaved") {
        filterParams.is_auto_saved = false;
      }
    }
    let { data } = await getDocumentVersionList({
      documentId: currentDocument?.id,
      queryParams: filterParams,
    });
    if (data?.length > 0) {
      setVersionList(data);
    }
  }
}

export default LoganDocVersionHistoryTool;
