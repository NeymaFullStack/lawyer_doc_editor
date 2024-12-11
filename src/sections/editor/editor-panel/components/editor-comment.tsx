import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BubbleMenu } from "@tiptap/react";
import { Editor, Range, posToDOMRect } from "@tiptap/core";
import { sticky } from "tippy.js";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDropdown } from "@/components/hook-form/dropdown-provider";
import { iconColors } from "../../../../../tailwind.config";
import { v4 } from "uuid";
import { Comment, useTabContext } from "../../editor-tab-group/use-tab-context";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/auth/hooks";

type EditorCommentProps = {
  editor: Editor | null;
};

export const getNewComment = (
  document_id: string,
  avatar: string,
  name: string,
  content: string
): Comment => ({
  comment_id: `a${v4()}a`,
  document_id: `${document_id}`,
  avatar: avatar,
  name: name,
  content,
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString(),
  status: "ACTIVE",
  replies: [],
});

export const EditorComment: React.FC<EditorCommentProps> = ({ editor }) => {
  const document_id = useParams()["document-id"];
  const { user } = useAuthContext();
  const avatar = user?.profile_logo;
  const name = user?.first_name + " " + user?.last_name;
  const { isComment, setIsComment } = useDropdown();
  const { comments, setComments } = useTabContext();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);

  const onSetComment = useCallback(
    (content: string) => {
      const newComment = getNewComment(`${document_id}`, avatar, name, content);
      setComments((prevComments) => [...prevComments, newComment]);
      editor?.commands.setComment(newComment.comment_id);
      // setActiveCommentId(newComment.id);
    },
    [editor]
  );

  const focusCommentWithActiveId = useCallback((id: string) => {
    if (!commentsSectionRef.current) return;

    const commentInput =
      commentsSectionRef.current.querySelector<HTMLInputElement>(`input#${id}`);

    if (!commentInput) return;

    commentInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, []);

  useEffect(() => {
    if (activeCommentId && isComment) {
      focusCommentWithActiveId(activeCommentId);
    }
  }, [activeCommentId, isComment, focusCommentWithActiveId]);

  const getReferenceClientRect = useCallback(() => {
    if (!editor) return new DOMRect();
    const { view } = editor;
    const { selection } = view.state;

    return posToDOMRect(view, selection.from, selection.to);
  }, [editor]);

  useEffect(() => {
    setIsComment(false);
  }, [editor?.state]);

  return (
    <BubbleMenu
      editor={editor}
      className="rounded-full border bg-popover text-popover-foreground p-0 shadow-md"
      pluginKey="commentMenu"
      updateDelay={0}
      tippyOptions={{
        offset: [0, 5],
        placement: "bottom-start",
        plugins: [sticky],
        sticky: "popper",
        getReferenceClientRect,
      }}
    >
      {isComment ? (
        <CommentInputPanel onSetComment={onSetComment} />
      ) : (
        <CommentPreviewPanel onAddComment={() => setIsComment(true)} />
      )}
    </BubbleMenu>
  );
};

const CommentPreviewPanel = ({
  onAddComment,
}: {
  onAddComment: () => void;
}) => (
  <Icon
    iconName="commentplus"
    fill={iconColors.from}
    className="cursor-pointer"
    onClick={onAddComment}
  />
);

const CommentInputPanel = ({
  onSetComment,
}: {
  onSetComment: (content: string) => void;
}) => {
  const [content, setContent] = useState("");

  const isValidContent = useMemo(() => content.trim().length > 0, [content]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidContent) onSetComment(content);
    },
    [content, isValidContent, onSetComment]
  );

  return (
    <div className="bg-white rounded-full border bg-popover text-popover-foreground p-2 shadow-md">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between gap-1 font-extralight text-logan-primary-400 simpleSearchSquare"
      >
        <Input
          className="h-6 !border-none caret-logan-black p-1 text-logan-black !transition-none"
          type="text"
          multiple
          placeholder="Add a comment..."
          value={content}
          autoFocus
          onChange={onChange}
        />
        <Button
          color="primary"
          size="xm"
          type="submit"
          disabled={!isValidContent}
          className="h-6 bg-logan-primary-200 !text-logan-blue rounded-lg hover:bg-logan-primary-300 text-smaller"
        >
          Save
        </Button>
        {/* <Button
          color="primary"
          size="xm"
          disabled={!isValidContent}
          className="h-6 bg-logan-primary-200 !text-logan-blue rounded-lg hover:bg-logan-primary-300 text-smaller"
        >
          remove
        </Button> */}
      </form>
    </div>
  );
};
