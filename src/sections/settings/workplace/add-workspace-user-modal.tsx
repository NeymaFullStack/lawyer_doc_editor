import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import axiosInstance, { endpoints } from "@/lib/axios";
import { userRoleOptions } from "../config-settings-view";
import { UserRole } from "../types";

type AddWorkspaceUserModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeModalActions: () => void;
};

export const AddWorkspaceUserModal = ({
  open,
  setOpen,
  closeModalActions,
}: AddWorkspaceUserModalProps) => {
  const inviteUsersRef = useRef<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const handleInviteUsers = useCallback(async () => {
    if (inviteUsersRef.current.length === 0) {
      alert("Please enter atleast one email address");
      return;
    }

    // TODO: add logic to invite users
    try {
      const res = await axiosInstance.post(
        endpoints.workspace.inviteUser,
        {
          user_emails: inviteUsersRef.current,
          role: selectedRole,
        },
        { headers: { "content-type": "application/json" } }
      );
      closeModalActions();
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  }, [inviteUsersRef, selectedRole, setOpen]);

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
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Invite New Member</h3>
          <div className="flex max-w-full items-center overflow-hidden">
            <EmailTagInput
              saveEmails={(emails: string[]) => {
                inviteUsersRef.current = emails;
              }}
            />
            <Select
              value={selectedRole}
              onValueChange={(value: UserRole) => {
                setSelectedRole(value);
              }}
            >
              <SelectTrigger className="h-11 w-[9.5rem] shrink-0 text-left rounded-l-none py-0 ring-0 focus:ring-0 [&>span]:font-medium focus-within:!border-border">
                <SelectValue
                  className="font-semibold"
                  placeholder={"Your Role"}
                />
              </SelectTrigger>
              <SelectContent>
                {userRoleOptions.map((option, index) => {
                  return (
                    <SelectItem key={option?.value} value={option?.value}>
                      {option?.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              onClick={handleInviteUsers}
              className="text-logan-blue !no-underline"
              variant={"link"}
            >
              Send Invite
            </Button>
          </div>{" "}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmailTagInput = memo(
  ({ saveEmails }: { saveEmails: (emails: string[]) => void }) => {
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

    useEffect(() => {
      saveEmails(tags);
    }, [tags]);

    const removeTag = (index: number): void => {
      setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    return (
      <div
        className={cn(
          "scrollbar-hide h-11 !max-w-[75%] flex-1 gap-2 overflow-x-auto rounded-md rounded-r-none border border-r-0 px-3 py-1",
          tags.length > 0 && "flex items-center gap-2"
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
          className="h-8 w-full min-w-full max-w-full flex-1 overflow-hidden !border-none outline-none"
          aria-label="Email input field"
        />
      </div>
    );
  }
);
EmailTagInput.displayName = "EmailTagInput";
