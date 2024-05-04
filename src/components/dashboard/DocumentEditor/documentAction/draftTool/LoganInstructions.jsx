import RemSizeImage from "@/components/generic/RemSizeImage";
import Image from "next/image";
import React from "react";

function LoganInstructions() {
  return (
    <div className="flex  items-center justify-center text-justify">
      <div className="px-16 py-8">
        <div className="m-auto flex flex-col items-center gap-1 ">
          <RemSizeImage
            imagePath={"/assets/icons/gpt-icon.svg"}
            remWidth={0.938}
            remHeight={1.313}
            alt={"GPT"}
          />

          <h2 className="font-bold">Welcome!</h2>
          <p>
            {`I am Logan, your AI-powered legal assistant designed to revolutionize the way you handle legal documents. Here's how I can assist you:`}
          </p>
        </div>
        <ul className="mt-5 flex list-disc flex-col gap-1 leading-4">
          <li>
            <strong>Content Review:</strong> Access my ability to review
            documents and related files for advice and improvements.
          </li>
          <li>
            <strong>Document Enhancement:</strong> Request rephrasing for
            clarity, compare sections to legal standards, and boost document
            robustness.{" "}
          </li>
          <li>
            <strong>Legal Guidance:</strong> Get explanations on terms, advice
            on document integration, and risk assessments.
          </li>
          <li>
            <strong>Accessibility:</strong> Make documents clearer for
            non-experts without losing legal accuracy.
          </li>
          <li>
            <strong>Efficiency:</strong> Eliminate redundancies, summarize
            annexes, and integrate related documents smoothly.
          </li>
          <li>
            <strong>Gap Identification:</strong> Spot potential legal gaps for
            clarification and suggest updated legal terms.
          </li>
          <li>
            <strong>Consistency Checks:</strong> Ensure the feasibility of
            clauses and consistent terminology use.
          </li>
          <li>
            <strong>Conflict Checks:</strong> Identify potential conflicts of
            interest
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LoganInstructions;
