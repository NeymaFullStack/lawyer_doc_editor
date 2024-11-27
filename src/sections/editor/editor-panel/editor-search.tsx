import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/core";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";

type EditorSearchAndReplaceProps = {
  editor: Editor | null;
};

export const EditorSearchAndReplace: React.FC<EditorSearchAndReplaceProps> = ({
  editor,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replaceTerm, setReplaceTerm] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

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
    editor?.commands.previousSearchResult();
    goToSelection();
  };

  const handleNextResult = () => {
    editor?.commands.nextSearchResult();
    goToSelection();
  };

  const handleReplaceAll = () => {
    editor?.commands.replaceAll();
  };

  const clear = () => {
    setSearchTerm("");
    setReplaceTerm("");
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

  return (
    <div className="w-96 grid gap-5 p-4">
      <Label className="text-lg">Search and Replace</Label>
      <div className="grid gap-3">
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2 w-24">
            Search:
          </label>
          <Input
            className="h-9"
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
            className="h-9"
            type="text"
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={caseSensitive}
            className="border-gray-300 data-[state=checked]:bg-blue-500"
            onCheckedChange={(checked: boolean) => setCaseSensitive(checked)}
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
        <Button onClick={handlePreviousResult} variant="ghost" size="sm">
          <Icon iconName="gradient-arrowDown" fill="" className="rotate-180 " />
        </Button>
        <Button onClick={handleNextResult} variant="ghost" size="sm">
          <Icon iconName="gradient-arrowDown" fill="" className="" />
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
  );
};
