import { useState } from "react";
import PositionToolTip from "@/components/generic/PositionToolTip";
import { useParams } from "next/navigation";
import { postComment } from "@/api/comments";
import { useDispatch } from "react-redux";
import { fetchAllComments } from "@/redux/editor/commentsSlice";
import RemSizeImage from "@/components/generic/RemSizeImage";

const AddCommentModal = ({ isOpen, onClose, position, editorRef, editor }) => {
  const [commentText, setCommentText] = useState("");
  const { docId } = useParams();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (commentText.trim()) {
      const comment = await postComment(docId, commentText);
      editor?.commands.setCommentHighlight(
        comment?.comment_id,
        "var(--logan-comment-active)",
      );
      dispatch(fetchAllComments(docId));
      setCommentText("");
      onClose();
    }
  };

  const isTooltip = false;

  return (
    <PositionToolTip
      onClose={onClose}
      position={position}
      isOpen={isOpen}
      containerRef={editorRef}
    >
      <div className="min-w-[20rem] p-1">
        <div
          className={
            "flex flex-1 items-center gap-2 rounded-lg bg-six px-3 py-0.5"
          }
        >
          <textarea
            name={"query"}
            disabled={false}
            autoComplete="off"
            autoFocus
            value={commentText}
            className={
              "flex-1  resize-none bg-six px-2 pl-1   text-xs text-black-txt outline-none "
            }
            style={{ overflowY: "16px", minHeight: "16px" }}
            onChange={(e) => {
              setCommentText(e.target.value);
              // e.target.style.height = "auto"; // Reset the height
              // e.target.style.height = "1rem";
              // e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on scrollHeight
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
                setCommentText("");
              }
            }}
          />

          <div className="flex h-full w-[1rem] items-center gap-3">
            <button
              onClick={() => {
                handleSubmit();
                setCommentText("");
              }}
            >
              {commentText.length > 0 && (
                <RemSizeImage
                  imagePath={
                    isTooltip
                      ? "/assets/icons/right-tick.svg"
                      : "/assets/icons/send-icon.svg"
                  }
                  remWidth={1.173}
                  remHeight={1.082}
                  alt={"Send Button"}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </PositionToolTip>
  );
};

export default AddCommentModal;
