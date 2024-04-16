import RemSizeImage from "@/components/generic/RemSizeImage";
import Image from "next/image";
import React from "react";

function LoganInstructions() {
  return (
    <div className="px-4 pt-2">
      <div className="text-center m-auto flex flex-col items-center gap-1">
        <RemSizeImage
          imagePath={"/assets/icons/gpt-icon.svg"}
          remWidth={0.938}
          remHeight={1.313}
          alt={"GPT"}
        />
        {/* <Image
          src={"/assets/icons/gpt-icon.svg"}
          width={15}
          height={21}
          alt="New"
        /> */}
        <h2 className="font-bold">Welcome!</h2>
        <p>
          {`I'm logan,and I'm here to help you generate leagal documents based on
          your specific needs.`}
        </p>
        <p className="leading-[0.5rem]">{`Here's how to proceed`}</p>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="bg-five p-2 rounded-lg">
          <h2 className="font-bold">Documentary Base</h2>
          <div className="ml-5">
            <ul className="list-disc leading-4">
              <li>
                Add any relevant document or information that could help me
                understand your request.
              </li>
              <li>
                This can include contracts, excerpts from specific clauses,
                guidelines, or examples.
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-five p-2 rounded-lg">
          <h2 className="font-bold">Dynamic Document Preview</h2>
          <div className="ml-5">
            <ul className="list-disc leading-4">
              <li>
                On your right you will find the preview of the dynamic document
                being created.
              </li>
              <li>
                It updates in real-time bases on the content of our discussions.
              </li>
              <li>
                This document is interactive.IF you make changes to the segment.
                I will incorporate into he continuity of our conversation.
              </li>
              <li>
                Feel free to save an intermediate version of the document at
                your convenience.
              </li>
              <li>
                To draw my attendtion to particular sections, you can also use
                the highlighter.
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-five p-2 rounded-lg">
          <h2 className="font-bold">Our exchanges, powered by Chat GPT 4</h2>
          <div className="ml-5">
            <ul className="list-disc leading-4">
              <li>
                Ask your question, give directives, or request specific sections
                for your document in this chat.
              </li>
              <li>
                {`For example: "Write me a confidentiality clause for a service
                contract" or "I would like a paragraph on sanctions in case of
                non-compliance with obligations."`}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="font-bold p-2 py-4 text-center leading-4">
        To start, please describe the type of document you wish to generate or
        ask your first question.
      </p>
    </div>
  );
}

export default LoganInstructions;
