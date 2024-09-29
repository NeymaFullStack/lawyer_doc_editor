import { archiveComment, postComment, postReply } from "@/api/comments";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { fetchAllComments } from "@/redux/editor/commentsSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Comments = () => {
  const { docId } = useParams();
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.commentsReducer);
  const [addCommentButtonHover, setAddCommentButtonHover] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (content.trim()) {
      await postComment(docId, content);
      dispatch(fetchAllComments(docId));
      setContent("");
      setAddCommentButtonHover(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllComments(docId));
  }, [dispatch, docId]);

  return (
    <div
      className="flex h-full flex-col"
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[2.997rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">Markup</h2>
        <div className="flex items-center gap-2 ">
          <button
            onClick={() => {
              setAddCommentButtonHover(true);
            }}
          >
            <RemSizeImage
              imagePath={`/assets/icons/${
                addCommentButtonHover ? "add-blue" : "add-light-blue"
              }.svg`}
              remWidth={2}
              remHeight={2}
              alt={"Add"}
            />
          </button>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 border-b-[0.063rem] border-secondary-blue bg-gradient-search px-5 py-3">
        <RemSizeImage
          imagePath={"/assets/icons/search-icon.svg"}
          remWidth={1.188}
          remHeight={1.188}
          alt={"Search"}
        />
        <input
          onChange={(e) => {}}
          autoComplete="off"
          className="w-[80%] bg-gradient-search  text-xs  outline-none"
          placeholder="Search for a specific subject, comment, or user..."
        ></input>
      </div>
      <div className=" flex flex-1 flex-col  gap-y-3 overflow-y-auto p-4 text-xs">
        {addCommentButtonHover && (
          <div className="flex  w-full flex-col  gap-y-2 rounded-[10px_0_0_0] bg-[#F0F5FC80] p-[13px_16px]">
            <div className="min-w-[20rem] p-1">
              <div
                className={
                  "flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-0.5"
                }
              >
                <textarea
                  name={"query"}
                  disabled={false}
                  autoComplete="off"
                  autoFocus
                  value={content}
                  className={
                    "  max-h-[8rem] flex-1 resize-none overflow-x-hidden  overflow-y-scroll bg-white px-2 pl-1 text-sm text-black-txt outline-none "
                  }
                  style={{ overflowY: "16px", minHeight: "16px" }}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                      setContent("");
                    }
                  }}
                />

                <div className="flex h-full w-[1rem] items-center gap-3">
                  <button
                    onClick={() => {
                      handleSubmit();
                      setContent("");
                    }}
                  >
                    {content.length > 0 && (
                      <RemSizeImage
                        imagePath={"/assets/icons/send-icon.svg"}
                        remWidth={1.173}
                        remHeight={1.082}
                        alt={"Send Button"}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {comments.map((comment) => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;

const CommentCard = ({ comment }) => {
  const dispatch = useDispatch();
  const { editor } = useSelector((state) => state.commentsReducer);
  const [reply, setReply] = useState("");
  const replies = comment.replies || [];
  const replyCount = comment.replies.length;
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleSubmit = async () => {
    if (reply.trim()) {
      await postReply(comment.comment_id, reply);
      dispatch(fetchAllComments(comment.document_id));
      setReply("");
    }
  };
  const handleArchiveComment = async () => {
    try {
      await archiveComment(comment.comment_id);
      dispatch(fetchAllComments(comment.document_id));
      editor?.commands.changeCommentColor(
        comment?.comment_id,
        "var(--logan-comment-archive)",
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex  w-full flex-col  gap-y-2 rounded-[10px_0_0_0] bg-[#F0F5FC80] p-[13px_16px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <RemSizeImage
            imagePath={comment.avatar || "/assets/images/default-avatar.png"}
            alt="User avatar"
            remWidth={2}
            remHeight={2}
            className="h-8 w-8 rounded-full"
          />
          <p className="font-inter text-left text-[13px] font-semibold leading-[15.73px]">
            {comment.name || "User"}
          </p>
        </div>
        <div className=" flex items-center gap-x-2">
          <p className="font-inter  text-left text-[9.6px] font-medium leading-[11.62px] text-[#095AD34D]">
            {comment.date || "Today"} . {comment.time || "12:00 AM"}
          </p>
          {comment.status === "ARCHIVED" ? (
            <RemSizeImage
              imagePath={"/assets/icons/archiveIcon.svg"}
              remWidth={5.0625}
              remHeight={1.1875}
              alt={"All Doc"}
            />
          ) : (
            <RemSizeImage
              imagePath={"/assets/icons/rightIcon.svg"}
              remWidth={0.75}
              remHeight={0.5}
              alt={"All Doc"}
              className="cursor-pointer"
              onClick={handleArchiveComment}
            />
          )}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-left text-[13px] font-normal leading-[16.9px]">
          {comment.content}
        </p>
      </div>
      <div class="flex w-fit flex-col items-start justify-center gap-3  ">
        <button
          onClick={() => setIsReplyOpen(!isReplyOpen)}
          class="rounded-lg bg-white p-1.5 px-2 text-left text-xs font-semibold leading-tight text-[#095AD3]"
        >
          {replyCount > 0 ? ` ${replyCount} Replies` : "Reply"}
        </button>
        {isReplyOpen && replyCount > 0 && (
          <div class="flex w-full  flex-col items-start gap-[14px] rounded-lg bg-white p-[26px_32px]">
            {replies.map((reply, index) => (
              <div className=" w-full" key={index}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <RemSizeImage
                      imagePath={
                        comment.avatar || "/assets/images/default-avatar.png"
                      }
                      alt="User avatar"
                      remWidth={2}
                      remHeight={2}
                      className="h-8 w-8 rounded-full"
                    />
                    <p className="font-inter text-left text-[13px] font-semibold leading-[15.73px]">
                      {reply.name || "User"}
                    </p>
                  </div>
                  <div>
                    <p className="font-inter  text-left text-[9.6px] font-medium leading-[11.62px] text-[#095AD34D]">
                      {reply.date || "Today"} . {reply.time || "12:00 AM"}
                    </p>
                  </div>
                </div>
                <div className="my-[14px] flex-1">
                  <p className="text-left text-[13px] font-normal leading-[16.9px]">
                    {reply.content}
                  </p>
                </div>
                {index < replyCount - 1 && (
                  <hr className=" mt-[14px] h-[1px] bg-[#095AD31A]" />
                )}
              </div>
            ))}
          </div>
        )}
        {isReplyOpen && (
          <div className="min-w-[20rem] p-1">
            <div
              className={
                "flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-0.5"
              }
            >
              <textarea
                name={"query"}
                disabled={false}
                autoComplete="off"
                autoFocus
                value={reply}
                className={
                  "  max-h-[8rem] flex-1 resize-none overflow-x-hidden  overflow-y-scroll bg-white px-2 pl-1 text-sm text-black-txt outline-none "
                }
                style={{ overflowY: "16px", minHeight: "16px" }}
                onChange={(e) => {
                  setReply(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                    setReply("");
                  }
                }}
              />

              <div className="flex h-full w-[1rem] items-center gap-3">
                <button
                  onClick={() => {
                    handleSubmit();
                    setReply("");
                  }}
                >
                  {reply.length > 0 && (
                    <RemSizeImage
                      imagePath={"/assets/icons/send-icon.svg"}
                      remWidth={1.173}
                      remHeight={1.082}
                      alt={"Send Button"}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
