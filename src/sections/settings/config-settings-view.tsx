import React, { ReactNode } from "react";
import Image from "next/image";

type Option = {
  label: ReactNode;
  value: string;
};

// Country Code Options
export const countryCodeOptions: Option[] = [
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <Image
          src="/assets/uk.svg"
          width={18}
          height={18}
          alt="Picture of the author"
        />
        <span>+33</span>
      </div>
    ),
    value: "+33",
  },
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <Image
          src="/assets/uk.svg"
          width={18}
          height={18}
          alt="Picture of the author"
        />
        <span>+44</span>
      </div>
    ),
    value: "+44",
  },
];

// Country Options
export const countryOptions: Option[] = [
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <Image
          src="/assets/uk.svg"
          width={18}
          height={18}
          alt="Picture of the author"
        />
        <span>France</span>
      </div>
    ),
    value: "france",
  },
  {
    label: (
      <div className="flex items-center gap-[0.35rem]">
        <Image
          src="/assets/uk.svg"
          width={18}
          height={18}
          alt="Picture of the author"
        />
        <span>UK</span>
      </div>
    ),
    value: "uk",
  },
];

export const countryLanguage: Option[] = [
  { label: "French", value: "french" },
  { label: "English (UK)", value: "english(uk)" },
];
