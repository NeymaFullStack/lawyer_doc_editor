import React from "react";
import RemSizeImage from "./RemSizeImage";

function NavigationBreadCrumbs({ breadCrumbs }) {
  return (
    <>
      {breadCrumbs.length > 0 && (
        <div className="flex gap-3 items-center">
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
                    className=" cursor-pointer flex gap-1 items-center text-[0.813rem]"
                  >
                    <RemSizeImage
                      imagePath={"/assets/icons/arrow-down-gray.svg"}
                      remWidth={0.9}
                      remHeight={0.9}
                      alt={"Route"}
                      className={" -rotate-90"}
                    />
                    <span className="flex items-center gap-2 leading-none bg-black-txt py-[0.35rem] px-3 rounded-md text-white font-bold">
                      <RemSizeImage
                        imagePath={"/assets/icons/client-folder-white.svg"}
                        remWidth={0.9}
                        remHeight={0.9}
                        alt={"Route"}
                      />
                      <span>{route}</span>
                    </span>
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="cursor-pointer flex gap-1 items-center text-[0.813rem]"
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/arrow-down-gray.svg"}
                    remWidth={0.9}
                    remHeight={0.9}
                    alt={"Route"}
                    className={" -rotate-90"}
                  />
                  <span className="flex items-center gap-2 leading-none bg-secondary-blue py-[0.35rem] px-3 rounded-md font-semibold">
                    <RemSizeImage
                      imagePath={"/assets/icons/non-client-folder.svg"}
                      remWidth={0.9}
                      remHeight={0.9}
                      alt={"Route"}
                    />
                    <span>{route}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default NavigationBreadCrumbs;
