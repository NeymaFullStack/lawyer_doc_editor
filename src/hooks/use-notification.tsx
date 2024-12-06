import { useState, useEffect, useCallback } from "react";

import {
  NotificationStatus,
  NotificationType,
} from "@/sections/notification/types";
import axiosInstance, { endpoints } from "@/lib/axios";
import { STORAGE_KEY } from "@/auth/context/auth-provider";
import { WORKPACE_KEY } from "@/auth/context/utils";
import EventSource from "@/polyfills/eventSource";
import { useFetcher } from "./use-fetcher";
import { HOST_API } from "@/config-global";

const fetchNotificationList = async (): Promise<{
  data: NotificationType[];
  status: string;
}> => {
  const res = await axiosInstance.get(endpoints.notification.allNotifications);
  return res.data;
};

export const useNotification = () => {
  const { data, refetch } = useFetcher(fetchNotificationList, []);
  const [notificationsList, setNotificationsList] = useState<
    NotificationType[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [eventSourceRetry, setEventSourceRetry] = useState(true);

  useEffect(() => {
    const accessToken = sessionStorage.getItem(STORAGE_KEY);
    const workplaceId = sessionStorage.getItem(WORKPACE_KEY);
    let eventSource: EventSource;
    if (workplaceId && accessToken) {
      try {
        eventSource = new EventSource(
          `http://localhost:7003${endpoints.notification.listen}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              workplace_id: workplaceId,
            },
          }
        );

        eventSource.onmessage = (event: MessageEvent) => {
          const newNotification = JSON.parse(JSON.parse(event.data));
          const newNotificationList = [newNotification, ...notificationsList];
          const unreadCount = newNotificationList.filter(
            (notification) => notification.status === NotificationStatus.UNREAD
          ).length;
          setUnreadCount(unreadCount);
          setNotificationsList(newNotificationList);
        };

        eventSource.onerror = () => {
          eventSource?.close();
        };
      } catch (error) {
        console.error(error);
        setEventSourceRetry((prev) => !prev);
      }
    }

    return () => {
      eventSource?.close();
    };
  }, [eventSourceRetry, notificationsList]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const unreadCount = data.filter(
        (notification) => notification.status === NotificationStatus.UNREAD
      ).length;
      setUnreadCount(unreadCount);
      setNotificationsList(data);
    }
  }, [data]);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await axiosInstance.put(
        endpoints.notification.markNotificationRead,
        { headers: { "content-type": "application/json" } }
      );
      refetch();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    notificationsList,
    unreadCount,
    fetchAllNotification: refetch,
    markAllAsRead,
  };
};
