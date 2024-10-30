import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import RemSizeImage from "./RemSizeImage";
import { useDebounce } from "@/hooks/useDebounce";
import { navigationItemTypes } from "@/constants/enums";
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
  const [openPopup, setOpenPopup] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const debouncedQuery = useDebounce(searchValue, 300);
  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    if (debouncedQuery) {
      if (controllerRef.current && !controllerRef.current.signal.aborted) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      fetchData(controllerRef.current, debouncedQuery);
    } else {
      setItems([]);
    }

    return () => {
      if (controllerRef.current && !controllerRef.current.signal.aborted) {
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
    setOpenPopup(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={openPopup} onOpenChange={setOpenPopup}>
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
                  setOpenPopup(true);
                }}
                onBlur={(e) => {
                  setIsFocusActive(false);
                  onInputBlur(e);
                }}
                onValueChange={setSearchValue}
                onKeyDown={(e) => setOpenPopup(e.key !== "Escape")}
                onMouseDown={() =>
                  setOpenPopup((open) => !!searchValue || false)
                }
              >
                <Input
                  placeholder={placeholder}
                  className=" h-7 border-none px-1 py-0 shadow-none placeholder:text-primary-gray focus:border-none focus:outline-none focus-visible:ring-0"
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>
          {/* {!open && <CommandList aria-hidden="true" className="hidden" />} */}

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
              "mt-2 w-[--radix-popover-trigger-width] p-2 pr-5 shadow-out-md",
              !(debouncedQuery?.length > 0) && "hidden",
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
                ? items?.map((group) => {
                    return (
                      <CommandGroup
                        key={nanoid()}
                        heading={
                          <span className="text-primary-gray">
                            {group?.heading ?? ""}
                          </span>
                        }
                      >
                        <ul className="pt-1">
                          {group?.items?.map((option: any) => {
                            let itemSrc = "";
                            if (option?.type === navigationItemTypes.CLIENT) {
                              itemSrc = "/assets/icons/client-folder.svg";
                            } else if (
                              option?.type === navigationItemTypes.FOLDER
                            ) {
                              itemSrc = "/assets/icons/non-client-folder.svg";
                            } else if (
                              option?.type === navigationItemTypes.DOCUMENT
                            ) {
                              itemSrc = "/assets/icons/doc-icon.svg";
                            }
                            let projectPath = [...option?.project_path];
                            if (option?.type === navigationItemTypes.DOCUMENT) {
                              projectPath.push(option?.title);
                            }
                            projectPath = limitItems(projectPath);
                            return (
                              <CommandItem
                                key={option?.id}
                                value={option?.id}
                                onMouseDown={(e) => e.preventDefault()}
                                onSelect={() =>
                                  onSelectItem(option?.id, option)
                                }
                              >
                                <div className="group flex w-full cursor-pointer items-center gap-2 rounded-md">
                                  <RemSizeImage
                                    imagePath={itemSrc}
                                    remWidth={1}
                                    remHeight={1}
                                    alt={"Client / Folder / Document"}
                                  />
                                  <ul className="flex w-full items-center overflow-hidden text-primary-gray">
                                    {projectPath.map((path, index) => {
                                      // Update when path changes
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
                                            className="flex  items-center gap-1 px-2"
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
                                        <Li
                                          path={path}
                                          searchValue={searchValue}
                                        />
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
              {!isLoading && debouncedQuery && items?.length === 0 && (
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
      if (data) {
        let suggestionRes = data?.groups?.filter((item: any, index: number) => {
          return item?.items?.length > 0;
        });
        setItems(suggestionRes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      !controller?.signal?.aborted && setIsLoading(false);
    }
  }

  function limitItems(items: any[]) {
    if (items?.length > 3) {
      return [items?.[0], { ellipsis: true }, items[items?.length - 1]];
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
}

export function highlightText(label: string, searchValue: string) {
  if (!searchValue) return label; // If there's no query, return the label as is.
  const escapedSearchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedSearchValue})`, "gi"); // Create a case-insensitive regex
  const parts = label?.split(regex); // Split the label based on the query

  return parts?.map((part, index) => {
    return regex.test(part) ? (
      <span key={nanoid()} className="whitespace-pre text-primary-blue">
        {`${part}`}
      </span>
    ) : (
      <span
        key={nanoid()}
        className="whitespace-pre text-primary-gray group-hover:text-black-txt"
      >
        {`${part}`}
      </span>
    );
  });
}

function Li({ path, searchValue }: { path: string; searchValue: string }) {
  const liRef = useRef<HTMLLIElement>(null);

  // Measure the width and conditionally apply the class
  const [maxWidthClass, setMaxWidthClass] = useState<string>("max-w-full");

  useEffect(() => {
    if (liRef.current) {
      const width = liRef.current.offsetWidth;
      setMaxWidthClass(width < 175 ? "max-w-fit" : "max-w-full");
    }
  }, []);
  return (
    <li
      key={nanoid()}
      className={cn(
        "max-w-fit",
        maxWidthClass === "max-w-full" && "max-w-full truncate",
      )}
      ref={liRef}
    >
      {highlightText(path, searchValue)}
    </li>
  );
}
