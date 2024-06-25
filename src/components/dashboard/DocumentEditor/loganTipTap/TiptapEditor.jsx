"use client";

import { useEditor, EditorContent, generateJSON } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ToolBar from "./ToolBar";
import Tag from "@/components/generic/Tag";
import { useDispatch, useSelector } from "react-redux";
import { copiedContentType, documentActions } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import {
  getDocumentContentByVersionIdUrl,
  getDocumentDataUrl,
} from "@/api/serviceUrl";
import {
  getDocumentContentByVersionId,
  getDocumentData,
  updateDocumentVersionContent,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import { useParams } from "next/navigation";
import { classIdSpan } from "./extensions/classIdSpan";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { documentArticleAction } from "@/redux/editor/documentArticleSlice";
import ArticleDeleteConfirmationModal from "./ArticleDeleteConfirmationModal";
import { classIdDiv } from "./extensions/classIdDiv";
import { findNodePos } from "@/utils/dashboard/editor-utils";
import { CustomHeading } from "./extensions/heading";
import ArticleExtention from "./plugins/article";
import CustomListItem from "./extensions/listItem";
import ArticleMenu from "./ArticleMenu";
import ArticleInsertion from "./plugins/artcleInsertion";

const docHtml =
  '<h1>Rental Agreement</h1><hr size="1"/><p>This Rental Agreement ("Agreement") is made and entered into this day by and between <span id="landlord" class="doc-variable">Anuj</span> ("Landlord") and <span id="tenant" class="doc-variable">Ankit</span> ("Tenant"). The premises subject to this Agreement is located at the address specified herein under the laws of the <span id="state" class="doc-variable">United States</span>.</p><div class="doc-article"><h2 id="a1f97861-4814-4e7f-a187-f09305c429ea">Premises</h2><p id="afbae19a-5b70-455f-91f0-0e5cff40d61a">The Landlord hereby leases to the Tenant the residential premises described as <span id="property_address" class="doc-variable">[Insert Address Here]</span> ("the Premises"). The Premises are to be occupied strictly as a private dwelling by the Tenant and their immediate family and for no other purpose without prior written consent of the Landlord.</p></div>';

const TiptapEditor = () => {
  const { docId } = useParams();
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
  } = useSelector((state) => state.documentVersioningReducer);
  const { currentEditVariable } = useSelector(
    (state) => state.documentVariableReducer,
  );
  const articleList = useSelector(
    (state) => state.documentArticleReducer.articleList,
  );
  const { copiedContent, activeDocumentAction, currentDocument } = useSelector(
    (state) => state.documentReducer,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

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

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: false, // Disable the default heading extension
        }),
        ArticleInsertion,
        CustomHeading.configure({
          levels: [1, 2, 3, 4, 5, 6], // Support for heading levels 1 to 6
        }),
        ArticleExtention,
        CustomListItem,
        Underline,
        classIdDiv,
        classIdSpan.configure({
          openModal: (node) => {
            setNodeToDelete(node);
            setOpenArticleDeleteConfirmModal(true);
          },
        }),
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
    editor && fetchDocumentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

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
        editor.getHTML() !== currentDocumentVersion?.docContent &&
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
    if (editor && currentEditVariable?.previousDefinition) {
      editor.commands.replaceTextInNodeWithClassAndValue(
        currentEditVariable?.previousDefinition,
        currentEditVariable?.currentDefinition,
      );
      // let contenthtml = editor?.getHTML();
      // contenthtml = String(contenthtml).replaceAll(
      //   `>${currentEditVariable?.previousDefinition}<`,
      //   `>${currentEditVariable?.currentDefinition}<`,
      // );
      // setEditorContent(String(contenthtml));
      // debouncedUpdateContent(
      //   contenthtml,
      //   currentDocument.id,
      //   currentDocumentVersion.version_id,
      // );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditVariable]);
  // console.log(!!editor?.getText());
  return (
    <div className="logan-tiptap h-full">
      <ToolBar editor={editor} />
      {openArticleDeleteConfirmModal && (
        <ArticleDeleteConfirmationModal
          open={openArticleDeleteConfirmModal}
          onConfirm={confirmDeletion}
          onClose={cancelDeletion}
        />
      )}
      <div className="flex h-[calc(100%-3rem)] w-full flex-col items-center overflow-hidden p-1 pr-3">
        <ArticleMenu
          items={items}
          onClick={handleMenuItemClick}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          position={menuPosition}
        />
        <div className="mt-1 flex w-[90%] items-center  gap-2">
          {activeDocumentAction !== documentActions.Draft && (
            <Tag textColor={"text-primary-blue"} bgColor={"bg-secondary-blue"}>
              Document
            </Tag>
          )}
          <h2
            className={`text-lg font-semibold text-black-txt ${currentDocument?.document_name ? "" : "invisible"}`}
          >
            {currentDocument?.document_name || "xyz"}
          </h2>
          {/* <span className="text-xs">28 Pages</span> */}
        </div>
        <div className=" my-2 h-full  w-[90%] overflow-y-scroll  bg-white ">
          {activeDocumentVersion && (
            <EditorContent
              editor={editor}
              className={`flex min-h-full w-full flex-col border-[0.125rem] px-5 py-2  ${activeDocumentAction !== documentActions.VersionHistory && editor?.isFocused ? "border-primary-blue" : ""} ${editor && activeDocumentVersion?.is_auto_saved !== null ? (activeDocumentVersion?.is_auto_saved ? "auto-save" : "save") : ""}`}
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
              docContent: docHtml,
              // '<h1>Rental Agreement</h1><hr size="1"/><p>This Rental Agreement ("Agreement") is made and entered into this day by and between <span id="landlord" class="doc-variable">Anuj</span> ("Landlord") and <span id="tenant" class="doc-variable">Ankit</span> ("Tenant"). The premises subject to this Agreement is located at the address specified herein under the laws of the <span id="state" class="doc-variable">United States</span>.</p><div class="doc-article"><h2 id="a1f97861-4814-4e7f-a187-f09305c429ea">Premises</h2><p id="afbae19a-5b70-455f-91f0-0e5cff40d61a">The Landlord hereby leases to the Tenant the residential premises described as <span id="property_address" class="doc-variable">[Insert Address Here]</span> ("the Premises"). The Premises are to be occupied strictly as a private dwelling by the Tenant and their immediate family and for no other purpose without prior written consent of the Landlord.</p></div><div class="doc-article"><h2 id="8bbc0b2f-f47a-455b-a3c1-6e25803efc5d">Term of Lease</h2><p id="364e80bc-cafc-48ce-8ac2-68dceeb94467">The rental term shall commence on <span id="start_date" class="doc-variable">[Start Date]</span> and shall expire on <span id="end_date" class="doc-variable">[End Date]</span> with the right to renew under mutual agreement.</p></div><div class="doc-article"><h2 id="083a261c-9a93-4cd6-82c8-0366a304eb40">Rental Payments</h2><p id="15a8bbfc-8a2d-4b2e-8b80-c7987da8df09">The Tenant agrees to pay the Landlord [Insert Rent Amount] payable on the 1st day of each calendar month. The first and last month\'s rent will be due prior to occupancy. Late payment will attract a charge of [Specify Charges] if not paid within [Specify Days] days of due date.</p></div><div class="doc-article"><h2 id="fb807988-4b97-4039-a562-20c00f97b970">Utilities and Services</h2><p id="39c550f2-b8ed-4827-95f7-d3a12d11a03d">The Tenant will be responsible for the payment of utilities including, but not limited to, electricity, gas, water, internet, telephone, and garbage collection associated with the Premises.</p></div><div class="doc-article"><h2 id="0eec5313-c55a-4621-b0b1-c35b339e4715">Security Deposit</h2><p id="40702ed3-1022-43a9-b728-470d800c0ae9">The Tenant shall deposit with the Landlord, the sum of [Specify Amount] as security for performance of all Tenant obligations under this Agreement. The Security Deposit will be returned to Tenant within [Specify Days] days of the expiration of this Lease after deducting damages and other dues, if any.</p></div><div class="doc-article"><h2 id="3daeca42-b459-4b53-87c5-f7d542e04eb8">Maintenance and Repairs</h2><p id="e1f65da8-b049-429b-9324-6dc960aab8da">The Tenant shall maintain the premises in a clean, orderly, and compliant state and shall not make any alterations to the premises without the prior written consent of the Landlord. The Landlord shall be responsible for repairs to the structural elements of the Premises.</p></div><div class="doc-article"><h2 id="e0e85b02-c01f-4908-b3d3-913abf25e18b">Right of Inspection</h2><p id="67ba6145-316b-4437-ba89-cdf1aac45874">The Landlord shall have the right to inspect the premises during reasonable hours to ensure maintenance and observe the Tenant’s compliance with this Agreement.</p></div><div class="doc-article"><h2 id="33d73fae-d8f2-49dd-a26d-0558a854a0d4">Governing Law</h2><p id="55381d61-afee-4440-8b8f-d4b828984784">This Agreement shall be governed by and construed in accordance with the laws of the <span id="state" class="doc-variable">United States</span> applicable in the state in which the Premises is located.</p></div><div class="doc-article"><h2 id="d6f5df52-37c5-4e9a-a635-39dfd0ab6d47">Entire Agreement</h2><p id="7562333b-ffee-4471-9c23-83b90ab1b44c">This document constitutes the entire agreement between the parties. Any prior understanding or representation of any kind preceding the date of this agreement shall not be binding on either party except to the extent incorporated in this Agreement.</p></div><div class="doc-article"><h2 id="dec6f91b-72dc-4d4d-b6ff-21d3e8b0a42e">Signatures</h2><p id="2a558caa-52d6-46b9-a36d-e25df78bb39a">Both parties hereby signify their agreement to the terms above by their signatures affixed below:</p><p id="845f3a9d-a03a-49ee-a32b-adc2453bc5f5">Landlord: __________________________ Date: _________</p><p id="1241769d-5c7b-4e64-be24-1a8cd6ab5cfe">Tenant: ___________________________ Date: _________</p></div>',
            },
          }),
        );
        setEditorContent(
          docHtml,
          // '<h1>Rental Agreement</h1><hr size="1"/><p>This Rental Agreement ("Agreement") is made and entered into this day by and between <span id="landlord" class="doc-variable">Anuj</span> ("Landlord") and <span id="tenant" class="doc-variable">Ankit</span> ("Tenant"). The premises subject to this Agreement is located at the address specified herein under the laws of the <span id="state" class="doc-variable">United States</span>.</p><div class="doc-article"><h2 id="a1f97861-4814-4e7f-a187-f09305c429ea">Premises</h2><p id="afbae19a-5b70-455f-91f0-0e5cff40d61a">The Landlord hereby leases to the Tenant the residential premises described as <span id="property_address" class="doc-variable">[Insert Address Here]</span> ("the Premises"). The Premises are to be occupied strictly as a private dwelling by the Tenant and their immediate family and for no other purpose without prior written consent of the Landlord.</p></div><div class="doc-article"><h2 id="8bbc0b2f-f47a-455b-a3c1-6e25803efc5d">Term of Lease</h2><p id="364e80bc-cafc-48ce-8ac2-68dceeb94467">The rental term shall commence on <span id="start_date" class="doc-variable">[Start Date]</span> and shall expire on <span id="end_date" class="doc-variable">[End Date]</span> with the right to renew under mutual agreement.</p></div><div class="doc-article"><h2 id="083a261c-9a93-4cd6-82c8-0366a304eb40">Rental Payments</h2><p id="15a8bbfc-8a2d-4b2e-8b80-c7987da8df09">The Tenant agrees to pay the Landlord [Insert Rent Amount] payable on the 1st day of each calendar month. The first and last month\'s rent will be due prior to occupancy. Late payment will attract a charge of [Specify Charges] if not paid within [Specify Days] days of due date.</p></div><div class="doc-article"><h2 id="fb807988-4b97-4039-a562-20c00f97b970">Utilities and Services</h2><p id="39c550f2-b8ed-4827-95f7-d3a12d11a03d">The Tenant will be responsible for the payment of utilities including, but not limited to, electricity, gas, water, internet, telephone, and garbage collection associated with the Premises.</p></div><div class="doc-article"><h2 id="0eec5313-c55a-4621-b0b1-c35b339e4715">Security Deposit</h2><p id="40702ed3-1022-43a9-b728-470d800c0ae9">The Tenant shall deposit with the Landlord, the sum of [Specify Amount] as security for performance of all Tenant obligations under this Agreement. The Security Deposit will be returned to Tenant within [Specify Days] days of the expiration of this Lease after deducting damages and other dues, if any.</p></div><div class="doc-article"><h2 id="3daeca42-b459-4b53-87c5-f7d542e04eb8">Maintenance and Repairs</h2><p id="e1f65da8-b049-429b-9324-6dc960aab8da">The Tenant shall maintain the premises in a clean, orderly, and compliant state and shall not make any alterations to the premises without the prior written consent of the Landlord. The Landlord shall be responsible for repairs to the structural elements of the Premises.</p></div><div class="doc-article"><h2 id="e0e85b02-c01f-4908-b3d3-913abf25e18b">Right of Inspection</h2><p id="67ba6145-316b-4437-ba89-cdf1aac45874">The Landlord shall have the right to inspect the premises during reasonable hours to ensure maintenance and observe the Tenant’s compliance with this Agreement.</p></div><div class="doc-article"><h2 id="33d73fae-d8f2-49dd-a26d-0558a854a0d4">Governing Law</h2><p id="55381d61-afee-4440-8b8f-d4b828984784">This Agreement shall be governed by and construed in accordance with the laws of the <span id="state" class="doc-variable">United States</span> applicable in the state in which the Premises is located.</p></div><div class="doc-article"><h2 id="d6f5df52-37c5-4e9a-a635-39dfd0ab6d47">Entire Agreement</h2><p id="7562333b-ffee-4471-9c23-83b90ab1b44c">This document constitutes the entire agreement between the parties. Any prior understanding or representation of any kind preceding the date of this agreement shall not be binding on either party except to the extent incorporated in this Agreement.</p></div><div class="doc-article"><h2 id="dec6f91b-72dc-4d4d-b6ff-21d3e8b0a42e">Signatures</h2><p id="2a558caa-52d6-46b9-a36d-e25df78bb39a">Both parties hereby signify their agreement to the terms above by their signatures affixed below:</p><p id="845f3a9d-a03a-49ee-a32b-adc2453bc5f5">Landlord: __________________________ Date: _________</p><p id="1241769d-5c7b-4e64-be24-1a8cd6ab5cfe">Tenant: ___________________________ Date: _________</p></div>',
        );
        extractArticles(editor.getJSON());
      }
    }
  }

  function handleSelection({ editor, transaction }) {
    let pos = transaction?.curSelection?.from;
    if (copiedContent && textInsertRef.current === true) {
      textInsertRef.current = false;
      if (copiedContent.type === copiedContentType.Variable) {
        const textContent = copiedContent?.content.definition;
        editor.commands.insertContentAt(
          Number(pos),
          `<span id=${copiedContent?.content?.variable} class="doc-variable">${textContent}</span>`,
          { updateSelection: true },
        );
      } else {
        editor.commands.insertContentAt(
          Number(pos),
          `<span id=${copiedContent?.content?.articleName} class="doc-article-tag">Article xyz- ${copiedContent?.content?.articleName}</span>`,
          { updateSelection: true },
        );
      }

      appDispatch(documentAction.setCopiedContent(null));
    }
  }

  function setEditorContent(content) {
    editor?.commands.setContent(content);
  }

  function handleChange({ editor, transaction }) {
    handleArticlesUpdate(transaction);
    // console.log("contentJSOn", jsonContent);
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

  function extractArticles(jsonContent) {
    let articles = jsonContent?.content
      ?.filter((item) => {
        return (
          item.type === "classIdDiv" && item?.attrs?.class === "doc-article"
        );
      })
      .map((item, index) => {
        return {
          id: item?.content?.[0]?.attrs?.id,
          articleName: item?.content?.[0]?.content?.[1]?.text,
          index: index + 1,
        };
      });
    appDispatch(documentArticleAction.setArticlesList(articles));
  }

  function handleArticlesUpdate(tr) {
    if (
      tr.curSelection?.$cursor?.parent?.firstChild?.attrs?.class ===
      "doc-article-title"
    ) {
      let articleId = tr.curSelection.$cursor.parent.attrs.id;
      let updatedTextContent =
        tr.curSelection?.$cursor?.parent.content.length <= 1
          ? ""
          : tr.curSelection.$cursor.parent.lastChild.textContent;
      if (articleId) {
        let newArticleList = articleList.map((item, index) => {
          if (
            item.id === articleId &&
            updatedTextContent !== item.articleName
          ) {
            editor.commands.replaceTextInNodeWithClassAndValue(
              `Article xyz- ${item.articleName}`,
              `Article xyz- ${updatedTextContent}`,
            );
            return { ...item, articleName: updatedTextContent };
          }
          return item;
        });
        appDispatch(documentArticleAction.setArticlesList(newArticleList));
        // console.log("articles", newArticleList);
      }
    }
  }

  function confirmDeletion() {
    if (nodeToDelete) {
      const { doc } = editor.state;
      // const articleToDelete =
      const nodeToDeletePos = findNodePos(doc, nodeToDelete);
      const grandParentNode = editor.state.doc.resolve(
        nodeToDeletePos - 1,
      ).parent;
      const grandparentNodePos = findNodePos(doc, grandParentNode);
      const grandparentNodeSelection =
        editor.commands.setNodeSelection(grandparentNodePos);
      grandparentNodePos !== null &&
        editor.commands.deleteSelection(grandparentNodeSelection);
      extractArticles(editor.getJSON());
      // if (grandparentNodePos !== null) {
      //   editor.commands.deletenode;
      //   // const transaction = tr.delete(
      //   //   grandparentNodePos,
      //   //   grandparentNodePos + grandParentNode.nodeSize,
      //   // );
      //   // editor.view.dispatch(transaction);
      // }
    }
    setOpenArticleDeleteConfirmModal(false);
    setNodeToDelete(null);
  }

  function cancelDeletion() {
    setOpenArticleDeleteConfirmModal(false);
    setNodeToDelete(null);
  }

  function handleMenuItemClick(item) {
    alert(`You clicked ${item}`);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }
};

export default TiptapEditor;
