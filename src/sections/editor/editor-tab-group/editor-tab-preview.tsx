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
import React, { useState, useCallback } from "react";
import { AGREEMENT_ITEMS, PREVIEW_MAIN_TAP_ITEMS } from "./config-tab";
import { Icon } from "@/components/icons";
import { iconColors } from "../../../../tailwind.config";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const EditorTabPreview = () => {
  const [customized, setCustomized] = useState<boolean>(false);
  const initial = PREVIEW_MAIN_TAP_ITEMS.map((item) => item.checked);
  const [checkedState, setCheckedState] = useState<boolean[][]>([
    ...initial,
  ] as boolean[][]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [visitedIndex, setVisitedIndex] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const handleCheckboxChange = useCallback((value: boolean) => {
    setCustomized(!value);
  }, []);

  const toggleCollapsible = useCallback((index: number) => {
    setActiveIndex((prevState) => (prevState === index ? null : index));
  }, []);

  const handleCheckedState = useCallback((index: number, idx: number) => {
    setCheckedState((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = updatedState[index].map((checked, i) =>
        i === idx ? !checked : checked
      );
      return updatedState;
    });
  }, []);

  const handleTriggerClick = (index: number) => {
    setVisitedIndex((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = true;
      return updatedState;
    });
  };

  return (
    <div>
      <div className="p-5">
        <Flex onClick={() => handleCheckboxChange(customized)}>
          <Checkbox checked={customized} />
          <Label className="text-logan-black text-smaller hover:!text-logan-blue cursor-pointer">
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
          <Collapsible
            key={index}
            open={activeIndex === index}
            onOpenChange={() => toggleCollapsible(index)}
          >
            <CollapsibleTrigger
              asChild
              className="h-10 p-3 bg-logan-primary-200 rounded-lg hover:text-logan-blue data-[state=open]:text-white data-[state=open]:bg-logan-blue"
              onClick={() => handleTriggerClick(index)}
            >
              <div className="flex items-center">
                <Checkbox
                  checked={activeIndex === index || visitedIndex[index]}
                  className={`data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-logan-blue
                     ${
                       activeIndex !== index &&
                       visitedIndex[index] &&
                       "data-[state=checked]:bg-logan-blue  data-[state=checked]:text-white"
                     }
                    `}
                />
                <Label
                  className={`flex-1 pl-2 text-logan-black font-semibold !text-smaller flex items-center gap-2 cursor-pointer 
                    ${
                      activeIndex !== index && visitedIndex[index]
                        ? "text-logan-blue"
                        : ""
                    } 
                    ${activeIndex === index ? "text-white" : ""}
                    `}
                >
                  {item.label}
                </Label>
                <Icon
                  iconName="dropdownicon"
                  fill={
                    activeIndex === index ? iconColors.white : iconColors.gray
                  }
                  className={`h-4 w-4 opacity-50 ${
                    activeIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.names?.map((name, idx) => {
                const checked: boolean = checkedState[index][idx] ?? false;
                return (
                  <Flex
                    key={idx}
                    className="p-2 pl-5 justify-between cursor-pointer hover:scale-y-105"
                  >
                    <Checkbox
                      checked={checked}
                      onClick={() => handleCheckedState(index, idx)}
                    />
                    <Label
                      className={`flex flex-1 items-center gap-2 !text-smaller text-logan-black hover:!text-logan-blue cursor-pointer ${
                        checked && "text-logan-blue"
                      }`}
                      onClick={() => handleCheckedState(index, idx)}
                    >
                      {name}
                    </Label>
                    {checked && (
                      <Icon
                        iconName="extenallink"
                        fill={iconColors["light-blue"]}
                        className="h-4 w-4"
                      />
                    )}
                  </Flex>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Flex: React.FC<FlexProps> = ({ children, className, onClick }) => (
  <div className={`flex items-center gap-2 ${className}`} onClick={onClick}>
    {children}
  </div>
);
