"use client";
import { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ToolBar from "./ToolBar";
import Tag from "@/components/generic/Tag";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  copiedContentType,
  documentActions,
  tagInsertionType,
} from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import { nanoid } from "nanoid";

import {
  getDocumentContentByVersionIdUrl,
  getDocumentDataUrl,
} from "@/api/serviceUrl";
import {
  getDocumentContentByVersionId,
  getDocumentData,
  getDocumentVariables,
  updateDocumentVersionContent,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import { useParams } from "next/navigation";
import { classIdSpan } from "./extensions/classIdSpan";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import ArticleDeleteConfirmationModal from "./ArticleDeleteConfirmationModal";
import { classIdDiv } from "./extensions/classIdDiv";
import { findNodePosFromNode } from "@/utils/dashboard/editor-utils";
import { flattenArray, getUserColor } from "@/utils/generic";
import { CustomHeading } from "./extensions/heading";
import ArticleExtention from "./plugins/article";
import StoreCursorPositionExtension from "./extensions/storeCursorPositionExtension";

import CustomListItem from "./extensions/listItem";
import ArticleMenu from "./ArticleMenu";
import ArticleInsertion from "./plugins/artcleInsertion";
import BackSlashAction from "./plugins/backSlashAction";
import { documentVariableAction } from "@/redux/editor/documentVariableSlice";
import { customParagraph } from "./extensions/paragraph";
import { createCollapsibleListOpenState } from "@/utils/component-utils";
import Collaboration from "@tiptap/extension-collaboration";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
// import { FontSize } from "./marks/fontStyle";
import CommentExtension from "./extensions/comments";

import { useUserDetails } from "@/hooks";
import LoganTagsMenu from "./LoganTagsMenu";
import { cn } from "@/utils/shadcn-utils";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import CopiedTag from "@/components/generic/CopiedTag";
import { commentsAction } from "@/redux/editor/commentsSlice";

const doc = new Y.Doc();
const initialArticleInsertionState = {
  isOpen: false,
  menuItems: [],
  pos: null,
  tooltipActive: false,
};
const initialTagInsertionState = {
  isOpen: false,
  pos: null,
  onClickTag: null,
  tooltipActive: false,
};
const TiptapEditor = () => {
  const { docId } = useParams();
  const editorRef = useRef();
  const { first_name = "", last_name = "" } = useUserDetails() || {};
  const appDispatch = useDispatch();
  const textInsertRef = useRef(false);
  const [openArticleDeleteConfirmModal, setOpenArticleDeleteConfirmModal] =
    useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  useState(false);
  const {
    currentDocumentVersion,
    activeDocumentVersion,
    selectedDocumentVersion,
  } = useSelector((state) => state.documentVersioningReducer, shallowEqual);
  const { currentEditVariable } = useSelector(
    (state) => state.documentVariableReducer,
    shallowEqual,
  );
  const {
    articleList,
    newAppendixState,
    reorderAppendixState,
    collapsibleListOpenState,
    deleteAppendixState,
  } = useSelector((state) => state.documentIndexingReducer, shallowEqual);
  const {
    copiedContent,
    activeDocumentAction,
    currentDocument,
    isEditorToolHidden,
    toolbar,
  } = useSelector((state) => state.documentReducer, shallowEqual);
  const { isAddCommentModalOpen, selectedTextPosition, isTextSelected } =
    useSelector((state) => state.commentsReducer);

  const [articleInsertionState, setArticleInsertionState] = useState(
    initialArticleInsertionState,
  );
  const [tagInsertionState, setTagInsertionState] = useState(
    initialTagInsertionState,
  );

  const debouncedUpdateContent =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(
      debounce((content, docId, versionId) => {
        updateDocumentVersionContent({
          document_id: docId,
          version_id: versionId,
          content: content,
        });
      }, 3000),
      [],
    );

  const provider = useMemo(() => {
    return new TiptapCollabProvider({
      name: docId,
      baseUrl: "ws://localhost:1234/collaboration/",
      // token: "notoken", // Your JWT token
      document: doc,
    });
  }, [docId]);

  const editor = useEditor(
    {
      extensions: [
        StoreCursorPositionExtension,
        // FontSize,
        StarterKit.configure({
          heading: false, // Disable the default heading extension
          paragraph: false,
        }),
        FontFamily,
        Collaboration.configure({
          document: doc,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: `${first_name} ${last_name}`,
            color: getUserColor(`${first_name} ${last_name}`),
          },
        }),
        CommentExtension.configure({
          handleClick: (commentId, color) => {
            console.log("In TiptapEditor Comments handleClick");
            console.log(commentId, color);
          },
        }),
        ArticleInsertion.configure({
          openArticleInsertionMenu: (menuItems, pos) => {
            setArticleInsertionState({
              isOpen: true,
              menuItems: menuItems,
              pos: pos,
              tooltipActive: false,
            });
          },
        }),
        BackSlashAction.configure({
          openBackSlashActionModal: (pos, onClickItem) => {
            setTagInsertionState({
              isOpen: true,
              onClickTag: onClickItem,
              tooltipActive: false,
              pos: pos,
            });
          },
        }),
        customParagraph,
        CustomHeading.configure({
          levels: [1, 2, 3, 4, 5, 6], // Support for heading levels 1 to 6
        }),
        ArticleExtention.configure({
          updateArticles: (articles) => {
            appDispatch(documentIndexingAction.setArticlesList(articles));
          },
        }),
        ,
        CustomListItem,
        Underline,
        classIdDiv,
        classIdSpan.configure({
          openModal: (node) => {
            setNodeToDelete(node);
            setOpenArticleDeleteConfirmModal(true);
          },
        }),
        CommentExtension,
      ],
      injectCSS: true,
      autofocus: true,
      editorProps: {
        // handleClick: (view, pos, event) => handleOnClickEditor(editor, pos),
      },
      onSelectionUpdate: handleSelection,
      onUpdate: handleChange,
    },
    [],
  );

  useEffect(() => {
    if (!editor) return;

    const updateSelectionState = () => {
      const { from, to } = editor.state.selection;
      const { view } = editor;

      const start = view.coordsAtPos(from);
      appDispatch(
        commentsAction.setSelectedTextPosition({
          top: start.top,
          left: start.left,
          isTextSelected: from !== to,
        }),
      );
    };

    // Listen to selection changes
    editor.on("selectionUpdate", updateSelectionState);

    // Cleanup the listener on unmount
    return () => {
      editor.off("selectionUpdate", updateSelectionState);
    };
  }, [editor]);

  useEffect(() => {
    editor && fetchDocumentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    currentDocumentVersion?.id &&
      currentDocumentVersion?.version_id &&
      fetchDocumentVariables();
  }, [currentDocumentVersion?.id, currentDocumentVersion?.version_id]);

  useEffect(() => {
    activeDocumentAction === documentActions.Preview ||
    activeDocumentAction === documentActions.VersionHistory
      ? editor?.setEditable(false)
      : editor?.setEditable(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentAction]);

  useEffect(() => {
    if (activeDocumentVersion) {
      if (
        activeDocumentAction === documentActions.VersionHistory ||
        (activeDocumentAction !== documentActions.VersionHistory &&
          activeDocumentVersion.is_auto_saved !== null)
      ) {
        editor.getHTML() !== activeDocumentVersion?.docContent &&
          setEditorContent(activeDocumentVersion?.docContent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentVersion]);

  useEffect(() => {
    if (currentDocumentVersion) {
      if (
        selectedDocumentVersion === null ||
        selectedDocumentVersion?.version_id !==
          currentDocumentVersion?.version_id
      ) {
        editor?.getHTML() !== currentDocumentVersion?.docContent &&
          setEditorContent(currentDocumentVersion?.docContent);
        appDispatch(
          documentVersioningAction.setDocumentVersion({
            activeDocumentVersion: {
              ...currentDocumentVersion,
            },
            selectedDocumentVersion: {
              ...currentDocumentVersion,
            },
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentAction, currentDocumentVersion]);

  useEffect(() => {
    copiedContent !== null && (textInsertRef.current = true);
  }, [copiedContent]);

  useEffect(() => {
    if (newAppendixState?.content && newAppendixState?.id) {
      const { doc } = editor.state;
      let foundNode = null;
      let nextAppendixPos = doc.content.size;
      if (
        newAppendixState.additionItemType === tagInsertionType.Article ||
        newAppendixState.additionItemType === tagInsertionType.SubArticle
      ) {
        doc.descendants((node, pos) => {
          if (node?.attrs?.id === newAppendixState?.id) {
            let foundNodeResolvePos = doc.resolve(pos);
            let insertionPos = pos + foundNodeResolvePos.nodeAfter.nodeSize;
            let insertionContent = "";
            if (
              newAppendixState.additionItemType === tagInsertionType.Article
            ) {
              insertionContent = `<div class="doc-article" id=${nanoid()}><h2 class="article-heading" id=${nanoid()}>${newAppendixState.content}</h2></div>`;
            } else if (
              newAppendixState.additionItemType === tagInsertionType.SubArticle
            ) {
              insertionContent = `<li id=${nanoid()}><p>${newAppendixState.content}<p></li>`;
            }
            editor
              .chain()
              .focus()
              .insertContentAt(insertionPos, insertionContent)
              .run();
          }
        });
        appDispatch(documentIndexingAction.resetNewAppendixState());
        return;
      }
      doc.descendants((node, pos) => {
        if (node.attrs.id === newAppendixState?.id) {
          foundNode = node;
        } else if (foundNode && node.attrs.class == "appendix-separator") {
          nextAppendixPos = pos;
        }
      });
      if (foundNode === null) {
        doc.forEach((node, offset) => {
          if (
            node.attrs.class == "appendix-separator" &&
            nextAppendixPos == doc.content.size
          ) {
            nextAppendixPos = offset;
          }
        });
      }
      editor.commands.insertContentAt(
        nextAppendixPos,
        newAppendixState?.content,
      );
      editor.commands.setNodeSelection(nextAppendixPos);

      editor.commands.scrollIntoView();
      appDispatch(documentIndexingAction.resetNewAppendixState());
    }
  }, [newAppendixState]);
  useEffect(() => {
    if (deleteAppendixState?.id) {
      const { doc } = editor.state;
      let foundNode = null;
      let deletionNodeEndPos = doc.content.size;
      let deletionNodeStartPos = doc.content.size;
      if (
        deleteAppendixState.additionItemType === tagInsertionType.Article ||
        deleteAppendixState.additionItemType === tagInsertionType.SubArticle
      ) {
        doc.descendants((node, pos) => {
          if (node?.attrs?.id === newAppendixState?.id) {
            editor.chain().focus().setNodeSelection(pos).deleteNode().run();
          }
        });
        appDispatch(documentIndexingAction.resetNewAppendixState());
        return;
      }
      doc.descendants((node, pos) => {
        if (
          node.attrs.id === deleteAppendixState?.id &&
          node.attrs.class == "appendix-separator"
        ) {
          foundNode = node;
          deletionNodeStartPos = pos;
        } else if (foundNode && node.attrs.class == "appendix-separator") {
          deletionNodeEndPos = pos;
        } else if (node.attrs.id === deleteAppendixState?.id) {
          deletionNodeStartPos = pos;
          deletionNodeEndPos = pos + node.nodeSize;
        }
      });

      editor.commands.deleteRange({
        from: deletionNodeStartPos,
        to: deletionNodeEndPos,
      });
      appDispatch(documentIndexingAction.setDeleteAppendixState(null));
    }
  }, [deleteAppendixState]);

  useEffect(() => {
    if (
      reorderAppendixState?.sourceItem?.id &&
      reorderAppendixState?.destinationItem?.id
    ) {
      const { doc } = editor.state;
      let foundSourceNode = null;
      let foundDestinationNode = null;
      let sourceReorderStartPos = doc.content.size;
      let sourceReorderEndPos = doc.content.size;
      let destinationReorderStartPos = doc.content.size;
      let destinationReorderEndPos = doc.content.size;
      let pos = doc.content.size;
      if (reorderAppendixState.isRoot) {
        doc.forEach((node, offset) => {
          pos = offset;
          if (node.attrs.id === reorderAppendixState?.sourceItem?.id) {
            foundSourceNode = node;
            sourceReorderStartPos = pos;
            if (
              foundDestinationNode &&
              destinationReorderEndPos == doc.content.size
            ) {
              destinationReorderEndPos = pos;
            }
          } else if (
            node.attrs.id === reorderAppendixState?.destinationItem?.id
          ) {
            foundDestinationNode = node;
            destinationReorderStartPos = pos;
            if (foundSourceNode && sourceReorderEndPos == doc.content.size) {
              sourceReorderEndPos = pos;
            }
          } else if (
            foundSourceNode &&
            node.attrs.class == "appendix-seprator" &&
            sourceReorderEndPos == doc.content.size
          ) {
            sourceReorderEndPos = pos;
          } else if (
            foundDestinationNode &&
            node.attrs.class == "appendix-seprator" &&
            destinationReorderEndPos == doc.content.size
          ) {
            destinationReorderEndPos = pos;
          }
        });
      } else {
        doc.descendants((node, pos) => {
          if (node?.attrs.id === reorderAppendixState?.sourceItem?.id) {
            sourceReorderStartPos = pos;
            sourceReorderEndPos = pos + node.nodeSize;
          }
          if (node?.attrs.id === reorderAppendixState?.destinationItem?.id) {
            destinationReorderStartPos = pos;
            destinationReorderEndPos = pos + node.nodeSize;
          }
        });
      }

      const insertionPosition =
        reorderAppendixState?.sourceItem?.index <
        reorderAppendixState?.destinationItem.index
          ? destinationReorderEndPos
          : destinationReorderStartPos;

      editor.commands.cut(
        { from: sourceReorderStartPos, to: sourceReorderEndPos },
        insertionPosition,
      );
      appDispatch(documentIndexingAction.setReorderAppendixState(null));
    }
  }, [reorderAppendixState]);

  useEffect(() => {
    if (
      (collapsibleListOpenState === null && articleList?.length > 0) ||
      flattenArray(articleList).length !==
        flattenArray(collapsibleListOpenState)?.length
    ) {
      createCollapsibleListOpenState(
        articleList,
        appDispatch,
        collapsibleListOpenState,
      );
    }
  }, [articleList]);

  useEffect(() => {
    if (editor && currentEditVariable?.previousDefinition) {
      editor.commands.replaceTextInNodeWithClassAndValue(
        currentEditVariable?.previousDefinition,
        currentEditVariable?.currentDefinition,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditVariable]);

  return (
    <div className="logan-tiptap  h-full w-full">
      {<CopiedTag />}
      <ToolBar editor={editor} />
      {openArticleDeleteConfirmModal && (
        <ArticleDeleteConfirmationModal
          open={openArticleDeleteConfirmModal}
          onConfirm={confirmDeletion}
          onClose={cancelDeletion}
        />
      )}
      <div
        className={cn(
          " flex h-[calc(100%-3rem)] w-full flex-col items-center justify-center overflow-y-hidden overflow-x-scroll p-1 pr-3",
        )}
      >
        <div
          className={`mt-1   flex w-[40.5rem] items-center  gap-2`}
          style={{ zoom: `${toolbar.zoom || 100}%` }}
        >
          <Tag textColor={"text-primary-blue"} bgColor={"bg-secondary-blue"}>
            Document
          </Tag>

          <h2
            className={`text-lg font-semibold text-black-txt ${currentDocument?.document_name ? "" : "invisible"}`}
          >
            {currentDocument?.document_name}
          </h2>
          {/* <span className="text-xs">28 Pages</span> */}
        </div>

        <div
          ref={editorRef}
          className={cn(
            `relative z-0 my-2 h-full w-[40.5rem]  overflow-y-scroll bg-white  transition-all`,
            (tagInsertionState?.isOpen || articleInsertionState?.isOpen) &&
              "overflow-y-hidden",
          )}
          style={{ zoom: `${toolbar.zoom || 100}%` }}
        >
          {articleInsertionState?.isOpen && (
            <ArticleMenu
              editorRef={editorRef.current}
              items={articleInsertionState?.menuItems}
              isOpen={articleInsertionState?.isOpen}
              onClose={() => {
                setArticleInsertionState(initialArticleInsertionState);
              }}
              position={articleInsertionState?.pos}
              view={editor.view}
            />
          )}
          {tagInsertionState?.isOpen && (
            <LoganTagsMenu
              editorRef={editorRef.current}
              onClickTag={tagInsertionState?.onClickTag}
              isOpen={tagInsertionState?.isOpen}
              onClose={() => {
                setTagInsertionState(initialTagInsertionState);
              }}
              position={tagInsertionState?.pos}
              view={editor.view}
            />
          )}
          {activeDocumentVersion && (
            <EditorContent
              editor={editor}
              className={cn(
                `flex min-h-full w-full flex-col border-[0.125rem] px-10 py-2`,
                activeDocumentAction !== documentActions.VersionHistory &&
                  editor?.isFocused &&
                  "border-primary-blue",
                editor &&
                  activeDocumentVersion?.is_auto_saved === true &&
                  "auto-save",
                activeDocumentVersion?.is_auto_saved === false && "save",
              )}
            />
          )}
        </div>
      </div>
    </div>
  );

  async function fetchDocumentData() {
    const res = await getDocumentData(`${getDocumentDataUrl}/${docId}`);
    if (res?.id) {
      appDispatch(documentAction.setCurrentDocument(res));
      const verRes = await getDocumentContentByVersionId(
        `${getDocumentContentByVersionIdUrl}${res?.id}/${res?.current_version?.version_id}`,
      );
      if ((verRes, verRes?.content_details?.content)) {
        appDispatch(
          documentVersioningAction.setDocumentVersion({
            currentDocumentVersion: {
              ...verRes,
              docContent: verRes?.content_details?.content,
              // '<h1>Rental Agreement</h1><hr size="1"/><p>This Rental Agreement ("Agreement") is made and entered into this day by and between <span id="landlord" class="doc-variable">Anuj</span> ("Landlord") and <span id="tenant" class="doc-variable">Ankit</span> ("Tenant"). The premises subject to this Agreement is located at the address specified herein under the laws of the <span id="state" class="doc-variable">United States</span>.</p><div class="doc-article"><h2 id="a1f97861-4814-4e7f-a187-f09305c429ea">Premises</h2><p id="afbae19a-5b70-455f-91f0-0e5cff40d61a">The Landlord hereby leases to the Tenant the residential premises described as <span id="property_address" class="doc-variable">[Insert Address Here]</span> ("the Premises"). The Premises are to be occupied strictly as a private dwelling by the Tenant and their immediate family and for no other purpose without prior written consent of the Landlord.</p></div><div class="doc-article"><h2 id="8bbc0b2f-f47a-455b-a3c1-6e25803efc5d">Term of Lease</h2><p id="364e80bc-cafc-48ce-8ac2-68dceeb94467">The rental term shall commence on <span id="start_date" class="doc-variable">[Start Date]</span> and shall expire on <span id="end_date" class="doc-variable">[End Date]</span> with the right to renew under mutual agreement.</p></div><div class="doc-article"><h2 id="083a261c-9a93-4cd6-82c8-0366a304eb40">Rental Payments</h2><p id="15a8bbfc-8a2d-4b2e-8b80-c7987da8df09">The Tenant agrees to pay the Landlord [Insert Rent Amount] payable on the 1st day of each calendar month. The first and last month\'s rent will be due prior to occupancy. Late payment will attract a charge of [Specify Charges] if not paid within [Specify Days] days of due date.</p></div><div class="doc-article"><h2 id="fb807988-4b97-4039-a562-20c00f97b970">Utilities and Services</h2><p id="39c550f2-b8ed-4827-95f7-d3a12d11a03d">The Tenant will be responsible for the payment of utilities including, but not limited to, electricity, gas, water, internet, telephone, and garbage collection associated with the Premises.</p></div><div class="doc-article"><h2 id="0eec5313-c55a-4621-b0b1-c35b339e4715">Security Deposit</h2><p id="40702ed3-1022-43a9-b728-470d800c0ae9">The Tenant shall deposit with the Landlord, the sum of [Specify Amount] as security for performance of all Tenant obligations under this Agreement. The Security Deposit will be returned to Tenant within [Specify Days] days of the expiration of this Lease after deducting damages and other dues, if any.</p></div><div class="doc-article"><h2 id="3daeca42-b459-4b53-87c5-f7d542e04eb8">Maintenance and Repairs</h2><p id="e1f65da8-b049-429b-9324-6dc960aab8da">The Tenant shall maintain the premises in a clean, orderly, and compliant state and shall not make any alterations to the premises without the prior written consent of the Landlord. The Landlord shall be responsible for repairs to the structural elements of the Premises.</p></div><div class="doc-article"><h2 id="e0e85b02-c01f-4908-b3d3-913abf25e18b">Right of Inspection</h2><p id="67ba6145-316b-4437-ba89-cdf1aac45874">The Landlord shall have the right to inspect the premises during reasonable hours to ensure maintenance and observe the Tenant’s compliance with this Agreement.</p></div><div class="doc-article"><h2 id="33d73fae-d8f2-49dd-a26d-0558a854a0d4">Governing Law</h2><p id="55381d61-afee-4440-8b8f-d4b828984784">This Agreement shall be governed by and construed in accordance with the laws of the <span id="state" class="doc-variable">United States</span> applicable in the state in which the Premises is located.</p></div><div class="doc-article"><h2 id="d6f5df52-37c5-4e9a-a635-39dfd0ab6d47">Entire Agreement</h2><p id="7562333b-ffee-4471-9c23-83b90ab1b44c">This document constitutes the entire agreement between the parties. Any prior understanding or representation of any kind preceding the date of this agreement shall not be binding on either party except to the extent incorporated in this Agreement.</p></div><div class="doc-article"><h2 id="dec6f91b-72dc-4d4d-b6ff-21d3e8b0a42e">Signatures</h2><p id="2a558caa-52d6-46b9-a36d-e25df78bb39a">Both parties hereby signify their agreement to the terms above by their signatures affixed below:</p><p id="845f3a9d-a03a-49ee-a32b-adc2453bc5f5">Landlord: __________________________ Date: _________</p><p id="1241769d-5c7b-4e64-be24-1a8cd6ab5cfe">Tenant: ___________________________ Date: _________</p></div>',
            },
          }),
        );
        setEditorContent(
          verRes?.content_details?.content,
          // '<h1>Rental Agreement</h1><hr size="1"/><p>This Rental Agreement ("Agreement") is made and entered into this day by and between <span id="landlord" class="doc-variable">Anuj</span> ("Landlord") and <span id="tenant" class="doc-variable">Ankit</span> ("Tenant"). The premises subject to this Agreement is located at the address specified herein under the laws of the <span id="state" class="doc-variable">United States</span>.</p><div class="doc-article"><h2 id="a1f97861-4814-4e7f-a187-f09305c429ea">Premises</h2><p id="afbae19a-5b70-455f-91f0-0e5cff40d61a">The Landlord hereby leases to the Tenant the residential premises described as <span id="property_address" class="doc-variable">[Insert Address Here]</span> ("the Premises"). The Premises are to be occupied strictly as a private dwelling by the Tenant and their immediate family and for no other purpose without prior written consent of the Landlord.</p></div><div class="doc-article"><h2 id="8bbc0b2f-f47a-455b-a3c1-6e25803efc5d">Term of Lease</h2><p id="364e80bc-cafc-48ce-8ac2-68dceeb94467">The rental term shall commence on <span id="start_date" class="doc-variable">[Start Date]</span> and shall expire on <span id="end_date" class="doc-variable">[End Date]</span> with the right to renew under mutual agreement.</p></div><div class="doc-article"><h2 id="083a261c-9a93-4cd6-82c8-0366a304eb40">Rental Payments</h2><p id="15a8bbfc-8a2d-4b2e-8b80-c7987da8df09">The Tenant agrees to pay the Landlord [Insert Rent Amount] payable on the 1st day of each calendar month. The first and last month\'s rent will be due prior to occupancy. Late payment will attract a charge of [Specify Charges] if not paid within [Specify Days] days of due date.</p></div><div class="doc-article"><h2 id="fb807988-4b97-4039-a562-20c00f97b970">Utilities and Services</h2><p id="39c550f2-b8ed-4827-95f7-d3a12d11a03d">The Tenant will be responsible for the payment of utilities including, but not limited to, electricity, gas, water, internet, telephone, and garbage collection associated with the Premises.</p></div><div class="doc-article"><h2 id="0eec5313-c55a-4621-b0b1-c35b339e4715">Security Deposit</h2><p id="40702ed3-1022-43a9-b728-470d800c0ae9">The Tenant shall deposit with the Landlord, the sum of [Specify Amount] as security for performance of all Tenant obligations under this Agreement. The Security Deposit will be returned to Tenant within [Specify Days] days of the expiration of this Lease after deducting damages and other dues, if any.</p></div><div class="doc-article"><h2 id="3daeca42-b459-4b53-87c5-f7d542e04eb8">Maintenance and Repairs</h2><p id="e1f65da8-b049-429b-9324-6dc960aab8da">The Tenant shall maintain the premises in a clean, orderly, and compliant state and shall not make any alterations to the premises without the prior written consent of the Landlord. The Landlord shall be responsible for repairs to the structural elements of the Premises.</p></div><div class="doc-article"><h2 id="e0e85b02-c01f-4908-b3d3-913abf25e18b">Right of Inspection</h2><p id="67ba6145-316b-4437-ba89-cdf1aac45874">The Landlord shall have the right to inspect the premises during reasonable hours to ensure maintenance and observe the Tenant’s compliance with this Agreement.</p></div><div class="doc-article"><h2 id="33d73fae-d8f2-49dd-a26d-0558a854a0d4">Governing Law</h2><p id="55381d61-afee-4440-8b8f-d4b828984784">This Agreement shall be governed by and construed in accordance with the laws of the <span id="state" class="doc-variable">United States</span> applicable in the state in which the Premises is located.</p></div><div class="doc-article"><h2 id="d6f5df52-37c5-4e9a-a635-39dfd0ab6d47">Entire Agreement</h2><p id="7562333b-ffee-4471-9c23-83b90ab1b44c">This document constitutes the entire agreement between the parties. Any prior understanding or representation of any kind preceding the date of this agreement shall not be binding on either party except to the extent incorporated in this Agreement.</p></div><div class="doc-article"><h2 id="dec6f91b-72dc-4d4d-b6ff-21d3e8b0a42e">Signatures</h2><p id="2a558caa-52d6-46b9-a36d-e25df78bb39a">Both parties hereby signify their agreement to the terms above by their signatures affixed below:</p><p id="845f3a9d-a03a-49ee-a32b-adc2453bc5f5">Landlord: __________________________ Date: _________</p><p id="1241769d-5c7b-4e64-be24-1a8cd6ab5cfe">Tenant: ___________________________ Date: _________</p></div>',
        );
        // extractArticles(editor.getJSON());
      }
    }
  }

  async function fetchDocumentVariables() {
    let { data } = await getDocumentVariables({
      documentId: currentDocumentVersion?.id,
      documentVersionId: currentDocumentVersion?.version_id,
    });
    data?.length > 0
      ? appDispatch(documentVariableAction.setVariableList(data))
      : appDispatch(documentVariableAction.setVariableList([]));
  }

  function handleSelection({ editor, transaction }) {
    let pos = transaction?.curSelection?.from;
    if (copiedContent && textInsertRef.current === true) {
      textInsertRef.current = false;
      if (
        copiedContent.type === copiedContentType.Variable ||
        copiedContent.type === copiedContentType.Company
      ) {
        debugger;
        const textContent = copiedContent?.title;
        editor.commands.insertContentAt(
          Number(pos),
          `<span  class="doc-variable" >${textContent}</span>`,
          { updateSelection: true },
        );
      } else {
        editor.commands.insertContentAt(
          Number(pos),
          `<span data-key=${copiedContent?.id} class=${copiedContent.type === copiedContentType.Appendix ? "doc-appendix-tag" : "doc-article-tag"}>${copiedContent.type === copiedContentType.Appendix ? "Appendix" : "Article"} ${copiedContent?.index} - ${copiedContent?.title}</span>`,
          { updateSelection: true },
        );
      }

      appDispatch(documentAction.setCopiedContent(null));
    }
  }

  function setEditorContent(content) {
    editor?.commands.setContent(content);
    // editor?.commands.setContent(
    //   '<h1 style="text-align: center">Non-Disclosure Agreement (NDA)</h1><hr><div class="doc-article" id="e4ef1a6b-e020-4a44-8acb-4a22dd6c3b99"><h2 class="article-heading" id="4f91925f-61c2-45d1-a570-fcb445017034"><span class="doc-article-title" contenteditable="false">Article 1 - </span>Parties</h2><p>This Non-Disclosure Agreement (the "Agreement") is entered into as of [Insert Date] by and between [Party A Name], with its principal office located at [Party A Address] (the "Disclosing Party"), and [Party B Name], with its principal office located at [Party B Address] (the "Receiving Party"). Both parties may be referred to individually as a "Party" or collectively as the "Parties."</p><ul><li id="9fcc0d1f-0595-4784-9cce-8e59f2b217fd" data-index="1.1"><p><strong>one.one: </strong></p><ul><li id="67d689c4-fe01-4892-bca3-91c15e846a93" data-index="1.1.1"><p><strong>one.one.oen: </strong></p><ul><li id="6bc6cb8b-4c5d-486b-83ab-043413ca68d1" data-index="1.1.1.1"><p><strong>one.one......: </strong></p></li></ul></li></ul></li></ul></div><div class="doc-article" id="35fb68e6-a1ac-4c35-832d-acd8d48a03df"><h2 class="article-heading" id="102447dd-efcc-4539-85c0-fea22634117f"><span class="doc-article-title" contenteditable="false">Article 2 - </span>Definition of Confidential Information</h2><p>For purposes of this Agreement, "Confidential Information" includes but is not limited to all information, whether verbal, electronic, written, or in any other form, which is disclosed by the Disclosing Party to the Receiving Party, including but not limited to business strategies, technical processes, software, and designs.</p></div><div class="doc-article" id="acaedbd3-8706-4144-9bad-92c444472e34"><h2 class="article-heading" id="0d74e99d-b892-4511-b3de-f4ac2acff5e1"><span class="doc-article-title" contenteditable="false">Article 3 - </span>Obligations of Receiving Party</h2><p>The Receiving Party agrees to: (i) maintain the confidentiality of the Confidential Information; (ii) refrain from disclosing such Confidential Information to any third party without prior written consent from the Disclosing Party; (iii) use such Confidential Information solely to evaluate or pursue a business relationship with the Disclosing Party; (iv) safeguard the Confidential Information from unauthorized use, disclosure, or theft.</p></div><div class="doc-article" id="106522d5-0033-418c-8042-3b7709fd0493"><h2 class="article-heading" id="e6adc5dc-4e1e-4c7b-90a4-bbb272c4ef14"><span class="doc-article-title" contenteditable="false">Article 4 - </span>Exclusions from Confidential Information</h2><p>Confidential Information does not include information that: (a) was publicly known prior to the time of disclosure by the Disclosing Party; (b) becomes publicly known after disclosure, other than as a result of a breach of this Agreement by the Receiving Party; (c) is independently developed by the Receiving Party without use of or reference to the Disclosing Party\'s Confidential Information.</p></div><div class="doc-article" id="6b2b977d-155b-4056-a732-6dfcfcf7fa72"><h2 class="article-heading" id="eb0e1552-64f3-40d9-b436-51ecfa37ec32"><span class="doc-article-title" contenteditable="false">Article 5 - </span>Term</h2><p>The obligations of this Agreement shall commence on the date of this Agreement and shall continue indefinitely until the Confidential Information no longer qualifies as confidential.</p></div><div class="doc-article" id="9da5e093-5384-4a1c-82d2-f1f80624dcf8"><h2 class="article-heading" id="a25a9669-a6c9-4b61-af8c-3c3886881b37"><span class="doc-article-title" contenteditable="false">Article 6 - </span>Return of Materials</h2><p>Upon termination of this Agreement, the Receiving Party agrees to return all materials containing Confidential Information to the Disclosing Party or to destroy all such materials and certify the destruction to the Disclosing Party, at the Disclosing Party\'s option.</p></div><div class="doc-article" id="45343877-79f1-4d10-be0c-d92954cf06b5"><h2 class="article-heading" id="855b9adf-6b82-45b0-a588-67b6f1869d04"><span class="doc-article-title" contenteditable="false">Article 7 - </span>No License</h2><p>Nothing in this Agreement grants the Receiving Party any rights in or to the Confidential Information except as expressly set forth herein.</p></div><div class="doc-article" id="508e2502-e7bb-43df-beed-347430d11487"><h2 class="article-heading" id="9e125df7-7cbe-4d07-a7df-808c6890dfb7"><span class="doc-article-title" contenteditable="false">Article 8 - </span>Miscellaneous</h2><p>This Agreement represents the entire agreement between the Parties with respect to its subject matter and supersedes all prior discussions, agreements, or understandings of any kind. This Agreement may be amended only by written agreement signed by both Parties. This Agreement is governed by and construed in accordance with the laws of the United States, without giving effect to any principles of conflicts of law.</p><p>IN WITNESS WHEREOF, the Parties hereto have executed this Non-Disclosure Agreement as of the Effective Date.</p><p>[Name of Party A]</p><p>By: ___________________________</p><p>Title: _________________________</p><p>Date: __________________________</p><p>[Name of Party B]</p><p>By: ___________________________</p><p>Title: _________________________</p><p>Date: __________________________</p></div>',
    // );
  }
  function handleChange({ editor, transaction }) {
    if (editor.getHTML() !== currentDocumentVersion?.docContent) {
      if (articleInsertionState.tooltipActive) {
        setArticleInsertionState(initialArticleInsertionState);
      } else if (articleInsertionState.isOpen) {
        setArticleInsertionState({
          ...articleInsertionState,
          tooltipActive: true,
        });
      }

      if (tagInsertionState.tooltipActive) {
        setTagInsertionState(initialTagInsertionState);
      } else if (tagInsertionState.isOpen) {
        setTagInsertionState({ ...tagInsertionState, tooltipActive: true });
      }
    }

    // handleArticlesUpdate(transaction);
    // extractArticles(editor.getJSON());

    let content = editor.getHTML();
    if (
      currentDocumentVersion &&
      content &&
      content !== currentDocumentVersion?.docContent &&
      activeDocumentAction !== documentActions.VersionHistory
    ) {
      appDispatch(
        documentVersioningAction.setDocumentVersion({
          currentDocumentVersion: {
            ...currentDocumentVersion,
            docContent: editor.getHTML(),
          },
        }),
      );

      !!editor?.getText() &&
        debouncedUpdateContent(
          content,
          currentDocument.id,
          currentDocumentVersion.version_id,
        );
    }
  }

  function confirmDeletion() {
    if (nodeToDelete) {
      const { doc } = editor.state;
      // const articleToDelete =
      const nodeToDeletePos = findNodePosFromNode(doc, nodeToDelete);
      const grandParentNode = editor.state.doc.resolve(
        nodeToDeletePos - 1,
      ).parent;
      const grandparentNodePos = findNodePosFromNode(doc, grandParentNode);
      const grandparentNodeSelection =
        editor.commands.setNodeSelection(grandparentNodePos);
      grandparentNodePos !== null &&
        editor.commands.deleteSelection(grandparentNodeSelection);
    }
    setOpenArticleDeleteConfirmModal(false);
    setNodeToDelete(null);
  }

  function cancelDeletion() {
    setOpenArticleDeleteConfirmModal(false);
    setNodeToDelete(null);
  }
};

export default TiptapEditor;
