"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";
// Define the schema using zod
const formSchema = z.object({
  legalName: z.string().min(1, "Legal Name is required"),
  companyType: z.enum(["Corporation", "LLC", "Partnership"], {
    required_error: "Company Type is required",
  }),
  registeredAddress: z.string().min(1, "Registered Address is required"),
  companyCountry: z.enum(["USA", "Canada", "UK"], {
    required_error: "Company Country is required",
  }),
  companyRegNumber: z
    .string()
    .min(1, "Company Registration Number is required"),
  taxIdNumber: z.string().min(1, "Tax Identification Number is required"),
  incorporationDate: z.string().min(1, "Date of Incorporation is required"),
  registeredCapital: z.string().min(1, "Registered Capital is required"),
  legalRep: z.string().min(1, "Legal Representative is required"),
  activity: z.string().min(1, "Activity is required"),
  website: z.string().min(1, "Website is required"),
  // logo: z.instanceof(File).optional(),
});

// Define the TypeScript types for the form data
export type FormData = z.infer<typeof formSchema>;

export function CompanyInformationForm({
  isEditing,
  onSaveChanges,
  closeDrawer,
}: {
  isEditing: boolean;
  onSaveChanges: (data: FormData) => void;
  closeDrawer: () => void;
}) {
  const appDispatch = useDispatch();
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
    useState<boolean>(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalName: "WK Tech Industries 1",
      companyType: "Corporation",
      registeredAddress: "500 Innovation Drive, Silicon Valley, CA, 94085 USA",
      companyCountry: "USA",
      companyRegNumber: "98-7654321",
      taxIdNumber: "987654321",
      incorporationDate: "January 15, 2010",
      registeredCapital: "$10 million",
      legalRep: "Grace Williams",
      activity: "Technology and Software Development",
      website: "www.wktechindustries.com",
      // logo: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onSaveChanges(data);
  };

  return (
    <Form {...form}>
      {isFileUploadModalOpen && (
        <FileUploadModal
          isOpen={isFileUploadModalOpen}
          onClose={() => {
            setIsFileUploadModalOpen(false);
          }}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium leading-none">
              Client Logo
            </label>
            <div
              className="relative border-secondary-blue"
              style={{ width: "6.5rem", height: "4.5rem" }}
            >
              <Image
                src={"/assets/images/processing-msg.svg"}
                alt={"Company Logo"}
                layout="fill"
                // width={6}
                // height={4.5}
                objectFit="cover w-[6rem] h-[4.5rem]"
                className="rounded" // Add a class if you want rounded corners
                quality={100} // Set the quality of the image
              />
            </div>
          </div>
          {isEditing && (
            <div className="ml-16 space-x-4">
              <Button
                onClick={() => {
                  setIsFileUploadModalOpen(true);
                }}
                size={"sm"}
                variant={"primary-blue-outline"}
              >
                Upload
              </Button>
              <Button onClick={() => {}} size={"sm"} variant={"normal"}>
                Remove
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {ClientPageField.map(
            (fieldItem: ClientPageFieldType, index: number) => {
              return (
                <FormField
                  key={fieldItem?.key}
                  control={form.control}
                  name={fieldItem?.key}
                  render={({ field }) => (
                    <FormItem isEditing={isEditing}>
                      <FormLabel className={isEditing ? " text-black-txt" : ""}>
                        {fieldItem?.label}
                      </FormLabel>
                      <FormControl>
                        {fieldItem.type === "input" ? (
                          <Input
                            copyProps={{
                              allowCopy: true,
                              onClickCopy: () => {
                                handleCopy(fieldItem?.key);
                                closeDrawer();
                              },
                            }}
                            placeholder={fieldItem.placeholder}
                            {...field}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            isEditing={isEditing}
                          />
                        ) : (
                          fieldItem.type === "select" && (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                            >
                              <SelectTrigger
                                copyProps={{
                                  allowCopy: true,
                                  onClickCopy: () => {
                                    handleCopy(fieldItem?.key);
                                    closeDrawer();
                                  },
                                }}
                                isEditing={isEditing}
                              >
                                <SelectValue
                                  placeholder={fieldItem.placeholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldItem.options.map((option, index) => {
                                  return (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          )
                        )}
                      </FormControl>
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

  function handleCopy(key: keyof FormData) {
    console.log("form", form.getValues(key));
    appDispatch(
      documentAction.setCopiedContent({
        title: form.getValues(key),
        type: copiedContentType.Company,
      }),
    );
  }
}
