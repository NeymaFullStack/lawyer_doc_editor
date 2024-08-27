import * as React from "react";

import { cn } from "@/utils/shadcn-utils";
import CopyButton from "@/components/generic/buttons/CopyButton";

export interface CopyDisabledProps {
  allowCopy?: false;
  onClickCopy?: never;
}

export interface CopyEnabledProps {
  allowCopy: true;
  onClickCopy: () => void;
}

export type CopyProps = CopyDisabledProps | CopyEnabledProps;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isEditing?: boolean;
  copyProps?: CopyProps;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      copyProps: { allowCopy, onClickCopy } = {
        allowCopy: false,
        onClickCopy: () => {},
      },
      isEditing = true,
      ...props
    },
    ref,
  ) => {
    return isEditing ? (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-secondary-blue bg-white px-3  py-1 text-xs text-black-txt  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    ) : (
      <p
        className={cn(
          "group flex min-h-7 w-full items-center rounded-md border border-transparent bg-transparent  text-xs leading-normal text-black-txt",
          className,
        )}
      >
        <span className="w-[75%] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.value}
        </span>
        {allowCopy && (
          <CopyButton
            className="ml-3 hidden group-hover:flex"
            onClick={onClickCopy}
          />
        )}
      </p>
    );
  },
);
Input.displayName = "Input";

export { Input };
