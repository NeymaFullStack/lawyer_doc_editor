import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BubbleMenu } from "@tiptap/react";
import {
  Editor,
  Range,
  getMarkRange,
  getMarkType,
  posToDOMRect,
} from "@tiptap/core";
import { sticky } from "tippy.js";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAttributes } from "../utils/utils";
import { iconColors } from "../../../../../tailwind.config";

interface LinkBubbleProps {
  editor: Editor | null;
}

export const EditorHyperLink: React.FC<LinkBubbleProps> = ({ editor }) => {
  const { href }: { href: string } = useAttributes(
    editor ?? ({} as Editor),
    "link",
    { href: "", target: "" }
  );

  const initialUrl = useRef<string>(href || "");
  const [isHide, setIsHide] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pos, setPos] = useState<Range>({ from: -1, to: -1 });

  const shouldShow = useCallback(
    () => editor?.isActive("link") ?? false,
    [editor]
  );

  const handleEdit = useCallback(() => setIsEdit(true), []);

  const onSetLink = useCallback(
    (url: string) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
        initialUrl.current = "";
        setIsEdit(false);
      }
    },
    [editor]
  );

  const onUnsetLink = useCallback(() => {
    if (editor && pos.from !== -1) {
      const transaction = editor.chain().focus().setTextSelection(pos);
      setPos({ from: -1, to: -1 });
      transaction.unsetLink().run();
    }
  }, [editor, pos]);

  const getReferenceClientRect = useCallback(() => {
    if (!editor) return new DOMRect();
    const { view } = editor;
    const {
      selection: { from, to, $to },
    } = view.state;

    const linkRange = getMarkRange($to, getMarkType("link", editor.schema));
    if (linkRange) {
      const node = view.nodeDOM(linkRange.from) as HTMLElement;
      return node!.parentElement!.getBoundingClientRect();
    }

    return posToDOMRect(view, from, to);
  }, [editor]);

  useEffect(() => {
    const isLinkActive = editor?.isActive("link");
    if (!isLinkActive) return;

    const prev = initialUrl.current;
    const current = href;

    if (!current) setIsEdit(true);
    else if (prev !== current) setIsEdit(false);

    initialUrl.current = current;

    const selection = editor?.state.selection;
    if (selection) {
      const { from, to } = selection;
      setPos({ from, to });
    }
  }, [editor?.state, href]);

  useEffect(() => {
    if (isHide && !initialUrl.current) {
      onUnsetLink();
      setIsEdit(false);
      setIsHide(false);
    }
  }, [isHide, onUnsetLink]);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 5],
        placement: "bottom-start",
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        plugins: [sticky],
        sticky: "popper",
        onHide: () => setIsHide(true),
        getReferenceClientRect,
      }}
    >
      {isEdit ? (
        <LinkPanelEdit initial={href} isOpen={isEdit} onSetLink={onSetLink} />
      ) : (
        <LinkPanelPreview
          url={href}
          onEdit={handleEdit}
          onRemove={onUnsetLink}
        />
      )}
    </BubbleMenu>
  );
};

const LinkPanelPreview = ({
  url,
  onEdit,
  onRemove,
}: {
  url: string;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <div className="bg-white rounded-md border bg-popover text-popover-foreground p-2 shadow-md">
    <div className="flex items-center justify-between gap-2 font-extralight text-logan-primary-400 simpleSearchSquare">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm link text-logan-blue underline font-sm"
      >
        {url}
      </a>
      <Button onClick={onEdit} variant="outline" size="xm" className="h-6 w-6">
        <Icon
          iconName="edit"
          fill={iconColors["light-gray"]}
          className="h-6 w-6"
        />
      </Button>
      <Button
        onClick={onRemove}
        variant="outline"
        size="xm"
        className="h-6 w-6"
      >
        <Icon
          iconName="trash"
          fill={iconColors["light-gray"]}
          className="h-6 w-6"
        />
      </Button>
    </div>
  </div>
);

const LinkPanelEdit = ({
  initial,
  isOpen,
  onSetLink,
}: {
  initial: string;
  isOpen: boolean;
  onSetLink: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>(initial || "");

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) onSetLink(url);
    },
    [url, isValidUrl, onSetLink]
  );

  useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-md border bg-popover text-popover-foreground p-2 shadow-md">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-1 font-extralight text-logan-primary-400 simpleSearchSquare"
      >
        <Icon
          iconName="hyperlink"
          fill={iconColors.from}
          className="flex-none text-black size-4"
        />
        <Input
          ref={inputRef}
          className="h-6 !border-none caret-logan-black p-1 text-logan-black !transition-none"
          type="url"
          value={url}
          autoFocus
          onChange={onChange}
        />
        <Button
          color="primary"
          size="xm"
          type="submit"
          className="h-6 bg-logan-primary-200 !text-logan-blue rounded-lg hover:bg-logan-primary-300 text-smaller"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditorHyperLink;
