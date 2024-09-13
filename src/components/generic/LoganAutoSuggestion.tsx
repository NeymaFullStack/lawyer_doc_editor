import { Command as CommandPrimitive } from "cmdk";
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/shadcn-components/ui/command";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/shadcn-components/ui/popover";
import { Skeleton } from "@/components/shadcn-components/ui/skeleton";
import RemSizeImage from "./RemSizeImage";
import { useDebounce } from "@/hooks/useDebounce";
import { navigationSearchItemTypes } from "@/constants/enums";
import { cn } from "@/utils/shadcn-utils";
import { nanoid } from "nanoid";

type Props<T extends string> = {
  // selectedValue: T;
  onSelectedValueChange: (value: string, data: any) => void;
  // searchValue: string;
  // onSearchValueChange: (value: string) => void;
  items: any[];
  // isLoading?: boolean;
  fetchSuggestions: (
    signal: any,
    { search_text }: { search_text: string },
  ) => Promise<any>;
  emptyMessage?: string;
  placeholder?: string;
};

export default function LoganAutoSuggestion<T extends string>({
  // selectedValue,
  onSelectedValueChange,
  // searchValue,
  // onSearchValueChange,
  // items,
  // isLoading,
  fetchSuggestions,
  emptyMessage = "No items.",
  placeholder = "Search Client, Folder And Document",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const debouncedQuery = useDebounce(searchValue, 300);
  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    if (debouncedQuery) {
      if (!controllerRef.current.signal.aborted) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      fetchData(controllerRef.current, debouncedQuery);
    } else {
      setItems([]);
    }

    return () => {
      if (!controllerRef.current.signal.aborted) {
        controllerRef.current.abort();
      }
    };
  }, [debouncedQuery, fetchSuggestions]);

  const reset = () => {
    setSelectedValue("");
    setSearchValue("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.relatedTarget?.hasAttribute("cmdk-list")) {
      reset();
    }
  };

  const onSelectItem = (value: string, data: any) => {
    // setSelectedValue(value, data);
    onSelectedValueChange(value, data);
    // setSearchValue(inputValue);
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <div
              className={`flex items-center gap-2 rounded-lg border-[1px] bg-white p-2 py-1 ${
                isFocusActive ? "border-primary-blue" : "border-secondary-blue"
              }`}
            >
              <RemSizeImage
                imagePath={
                  isFocusActive
                    ? "/assets/icons/search-blue.svg"
                    : "/assets/icons/search-icon.svg"
                }
                remWidth={1}
                remHeight={1}
                alt={"Search"}
              />
              <CommandPrimitive.Input
                asChild
                value={searchValue}
                onFocus={() => {
                  setIsFocusActive(true);
                  setOpen(true);
                }}
                onBlur={(e) => {
                  setIsFocusActive(false);
                  onInputBlur(e);
                }}
                onValueChange={setSearchValue}
                onKeyDown={(e) => setOpen(e.key !== "Escape")}
                onMouseDown={() => setOpen((open) => !!searchValue || false)}
              >
                <Input
                  placeholder={placeholder}
                  className=" h-7 border-none px-1 py-0 shadow-none placeholder:text-primary-gray focus:border-none focus:outline-none focus-visible:ring-0"
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className={cn(
              "mt-2 w-[--radix-popover-trigger-width] p-2 shadow-out-md",
              !(searchValue?.length > 0) && !(items?.length > 0) && "hidden",
            )}
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items?.length > 0 && !isLoading
                ? items.map((group, index) => {
                    return (
                      <CommandGroup
                        key={nanoid()}
                        heading={
                          <span className="text-primary-gray">
                            {group?.heading ? group?.heading : ""}
                          </span>
                        }
                      >
                        <ul className="pt-1">
                          {group?.items.map((option: any, index: number) => {
                            let itemSrc = "";
                            if (
                              option?.type === navigationSearchItemTypes.CLIENT
                            ) {
                              itemSrc = "/assets/icons/client-folder.svg";
                            } else if (
                              option?.type === navigationSearchItemTypes.FOLDER
                            ) {
                              itemSrc = "/assets/icons/non-client-folder.svg";
                            } else if (
                              option?.type ===
                              navigationSearchItemTypes.DOCUMENT
                            ) {
                              itemSrc = "/assets/icons/doc-icon.svg";
                            }
                            let projectPath = [...option?.project_path];
                            if (
                              option?.type ===
                              navigationSearchItemTypes.DOCUMENT
                            ) {
                              projectPath.push(option?.title);
                            }
                            projectPath = limitItems(projectPath);
                            return (
                              <CommandItem
                                key={option.id}
                                value={option.id}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() => onSelectItem(option.id, option)}
                              >
                                <div className="group flex w-full cursor-pointer items-center gap-2 rounded-md">
                                  <RemSizeImage
                                    imagePath={itemSrc}
                                    remWidth={1}
                                    remHeight={1}
                                    alt={"Client / Folder / Document"}
                                  />
                                  <ul className="flex items-center text-primary-gray">
                                    {projectPath.map((path, index) => {
                                      if (path?.sep) {
                                        return (
                                          <li
                                            key={nanoid()}
                                            className="flex items-center"
                                          >
                                            <span className="px-2 text-primary-blue">
                                              /
                                            </span>
                                          </li>
                                        );
                                      } else if (path?.ellipsis) {
                                        return (
                                          <li
                                            key={nanoid()}
                                            className="flex items-center gap-1 px-2"
                                          >
                                            <span className=" text-primary-blue">
                                              /
                                            </span>
                                            <span className="text-primary-blue">
                                              ...
                                            </span>
                                            <span className=" text-primary-blue">
                                              /
                                            </span>
                                          </li>
                                        );
                                      }
                                      return (
                                        <li
                                          key={nanoid()}
                                          className="flex items-center "
                                        >
                                          {highlightText(path)}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </ul>
                      </CommandGroup>
                    );
                  })
                : null}
              {!isLoading && !(items.length > 0) && (
                <CommandEmpty>
                  <span className="text-primary-gray">
                    {emptyMessage ?? "No items."}
                  </span>
                </CommandEmpty>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );

  async function fetchData(controller: any, debouncedValue: string) {
    try {
      setIsLoading(true);
      const data = await fetchSuggestions(controller, {
        search_text: debouncedValue,
      });
      let suggestionRes = data?.groups.filter((item: any, index: number) => {
        return item.items.length > 0;
      });
      setItems(suggestionRes);
    } catch (error) {
      console.error(error);
    } finally {
      !controller?.signal?.aborted && setIsLoading(false);
    }
  }

  function limitItems(items: any[]) {
    if (items.length > 3) {
      return [items[0], { ellipsis: true }, items[items.length - 1]];
    } else {
      return insertSeparators(items);
    }
  }

  function insertSeparators(items: any[]) {
    const result: any[] = [];
    items.forEach((item, index) => {
      if (index > 0) {
        result.push({ sep: true });
      }
      result.push(item);
    });
    return result;
  }

  function highlightText(label: string) {
    if (!searchValue) return label; // If there's no query, return the label as is.
    const escapedSearchValue = searchValue.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const regex = new RegExp(`(${escapedSearchValue})`, "gi"); // Create a case-insensitive regex
    const parts = label.split(regex); // Split the label based on the query

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={nanoid()} className="text-primary-blue">
          {part}
        </span>
      ) : (
        <span
          key={nanoid()}
          className="text-primary-gray group-hover:text-black-txt"
        >
          {part}
        </span>
      ),
    );
  }
}
