import React, { useState, useCallback } from "react";
import {
  Comment,
  defaultAvatar,
  Reply,
  useTabContext,
} from "./use-tab-context";
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
import { useParams } from "next/navigation";
import { getNewComment } from "../editor-panel/components/editor-comment";
import { Textarea } from "@/components/ui/textarea";

export const EditorTabComments = () => {
  const { comments, setComments } = useTabContext();
  const { user } = useAuthContext();
  const document_id = useParams()["document-id"];
  const avatar = user?.profile_logo;
  const name = user?.first_name + " " + user?.last_name;
  const [content, setContent] = useState<string>("");
  const [isNew, setIsNew] = useState<boolean>(false);

  const handleNewAnswer = () => {
    setContent("");
    setIsNew(!isNew);
  };

  const newCreateComment = () => {
    const newComment = getNewComment(`${document_id}`, avatar, name, content);
    setComments((prevComments) => [newComment, ...prevComments]);

    setIsNew(false);
  };

  return (
    <div>
      <EditorTabCommentsHeader onClick={handleNewAnswer} isNew={isNew} />
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
      <div className="grid gap-4 p-4 bg-white">
        {isNew && (
          <form
            onSubmit={newCreateComment}
            className="flex w-full flex-col gap-3 rounded-xl bg-logan-primary-700 px-3 py-4"
          >
            <CommentCardHeader avatar={avatar} name="You" status="ACTIVE" />
            <Flex className="simpleSearchSquare bg-white px-2 py-1 border border-white rounded-xl hover:border-logan-blue">
              <Input
                className="!border-none caret-logan-black p-1 h-6 text-logan-black !transition-none"
                placeholder="Answer"
                value={content}
                autoFocus
                required
                onChange={(e) => setContent(e.target.value)}
              />
              <ToolBarItem
                iconName="sendplane"
                className="bg-white"
                disabled={content ? false : true}
                onClick={newCreateComment}
              />
            </Flex>
          </form>
        )}
        {comments.map((comment) => (
          <CommentCard
            key={comment.comment_id}
            comment={comment}
            fullName={name}
            avatar={avatar}
          />
        ))}
      </div>
    </div>
  );
};

type EditorTabCommentsHeaderProps = {
  onClick: () => void;
  isNew: boolean;
};

const EditorTabCommentsHeader = ({
  onClick,
  isNew,
}: EditorTabCommentsHeaderProps) => {
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
        <ToolBarItem
          iconName="plus"
          isSelected={isNew}
          isBlack={false}
          disabled={false}
          onClick={onClick}
        />
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
  fullName: string;
  avatar: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  fullName,
  avatar,
}) => {
  const nowDate = new Date().toLocaleDateString();
  const [reply, setReply] = useState<string>("");
  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);

  const replies: Reply[] = comment.replies || [];
  const replyCount: number = replies.length;

  const handleSubmit = useCallback(async () => {
    replies.push({
      avatar: avatar,
      name: fullName,
      date: nowDate,
      time: new Date().toLocaleTimeString(),
      content: reply,
    });
    console.log("replies: ", replies);
    setReply("");
  }, [reply, replies]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-logan-primary-700 px-3 py-4">
      <CommentCardHeader
        avatar={comment.avatar || ""}
        name={comment.name === fullName ? "You" : (comment.name ?? "User")}
        date={
          comment.date === nowDate ? "Today" : (comment.date ?? "Unknown Date")
        }
        time={comment.time ?? "12:00 AM"}
        status={comment.status}
      />

      <Label className="flex-1 !text-sm font-normal text-logan-black">
        {comment.content}
      </Label>

      <Flex className="flex-col items-start justify-center">
        <Flex className="rounded-full bg-white p-1.5 px-2">
          <Label
            onClick={() => setIsReplyOpen((prev) => !prev)}
            className="!text-xm font-semibold leading-tight text-logan-blue cursor-pointer"
          >
            {replyCount > 0 ? `${replyCount} Replies` : "Reply"}
          </Label>
          {replyCount > 0 && (
            <Flex className="gap-0">
              {replies.map((reply, index) => (
                <CommentAvatar
                  key={index}
                  avatar={reply.avatar || ""}
                  name={reply.name}
                />
              ))}
            </Flex>
          )}
        </Flex>

        {isReplyOpen && replyCount > 0 && (
          <Flex className="w-full flex-col items-start rounded-lg bg-white p-6">
            {replies.map((reply, index) => (
              <div key={index} className="w-full">
                <CommentCardHeader
                  avatar={reply.avatar || ""}
                  name={reply.name === fullName ? "You" : (reply.name ?? "")}
                  date={
                    reply.date === nowDate
                      ? "Today"
                      : (reply.date ?? "Unknown Date")
                  }
                  time={reply.time ?? "12:00 AM"}
                />
                <Label className="flex-1 !text-sm font-normal text-logan-black my-3">
                  {reply.content}
                </Label>
                {index < replyCount - 1 && (
                  <Separator className="mt-3 bg-logan-primary-300" />
                )}
              </div>
            ))}
          </Flex>
        )}

        {isReplyOpen && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-2 w-96"
          >
            <Flex className="gap-2 font-extralight simpleSearchSquare">
              <Textarea
                name="query"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="flex-1 resize-none bg-white px-2 outline-none border-none"
                required
              />
              <CommentAvatar avatar={avatar} />
            </Flex>
          </form>
        )}
      </Flex>
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

type CommentAvatarProps = {
  avatar: string;
  name?: string;
};

const CommentAvatar = ({ avatar, name }: CommentAvatarProps) => (
  <Avatar className="size-5">
    <AvatarImage
      src={avatar || defaultAvatar}
      className="size-5"
      alt={`${name ? name + "'s " : "Your "} avatar`}
    />
  </Avatar>
);

type CommentAvatarLabelProps = {
  label: string;
};

const CommentAvatarLabel = ({ label }: CommentAvatarLabelProps) => (
  <Label className="!text-xm font-semibold text-logan-black">{label}</Label>
);

type CommentCardHeaderProps = {
  avatar: string;
  name: string;
  date?: string;
  time?: string;
  status?: "ACTIVE" | "ARCHIVED";
};

const CommentCardHeader = ({
  avatar,
  name,
  date,
  time,
  status,
}: CommentCardHeaderProps) => (
  <Flex className="justify-between">
    <Flex>
      <CommentAvatar avatar={avatar} name={name} />
      <CommentAvatarLabel label={name} />
    </Flex>
    <Flex className="!gap-2">
      <Label className="!text-xxm font-medium text-logan-primary-800">
        {date} · {time}
      </Label>
      {status && (
        <Icon
          iconName={status === "ACTIVE" ? "showeye" : "hiddeneye"}
          onClick={() => {}}
        />
      )}
    </Flex>
  </Flex>
);
