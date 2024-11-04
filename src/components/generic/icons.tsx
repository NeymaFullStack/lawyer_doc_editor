"use client";

import { cn } from "@/utils/shadcn-utils";
import { type FC, forwardRef, type HTMLAttributes, SVGAttributes } from "react";

export type IconProps = {
  endColor?: string;
  color?: string;
  iconName: keyof typeof icons;
  iconClassName?: string;
  width?: number;
  height?: number;
} & Pick<HTMLAttributes<HTMLDivElement>, "className" | "onClick" | "style">;

export type SvgIconProps = SVGAttributes<SVGElement> & {
  endColor?: string;
};
const icons = {
  search: ({ className, color, endColor }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.678 7.11426C11.6128 7.11435 10.5632 7.36914 9.61659 7.85738C8.66998 8.34561 7.85386 9.05314 7.23631 9.92092C6.61877 10.7887 6.21771 11.7916 6.06659 12.8459C5.91548 13.9002 6.01869 14.9753 6.36762 15.9816C6.71655 16.9879 7.30107 17.8962 8.07243 18.6306C8.84379 19.3651 9.7796 19.9044 10.8018 20.2037C11.824 20.5029 12.903 20.5534 13.9486 20.3509C14.9943 20.1484 15.9764 19.6987 16.813 19.0395L19.6828 21.9092C19.831 22.0523 20.0295 22.1315 20.2355 22.1297C20.4416 22.1279 20.6387 22.0453 20.7844 21.8996C20.9301 21.7539 21.0127 21.5568 21.0145 21.3508C21.0163 21.1448 20.9371 20.9463 20.7939 20.7981L17.9241 17.9283C18.7005 16.9434 19.1839 15.7599 19.319 14.5131C19.4541 13.2663 19.2355 12.0066 18.6881 10.8783C18.1407 9.74994 17.2867 8.79849 16.2238 8.13283C15.1609 7.46716 13.9321 7.11417 12.678 7.11426ZM7.5701 13.7935C7.5701 12.4389 8.10825 11.1397 9.06616 10.1818C10.0241 9.22397 11.3233 8.68584 12.678 8.68584C14.0326 8.68584 15.3318 9.22397 16.2897 10.1818C17.2477 11.1397 17.7858 12.4389 17.7858 13.7935C17.7858 15.1481 17.2477 16.4473 16.2897 17.4052C15.3318 18.363 14.0326 18.9012 12.678 18.9012C11.3233 18.9012 10.0241 18.363 9.06616 17.4052C8.10825 16.4473 7.5701 15.1481 7.5701 13.7935Z"
        fill="url(#paint0_linear_5354_2305)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5354_2305"
          x1="6.08106"
          y1="7.11426"
          x2="22.7496"
          y2="9.91637"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
      </defs>
    </svg>
  ),
  pencil: ({ className, color, endColor }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M7.79625 4.2768C7.79707 4.38288 7.76484 4.48658 7.70402 4.57348C7.6432 4.66039 7.55683 4.72619 7.45691 4.76172L5.40662 5.50754L4.66135 7.55813C4.62462 7.65712 4.55848 7.7425 4.47182 7.80279C4.38516 7.86307 4.28213 7.89539 4.17657 7.89539C4.07101 7.89539 3.96798 7.86307 3.88133 7.80279C3.79467 7.7425 3.72853 7.65712 3.69179 7.55813L2.9462 5.50528L0.896237 4.76172C0.797277 4.72498 0.711928 4.65882 0.651658 4.57213C0.591387 4.48545 0.559082 4.38239 0.559082 4.2768C0.559082 4.17121 0.591387 4.06815 0.651658 3.98146C0.711928 3.89477 0.797277 3.82861 0.896237 3.79187L2.94847 3.04605L3.69179 0.995461C3.72853 0.89647 3.79467 0.811096 3.88133 0.750807C3.96798 0.690518 4.07101 0.658203 4.17657 0.658203C4.28213 0.658203 4.38516 0.690518 4.47182 0.750807C4.55848 0.811096 4.62462 0.89647 4.66135 0.995461L5.40694 3.04832L7.45691 3.79187C7.55683 3.82741 7.6432 3.8932 7.70402 3.98011C7.76484 4.06702 7.79707 4.17072 7.79625 4.2768Z"
        fill="url(#paint0_linear_5354_2309)"
      />
      <path
        d="M13.2801 3.56531L11.927 4.91827L15.5613 8.55226L16.9143 7.1993C17.6132 6.50045 17.6132 5.36833 16.9143 4.66948L15.8129 3.56531C15.114 2.86647 13.9817 2.86647 13.2828 3.56531H13.2801ZM11.2952 5.55003L4.77866 12.0688C4.48792 12.3596 4.27546 12.7202 4.15804 13.1143L3.1684 16.4771C3.09851 16.7148 3.16281 16.9691 3.33614 17.1424C3.50946 17.3158 3.76386 17.38 3.99869 17.313L7.36179 16.3234C7.75597 16.206 8.1166 15.9935 8.40734 15.7028L14.9295 9.18401L11.2952 5.55003Z"
        fill="url(#paint1_linear_5354_2309)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5354_2309"
          x1="0.651304"
          y1="0.658202"
          x2="19.3766"
          y2="3.84355"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5354_2309"
          x1="0.651304"
          y1="0.658202"
          x2="19.3766"
          y2="3.84355"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
      </defs>
    </svg>
  ),
  comment: ({ className, color, endColor }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.23977 8.99417C6.68701 9.54693 6.37646 10.2966 6.37646 11.0784V17.38C6.37646 18.1617 6.68701 18.9114 7.23977 19.4642C7.79254 20.0169 8.54225 20.3275 9.32398 20.3275H9.6289V22.6936C9.6289 23.4352 10.4656 23.8686 11.0709 23.4409L15.4821 20.3275H19.6911C20.4728 20.3275 21.2226 20.0169 21.7753 19.4642C22.3281 18.9114 22.6386 18.1617 22.6386 17.38V11.0784C22.6386 10.2966 22.3281 9.54693 21.7753 8.99417C21.2226 8.4414 20.4728 8.13086 19.6911 8.13086H9.32398C8.54225 8.13086 7.79254 8.4414 7.23977 8.99417ZM15.2045 14.8019H17.6729C17.8038 14.8019 17.9294 14.7462 18.0219 14.647C18.1145 14.5478 18.1665 14.4133 18.1665 14.273C18.1665 14.1327 18.1145 13.9982 18.0219 13.899C17.9294 13.7998 17.8038 13.744 17.6729 13.744H15.2045V11.0994C15.2045 10.9591 15.1525 10.8245 15.0599 10.7253C14.9673 10.6262 14.8418 10.5704 14.7108 10.5704C14.5799 10.5704 14.4543 10.6262 14.3617 10.7253C14.2692 10.8245 14.2172 10.9591 14.2172 11.0994V13.744H11.7488C11.6179 13.744 11.4923 13.7998 11.3997 13.899C11.3071 13.9982 11.2551 14.1327 11.2551 14.273C11.2551 14.4133 11.3071 14.5478 11.3997 14.647C11.4923 14.7462 11.6179 14.8019 11.7488 14.8019H14.2172V17.4466C14.2172 17.5869 14.2692 17.7214 14.3617 17.8206C14.4543 17.9198 14.5799 17.9755 14.7108 17.9755C14.8418 17.9755 14.9673 17.9198 15.0599 17.8206C15.1525 17.7214 15.2045 17.5869 15.2045 17.4466V14.8019Z"
        fill="url(#paint0_linear_5354_2311)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5354_2311"
          x1="6.46531"
          y1="8.13086"
          x2="24.4664"
          y2="11.3101"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
      </defs>
    </svg>
  ),
  undo: ({ className, color, endColor }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      className={className}
    >
      <path
        d="M4.62517 8.92709L0.961426 5.26335L4.62517 1.59961"
        stroke="url(#paint0_linear_5354_2320)"
        strokeWidth="1.36726"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.961426 5.26758H8.65528C9.18452 5.26758 9.70858 5.37182 10.1975 5.57435C10.6865 5.77688 11.1308 6.07374 11.505 6.44797C11.8792 6.8222 12.1761 7.26648 12.3786 7.75543C12.5812 8.24439 12.6854 8.76845 12.6854 9.29769C12.6854 9.82693 12.5812 10.351 12.3786 10.84C12.1761 11.3289 11.8792 11.7732 11.505 12.1474C11.1308 12.5216 10.6865 12.8185 10.1975 13.021C9.70858 13.2236 9.18452 13.3278 8.65528 13.3278H6.09066"
        stroke="url(#paint1_linear_5354_2320)"
        strokeWidth="1.36726"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5354_2320"
          x1="0.981443"
          y1="1.59961"
          x2="5.13411"
          y2="1.94866"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5354_2320"
          x1="1.02548"
          y1="5.26758"
          x2="13.6529"
          y2="8.35525"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
      </defs>
    </svg>
  ),
  redo: ({ className, color, endColor }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      className={className}
    >
      <path
        d="M9.37483 8.92709L13.0386 5.26335L9.37483 1.59961"
        stroke="url(#paint0_linear_5354_2324)"
        strokeWidth="1.36726"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0386 5.26758H5.34472C4.81548 5.26758 4.29142 5.37182 3.80246 5.57435C3.31351 5.77688 2.86923 6.07374 2.495 6.44797C2.12077 6.8222 1.82391 7.26648 1.62138 7.75543C1.41885 8.24439 1.31461 8.76845 1.31461 9.29769C1.31461 9.82693 1.41885 10.351 1.62138 10.84C1.82391 11.3289 2.12077 11.7732 2.495 12.1474C2.86923 12.5216 3.31351 12.8185 3.80246 13.021C4.29142 13.2236 4.81548 13.3278 5.34472 13.3278H7.90934"
        stroke="url(#paint1_linear_5354_2324)"
        strokeWidth="1.36726"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5354_2324"
          x1="13.0186"
          y1="1.59961"
          x2="8.86589"
          y2="1.94866"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5354_2324"
          x1="12.9745"
          y1="5.26758"
          x2="0.347116"
          y2="8.35525"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color ?? "#095AD3"} />
          <stop offset="1" stopColor={endColor ?? "#166FF4"} />
        </linearGradient>
      </defs>
    </svg>
  ),
} satisfies Record<string, FC<SvgIconProps>>;

export const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      iconName,
      className,
      iconClassName,
      width,
      height,
      endColor,
      color,
      onClick,
      ...props
    },
    ref,
  ) => (
    <span
      className={cn(
        `flex flex-row items-center justify-center`,
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
      ref={ref}
    >
      {!!icons[iconName] &&
        icons[iconName]({ color, className: iconClassName, endColor })}
    </span>
  ),
);

Icon.displayName = "Icon";
