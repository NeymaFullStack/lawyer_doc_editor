import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { Button, Progress } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalType } from "./FolderDocCreation";
const twoColors = {
  "0%": "#108ed1",
  "100%": "#108ee9",
};
// background: linear-gradient(26.59deg, rgba(9, 90, 211, 0.71) 16.66%, rgba(12, 94, 219, 0.71) 33.78%, rgba(22, 111, 244, 0.71) 50.9%, rgba(22, 111, 244, 0.2556) 68.01%);

function ProgressModal({ open, onClose, cancelAiTemplateGeneration }) {
  const appDispatch = useDispatch();
  const [progress, setProgress] = useState(0.2);
  useEffect(() => {
    let timer;

    const updateProgress = () => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.2;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    };

    timer = setInterval(updateProgress, 100); // Adjust the interval as needed

    return () => {
      setProgress(100);
      clearInterval(timer);
    };
  }, []);

  // console.log(progress);

  return (
    <LoganModal
      closable={false}
      modalOpen={open}
      width={"45rem"}
      className={"relative"}
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => {
              cancelAiTemplateGeneration();
              appDispatch(
                folderNavigationAction.setOpenModalType(
                  modalType.CREATE_DOCUMENT,
                ),
              );
              onClose(true, {
                language: { label: "English", value: "en" },
                legalPlayground: { label: "United States", value: "US" },
              });
            }}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/left-arrow-grey.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            className={`btn btn--normal`}
          >
            Back
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-bold text-black">
          Take 1 minute now to{" "}
          <span className="text-primary-blue">Save hours</span> down the line
        </h2>
        <RemSizeImage
          imagePath={"/assets/icons/poweredby-ai.svg"}
          remWidth={8}
          remHeight={2}
          alt={"AI"}
        />
      </div>
      <div className="flex items-center justify-center">
        <Progress
          showInfo={false}
          size={"0.6rem"}
          className="mb-4 mt-7 w-[83%]"
          percent={progress}
          trailColor="#E6EEFB"
          strokeColor={
            "linear-gradient(to left, rgba(9, 90, 211, 0.71) 16.66%, rgba(12, 94, 219, 0.71) 33.78%, rgba(22, 111, 244, 0.71) 50.9%, rgba(22, 111, 244, 0.2556) 68.01%)"
          }
        />
      </div>
    </LoganModal>
  );
}

export default ProgressModal;
