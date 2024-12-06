import { Separator } from "@/components/ui/separator";
import { PageLayouts } from "./page-layouts";

type TableOfContentsType = {
  article: string;
  titles: string[];
};

const tableOfContents: TableOfContentsType[] = [
  {
    article: "Definitions",
    titles: [
      "Franchise",
      "Franchisee",
      "Franchised Business",
      "Franchise Fee",
      "Territory",
    ],
  },
  {
    article: "Grant of Franchise",
    titles: ["Exclusive License", "Use of Trademarks", "Non-Transferability"],
  },
  {
    article: "Initial Franchise Fee",
    titles: ["Amount and Payment", "No Refunds"],
  },
];

export const PageTableContents = () => {
  return (
    <PageLayouts className="px-20 pt-28 pb-20">
      <p className="tableContentTitle text-5xl font-medium mb-9">
        Table of Contents
      </p>
      {tableOfContents.map((item: TableOfContentsType, index: number) => (
        <div key={index} className="tableContent mb-5">
          <TableContentsItem pageIndex={index + 1} text={item.article} />
          <Separator className="bg-logan-primary-300 mt-1 mb-2" />
          {item.titles.map((title: string, idx: number) => (
            <TableContentsItem
              key={idx}
              pageIndex={index + 1}
              text={title}
              index={idx + 1}
            />
          ))}
        </div>
      ))}
    </PageLayouts>
  );
};

type TableContentsItemProps = {
  pageIndex?: number;
  index?: number;
  text: string;
};

const TableContentsItem = ({
  pageIndex,
  index,
  text,
}: TableContentsItemProps) => {
  return (
    <p className="flex justify-between text-left p-1">
      {!index ? (
        <>
          <span className="flex-1 text-xl font-bold">
            Article{" " + pageIndex + " - " + text}
          </span>
          <span className="text-sm font-bold">Page {pageIndex}</span>
        </>
      ) : (
        <>
          <span className="pr-5 font-medium">
            {pageIndex}.{index}
          </span>
          <span className="flex-1 font-medium">{text}</span>
          <span className="text-sm font-medium">Page {pageIndex}</span>
        </>
      )}
    </p>
  );
};
