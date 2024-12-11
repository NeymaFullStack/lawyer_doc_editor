import React, { useState, useCallback, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllComments } from "../redux/actions";
// import { postReply, archiveComment } from "../api";
// import RemSizeImage from "./RemSizeImage";

import { Comment, useTabContext } from "./use-tab-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/auth/hooks";
import { Label } from "@/components/ui/label";
import { Icon, icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { ToolBarItem } from "../editor-panel/components/editor-toolbar-item";
import { Button } from "@/components/ui/button";
import { iconColors } from "../../../../tailwind.config";
import { useHover } from "@/hooks/use-hover";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const EditorTabComments = () => {
  const { comments } = useTabContext();

  return (
    <div>
      <EditorTabCommentsHeader />
      <Separator className="bg-logan-primary-300" />
      <Flex className="justify-between simpleSearchSquare px-4 py-2 gap-1">
        <Icon
          iconName="search"
          iconClassName="size-9"
          fill={iconColors["light-gray"]}
        />
        <Input
          className="h-6 w-full !border-none caret-logan-black p-1 text-logan-black !transition-none"
          placeholder="Search for a specific subject, comment, or user."
          type="text"
          autoFocus
        />
      </Flex>
      <Separator />
      <div className="p-4 bg-white">
        {comments.map((comment) => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

const EditorTabCommentsHeader = () => {
  const [isSwitched, setIsSwitched] = useState<boolean>(true);

  return (
    <Flex className="px-5 py-2 h-11 justify-between gap-x-2.5">
      <Label className="leading-7 font-semibold text-logan-black-foreground">
        Markup
      </Label>
      <Flex className="gap-2">
        <CommentHeaderButton iconName="filter" label="Opened" />
        <CommentHeaderButton iconName="filter" label="All comments" />
        <Flex className="bg-logan-primary-200 px-2 h-7 gap-2 rounded-md">
          <Icon
            iconName="commentleftlist"
            fill={isSwitched ? iconColors["light-gray"] : iconColors.from}
            onClick={() => setIsSwitched(false)}
          />
          <Switch
            className="w-9 h-4.5 !bg-white"
            thumbClassName="w-3.5 h-3.5 bg-logan-blue"
            checked={isSwitched}
            onCheckedChange={setIsSwitched}
          />
          <Icon
            iconName="commentrightlist"
            fill={isSwitched ? iconColors.from : iconColors["light-gray"]}
            onClick={() => setIsSwitched(true)}
          />
        </Flex>
        <ToolBarItem iconName="plus" isBlack={false} disabled={false} />
      </Flex>
    </Flex>
  );
};

type CommentHeaderButtonProps = {
  iconName: keyof typeof icons;
  label: string;
};

const CommentHeaderButton = ({ iconName, label }: CommentHeaderButtonProps) => {
  const { hover, handleMouseOut, handleMouseOver } = useHover();

  return (
    <Button
      size="xxm"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className=" !bg-logan-primary-200 border border-logan-primary-200 rounded-md !text-logan-black-foreground hover:!text-logan-blue hover:border-logan-blue text-xm"
    >
      {iconName && (
        <Icon
          iconName={iconName}
          fill={hover ? iconColors.from : iconColors["light-gray"]}
        />
      )}
      {label}
    </Button>
  );
};

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const { user } = useAuthContext();
  const fullName = user?.first_name + " " + user?.last_name;
  const nowDate = new Date().toLocaleDateString();
  // const dispatch = useDispatch();
  // const { editor } = useSelector((state: RootState) => state.commentsReducer);
  // const [reply, setReply] = useState<string>("");
  // const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);

  // const replies: Reply[] = comment.replies || [];
  // const replyCount: number = replies.length;

  // const handleSubmit = useCallback(async () => {
  //   if (reply.trim()) {
  //     await postReply(comment.comment_id, reply);
  //     dispatch(fetchAllComments(comment.document_id));
  //     setReply("");
  //   }
  // }, [reply, dispatch, comment.comment_id, comment.document_id]);

  // const handleArchiveComment = useCallback(async () => {
  //   try {
  //     await archiveComment(comment.comment_id);
  //     dispatch(fetchAllComments(comment.document_id));
  //     editor?.commands.changeCommentColor(
  //       comment.comment_id,
  //       "var(--logan-comment-archive)"
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [dispatch, comment.comment_id, comment.document_id, editor]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-logan-primary-700 px-3 py-4">
      <Flex className="justify-between">
        {/* User Information */}
        <Flex>
          <Avatar className="size-5">
            <AvatarImage
              src={comment?.avatar || "/favicon/favicon-32x32.png"}
              className="size-5"
              alt={`${comment?.name || "User"}'s avatar`}
            />
          </Avatar>
          <Label className="!text-xm font-semibold text-logan-black">
            {comment.name === fullName ? "You" : (comment.name ?? "User")}
          </Label>
        </Flex>
        {/* Date, Time, and Status */}
        <Flex className="!gap-2">
          <Label className="!text-xxm font-medium text-logan-primary-800">
            {comment.date === nowDate
              ? "Today"
              : (comment.date ?? "Unknown Date")}{" "}
            · {comment.time ?? "12:00 AM"}
          </Label>
          <Icon
            iconName={comment.status === "ACTIVE" ? "showeye" : "hiddeneye"}
            className="cursor-pointer"
          />
        </Flex>
      </Flex>

      <Label className="flex-1 !text-xm font-normal text-logan-black">
        {comment.content}
      </Label>

      {/* <div className="flex w-fit flex-col items-start justify-center gap-3">
        <button
          onClick={() => setIsReplyOpen((prev) => !prev)}
          className="rounded-lg bg-white p-1.5 px-2 text-left text-xs font-semibold leading-tight text-[#095AD3]"
        >
          {replyCount > 0 ? `${replyCount} Replies` : "Reply"}
        </button>

        {isReplyOpen && replyCount > 0 && (
          <div className="flex w-full flex-col items-start gap-[14px] rounded-lg bg-white p-[26px_32px]">
            {replies.map((reply, index) => (
              <div key={index} className="w-full">
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
                    <p className="text-left text-[13px] font-semibold leading-[15.73px]">
                      {reply.name || "User"}
                    </p>
                  </div>
                  <p className="text-left text-[9.6px] font-medium leading-[11.62px] text-[#095AD34D]">
                    {reply.date || "Today"} . {reply.time || "12:00 AM"}
                  </p>
                </div>
                <div className="my-[14px] flex-1">
                  <p className="text-left text-[13px] font-normal leading-[16.9px]">
                    {reply.content}
                  </p>
                </div>
                {index < replyCount - 1 && (
                  <hr className="mt-[14px] h-[1px] bg-[#095AD31A]" />
                )}
              </div>
            ))}
          </div>
        )}

        {isReplyOpen && (
          <div className="min-w-[20rem] p-1">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-0.5">
              <textarea
                name="query"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="max-h-[8rem] flex-1 resize-none overflow-x-hidden overflow-y-scroll bg-white px-2 pl-1 text-sm text-black-txt outline-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!reply.length}
                className="flex h-full w-[1rem] items-center gap-3"
              >
                {reply.length > 0 && (
                  <RemSizeImage
                    imagePath="/assets/icons/send-icon.svg"
                    remWidth={1.173}
                    remHeight={1.082}
                    alt="Send Button"
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

type FlexProps = {
  children: React.ReactNode;
  className?: string;
};

const Flex = ({ children, className = "" }: FlexProps) => (
  <div className={cn("flex items-center gap-3", className)}>{children}</div>
);
