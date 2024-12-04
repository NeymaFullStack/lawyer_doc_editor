import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AddWorkspaceUserModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const AddWorkspaceUserModal = ({
  open,
  setOpen,
}: AddWorkspaceUserModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[40rem] max-w-[40rem] !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-logan-black">
            Add User
          </DialogTitle>
          <DialogDescription className="text-xs text-logan-black-foreground">
            Invite new members to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-w-full items-center overflow-hidden">
          <EmailTagInput />
          <Select defaultValue={"administrator"}>
            <SelectTrigger className="h-11 w-36 shrink-0 rounded-l-none py-0 ring-0 focus:ring-0 [&>span]:font-medium">
              <SelectValue
                className="font-semibold"
                placeholder={"Your Role"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"administrator"}>Administrator</SelectItem>
              <SelectItem value="teamMember">Team Member</SelectItem>
            </SelectContent>
          </Select>
          <Button className="text-logan-blue !no-underline" variant={"link"}>
            Send Invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmailTagInput = memo(() => {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const addTag = (tag: string): void => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);

    if (isValidEmail && !tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag]);
      setInput("");
    }
  };

  const removeTag = (index: number): void => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "scrollbar-hide h-11 !max-w-[75%] flex-1 gap-2 overflow-x-auto rounded-md rounded-r-none border border-r-0 px-3 py-1",
        tags.length > 0 && "flex items-center gap-2",
      )}
    >
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 rounded-xl bg-logan-primary-200 p-2 py-0 text-xs leading-tight text-gray-800 hover:bg-logan-primary-200"
            >
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(index)}
                className="ml-1 h-7 p-0 text-gray-500 hover:text-gray-800"
                aria-label={`Remove ${tag}`}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type email and press Enter"
        className="h-8 w-full min-w-full max-w-full flex-1 overflow-hidden border-none p-0 focus-visible:ring-0"
        aria-label="Email input field"
      />
    </div>
  );
});
EmailTagInput.displayName = "EmailTagInput";
