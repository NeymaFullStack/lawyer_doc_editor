import React, { memo, useCallback, useState } from "react";
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
import {
  countryCodeOptions,
  countryLanguage,
  countryOptions,
} from "../config-settings-view";
import { Icon } from "@/components/icons";
import { useAuthContext } from "@/auth/hooks";
import { workplaceDetailsType } from "../types";
import axiosInstance, { endpoints } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { LogoUploadModal } from "../logo-upload-modal";

import Image from "next/image";

const workplaceDetailsSchema = z.object({
  workplace_name: z.string().min(1, "First name is required"),
  user_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  website: z.string().optional(),
  legal_specialty: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  company_address: z.string().min(1, "Language is required"),
  tax_identification_number: z.string().optional(),
});

function General() {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const uploadedImageStateRef = React.useRef<{
    image: File | null;
    isLogoRemoved: boolean;
  }>({ image: null, isLogoRemoved: false });

  const form = useForm({
    resolver: zodResolver(workplaceDetailsSchema),
    defaultValues: {
      ...(user as workplaceDetailsType),
      country: user?.country || "uk",
      legal_specialty: user?.legal_specialty || "busniess",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const handleSaveLogo = useCallback(
    async (logo: File | null, isLogoRemoved: boolean) => {
      uploadedImageStateRef.current = {
        image: logo,
        isLogoRemoved: isLogoRemoved,
      };
    },
    [uploadedImageStateRef],
  );

  const saveUserData = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put(
        endpoints.settings.user.save,
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
      let params: Record<string, any> = { ...data };
      // sanitize params
      if (uploadedImageStateRef.current.isLogoRemoved) {
        params.is_profile_logo_deleted = true;
      }
      if (uploadedImageStateRef.current.image instanceof File) {
        params.profile_logo = uploadedImageStateRef.current.image;
      }
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      saveUserData(formData);
    },
    [uploadedImageStateRef, saveUserData],
  );

  return (
    <div className="flex h-full flex-col space-y-5">
      <WorlplaceLogo
        handleSaveLogo={handleSaveLogo}
        logo={user?.profile_logo}
      />
      <Separator className="bg-logan-primary-200" />
      <Form {...form}>
        {/* Profile Section */}
        <h3 className="font-semibold leading-none tracking-tight">Profile</h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-5 md:row-auto md:grid-cols-2">
          <FormField
            key={"workplace_name"}
            control={form.control}
            name={"workplace_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Workplace Name"
                    className={errors.workplace_name ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors?.workplace_name && (
                  <FormMessage>
                    {errors?.workplace_name?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"user_name"}
            control={form.control}
            name={"user_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Last Name"
                    className={errors.user_name ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.user_name && (
                  <FormMessage>
                    {errors.user_name?.message?.toString()}
                  </FormMessage>
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
            key={"email"}
            control={form.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contact Email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.email && (
                  <FormMessage>{errors.email?.message?.toString()}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"website"}
            control={form.control}
            name={"website"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company website*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company website"
                    className={errors.website ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.website && (
                  <FormMessage>
                    {errors.website?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"country"}
            control={form.control}
            name={"country"}
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
                {errors.country && (
                  <FormMessage>
                    {errors.country?.message?.toString()}
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
            key={"legal_specialty"}
            control={form.control}
            name={"legal_specialty"}
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
            key={"tax_identification_number"}
            control={form.control}
            name={"tax_identification_number"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Indentification Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Address"
                    className={
                      errors.tax_identification_number ? "border-red-500" : ""
                    }
                  />
                </FormControl>
                {errors.tax_identification_number && (
                  <FormMessage>
                    {errors.tax_identification_number?.message?.toString()}
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
}
export default General;

export const WorlplaceLogo = memo(
  ({
    handleSaveLogo,
    logo,
  }: {
    handleSaveLogo: (logo: File | null, isLogoRemoved: boolean) => void;
    logo: string | null;
  }) => {
    const [image, setImage] = useState<File | string | null>(logo);
    const [openUploadLogoModal, setOpenUploadLogoModal] =
      useState<boolean>(false);

    const handleUploadLogo = useCallback((logo: File) => {
      setImage(logo);
      handleSaveLogo(logo, false);
    }, []);

    const handleRemoveLogo = useCallback(() => {
      setImage(null);
      handleSaveLogo(null, true);
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
                  src={image as string}
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
