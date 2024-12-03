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
import { AGREEMENT_ITEMS, PREVIEW_MAIN_TAP_ITEMS } from "./config-tab";

export const EditorTabPreview = () => {
  const [customized, setCustomized] = useState(false);
  const [isSelect, setIsSelect] = useState(false);

  const handleCheckboxChange = (value: boolean) => {
    setCustomized(!value);
  };

  return (
    <div>
      <div className="p-5">
        <Flex onClick={() => handleCheckboxChange(customized)}>
          <Checkbox checked={customized} />
          <Label
            className={`text-logan-black text-smaller hover:!text-logan-blue cursor-pointer`}
          >
            Customize the Style of Each Document
          </Label>
        </Flex>
        {customized && (
          <Flex className="pt-3">
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
                />
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
      <div className="grid gap-2 p-5">
        {PREVIEW_MAIN_TAP_ITEMS.map((item, index) => (
          <Select
            key={index}
            onValueChange={(value) => console.log("value: ", value)}
          >
            <SelectTrigger className="border-none bg-logan-primary-200 data-[state=open]:bg-logan-blue data-[state=open]:border-logan-blue">
              <SelectValue
                placeholder={
                  <Flex className="h-6 text-logan-black font-semibold text-smaller">
                    {/* <Checkbox /> */}
                    <Label>{item.label}</Label>
                  </Flex>
                }
              />
            </SelectTrigger>
            <SelectContent className="-mt-1">
              {item.names?.map((name, idx) => {
                const checked = item.checked ? item.checked[idx] : false;
                return (
                  <SelectItem
                    key={idx}
                    value={name}
                    className="pl-2 !text-logan-black-foreground hover:bg-white focus:bg-white"
                  >
                    <Flex>
                      <Checkbox checked={checked} />
                      <Label
                        className={`text-smaller hover:!text-logan-blue cursor-pointer`}
                      >
                        {name}
                      </Label>
                    </Flex>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
};

interface FlexProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Flex: React.FC<FlexProps> = ({ children, className, onClick }) => (
  <div className={`flex items-center gap-2 ${className}`} onClick={onClick}>
    {children}
  </div>
);
