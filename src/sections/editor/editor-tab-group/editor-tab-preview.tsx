import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ReactNode, useState } from "react";
import React from "react";
import { AGREEMENT_ITEMS } from "./config-tab";

export const EditorTabPreview = () => {
  const [customized, setCustomized] = useState(false);
  const handleCheckboxChange = () => {
    setCustomized(!customized);
  };

  return (
    <div>
      <div className="p-5">
        <Flex className="pb-3">
          <Checkbox
            checked={customized}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            className={`${
              customized ? "!text-logan-blue" : "text-logan-black"
            } text-smaller`}
          >
            Customize the Style of Each Document
          </Label>
        </Flex>
        {customized && (
          <Flex>
            <Label className="!text-smaller text-logan-primary-400 font-medium">
              SELECT
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <Badge className="h-6 bg-logan-blue p-2 text-white rounded-sm">
                      Document - Franchise Agreement
                    </Badge>
                  }
                ></SelectValue>
              </SelectTrigger>
              <SelectContent className="-mt-1">
                {AGREEMENT_ITEMS.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item.label}
                    className="pl-2 !text-logan-black-foreground hover:!text-logan-primary-600 hover:bg-white focus:bg-white"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Flex>
        )}
      </div>
      <Separator className="bg-logan-primary-300" />
    </div>
  );
};

interface FlexProps {
  children: ReactNode;
  className?: string;
}

const Flex: React.FC<FlexProps> = ({ children, className }) => (
  <div className={`flex items-center gap-2 ${className}`}>{children}</div>
);
