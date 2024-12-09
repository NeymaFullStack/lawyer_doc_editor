import { BubbleMenu } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";
import { useDropdown } from "@/components/hook-form/dropdown-provider";
import { Icon } from "@/components/icons";
import { iconColors } from "../../../../../tailwind.config";
import { v4 } from "uuid";

interface Comment {
  id: string;
  content: string;
  replies: Comment[];
  createdAt: Date;
}

const getNewComment = (content: string): Comment => {
  return {
    id: `a${v4()}a`,
    content,
    replies: [],
    createdAt: new Date(),
  };
};

type EditorCommentProps = {
  editor: Editor | null;
};

export const EidtorComment = ({ editor }: EditorCommentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement | null>(null);

  const focusCommentWithActiveId = (id: string) => {
    if (!commentsSectionRef.current) return;

    const commentInput =
      commentsSectionRef.current.querySelector<HTMLInputElement>(`input#${id}`);

    if (!commentInput) return;

    commentInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  useEffect(() => {
    if (!activeCommentId) return;

    focusCommentWithActiveId(activeCommentId);
  }, [activeCommentId]);

  const setComment = () => {
    const newComment = getNewComment("");

    setComments([...comments, newComment]);

    editor?.commands.setComment(newComment.id);

    setActiveCommentId(newComment.id);

    setTimeout(focusCommentWithActiveId);
  };

  // const setComment = () => {
  //   const comment = getNewComment("Comment");
  //   editor?.chain().focus().insertContent(comment).run();
  // };

  return (
    <BubbleMenu editor={editor} className="bg-black">
      <Icon iconName="comment" onClick={setComment} fill={iconColors.from} />
    </BubbleMenu>
  );
};
