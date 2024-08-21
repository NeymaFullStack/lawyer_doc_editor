"use client";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import RemSizeImage from "../generic/RemSizeImage";
import { getTimePassed } from "@/utils/dateUtils";
import { Button } from "antd";

const NotificationBox = ({
  unreadCount,
  notifications,
  onClose,
  sidebarWidth,
}) => {
  const boxRef = useRef(null);

  // Close notification box if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef]);

  return ReactDOM.createPortal(
    <div
      ref={boxRef}
      className="shadow-out-md fixed z-50 w-80 overflow-hidden rounded-lg border-[1.5px] border-secondary-blue bg-white transition-all duration-300 ease-in-out"
      style={{ left: `calc(${sidebarWidth}px + 16px)`, bottom: "16px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <h2 className=" w-fit text-lg font-semibold text-black-txt">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 p-2 py-[0.35rem] text-sm leading-3 text-blue-500">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <RemSizeImage
            imagePath={"/assets/icons/cross-icon.svg"}
            remWidth={1.3}
            remHeight={1.3}
            alt="User"
          />
        </button>
      </div>

      {/* Notification Items */}
      <div className="max-h-[30rem] min-h-[30rem] overflow-y-auto">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`flex cursor-pointer items-start gap-2 border-b p-3 py-4 ${notification?.status === "UNREAD" ? "bg-six" : ""} hover:bg-six`}
            onClick={onClose} // Close the box if a notification is clicked
          >
            <RemSizeImage
              imagePath={"/assets/icons/user-img.svg"}
              remWidth={1.65}
              remHeight={1.65}
              alt="User"
            />
            <div className="text-xs ">
              <p className="text-black-txt">
                {/* <span className="font-bold ">{notification.name}</span>{" "} */}
                {notification.message}
              </p>
              {notification.notification_type !== "ALERT" && (
                <div className="my-2 flex items-center gap-3">
                  <Button
                    onClick={() => {}}
                    className={`btn btn--primary h-7 !px-3 !py-0 text-xs !font-normal `}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {}}
                    className={`btn btn--white  h-7 !px-3 !py-0 text-xs !font-normal `}
                  >
                    Deny
                  </Button>
                </div>
              )}
              <p className="mt-1">
                <span>Lexington Ltd.</span>
                {" • "}
                <span>{getTimePassed(notification.created_at)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body, // Portal to render the notification box outside the usual DOM hierarchy
  );
};

export default NotificationBox;
