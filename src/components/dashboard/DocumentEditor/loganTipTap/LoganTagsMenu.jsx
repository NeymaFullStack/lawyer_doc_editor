import PositionToolTip from "@/components/generic/PositionToolTip";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { tagInsertionType } from "@/constants/enums";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LoganTagsMenu = ({
  onClickTag,
  isOpen,
  onClose,
  position,
  view,
  editorRef,
}) => {
  const [input, setInput] = useState("");
  const { variableList } = useSelector(
    (state) => state.documentVariableReducer,
  );
  const articleList = useSelector(
    (state) => state.documentIndexingReducer.articleList,
  );
  const [tagList, setTagList] = useState([]);
  const [filteredTagList, setFilteredTagList] = useState([]);
  useEffect(() => {
    let tagList = [];
    if (articleList?.length == 0 && variableList?.length == 0) {
      return;
    }
    for (let item of articleList) {
      let tag = {
        type: item?.type,
        tagName: item?.articleName,
        index: item?.index,
      };
      tagList.push(tag);
      if (item?.children && item.children.length > 0) {
        tagList = [...tagList, ...extractArticles(item?.children)];
      }
    }
    for (let item of variableList) {
      let tag = {
        type: tagInsertionType.Variable,
        tagName: item?.definition,
      };
      tagList.push(tag);
    }
    setTagList(tagList);
    function extractArticles(articleList) {
      let tagList = [];
      for (let item of articleList) {
        let tag = {
          type: item?.type,
          tagName: item?.articleName,
          index: item?.index,
        };
        tagList.push(tag);
        if (item.children) {
          tagList = [...tagList, ...extractArticles()];
        }
      }
      return tagList;
    }
  }, [articleList, variableList]);
  useEffect(() => {
    if (!input) {
      filteredTagList?.length > 0 && setFilteredTagList([]);
    } else {
      let filteredList = tagList.filter((item, index) => {
        return String(item.tagName).includes(input);
      });
      setFilteredTagList(filteredList);
    }
  }, [input]);
  return (
    <PositionToolTip
      onClose={onClose}
      position={position}
      isOpen={isOpen}
      containerRef={editorRef}
    >
      <div className={`${filteredTagList.length > 0 && "min-w-[15rem]"}`}>
        <h2 className="text-sm">INSERT</h2>
        <div
          className={
            "mb-2 mt-1 flex h-[1.6rem] flex-1 items-center gap-2 rounded-lg bg-six px-3"
          }
        >
          <input
            autoComplete="off"
            value={input}
            type="text"
            className={
              "h-[100%] w-full flex-1 bg-six px-3 pl-1 text-sm text-black-txt outline-none "
            }
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        {input ? (
          <ul className="flex h-[15rem] flex-col gap-1 overflow-y-scroll">
            {filteredTagList.map((item, index) => {
              let tagColors = {};
              if (item?.type === tagInsertionType?.SubArticle) {
                tagColors["textColor"] = "text-primary-blue";
                tagColors["bgColor"] = "bg-secondary-blue";
              } else if (item?.type === tagInsertionType?.Variable) {
                tagColors["textColor"] = "text-var";
                tagColors["bgColor"] = "bg-var";
              } else if (item?.type === tagInsertionType?.Article) {
                tagColors["textColor"] = "text-primary-blue";
                tagColors["bgColor"] = "bg-secondary-blue";
              }
              return (
                <li
                  onClick={() => {
                    onClickTag(view, item);
                    onClose();
                  }}
                  key={index}
                  className="group flex min-w-36 cursor-pointer items-center justify-between py-2 hover:bg-six"
                >
                  <div
                    className={`flex items-center gap-2 rounded-md p-1 px-2  ${tagColors.bgColor}`}
                  >
                    {item.type === tagInsertionType.SubArticle ||
                    item.type === tagInsertionType.Variable ? (
                      <RemSizeImage
                        imagePath={
                          item.type === tagInsertionType.SubArticle
                            ? "/assets/icons/docaction/subarticle-gray.svg"
                            : "/assets/icons/docaction/variable-gray.svg"
                        }
                        remWidth={1}
                        remHeight={1}
                        alt={"Indexing"}
                      />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${tagColors?.textColor}`}
                      >
                        Article
                      </span>
                    )}
                    {item.type !== tagInsertionType.Variable && (
                      <span
                        className={`text-sm font-semibold ${tagColors?.textColor}`}
                      >{`${item?.index} -`}</span>
                    )}
                    <span
                      className={`max-w-[10rem] overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold ${tagColors?.textColor}`}
                    >
                      {item?.tagName}
                    </span>
                  </div>
                  {
                    <div className=" invisible ml-10 mr-2 group-hover:visible">
                      <RemSizeImage
                        imagePath="/assets/icons/docaction/tag-select.svg"
                        remHeight={1.2}
                        remWidth={1.2}
                        alt="next"
                        className="-rotate-90:"
                      />
                    </div>
                  }
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="flex w-full flex-col gap-2 text-black-txt">
            <li className=" flex min-w-36 items-center justify-between">
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/indexing.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Article</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li className=" flex min-w-36 items-center justify-between">
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/indexing.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Appendix</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li className=" flex min-w-36 items-center justify-between">
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/Variable.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Variable</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li className=" flex min-w-36 items-center justify-between">
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/definition.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Definition</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
          </ul>
        )}
      </div>
    </PositionToolTip>
  );
};

export default LoganTagsMenu;
