import React from "react";

type PageCoverProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageLayouts = ({ children, className }: PageCoverProps) => {
  const classes: string = `page text-center h-[297mm] w-[210mm] bg-white py-16 px-14 border border-logan-primary-200 overflow-hidden relative hover:border-logan-blue transition-all hover:shadow-badge-md ${className}`;

  return (
    <div className="bg-logan-primary-200 pb-10">
      <div className={classes}>{children}</div>
    </div>
  );
};
