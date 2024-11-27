import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/core";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { iconColors } from "../../../../tailwind.config";
import { Divider } from "./editor-toolbar-view";

type EditorSearchAndReplaceProps = {
  editor: Editor | null;
};

export const EditorSearchAndReplace: React.FC<EditorSearchAndReplaceProps> = ({
  editor,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replaceTerm, setReplaceTerm] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(true);

  // Track the search result number and total count
  const [currentResult, setCurrentResult] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const goToSelection = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace || {};
    const position = results?.[resultIndex];

    if (!position) return;

    editor.commands.setTextSelection(position);

    const resolvedNode = editor.view.domAtPos(editor.state.selection.anchor);
    const node = resolvedNode?.node;

    if (node instanceof HTMLElement) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const updateSearchReplace = (clearIndex: boolean = false) => {
    if (!editor) return;

    if (clearIndex) editor.commands.resetIndex();

    editor.commands.setSearchTerm(searchTerm);
    editor.commands.setReplaceTerm(replaceTerm);
    editor.commands.setCaseSensitive(caseSensitive);
  };

  const handlePreviousResult = () => {
    if (editor?.storage.searchAndReplace?.results) {
      const newIndex = Math.max(currentResult - 1, 0);
      setCurrentResult(newIndex);
      goToSelection();
    }
  };

  const handleNextResult = () => {
    if (editor?.storage.searchAndReplace?.results) {
      const newIndex = Math.min(currentResult + 1, totalResults - 1);
      setCurrentResult(newIndex);
      goToSelection();
    }
  };

  const handleClose = () => {
    const dropdown = document.getElementsByClassName(
      "dropDownContent"
    )[0] as HTMLElement;
    dropdown.style.display = "none";
  };

  const handleReplaceAll = () => {
    editor?.commands.replaceAll();
  };

  const handleMore = () => {
    setFlag(false);
  };

  const clear = () => {
    setSearchTerm("");
    setReplaceTerm("");
    setCurrentResult(0);
    setTotalResults(0);
    editor?.commands.resetIndex();
  };

  useEffect(() => {
    if (editor) setTimeout(() => updateSearchReplace());
  }, [editor]);

  useEffect(() => {
    updateSearchReplace(true);
  }, [searchTerm]);

  useEffect(() => {
    updateSearchReplace();
  }, [replaceTerm]);

  useEffect(() => {
    updateSearchReplace(true);
  }, [caseSensitive]);

  useEffect(() => {
    if (editor?.storage.searchAndReplace?.results) {
      const results = editor.storage.searchAndReplace.results;
      setTotalResults(results.length);
      setCurrentResult(editor.storage.searchAndReplace.resultIndex || 0);
    }
  }, [editor?.storage.searchAndReplace?.results]);

  return (
    <>
      {flag ? (
        <div className="flex items-center gap-3 font-extralight text-logan-primary-400 simpleSearchSquare">
          <Input
            className="!border-none caret-logan-black p-1 h-6"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span>
            {currentResult + 1}/{totalResults}
          </span>
          <Divider />
          <Icon
            iconName="arrowdown"
            onClick={handlePreviousResult}
            fill={iconColors["light-blue"]}
          />
          <Icon
            iconName="arrowdown"
            onClick={handleNextResult}
            fill={iconColors["light-blue"]}
            className="rotate-180"
          />
          <Icon
            iconName="dialogclose"
            onClick={handleClose}
            fill={iconColors["light-blue"]}
            className="size-4"
          />
          <Icon
            iconName="addmore"
            onClick={handleMore}
            fill={iconColors["light-blue"]}
            className="size-1"
          />
        </div>
      ) : (
        <div className="w-96 grid gap-5 p-4">
          <Label className="text-lg">Search and Replace</Label>
          <div className="grid gap-3">
            <div className="flex items-center">
              <label htmlFor="search" className="mr-2 w-24">
                Search:
              </label>
              <Input
                className=""
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="replace" className="mr-2 w-24">
                Replace:
              </label>
              <Input
                className=""
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                checked={caseSensitive}
                className="border-gray-300 data-[state=checked]:bg-blue-500"
                onCheckedChange={(checked: boolean) =>
                  setCaseSensitive(checked)
                }
              />
              <label className="ml-2">Case Sensitive</label>
            </div>
          </div>
          <div className="flex justify-start">
            <Button
              size="sm"
              onClick={() => clear()}
              className="text-white rounded-xl bg-red-500"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleReplaceAll}
              className="bg-green-500 text-white rounded-xl"
            >
              Replace
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
