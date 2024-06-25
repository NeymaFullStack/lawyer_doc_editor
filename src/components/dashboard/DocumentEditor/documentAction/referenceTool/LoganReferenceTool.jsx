import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Collapse, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import AppendixList from "./AppendixList";
import ArticleList from "./ArticleList";
import AppendixDropDown from "./AppendixDropDown";
import Tag from "@/components/generic/Tag";
import { useSelector } from "react-redux";

function LoganReferenceTool() {
  // const [isAppendixActive, setIsAppendixActive] = useState(true);
  // const [openAppendixMenu, setOpenAppendixMenu] = useState(true);
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const articleList = useSelector(
    (state) => state.documentArticleReducer.articleList,
  );

  // useEffect(() => {
  //   !isAppendixActive && !openAppendixMenu && setOpenAppendixMenu(true);
  // }, [isAppendixActive]);
  console.log("articleList", articleList);
  return (
    <div
      className="h-full w-[26.5rem]  overflow-hidden bg-white "
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[3.3rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">Index</h2>
        {/* <div className="flex items-center gap-2 ">
          <Button
            onClick={(e) => {
              setIsAppendixActive(true);
              e.stopPropagation();
            }}
            className={`btn btn--normal !py-4 ${
              isAppendixActive &&
              "!border-[0.063rem] border-solid !border-[#FF7A00] bg-[#FFF3E7] text-[#FF7A00] hover:!text-[#FF7A00]"
            }`}
          >
            Appendix
          </Button>
          <Button
            onClick={(e) => {
              setIsAppendixActive(false);
              e.stopPropagation();
            }}
            className={`btn btn--normal !py-4 ${
              !isAppendixActive &&
              "!border-[0.063rem] border-solid !border-[#FF26C2] bg-[#FFF5FD] text-[#FF26C2] hover:!text-[#FF26C2]"
            }`}
          >
            Articles
          </Button>
        </div> */}
      </div>
      {/* {!isAppendixActive && (
        <div className=" relative flex items-center gap-2 border-b-[0.063rem] border-secondary-blue bg-gradient-search px-5 py-3">
          <span className="text-xs">Articles From :</span>
          <Dropdown
            destroyPopupOnHide={true}
            open={openAppendixMenu}
            dropdownRender={() => (
              <AppendixDropDown
                onClose={() => {
                  setOpenAppendixMenu(false);
                }}
              />
            )}
          >
            <Tag textColor={"text-primary-blue"} bgColor={"bg-six"}>
              {articleFrom}
            </Tag>
          </Dropdown>
        </div>
      )} */}
      <div className="flex w-full items-center gap-3 border-b-[0.063rem] border-secondary-blue bg-gradient-search px-5 py-3">
        <RemSizeImage
          imagePath={"/assets/icons/search-icon.svg"}
          remWidth={1.188}
          remHeight={1.188}
          alt={"Search"}
        />
        <input
          autoComplete="off"
          className="w-[80%] bg-gradient-search  text-xs  outline-none"
          placeholder={"Search for a specific appendix or article"}
        ></input>
      </div>
      <div className="m-4 h-[100%] overflow-hidden text-xs ">
        <Collapse
          bordered={false}
          items={[
            {
              key: "document",
              label: (
                <div className="flex items-center gap-2">
                  <Tag textColor="text-white" bgColor="bg-primary-blue">
                    Document
                  </Tag>
                  <h3 className="text-sm font-semibold text-black-txt">
                    {currentDocument?.document_name}
                  </h3>
                </div>
              ),
              children: <ArticleList showArticleTag items={articleList} />,
            },
          ]}
          expandIcon={(panelProps) => {
            return (
              <RemSizeImage
                className={panelProps.isActive ? " rotate-90" : ""}
                imagePath={"/assets/icons/docaction/expand-blue.svg"}
                remWidth={0.45}
                remHeight={0.5}
                alt={"Expand"}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

export default LoganReferenceTool;
