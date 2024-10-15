"use client";
import { appAction } from "@/redux/appSlice";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NewButtonActionsDropDown from "./NewButtonActionsDropDown";
import RemSizeImage from "../generic/RemSizeImage";
import LoganDropDown from "../generic/LoganDropDown";
import FolderDocCreation from "../dashboard/Navigation/FolderDocCreation";
import WorkSpaceSelector from "./WorkSpaceSelector";
import Notification from "./Notification";
import { useParams, usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import {
  dashboardRoute,
  settingsRoute,
  tempelatedRoute,
} from "@/constants/routes";
import { cn } from "@/utils/shadcn-utils";

function Sidebar() {
  const pathName = usePathname();
  const params = useParams();
  console.log("okhdd", pathName, params);
  const router = useRouter();
  return (
    <aside
      id="logo-sidebar"
      className="absolute left-0 top-0 z-20 h-screen w-60 -translate-x-full text-xs transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <FolderDocCreation />

      <div className="h-full overflow-y-auto py-4">
        <div className="my-[1.875rem] mb-16 ml-5">
          <div
            className={"w-[50%] cursor-pointer"}
            onClick={() => {
              router.push(dashboardRoute);
            }}
          >
            <Image
              src="/assets/icons/logan-logo.svg"
              height={25}
              width={120}
              alt="Logan"
              priority
            />
          </div>
        </div>
        <WorkSpaceSelector />
        <LoganDropDown
          placement="bottomRight"
          trigger={"hover"}
          baseElement={
            <Button
              className="btn btn--primary mb-8 ml-5 mt-10 text-xs"
              icon={
                <RemSizeImage
                  imagePath={"/assets/icons/add-white.svg"}
                  remWidth={1.343}
                  remHeight={1.343}
                  alt={"New"}
                />
              }
            >
              New
            </Button>
          }
          customDropDownMenu={({ closeMenu }) => (
            <NewButtonActionsDropDown onClose={closeMenu} />
          )}
        />

        <ul className="w-full border-t-[0.063rem] border-hr-line font-medium ">
          <li className="border-b-[0.063rem] border-hr-line py-2 pl-3">
            <div className="w-[55%]">
              <Link href={dashboardRoute}>
                <div
                  className={
                    "flex cursor-pointer items-center gap-5 rounded-lg p-2 hover:bg-five hover:text-primary-blue" +
                    (pathName.startsWith(dashboardRoute)
                      ? " text-primary-blue"
                      : "")
                  }
                >
                  <RemSizeImage
                    imagePath={
                      pathName.startsWith(dashboardRoute)
                        ? `/assets/icons/dashboard-active.svg`
                        : `/assets/icons/dashboard.svg`
                    }
                    remWidth={1.023}
                    remHeight={1.023}
                    alt={"Dashboard"}
                  />
                  <span>Dashboard</span>
                </div>
              </Link>
            </div>
          </li>
          <li className="border-b-[0.063rem] border-hr-line py-2 pl-3">
            <div className="w-[55%]">
              <Link href={tempelatedRoute}>
                <div
                  className={
                    "flex cursor-pointer items-center gap-5 rounded-lg p-2 hover:bg-five hover:text-primary-blue" +
                    (pathName.startsWith(tempelatedRoute)
                      ? " text-primary-blue"
                      : "")
                  }
                >
                  <RemSizeImage
                    imagePath={
                      pathName.startsWith(tempelatedRoute)
                        ? "/assets/icons/template-active.svg"
                        : "/assets/icons/template.svg"
                    }
                    remWidth={1.023}
                    remHeight={1.023}
                    alt="Template"
                  />

                  <span>Templates</span>
                </div>
              </Link>
            </div>
          </li>
        </ul>
        <ul className="absolute bottom-0 mb-5 flex w-full flex-col gap-2 ">
          <li className="pl-5 !text-primary-gray">MORE</li>
          <li className="pl-5">
            <Link
              href={settingsRoute}
              className={cn("flex items-center gap-4 ")}
            >
              <RemSizeImage
                imagePath={"/assets/icons/settings-icon.svg"}
                remWidth={1.25}
                remHeight={1.25}
                alt="Settings"
              />
              <span
                className={cn(
                  "text-primary-gray",
                  pathName.startsWith(settingsRoute) && " text-primary-blue",
                )}
              >
                Settings
              </span>
            </Link>
          </li>
          <li className="pl-5">
            <div className={"flex cursor-pointer items-center gap-4"}>
              <RemSizeImage
                imagePath={"/assets/icons/help-icon.svg"}
                remWidth={1.25}
                remHeight={1.25}
                alt="Account"
              />
              <span className={"!text-primary-gray"}>Help</span>
            </div>
          </li>
          <li className="pl-5">
            <div
              className={"flex cursor-pointer items-center gap-4"}
              onClick={() => {
                deleteCookie("authToken");
                location.reload();
              }}
            >
              <RemSizeImage
                imagePath={"/assets/icons/logout-icon.svg"}
                remWidth={1.25}
                remHeight={1.25}
                alt="Account"
              />
              <span className={"!text-primary-gray"}>Logout</span>
            </div>
          </li>
          <li className="mx-3 mt-3 flex items-center gap-2 rounded-xl border-[1px] border-secondary-blue px-2 py-2">
            <RemSizeImage
              imagePath={"/assets/icons/user-img.svg"}
              remWidth={1.65}
              remHeight={1.65}
              alt="User"
            />
            <div className="flex flex-col justify-center ">
              <span className="text-sm font-semibold leading-3 text-black-txt">
                Paul Smith
              </span>
              <span className="text-xs">paul.s@lexington.com</span>
            </div>
            <Notification />
          </li>
        </ul>
      </div>
    </aside>
  );

  //   function onClickMenuItem(item) {
  //     appDispatch(appAction.setCurrentActiveMenu(item));
  //   }
}

export default Sidebar;
