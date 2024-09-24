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
        {comments.map((comment) => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;

const CommentCard = ({ comment }) => {
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
        <div>
          <p className="font-inter  text-left text-[9.6px] font-medium leading-[11.62px] text-[#095AD34D]">
            {comment.date || "Today"} . {comment.time || "12:00 AM"}
          </p>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-left text-[13px] font-normal leading-[16.9px]">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
