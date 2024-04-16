import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import AppendixList from "./AppendixList";
import ArticleList from "./ArticleList";
import Tags from "@/components/generic/Tags";
import AppendixDropDown from "./AppendixDropDown";

function LoganReferenceTool() {
  const [isAppendixActive, setIsAppendixActive] = useState(true);
  const [articleFrom, setArticleFrom] = useState("Document - Updated By Laws");
  const [openAppendixMenu, setOpenAppendixMenu] = useState(true);

  useEffect(() => {
    !isAppendixActive && !openAppendixMenu && setOpenAppendixMenu(true);
  }, [isAppendixActive]);

  return (
    <div
      className="h-full w-[26.5rem]  overflow-hidden bg-white "
      aria-label="Logan Document Version History"
    >
      <div className="w-full flex justify-between border-b-[0.063rem] border-secondary-blue h-[3.3rem] items-center px-[0.8rem]">
        <h2 className="text-primary-gray text-sm font-semibold">
          Reference Management
        </h2>
        <div className="flex items-center gap-2 ">
          <Button
            onClick={(e) => {
              setIsAppendixActive(true);
              e.stopPropagation();
            }}
            className={`btn btn--normal !py-4 ${
              isAppendixActive &&
              "text-[#FF7A00] border-solid hover:!text-[#FF7A00] !border-[0.063rem] !border-[#FF7A00] bg-[#FFF3E7]"
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
              "text-[#FF26C2] border-solid hover:!text-[#FF26C2] !border-[0.063rem] !border-[#FF26C2] bg-[#FFF5FD]"
            }`}
          >
            Articles
          </Button>
        </div>
      </div>
      {!isAppendixActive && (
        <div className=" relative px-5 py-3 flex items-center gap-2 border-b-[0.063rem] border-secondary-blue bg-gradient-search">
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
            <Tags textColor={"text-primary-blue"} bgColor={"bg-six"}>
              {articleFrom}
            </Tags>
          </Dropdown>
        </div>
      )}
      <div className="w-full px-5 py-3 flex gap-3 items-center border-b-[0.063rem] border-secondary-blue bg-gradient-search">
        <RemSizeImage
          imagePath={"/assets/icons/search-icon.svg"}
          remWidth={1.188}
          remHeight={1.188}
          alt={"Search"}
        />
        <input
          autoComplete="off"
          className="w-[80%] text-xs  outline-none  bg-gradient-search"
          placeholder={`Search For An ${
            isAppendixActive ? "Annex" : "Article"
          }`}
        ></input>
      </div>
      <div className="overflow-hidden h-[100%] text-xs m-4 ">
        {isAppendixActive ? <AppendixList /> : <ArticleList />}
      </div>
    </div>
  );
}

export default LoganReferenceTool;
