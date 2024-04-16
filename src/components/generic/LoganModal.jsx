import { Button } from "antd";
import Modal from "antd/es/modal/Modal";
import React from "react";
import RemSizeImage from "./RemSizeImage";

function LoganModal({
  modalOpen,
  applyButtonText,
  cancelButtonText,
  onClickApply,
  onClickCancel,
  children,
  className,
  width,
  footer = true,
  footerleft,
  applyButtonClass = "",
  cancelButtonClass = "",
  applyButtonIcon,
  cancelButtonIcon,
  customFooter,
  applyButtonHtmlType,
  cancelButtonHtmlType,
  closable,
  modalButtonsCLass,
  wrapClassName,
}) {
  return (
    <Modal
      closable={closable}
      wrapClassName={wrapClassName}
      destroyOnClose
      width={width}
      className={className}
      closeIcon={
        <RemSizeImage
          imagePath={"/assets/icons/cross-icon.svg"}
          remWidth={1.5}
          remHeight={1.5}
          alt={"Close"}
        />
        // <Image
        //   src={"/assets/icons/cross-icon.svg"}
        //   width={24}
        //   height={24}
        //   alt="Close"
        // />
      }
      onCancel={onClickCancel}
      open={modalOpen}
      footer={false}
    >
      {children}
      {footer &&
        (customFooter ? (
          customFooter
        ) : (
          <div
            className={`flex items-center ${
              footerleft ? "justify-between" : "justify-end"
            } mt-5`}
          >
            {footerleft}
            <div className={`flex gap-3 ${modalButtonsCLass}`}>
              {applyButtonText && (
                <Button
                  htmlType={cancelButtonHtmlType}
                  icon={applyButtonIcon}
                  onClick={() => onClickApply()}
                  className={`btn btn--primary text-xs ${applyButtonClass}`}
                >
                  {applyButtonText ? applyButtonText : "OK"}
                </Button>
              )}
              {cancelButtonText && (
                <Button
                  htmlType={applyButtonHtmlType}
                  icon={cancelButtonIcon}
                  onClick={() => onClickCancel()}
                  className={`btn btn--secondary text-xs ${cancelButtonClass}`}
                >
                  {cancelButtonText ? cancelButtonText : "Cancel"}
                </Button>
              )}
            </div>
          </div>
        ))}
    </Modal>
  );
}

export default LoganModal;
