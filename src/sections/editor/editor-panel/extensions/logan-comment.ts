import { Mark, mergeAttributes, Range } from "@tiptap/core";
import { Mark as PMMark } from "@tiptap/pm/model";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      setComment: (commentId: string) => ReturnType;
      unsetComment: (commentId: string) => ReturnType;
    };
  }
}

export interface MarkWithRange {
  mark: PMMark;
  range: Range;
}

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
  onCommentActivated: (commentId: string | null) => void;
}

export interface CommentStorage {
  activeCommentId: string | null;
}

export const LoganComment = Mark.create<CommentOptions, CommentStorage>({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: {},
      onCommentActivated: () => {},
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-comment-id"),
        renderHTML: (attrs: Record<string, any>) => ({
          "data-comment-id": attrs.commentId,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-comment-id]",
        getAttrs: (el: HTMLElement) =>
          el.getAttribute("data-comment-id")?.trim() ? null : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  onSelectionUpdate() {
    const { $from } = this.editor.state.selection;
    const marks = $from.marks();
    const commentMark = this.editor.schema.marks.comment;

    const activeCommentMark = marks.find((mark) => mark.type === commentMark);
    this.storage.activeCommentId =
      (activeCommentMark?.attrs.commentId as string) || null;

    this.options.onCommentActivated(this.storage.activeCommentId);
  },

  addStorage() {
    return {
      activeCommentId: null,
    };
  },

  addCommands() {
    return {
      setComment:
        (commentId: string) =>
        ({ commands }) =>
          !!commentId && commands.setMark("comment", { commentId }),

      unsetComment:
        (commentId: string) =>
        ({ tr, dispatch }) => {
          if (!commentId) return false;

          tr.doc.descendants((node, pos) => {
            const mark = node.marks.find(
              (m) =>
                m.type.name === "comment" && m.attrs.commentId === commentId
            );

            if (mark) {
              tr.removeMark(pos, pos + node.nodeSize, mark);
            }
          });

          return dispatch?.(tr) ?? false;
        },
    };
  },
});
