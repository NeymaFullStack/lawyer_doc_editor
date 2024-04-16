import React, { useEffect } from "react";

function Stepper({ totalSteps, stepActiveColor, currentStep = 1 }) {
  const stepsArray = new Array(totalSteps).fill("0");
  return (
    <div className="flex gap-3 items-center">
      <ul className="flex gap-2 items-center">
        {stepsArray.map((item, index) => {
          return (
            <li
              key={index}
              className={`rounded-xl w-[2.2rem] h-[0.7rem] ${
                index + 1 <= currentStep ? stepActiveColor : "bg-secondary-blue"
              }`}
            ></li>
          );
        })}
      </ul>
      <div className="text-lg font-medium text-primary-blue">
        <span>{currentStep}</span> / <span>{totalSteps}</span>
      </div>
    </div>
  );
}

export default Stepper;
