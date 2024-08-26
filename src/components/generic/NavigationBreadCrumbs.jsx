"use client";
import React, { useState } from "react";
import RemSizeImage from "./RemSizeImage";
import { useRouter } from "next/navigation";
import ClientPageDrawer from "../dashboard/clientPage/ClientPageDrawer";

function NavigationBreadCrumbs({ breadCrumbs }) {
  const router = useRouter();
  const [openClientPage, setOpenClientPage] = useState(false);
  console.log("bread", breadCrumbs);
  return (
    <>
      {breadCrumbs.length > 0 && (
        <div className="flex items-center gap-3">
          {
            <RemSizeImage
              imagePath={"/assets/icons/bread-crumb.svg"}
              remWidth={1.023}
              remHeight={1.023}
              alt={"New"}
            />
          }
          <ul className="flex items-center gap-2">
            {breadCrumbs.map((route, index) => {
              if (index == 0) {
                return (
                  <li
                    key={index}
                    className=" flex  items-center gap-1 !text-xs text-[0.813rem]"
                  >
                    <RemSizeImage
                      imagePath={"/assets/icons/arrow-down-gray.svg"}
                      remWidth={0.9}
                      remHeight={0.9}
                      alt={"Route"}
                      className={" -rotate-90"}
                    />
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => {
                          router.push(route.href);
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-black-txt px-3 py-[0.35rem] font-semibold leading-normal text-white"
                      >
                        <RemSizeImage
                          imagePath={"/assets/icons/client-folder-white.svg"}
                          remWidth={0.9}
                          remHeight={0.9}
                          alt={"Route"}
                        />
                        <span>{route?.name}</span>
                      </span>
                      <span
                        onClick={() => {
                          setOpenClientPage(true);
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-primary-blue px-3 py-[0.35rem] font-semibold leading-normal text-white"
                      >
                        <RemSizeImage
                          imagePath={"/assets/icons/client-folder-white.svg"}
                          remWidth={0.9}
                          remHeight={0.9}
                          alt={"Client"}
                        />
                        <span>Client Page</span>
                      </span>
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="flex cursor-pointer items-center gap-1 !text-xs"
                  onClick={() => {
                    router.push(route.href);
                  }}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/arrow-down-gray.svg"}
                    remWidth={0.9}
                    remHeight={0.9}
                    alt={"Route"}
                    className={" -rotate-90"}
                  />
                  <span className="flex items-center gap-2 rounded-md bg-secondary-blue px-3 py-[0.35rem] font-semibold leading-normal">
                    <RemSizeImage
                      imagePath={"/assets/icons/non-client-folder.svg"}
                      remWidth={0.9}
                      remHeight={0.9}
                      alt={"Route"}
                    />
                    <span>{route.name}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {openClientPage && (
            <ClientPageDrawer
              isOpen={openClientPage}
              setIsOpen={setOpenClientPage}
              onClose={() => {
                setOpenClientPage(false);
              }}
              showFooter={false}
            />
          )}
        </div>
      )}
    </>
  );
}

export default NavigationBreadCrumbs;
