import { documentStatus } from "../enums";
import Tags from "@/components/generic/Tags";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Sort from "@/components/generic/Sort";
import { sortNumbersTableList, sortStringTableList } from "@/utils/generic";
import { dateTimeFormat } from "@/utils/dateUtils";
const foldersToShow = 4;

export const documenetVersionHistoryListColumns = (activeDocument) => {
  return [
    {
      title: "Doc Name",
      dataIndex: "docName",
      key: "docName",
      className: "text-black font-semibold",
      render: (_, record) => {
        let isActive = false;
        if (activeDocument && record?.id === activeDocument?.id) {
          isActive = true;
        }
        return (
          <div className="flex items-center gap-2">
            {isActive && (
              <RemSizeImage
                imagePath={"/assets/icons/arrow-left.svg"}
                remWidth={0.313}
                remHeight={0.313}
                alt="Active Version"
              />
              // <Image
              //   src={"/assets/icons/arrow-left.svg"}
              //   height={5}
              //   width={5}
              //   alt="Active Version"
              // />
            )}
            <span className={isActive ? "text-primary-blue" : "text-black"}>
              {record.docName}
            </span>
          </div>
        );
      },
    },
    {
      title: "time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let status = "";
        if (record.version === documentStatus.Current) {
          status = (
            <Tags textColor={"text-primary-blue"} bgColor={"bg-secondary-blue"}>
              Current version
            </Tags>
          );
        } else if (record.version === documentStatus.Finalized) {
          status = (
            <Tags textColor={"text-[#10C900]"} bgColor={"bg-[#D9FADB]"}>
              Finalized
            </Tags>
          );
        } else {
          status = (
            <Tags textColor={"text-[#FFC700]"} bgColor={"bg-[#FFF7DB]"}>
              Draft
            </Tags>
          );
        }

        return status;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            {record.exported &&
              (record.version === documentStatus.Finalized ? (
                <RemSizeImage
                  imagePath={"/assets/icons/export-finalized.svg"}
                  remWidth={1}
                  remHeight={1.125}
                  alt="Export Finalised"
                />
              ) : (
                // <Image
                //   src={"/assets/icons/export-finalized.svg"}
                //   height={1.125}
                //   width={1}
                //   alt="New"
                // />
                <RemSizeImage
                  imagePath={"/assets/icons/export-draft.svg"}
                  remWidth={1}
                  remHeight={1.125}
                  alt="Export Draft"
                />
                // <Image
                //   src={"/assets/icons/export-draft.svg"}
                //   height={18}
                //   width={16}
                //   alt="New"
                // />
              ))}
          </>
        );
      },
    },
  ];
};

export const clientFoldersListTableColumns = (setListData, listData) => {
  return [
    {
      label: "",
      customHead: (column) => {
        return (
          <span className="flex items-center gap-4 ">
            <span>Name</span>
            <Sort
              onClickSort={(sortOrder) => {
                setListData(sortStringTableList(listData, sortOrder, "title"));
              }}
            />
          </span>
        );
      },
      customView: (row) => {
        return (
          <div className="flex items-center gap-3">
            <RemSizeImage
              imagePath={"/assets/icons/client-folder.svg"}
              remWidth={1.313}
              remHeight={1.313}
              alt={"Client Folder"}
            />
            <span className=" font-semibold text-black">{row.title}</span>
          </div>
        );
      },
      id: "title",
    },
    {
      label: "",
      customHead: (column) => {
        return (
          <span className="flex items-center gap-4">
            <span>Last Modified</span>
            <Sort
              onClickSort={(sortOrder) => {
                setListData(
                  sortNumbersTableList(listData, sortOrder, "lastModified")
                );
              }}
            />
          </span>
        );
      },
      format: (row) => {
        return dateTimeFormat(row?.updated_at);
      },
      id: "updated_at",
    },
    {
      label: "Folders",
      customView: (row) => {
        let folders = row?.sub_projects;
        if (folders?.length <= 0) {
          return "NA";
        }
        let folderLimitExceed = folders?.length > foldersToShow;
        if (folderLimitExceed) {
          folders = folders?.slice(0, 4);
        }
        let folderTags = folders?.map((folder, index) => {
          return (
            <Tags
              className={"font-medium"}
              textColor={"text-primary-blue"}
              bgColor={"bg-secondary-blue"}
              key={folder?.id}
            >
              {folder?.title}
            </Tags>
          );
        });

        if (folderLimitExceed) {
          folderTags?.push(
            <Tags
              className={"font-medium"}
              textColor={"text-primary-blue"}
              bgColor={"bg-secondary-blue"}
              key="o0"
            >
              {`+1`}
            </Tags>
          );
        }
        return <div className="flex items-center gap-1">{folderTags}</div>;
      },
    },
    {
      label: "",
      id: "",
      class: () => "text-right",
      customView: (row) => {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="mr-1"
          >
            <RemSizeImage
              imagePath={"/assets/icons/blue-option-hoz.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt="option"
              className={"rotate-90"}
            />
          </button>
        );
      },
    },
  ];
};

export const foldersListTableColumns = (setListData, listData) => {
  return [
    {
      label: "",
      customHead: (column) => {
        return (
          <span className="flex items-center gap-4 ">
            <span>Name</span>
            <Sort
              onClickSort={(sortOrder) => {
                setListData(sortStringTableList(listData, sortOrder, "title"));
              }}
            />
          </span>
        );
      },
      customView: (row) => {
        return (
          <div className="flex items-center gap-3">
            <RemSizeImage
              imagePath={"/assets/icons/non-client-folder.svg"}
              remWidth={1.313}
              remHeight={1.313}
              alt={"Client Folder"}
            />
            <span className=" font-semibold text-black">{row.title}</span>
          </div>
        );
      },
      id: "title",
    },
    {
      label: "",
      customHead: (column) => {
        return (
          <span className="flex items-center gap-4">
            <span>Last Modified</span>
            <Sort
              onClickSort={(sortOrder) => {
                setListData(
                  sortNumbersTableList(listData, sortOrder, "lastModified")
                );
              }}
            />
          </span>
        );
      },
      format: (row) => {
        return dateTimeFormat(row?.updated_at);
      },
      id: "updated_at",
    },
    {
      label: "Folders",
      id: "folders",
      customView: (row) => {
        let folders = row?.sub_projects;
        if (folders?.length <= 0 || !folders) {
          return "NA";
        }
        let folderLimitExceed = folders?.length > foldersToShow;
        if (folderLimitExceed) {
          folders = folders?.slice(0, 4);
        }
        let folderTags = folders?.map((folder, index) => {
          return (
            <Tags
              className={"font-medium"}
              textColor={"text-primary-blue"}
              bgColor={"bg-secondary-blue"}
              key={folder?.id}
            >
              {folder?.title}
            </Tags>
          );
        });

        if (folderLimitExceed) {
          folderTags?.push(
            <Tags
              className={"font-medium"}
              textColor={"text-primary-blue"}
              bgColor={"bg-secondary-blue"}
            >
              {`+1`}
            </Tags>
          );
        }
        return <div className="flex items-center gap-1">{folderTags}</div>;
      },
    },
    {
      label: "",
      id: "",
      class: () => "text-right",
      customView: (row) => {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="mr-1"
          >
            <RemSizeImage
              imagePath={"/assets/icons/blue-option-hoz.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt="option"
              className={"rotate-90"}
            />
          </button>
        );
      },
    },
  ];
};
