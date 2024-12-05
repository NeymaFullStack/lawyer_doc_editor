import React, { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { countryOptions } from "../config-settings-view";
import { Icon } from "@/components/icons";
import { useAuthContext } from "@/auth/hooks";
import { workplaceDetailsType } from "../types";
import axiosInstance, { endpoints } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { LogoUploadModal } from "../logo-upload-modal";

import Image from "next/image";
import { useFetcher } from "@/hooks/use-fetcher";
import { sanitizeParams } from "@/components/hook-form/utils";
import { LoadingSpinner } from "@/components/loading-spinner";

const workplaceDetailsSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  code: z.string().min(1, "User name is required"),
  company_email: z.string().optional(),
  company_website: z.string().optional(),
  company_legal_speciality: z.string().optional(),
  company_country_code: z.string().optional(),
  company_address: z.string().optional(),
  company_tax_identification_number: z.string().optional(),
});

const fetchWorkSpaceDetails = async (): Promise<{
  data: Record<string, any>;
  status: string;
}> => {
  const res = await axiosInstance.get(endpoints.workspace.workspaceDetails);
  return res.data;
};

export const General = () => {
  const { data } = useFetcher(fetchWorkSpaceDetails, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const workerDetails = data?.data;
  const { user, setUser } = useAuthContext();
  const [uploadedImageState, setUploadedImageState] = React.useState<{
    image: File | null;
    isLogoRemoved: boolean;
  }>({ image: null, isLogoRemoved: false });

  const form = useForm({
    resolver: zodResolver(workplaceDetailsSchema),
    defaultValues: {
      company_country_code: workerDetails?.company_details.country || "uk",
      company_legal_speciality:
        workerDetails?.company_details.legal_speciality || undefined,
      name: workerDetails?.name || "",
      code: workerDetails?.code || "",
      company_email: workerDetails?.company_details?.email || "",
      company_address: workerDetails?.company_details?.address || "",
      company_website: workerDetails?.company_details?.website || "",
      company_tax_identification_number:
        workerDetails?.company_details?.tax_identification_number || "",
    },
  });

  const disableSaveButton =
    !form.formState.isDirty &&
    !uploadedImageState.isLogoRemoved &&
    !(uploadedImageState.image instanceof File);

  useEffect(() => {
    if (workerDetails) {
      form.reset({
        company_country_code: workerDetails?.company_details.country || "uk",
        company_legal_speciality:
          workerDetails?.company_details.legal_speciality || undefined,
        name: workerDetails?.name || "",
        code: workerDetails?.code || "",
        company_email: workerDetails?.company_details?.mail || "",
        company_address: workerDetails?.company_details?.address || "",
        company_website: workerDetails?.company_details?.website || "",
        company_tax_identification_number:
          workerDetails?.company_details?.tax_identification_number || "",
      });
    }
  }, [workerDetails]);

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const handleSaveLogo = useCallback(
    async (logo: File | null, isLogoRemoved: boolean) => {
      setUploadedImageState({
        image: logo,
        isLogoRemoved: isLogoRemoved,
      });
    },
    [uploadedImageState],
  );

  const saveUserData = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put(
        endpoints.workspace.workspaceDetails,
        formData,
        { headers: { "content-type": "multipart/form-data" } },
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onFormSubmit = useCallback(
    (data: workplaceDetailsType) => {
      let params: Record<string, any> = sanitizeParams({ ...data });
      // sanitize params
      if (uploadedImageState.isLogoRemoved) {
        params.is_logo_deleted = true;
      }
      if (uploadedImageState.image instanceof File) {
        params.logo = uploadedImageState.image;
      }
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      saveUserData(formData);
    },
    [uploadedImageState, saveUserData],
  );

  return (
    <div className="relative flex h-full flex-col space-y-5">
      <Button
        onClick={() => {
          handleSubmit(onFormSubmit)();
        }}
        disabled={disableSaveButton}
        variant={"primary-blue"}
        className="absolute -top-[4.55rem] right-0 flex w-min items-center transition-all duration-300 ease-in-out"
      >
        Save Changes
        {isLoading && <LoadingSpinner className="ml-1" />}
      </Button>

      <WorlplaceLogo handleSaveLogo={handleSaveLogo} logo={user?.logo} />
      <Separator className="bg-logan-primary-200" />
      <Form {...form}>
        {/* Profile Section */}
        <h3 className="font-semibold leading-none tracking-tight">Profile</h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-5 md:row-auto md:grid-cols-2">
          <FormField
            key={"name"}
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Workplace Name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors?.name && (
                  <FormMessage>{errors?.name?.message?.toString()}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"code"}
            control={form.control}
            name={"code"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="User Name"
                    className={errors.code ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.code && (
                  <FormMessage>{errors.code?.message?.toString()}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
        <Separator className="bg-logan-primary-200" />
        <h3 className="font-semibold leading-none tracking-tight">
          Company Information
        </h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:row-auto md:grid-cols-2">
          <FormField
            key={"company_email"}
            control={form.control}
            name={"company_email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contact Email"
                    className={errors.company_email ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.company_email && (
                  <FormMessage>
                    {errors.company_email?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"company_website"}
            control={form.control}
            name={"company_website"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company website*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company website"
                    className={errors.company_website ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.company_website && (
                  <FormMessage>
                    {errors.company_website?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"company_country_code"}
            control={form.control}
            name={"company_country_code"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Country*</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    {...(() => {
                      const { ref, ...rest } = field;
                      return rest;
                    })()}
                  >
                    <SelectTrigger
                      dropdownIcon={
                        <Icon iconName="logan-selct-dropdown-arrow" />
                      }
                    >
                      <SelectValue placeholder={"Select Country"} />
                    </SelectTrigger>

                    <SelectContent className="min-w-fit">
                      {countryOptions.map((option, index) => {
                        return (
                          <SelectItem
                            key={option?.value}
                            value={option?.value}
                            className="cursor-pointer justify-start"
                          >
                            {option?.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.company_country_code && (
                  <FormMessage>
                    {errors.company_country_code?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"company_address"}
            control={form.control}
            name={"company_address"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Address*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Address"
                    className={errors.company_address ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.company_address && (
                  <FormMessage>
                    {errors.company_address?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"company_legal_speciality"}
            control={form.control}
            name={"company_legal_speciality"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Speciality</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    {...(() => {
                      const { ref, ...rest } = field;
                      return rest;
                    })()}
                  >
                    <SelectTrigger
                      dropdownIcon={
                        <Icon iconName="logan-selct-dropdown-arrow" />
                      }
                    >
                      <SelectValue placeholder={"Legal Specialty"} />
                    </SelectTrigger>

                    <SelectContent>
                      {[
                        { label: "One", value: "one" },
                        { label: "Two", value: "two" },
                      ].map((option, index) => {
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
              </FormItem>
            )}
          />
          <FormField
            key={"company_tax_identification_number"}
            control={form.control}
            name={"company_tax_identification_number"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Identification Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Address"
                    className={
                      errors.company_tax_identification_number
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                {errors.company_tax_identification_number && (
                  <FormMessage>
                    {errors.company_tax_identification_number?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </Form>
      <Separator className="bg-logan-primary-200" />
      <DeleteWorkPlace />
    </div>
  );
};

type workplaceProfileLogoType = {
  handleSaveLogo: (logo: File | null, isLogoRemoved: boolean) => void;
  logo: string | null;
};

const WorlplaceLogo = memo(
  ({ handleSaveLogo, logo }: workplaceProfileLogoType) => {
    const [image, setImage] = useState<File | string | null>(logo);
    const [openUploadLogoModal, setOpenUploadLogoModal] =
      useState<boolean>(false);

    const handleUploadLogo = useCallback((logo: File) => {
      setImage(logo);
      handleSaveLogo(logo, false);
    }, []);

    const handleRemoveLogo = useCallback(() => {
      setImage(null);
      let logoStatus = typeof logo === "string" ? true : false;
      handleSaveLogo(null, logoStatus);
    }, []);
    return (
      <div className="flex flex-col space-y-5">
        <h3 className="font-semibold leading-none tracking-tight">
          Workplace Profile
        </h3>
        <div className="flex flex-col space-y-4">
          <Label>Workplace Logo</Label>
          <div className="flex items-center">
            {image && (
              <div className="h-20 w-32">
                <Image
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="logo"
                  fill
                  className="!static h-full w-full rounded object-cover"
                />
              </div>
            )}

            <div className={cn("ml-16 space-x-4", !image && "ml-0")}>
              <Button
                onClick={(e) => {
                  setOpenUploadLogoModal(true);
                  e.stopPropagation();
                  e.preventDefault();
                }}
                size={"sm"}
                variant={"outline"}
                className="border !border-logan-blue !text-logan-blue hover:bg-white"
              >
                Upload
              </Button>
              <Button
                onClick={handleRemoveLogo}
                variant={"outline"}
                className="hover:bg-white"
                size={"sm"}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
        <LogoUploadModal
          handleUploadLogo={handleUploadLogo}
          setOpen={setOpenUploadLogoModal}
          open={openUploadLogoModal}
        />
      </div>
    );
  },
);

WorlplaceLogo.displayName = "WorlplaceLogo";

const DeleteWorkPlace = memo(() => {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-semibold leading-none tracking-tight">
        Delete Workspace
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex w-7/12 flex-col space-y-4">
          <p className="text-xs text-logan-black-foreground">
            <span className="font-semibold">Warning </span> Deleting this
            workspace is irreversible and will result in the permanent removal
            of all associated client folders and their documents. We strongly
            recommend backing up all files and documents before proceeding with
            deletion.
          </p>
          <p className="text-xs font-semibold text-logan-black-foreground underline">
            Consult Logan’s FAQ section for more information
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          size={"sm"}
          variant={"outline"}
          className="border !border-logan-warn !text-logan-warn hover:bg-white"
        >
          Delete Workspace
        </Button>
      </div>
    </div>
  );
});
DeleteWorkPlace.displayName = "DeleteWorkPlace";
