"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tag from "./Tag";
import { useSelector } from "react-redux";
import RemSizeImage from "./RemSizeImage";
import {
  copiedContentType,
  documentType,
  indexingManipulationTypes,
} from "@/constants/enums";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import { useDispatch } from "react-redux";
import { documentAction } from "@/redux/documentSlice";
import { toggleCollapsibleListOpenState } from "@/utils/component-utils";
import OptionButton from "./buttons/OptionButton";
import LoganDropDown from "./LoganDropDown";
import { nanoid } from "nanoid";
import CopyButton from "./buttons/CopyButton";
import ArticleList from "../dashboard/DocumentEditor/documentAction/referenceTool/ArticleList";
import { Button } from "../shadcn-components/ui/button";
import ButtonGroup from "antd/es/button/button-group";

const CollapsibleList = ({
  items,
  isDragAndDrop = false,
  articleAction = undefined,
}) => {
  const appDispatch = useDispatch();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`root-${nanoid()}`} type="item">
        {(provided) => (
          <div
            className="flex flex-col justify-center gap-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <CollapsibleItem
                key={item.id}
                item={item}
                index={index}
                articleAction={articleAction}
                isDragAndDrop={isDragAndDrop}
                level={0}
                articleParentType={item.articleType}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
  // function reorder(list, startIndex, endIndex) {
  //   const [removed] = list.splice(startIndex, 1);
  //   list.splice(endIndex, 0, removed);
  //   return list;
  // }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;
    let sourceItem = null;
    let destinationItem = null;
    let isRoot = false;
    if (source.droppableId === destination.droppableId) {
      const newItems = JSON.parse(JSON.stringify(items));

      if (String(source.droppableId).includes("root-")) {
        sourceItem = newItems[source.index];
        destinationItem = newItems[destination.index];
        isRoot = true;
      } else {
        findDroppableAreaItem(newItems);
      }
      appDispatch(
        documentIndexingAction.setReorderAppendixState({
          sourceItem,
          destinationItem,
          isRoot,
        }),
      );
    }

    function findDroppableAreaItem(items) {
      for (let index = 0; index < items.length; index++) {
        if (items?.[index]?.id === source.droppableId) {
          items?.[index]?.children.forEach((actionItem, index) => {
            source.index === index && (sourceItem = actionItem);
            destination.index === index && (destinationItem = actionItem);
            return;
          });
        } else if (items?.[index]?.children && items) {
          findDroppableAreaItem(items[index].children);
        }
      }
    }

    // const reorderRecursive = (items) => {
    //   items.forEach((item) => {
    //     if (`${item.id}-subitems` === source.droppableId) {
    //       item.children = reorder(
    //         item.children,
    //         source.index,
    //         destination.index,
    //       );
    //     } else if (item.children) {
    //       reorderRecursive(item.children);
    //     }
    //   });
    // };

    // reorderRecursive(newItems);
    // appDispatch(documentIndexingAction.setArticlesList(newItems));
  }
};

const CollapsibleItem = ({
  item,
  index,
  level = 0,
  articleAction,
  isDragAndDrop,
  last = false,
  articleParentType,
  isNextItemInput = false,
}) => {
  const appDispatch = useDispatch();

  const [hovered, setHovered] = useState(false);
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const [articleInputValue, setArticleInputValue] = useState("");
  const [isAddButtonHovered, setisAddButtonHovered] = useState(false);
  // const copiedContent = useSelector(
  //   (state) => state.documentReducer.copiedContent,
  // );
  const { collapsibleListOpenState, articleList } = useSelector(
    (state) => state.documentIndexingReducer,
  );
  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // // Event handler to update cursor position
  // const handleMouseMove = (event) => {
  //   setCursorPosition({ x: event.clientX, y: event.clientY });
  // };
  // useEffect(() => {
  //   if (window !== undefined && copiedContent) {
  //     // copiedContent?.id && window.
  //     window.addEventListener("mousemove", handleMouseMove);
  //   }
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     setCursorPosition({ x: 0, y: 0 });
  //   };
  // }, [copiedContent]);
  // // const toggleOpen = () => setitem?.IsOpen(!item?.isOpen);

  const content = (
    <div
      onMouseEnter={(e) => {
        setHovered(true);
        e.stopPropagation();
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.stopPropagation();
      }}
      className={` ${collapsibleListOpenState?.get(item.id) && level == 0 ? "rounded-lg border " : `relative ${!last ? "border-b" : ""} ${!collapsibleListOpenState.get(item.id) && !item.input ? "py-2" : ""}`}`}
    >
      <div
        onClick={() => {
          item?.children?.length > 0 &&
            toggleCollapsibleListOpenState(
              articleList,
              collapsibleListOpenState,
              item.id,
              appDispatch,
            );
        }}
        className={`group flex items-center justify-between ${collapsibleListOpenState?.get(item.id) ? "border-b py-2" : " bg-white"} ${hovered && !item?.input && !isNextItemInput ? "pb-2" : ""}`}
      >
        <div
          style={{ marginLeft: `${level / 2 + 0.15}rem` }}
          className="flex w-full flex-col justify-between"
        >
          <div className="flex w-full items-center gap-2">
            <RemSizeImage
              className={`ml-1 cursor-pointer py-2  ${collapsibleListOpenState?.get(item.id) ? "rotate-90" : ""}`}
              imagePath={"/assets/icons/docaction/expand-blue.svg"}
              remWidth={0.45}
              remHeight={0.5}
              alt={"Expand"}
            />
            {level === 0 ? (
              <Tag
                textColor="text-white"
                bgColor={
                  articleParentType === "document"
                    ? "bg-primary-blue"
                    : "bg-appendix-1"
                }
              >
                {documentType[item.articleType]}
              </Tag>
            ) : (
              <>
                {level === 1 ? (
                  <Tag
                    textColor={
                      articleParentType === "document"
                        ? "text-primary-blue"
                        : "text-appendix-1"
                    }
                    bgColor={
                      articleParentType === "document"
                        ? "bg-secondary-blue"
                        : "bg-appendix"
                    }
                  >
                    Article
                  </Tag>
                ) : (
                  <div className=" h-[1.498rem]"></div>
                )}
              </>
            )}
            {level > 0 && (
              <div className="flex items-center gap-1 ">
                <RemSizeImage
                  imagePath={`/assets/icons/docaction/${articleParentType === "document" ? "article-icon" : "appendix-icon"}.svg`}
                  remWidth={0.45}
                  remHeight={0.45}
                  alt={"article"}
                />
                <span
                  className={`text-xs ${articleParentType === "document" ? "text-primary-blue" : "text-appendix-1"}`}
                >
                  {item.index}
                </span>
              </div>
            )}

            {item.input ? (
              <div className="mr-3 flex h-fit w-full  items-center justify-between gap-2 py-2">
                <div
                  tabIndex={0}
                  className={
                    "flex h-fit w-[80%] items-center gap-2 rounded-md border-[1px] border-primary-gray   pl-2  pr-1 text-black-txt  focus-within:border-primary-blue"
                  }
                >
                  <input
                    autoComplete="off"
                    onBlur={() => {
                      articleAction(
                        indexingManipulationTypes.DELETEINPUT,
                        item.id,
                        level,
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        articleAction(
                          indexingManipulationTypes.ADDARTICLE,
                          item.id,
                          level,
                          articleInputValue,
                        );
                      }
                    }}
                    placeholder="New Article Name"
                    autoFocus
                    value={articleInputValue}
                    className=" h-[1.5rem] w-[90%] outline-none"
                    onChange={(e) => {
                      setArticleInputValue(e.target.value);
                    }}
                  />
                  {articleInputValue.length > 0 && (
                    <Button
                      size={"xs"}
                      className="px-1"
                      variant="link"
                      onClick={() => {
                        articleAction(
                          indexingManipulationTypes.ADDARTICLE,
                          item.id,
                          level,
                          articleInputValue,
                        );
                      }}
                    >
                      <RemSizeImage
                        imagePath={"/assets/icons/right-tick.svg"}
                        remWidth={0.8}
                        remHeight={1.082}
                        alt={"Send Button"}
                      />
                    </Button>
                  )}
                </div>
                <span
                  className=" cursor-pointer"
                  onClick={() =>
                    articleAction(
                      indexingManipulationTypes.DELETEINPUT,
                      item.id,
                      level,
                    )
                  }
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/cross-icon.svg"}
                    remWidth={0.898}
                    remHeight={1.125}
                    alt={"Close"}
                  />
                </span>
              </div>
            ) : (
              <h3 className=" max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold text-black-txt hover:text-primary-blue">
                {item.title}
              </h3>
            )}
            {!item.input && (
              <span
                className={`rounded-md bg-six px-[0.313rem] py-[0.063rem] ${item?.children?.length > 0 ? "text-primary-blue" : "text-primary-gray"}`}
              >
                {item?.children?.length || 0}
              </span>
            )}
          </div>
          {articleAction &&
            !collapsibleListOpenState.get(item.id) &&
            !item.input &&
            !isNextItemInput && (
              <div
                className={`invisible absolute  -bottom-[.635rem] left-0  right-0 flex w-full  items-center bg-white group-hover:visible`}
              >
                <span
                  className={`h-[1px] flex-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
                ></span>
                <button
                  onMouseEnter={() => {
                    setisAddButtonHovered(true);
                  }}
                  onMouseLeave={() => {
                    setisAddButtonHovered(false);
                  }}
                  className={`mx-3 rounded-md  px-5 py-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
                  onClick={(e) => {
                    articleAction(
                      indexingManipulationTypes.ADDITEM,
                      item.id,
                      level,
                    );
                    e.stopPropagation();
                  }}
                >
                  <RemSizeImage
                    imagePath={`/assets/icons/add-${isAddButtonHovered ? "white" : "blue"}-outline.svg`}
                    remWidth={0.65}
                    remHeight={1.125}
                    alt={"add"}
                  />
                </button>
                <span
                  className={`h-[1px] flex-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
                ></span>
              </div>
            )}
        </div>
        {!item.input &&
          (level > 0 || (level == 0 && articleParentType !== "document")) && (
            <div className="mr-2 flex items-center gap-2">
              <CopyButton
                className="hidden group-hover:flex"
                onClick={(e) => {
                  appDispatch(
                    documentAction.setCopiedContent({
                      title: item.title,
                      index: item.index,
                      id: item.id,
                      type: item.articleType || item.type,
                    }),
                  );
                  e.stopPropagation();
                }}
              />
              {/* <button
                onClick={(e) => {
                  appDispatch(
                    documentAction.setCopiedContent({
                      title: item.title,
                      index: item.index,
                      id: item.id,
                      type: item.articleType || item.type,
                    }),
                  );
                  e.stopPropagation();
                }}
                className={`h-full w-[3.313rem] cursor-pointer items-center justify-center rounded-md bg-secondary-blue py-[0.15rem] text-xs font-medium text-primary-blue ${hovered ? "visible" : "invisible"} `}
              >
                Copy
              </button> */}
              <LoganDropDown
                placement="bottomRight"
                trigger={"click"}
                baseElement={
                  <Button
                    size="icon"
                    variant={"link"}
                    className="p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <OptionButton />
                  </Button>
                }
                customDropDownMenu={({ closeMenu }) => (
                  <ul className="text-md rounded-xl bg-white p-1 shadow-out-lg">
                    <li
                      onClick={() => {
                        //delete itme logic
                        articleAction("delete", item.id, level);
                        closeMenu();
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-lg p-2 py-1 pr-4 hover:bg-five hover:text-primary-blue"
                    >
                      <RemSizeImage
                        imagePath={"/assets/icons/delete-outline.svg"}
                        remWidth={0.9}
                        remHeight={0.9}
                        alt={"delete"}
                      />
                      <span className=" font-medium text-black-txt">
                        Delete
                      </span>
                    </li>
                  </ul>
                )}
              />
            </div>
          )}
      </div>
      {collapsibleListOpenState?.get(item.id) && item.children && (
        <Droppable droppableId={`${item.id}`} type={`subitem-${level}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {item?.children.map((child, index) => (
                <CollapsibleItem
                  key={child.id}
                  item={child}
                  index={index}
                  level={level + 1}
                  articleAction={articleAction}
                  isDragAndDrop={isDragAndDrop}
                  last={item?.children?.length === index + 1}
                  isNextItemInput={
                    item.children[index + 1]?.input ? true : false
                  }
                  articleParentType={articleParentType}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );

  return (
    <>
      {/* {copiedContent?.content && (
        <div
          style={{
            left: cursorPosition.x + 5 + "px",
            top: cursorPosition.y + "px",
          }}
          className={`fixed flex items-center gap-2 rounded-md border-[2px] border-dotted ${copiedContent.type === copiedContentType.Appendix ? "border-appendix-1 text-appendix-1" : " border-primary-blue text-primary-blue"}  p-1 `}
        >
          <RemSizeImage
            imagePath={`/assets/icons/${copiedContent.type === copiedContentType.Appendix ? "paste-appendix" : "paste-icon"}.svg`}
            remWidth={1.2}
            remHeight={1.2}
            alt={"Paste"}
          />
          <div className="ml-1 flex items-center gap-2 text-sm font-semibold ">
            <div className="flex items-center">
              <RemSizeImage
                className={"mr-1"}
                imagePath={`/assets/icons/docaction/${copiedContent.type === copiedContentType.Appendix ? "appendix" : "article-icon"}.svg`}
                remWidth={0.5}
                remHeight={0.5}
                alt={"article"}
              />
              {copiedContent.type === copiedContentType.Appendix
                ? `Appendix ${copiedContent?.content?.index} -`
                : "Article -"}
            </div>
            <span>{copiedContent?.content?.title}</span>
          </div>
        </div>
      )} */}
      {isDragAndDrop && articleAction ? (
        <Draggable draggableId={item?.id?.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${snapshot.isDragging ? "bg-gray-100" : ""}`}
            >
              {content}
            </div>
          )}
        </Draggable>
      ) : (
        <div>{content}</div>
      )}
    </>
  );
};

export default CollapsibleList;
