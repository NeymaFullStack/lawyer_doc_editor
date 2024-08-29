"use client";
import React, { useEffect, useState } from "react";
import RemSizeImage from "../generic/RemSizeImage";
import NotificationBox from "./NotificationBox";
import {
  getAllNotifications,
  markAllNotificationSeen,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { appAction } from "@/redux/appSlice";
import { useSelector } from "react-redux";
import EventSource from "@/utils/polyfills/eventSource";
import { getNewNotificationsUrl } from "@/api/serviceUrl";
import { getCookie } from "cookies-next";
// const notifications = [
//   {
//     name: "Alexandra Martin",
//     message:
//       "tagged you in a comment on the document Corporate Governance Guidelines.",
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//   },
//   {
//     name: "Diana Hawthorne",
//     message: 'has invited you to join the "Heritage LLP" workspace.',
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//     actions: [{ label: "Accept" }, { label: "Deny" }],
//   },
//   {
//     name: "Alexandra Martin",
//     message:
//       "tagged you in a comment on the document Corporate Governance Guidelines.",
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//   },
//   {
//     name: "Diana Hawthorne",
//     message: 'has invited you to join the "Heritage LLP" workspace.',
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//     actions: [{ label: "Accept" }, { label: "Deny" }],
//   },
//   {
//     name: "Alexandra Martin",
//     message:
//       "tagged you in a comment on the document Corporate Governance Guidelines.",
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//   },
//   {
//     name: "Diana Hawthorne",
//     message: 'has invited you to join the "Heritage LLP" workspace.',
//     timestamp: dayjs(),
//     avatar: "https://via.placeholder.com/40",
//     actions: [{ label: "Accept" }, { label: "Deny" }],
//   },
//   // Add more notifications here...
// ];
function Notification() {
  const appDispatch = useDispatch();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [unreadCount, setUnreadCount] = useState(0);
  const [eventSourceRetry, setEventSourceRetry] = useState(true);
  const { notificationsList } = useSelector((state) => state.appReducer);
  useEffect(() => {
    let NotificatioEventUrl = `http://localhost:7003${getNewNotificationsUrl}`;
    // let NotificatioEventUrl = `http://ec2-54-201-201-255.us-west-2.compute.amazonaws.com:7003${getNewNotificationsUrl}`;
    let eventSource;
    if (getCookie("authToken")) {
      try {
        eventSource = new EventSource(`${NotificatioEventUrl}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(getCookie("authToken"))}`,
          },
        });

        eventSource.onmessage = (event) => {
          const newNotification = JSON.parse(JSON.parse(event.data));
          console.log("newNotification", newNotification);
          let newNotificationList = [newNotification, ...notificationsList];
          const unreadCount = _.filter(newNotificationList, {
            status: "UNREAD",
          }).length;
          setUnreadCount(unreadCount);
          appDispatch(appAction.setNotificationsList(newNotificationList));
        };
        eventSource.onerror = () => {
          eventSource.close();
          setEventSourceRetry((prev) => !prev);
        };
      } catch (error) {
        console.log(error);
        setEventSourceRetry((prev) => !prev);
      }
    }

    return () => {
      eventSource && eventSource.close();
    };
  }, [eventSourceRetry]);

  useEffect(() => {
    getAllNotification();
  }, []);

  // console.log("notificationsList", notificationsList);
  return (
    <div
      className=" ml-auto cursor-pointer"
      onClick={() => setIsNotificationOpen(true)}
    >
      <RemSizeImage
        imagePath={`/assets/icons/${unreadCount > 0 ? "solid-blue-bell" : "outline-blue-bell"}.svg`}
        remWidth={1.65}
        remHeight={1.65}
        alt="bell"
      />

      {isNotificationOpen && (
        <NotificationBox
          notifications={notificationsList}
          onClose={onClose}
          sidebarWidth={sidebarWidth}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
  async function getAllNotification() {
    const res = await getAllNotifications();
    if (res?.length > 0) {
      const unreadCount = _.filter(res, {
        status: "UNREAD",
      }).length;
      setUnreadCount(unreadCount);
      appDispatch(appAction.setNotificationsList(res));
    }
  }

  function onClose() {
    setIsNotificationOpen(false);
    markAllNotificationSeen();
    if (notificationsList.length > 0) {
      const updatedItems = _.map(notificationsList, (item) =>
        _.assign({}, item, { status: "READ" }),
      );
      appDispatch(appAction.setNotificationsList(updatedItems));
      setUnreadCount(0);
    }
  }
}

export default Notification;
