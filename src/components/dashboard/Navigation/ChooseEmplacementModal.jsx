import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Form } from "antd";
import Input from "antd/es/input/Input";
import React from "react";

function ChooseEmplacementModal({ open, onClose }) {
  return (
    <LoganModal
      onClickCancel={onCloseClientModal}
      modalOpen={open}
      width={"43.188rem"}
      closable={false}
    >
      <h2 className="font-bold text-2xl text-black">
        Choose <span className="text-primary-blue">How To Begin</span>
      </h2>
      <div className="mt-4">
        <Form
          labelCol={{ span: 24 }} // Adjust label column span as needed
          wrapperCol={{ span: 24 }} // Adjust wrapper column span as needed
          validateTrigger={[]}
        >
          <Form.Item
            name="clientName"
            label={"Client Name *"}
            rules={[{ required: true, message: "Field Required" }]}
          >
            <Input
              onChange={(e) => {
                setClientName(e.target.value);
              }}
              autoComplete="off"
              placeholder="Enter your name"
            />
          </Form.Item>
        </Form>
        {/* <label
      htmlFor="doc-name"
      className="text-[0.784rem] text-black font-semibold mt-10"
    >
      Client Name *
    </label>
    <input
      autoComplete="off"
      onChange={(e) => setClientName(e.target.value)}
      value={clientName}
      id="folder-name"
      type="text"
      className="my-4 focus:border-primary-blue border-[0.063rem] w-full border-secondary-blue h-[2.813rem] mt-2 rounded-xl pl-4 text-primary-gray text-sm"
    ></input> */}
      </div>
    </LoganModal>
  );
}

export default ChooseEmplacementModal;
