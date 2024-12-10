"use client";

import React, { memo, useState, useCallback } from "react";
import { formatTimestamp } from "@/lib/date";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  NotificationStatus,
  NotificationType,
  NotificationTypes,
  WorkpaceInvitationAction,
} from "./types";
import { Icon } from "../../components/icons";
import { useNotification } from "@/hooks/use-notification";
import { Bell } from "lucide-react";
import { iconColors } from "../../../tailwind.config";
import axiosInstance, { endpoints } from "@/lib/axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRefreshContext } from "@/layouts/main/refresh-context";

type NotificationPanelProps = {
  unreadCount: number;
  notifications: NotificationType[];
  onClose: () => void;
  handleRespondWorkspaceInvitation: (
    actionType: WorkpaceInvitationAction,
    notification: NotificationType
  ) => void;
};

const Notification: React.FC = () => {
  const {
    notificationsList,
    unreadCount,
    markAllAsRead,
    fetchAllNotification,
  } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { triggerWorkspaceRefresh } = useRefreshContext();

  const handleRespondWorkspaceInvitation = useCallback(
    async (
      actionType: WorkpaceInvitationAction,
      notification: NotificationType
    ) => {
      const respondParams = {
        notification_id: notification.id,
        user_invite_response_status: actionType,
        workspace_id: notification.metadata.workspace_id,
      };

      try {
        const res = await axiosInstance.post(
          endpoints.workspace.respondWorkspaceInvitation,
          respondParams,
          { headers: { "content-type": "application/json" } }
        );
        fetchAllNotification();
        triggerWorkspaceRefresh();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchAllNotification, triggerWorkspaceRefresh]
  );

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    markAllAsRead();
  };

  return (
    <Popover
      open={isNotificationOpen}
      onOpenChange={(open) => setIsNotificationOpen(open)}
    >
      <PopoverTrigger>
        <NotificationBell unreadCount={unreadCount} />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="bottom-4 p-0 w-88"
        sideOffset={40}
        alignOffset={40}
      >
        <NotificationPanel
          notifications={notificationsList}
          onClose={handleNotificationClose}
          unreadCount={unreadCount}
          handleRespondWorkspaceInvitation={handleRespondWorkspaceInvitation}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Notification;

const NotificationPanel = memo(
  ({
    unreadCount,
    notifications,
    onClose,
    handleRespondWorkspaceInvitation,
  }: NotificationPanelProps) => {
    return (
      <>
        <div className="flex items-center justify-between border-b p-2 px-3">
          <div className="flex items-center gap-2">
            <h2 className="text-black-txt w-fit text-lg font-semibold">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 p-2 py-[0.35rem] text-sm leading-3 text-blue-500">
                {unreadCount}
              </span>
            )}
          </div>

          <Icon
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            iconClassName="size-4"
            iconName="dialogclose"
          />
        </div>

        <div className="max-h-[30rem] min-h-[30rem] overflow-y-auto">
          {notifications?.map((notification, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-start gap-3 border-b p-3 py-4 ${
                notification.status === NotificationStatus.UNREAD
                  ? "bg-logan-primary-200"
                  : ""
              } hover:bg-logan-primary-200`}
              onClick={onClose}
            >
              <Avatar className="size-10">
                <AvatarImage src={""} />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="text-logan-black">{notification?.message}</p>
                {notification.notification_type ==
                  NotificationTypes.WORKSPACE_INVITATION && (
                  <div className="my-2 flex items-center gap-3">
                    <Button
                      size={"xm"}
                      variant={"primary-blue"}
                      className="text-xs font-light hover:!bg-white"
                      onClick={() => {
                        handleRespondWorkspaceInvitation(
                          WorkpaceInvitationAction.ACCEPTED,
                          notification
                        );
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size={"xm"}
                      variant={"outline"}
                      className="px-3 text-xs font-light hover:!bg-white"
                      onClick={() => {
                        handleRespondWorkspaceInvitation(
                          WorkpaceInvitationAction.REJECTED,
                          notification
                        );
                      }}
                    >
                      Deny
                    </Button>
                  </div>
                )}
                <p className="mt-1">
                  <span>{notification.created_by}</span>
                  {" • "}
                  <span>
                    {formatTimestamp(new Date(notification.created_at))}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
);
NotificationPanel.displayName = "NotificationPanel";

const NotificationBell = memo(({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="relative">
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 rounded-full p-1 bg-red-700"></span>
      )}
      <Bell size={20} color={iconColors.from} />
    </div>
  );
});

NotificationBell.displayName = "NotificationBell";
