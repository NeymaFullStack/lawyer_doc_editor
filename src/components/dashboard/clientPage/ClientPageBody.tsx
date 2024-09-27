"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { unknown, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import { documentAction } from "@/redux/documentSlice";
import { useDispatch } from "react-redux";
import { copiedContentType } from "@/constants/enums";
import { ClientPageFieldType } from "@/types/form";
import { ClientPageField } from "@/constants/typedList";
import Image from "next/image";
import { Button } from "@/components/shadcn-components/ui/button";
import FileUploadModal from "@/components/generic/FileUploadModal";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import FilePreview from "@/components/generic/FilePreview";
import DropFile from "@/components/generic/DropFile";
import { cn } from "@/utils/shadcn-utils";
import CopyButton from "@/components/generic/buttons/CopyButton";
// Define the schema using zod
const formSchema = z.object({
  legal_name: z.string().optional(),
  company_type: z.string().optional(),
  registered_address: z.string().optional(),
  company_country: z.enum(["USA", "Canada", "UK", ""]).optional(),
  company_registration_number: z.string().optional(),
  tax_identification_number: z.string().optional(),
  date_of_incorporation: z.string().optional(),
  registered_capital: z.string().optional(),
  legal_representative: z.string().optional(),
  activity: z.string().optional(),
  website: z.string().optional(),
  // logo: z.union([z.instanceof(File), z.literal("")]).optional(),
});

// Define the TypeScript types for the form data
export type ClientFormData = z.infer<typeof formSchema>;
type CompanyInformationFormRef = HTMLFormElement & {
  saveAndClose?: () => void; // Adding the submit method to the ref
  onClickDocCreation?: () => void;
  onUpdateChanges?: () => void;
};

const CompanyInformationForm = forwardRef<
  CompanyInformationFormRef,
  {
    isEditing?: boolean;
    allowCopy?: boolean;
    onSaveChanges: (data: ClientFormData) => void;
    onContinueDocCreation?: (
      data: ClientFormData,
      file: File | null | "",
    ) => void;
    formDetails: ClientFormData;
    closeDrawer?: () => void;
    renderInModal?: boolean;
  }
>(
  (
    {
      allowCopy = false,
      isEditing = true,
      onSaveChanges = () => {},
      closeDrawer = () => {},
      renderInModal = false,
      onContinueDocCreation = () => {},
      formDetails,
    },
    ref,
  ) => {
    const appDispatch = useDispatch();
    const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
      useState<boolean>(false);
    const [file, setFile] = useState<File | null | "">(null);
    const isFileRemoved = useRef(false);
    const form = useForm<ClientFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        legal_name: formDetails?.legal_name || "",
        company_type: formDetails?.company_type || "",
        registered_address: formDetails?.registered_address || "",
        company_country: formDetails?.company_country || "",
        company_registration_number:
          formDetails?.company_registration_number || "",
        tax_identification_number: formDetails?.tax_identification_number || "",
        date_of_incorporation: formDetails?.date_of_incorporation || "",
        registered_capital: formDetails?.registered_capital || "",
        legal_representative: formDetails?.legal_representative || "",
        activity: formDetails?.activity || "",
        website: formDetails?.website || "",
        // logo: formDetails?.logo || "",
      },
    });

    useEffect(() => {
      if (formDetails && form) {
        let autoFillDetails: Record<string, string> = {};
        if ("logo" in formDetails) {
          setFile(formDetails.logo as File | null | "");
          const { logo, ...restFormDetails } = formDetails;
          for (let key in restFormDetails) {
            autoFillDetails[key] =
              (restFormDetails as Record<string, string>)[key] || "";
          }
          form.reset(autoFillDetails);
        } else {
          form.reset(formDetails);
        }
      }
    }, [formDetails, form]);

    const onSubmit: SubmitHandler<ClientFormData> = (data, event) => {
      event?.preventDefault();
      try {
        // Attempt to parse the data with the schema
        // console.log(formSchema.parse(data));
        // If successful, proceed with your onSaveChanges
        let submitClientFormData: ClientFormData & {
          logo?: File | null | "";
          is_logo_deleted?: boolean;
        } = { ...data };
        if (file instanceof File) {
          submitClientFormData.logo = file;
        }
        if (isFileRemoved.current) {
          submitClientFormData.is_logo_deleted = true;
        }
        onSaveChanges(submitClientFormData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Zod Validation Errors:", error.errors);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };
    useImperativeHandle(
      ref,
      () =>
        ({
          saveAndClose: () => {
            form.handleSubmit(onSubmit)();
          },
          onClickDocCreation: () => {
            onContinueDocCreation(formSchema.parse(form.getValues()), file);
          },
          onUpdateChanges: () => {
            form.handleSubmit(onSubmit)();
          },
        }) as CompanyInformationFormRef,
      [form, onSubmit, onContinueDocCreation],
    );
    console.log("file", file);
    return (
      <Form {...form}>
        {isFileUploadModalOpen && !renderInModal && (
          <FileUploadModal
            onClickSave={(file: File) => {
              setFile(file);
              isFileRemoved.current = false;
            }}
            isOpen={isFileUploadModalOpen}
            onClose={() => {
              setIsFileUploadModalOpen(false);
            }}
          />
        )}
        <form ref={ref} className="space-y-6 ">
          <div className="flex flex-col items-start justify-center gap-5">
            <div className={cn("flex flex-col justify-center  gap-3")}>
              <label className="text-xs font-medium leading-none">
                Client Logo
              </label>

              {renderInModal && (
                <>
                  {file ? (
                    <FilePreview
                      deleteFile={() => {
                        // form.setValue("logo", undefined);
                        setFile(null);
                      }}
                      file={file}
                      className="mt-0"
                    />
                  ) : (
                    <DropFile
                      height={"5rem"}
                      className={""}
                      customClass=""
                      fileTypes={[".png", "jpeg", "jpg"]}
                      onUpload={({ file }: { file: File }) => {
                        // form.setValue("logo", file);
                        setFile(file);
                        isFileRemoved.current = false;
                      }}
                    />
                  )}
                </>
              )}
              <div className="flex items-center ">
                {!renderInModal && file && (
                  <div
                    className="relative border-secondary-blue"
                    style={{ width: "6.5rem", height: "4.5rem" }}
                  >
                    <Image
                      src={
                        typeof file === "string"
                          ? (file as string)
                          : URL.createObjectURL(file as File)
                      }
                      alt={"Company Logo"}
                      fill
                      // objectFit="cover "
                      className="h-[4.5rem] w-[6rem] rounded bg-cover" // Add a class if you want rounded corners
                      quality={100} // Set the quality of the image
                    />
                  </div>
                )}

                {isEditing && !renderInModal && (
                  <div className={cn("ml-16 space-x-4", !file && "ml-0")}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsFileUploadModalOpen(true);
                      }}
                      size={"sm"}
                      variant={"primary-blue-outline"}
                    >
                      Upload
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        isFileRemoved.current = true;
                        setFile(null);
                      }}
                      size={"sm"}
                      variant={"normal"}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {ClientPageField.map(
              (fieldItem: ClientPageFieldType, index: number) => {
                return (
                  <FormField
                    key={fieldItem?.key}
                    control={form.control}
                    name={fieldItem?.key}
                    render={({ field }: { field: any }) => (
                      <FormItem isEditing={isEditing}>
                        <FormLabel
                          className={isEditing ? " text-black-txt" : ""}
                        >
                          {fieldItem?.label}
                        </FormLabel>

                        {!isEditing ? (
                          <p
                            className={cn(
                              "group flex min-h-7 w-[90%] items-center justify-start break-words rounded-md border border-transparent bg-transparent text-xs  leading-normal ",
                            )}
                          >
                            {String(field?.value) || "NA"}
                            {allowCopy && (
                              <CopyButton
                                className="ml-3 hidden group-hover:inline-block"
                                onClick={() => {
                                  handleCopy(fieldItem?.key);
                                  closeDrawer();
                                }}
                              />
                            )}
                          </p>
                        ) : fieldItem?.type === "input" ? (
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={fieldItem.placeholder}
                            />
                          </FormControl>
                        ) : (
                          fieldItem?.type === "select" && (
                            <FormControl>
                              <Select
                                {...(() => {
                                  delete field?.ref;
                                  return field;
                                })()}
                                onValueChange={(value) => {
                                  form.setValue(fieldItem?.key, value);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={fieldItem?.placeholder}
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {fieldItem.options.map((option, index) => {
                                    return (
                                      <SelectItem
                                        key={option?.value}
                                        value={option?.value}
                                        className="cursor-pointer"
                                      >
                                        {option?.label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          )
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              },
            )}
          </div>
        </form>
      </Form>
    );

    function handleCopy(key: keyof ClientFormData) {
      appDispatch(
        documentAction.setCopiedContent({
          title: form.getValues(key),
          type: copiedContentType.Company,
        }),
      );
    }
  },
);
export default CompanyInformationForm;
