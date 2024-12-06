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
  userRoleOptions,
} from "../config-settings-view";
import { Icon } from "@/components/icons";
import { useAuthContext } from "@/auth/hooks";
import { UserProfile } from "../types";
import axiosInstance, { endpoints } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { LogoUploadModal } from "../logo-upload-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { SelectDropDownItemType } from "@/types";
import { sanitizeParams } from "@/components/hook-form/utils";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().optional(),
  role: z.string().optional(),
  legal_specialty: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  language: z.string().min(1, "Language is required"),
  country_code: z.string().optional(),
});

function DetailsView() {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImageState, setUploadedImageState] = React.useState<{
    image: File | null;
    isLogoRemoved: boolean;
  }>({ image: null, isLogoRemoved: false });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...(user as UserProfile),
      country_code: user?.country_code ?? "+44",
      country: user?.country ?? "uk",
      language: user?.language ?? "french",
      role: user?.role ?? undefined,
      legal_specialty: user?.legal_specialty ?? undefined,
      phone_number: user?.phone_number ?? "",
      email: user?.email ?? "",
    },
  });

  const disableSaveButton =
    !form.formState.isDirty &&
    !(
      uploadedImageState.image instanceof File ||
      uploadedImageState.isLogoRemoved
    );

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
    [uploadedImageState]
  );

  const saveUserData = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put(
        endpoints.settings.user.save,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onFormSubmit = useCallback(
    (data: UserProfile) => {
      let params: Record<string, any> = sanitizeParams({ ...data });
      // sanitize params
      if (uploadedImageState.isLogoRemoved) {
        params.is_profile_logo_deleted = true;
      }
      if (uploadedImageState.image instanceof File) {
        params.profile_logo = uploadedImageState.image;
      }
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      saveUserData(formData);
    },
    [uploadedImageState, saveUserData]
  );
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="inline-block text-xl font-bold">Avatar</h1>
        <Button
          onClick={() => {
            handleSubmit(onFormSubmit)();
          }}
          disabled={disableSaveButton}
          variant={"primary-blue"}
          className="flex items-center transition-all duration-300 ease-in-out"
        >
          Save Changes
          {isLoading && <LoadingSpinner className="ml-1" />}
        </Button>
      </div>
      <UserProfileLogo
        handleSaveLogo={handleSaveLogo}
        logo={user?.profile_logo}
      />
      <Separator className="bg-logan-primary-200" />
      <Form {...form}>
        {/* Profile Section */}
        <h3 className="font-semibold leading-none tracking-tight">Profile</h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-5 md:row-auto md:grid-cols-2">
          <FormField
            key={"first_name"}
            control={form.control}
            name={"first_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="First Name"
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors?.first_name && (
                  <FormMessage>
                    {errors?.first_name?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"last_name"}
            control={form.control}
            name={"last_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Last Name"
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.last_name && (
                  <FormMessage>
                    {errors.last_name?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"role"}
            control={form.control}
            name={"role"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role</FormLabel>
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
                      <SelectValue placeholder={"Select Your Role"} />
                    </SelectTrigger>

                    <SelectContent>
                      {userRoleOptions.map((option: SelectDropDownItemType) => {
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
        </div>
        <Separator className="bg-logan-primary-200" />
        <h3 className="font-semibold leading-none tracking-tight">Contact</h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:row-auto md:grid-cols-2">
          <FormField
            key={"email"}
            control={form.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                </FormControl>
                {errors.email && (
                  <FormMessage>{errors.email?.message?.toString()}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div aria-describedby="phone" className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <div
              tabIndex={0}
              className="flex h-10 w-full items-center gap-1 rounded-md border border-input bg-white py-1 pl-2 pr-1 text-xs transition-colors placeholder:text-logan-primary-50 focus-within:border-logan-blue focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400"
            >
              <FormField
                key={"country_code"}
                control={form.control}
                name={"country_code"}
                render={({ field }) => (
                  <FormItem className="min-w-24">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        {...(() => {
                          const { ref, ...rest } = field;
                          return rest;
                        })()}
                      >
                        <SelectTrigger className="h-[1.6rem] border-none bg-logan-primary-200 outline-none ring-0 focus:ring-0 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {countryCodeOptions.map((option, index) => {
                            return (
                              <SelectItem
                                key={option?.value}
                                value={option?.value}
                                className="cursor-pointer px-1"
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
                key={"phone_number"}
                control={form.control}
                name={"phone_number"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Phone Number"
                        className={"h-[1.6rem] !border-none outline-none "}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Separator className="bg-logan-primary-200" />
        <h3 className="font-semibold leading-none tracking-tight">General</h3>
        <div className="!mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:row-auto md:grid-cols-2">
          <FormField
            key={"country"}
            control={form.control}
            name={"country"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Practice*</FormLabel>
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
                    {errors.country_code?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            key={"language"}
            control={form.control}
            name={"language"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language Preference*</FormLabel>
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
                      <SelectValue placeholder={"Select Language"} />
                    </SelectTrigger>

                    <SelectContent>
                      {countryLanguage.map((option, index) => {
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
                {errors.language && (
                  <FormMessage>
                    {errors.language?.message?.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
export default DetailsView;

type UserProfileLogoType = {
  handleSaveLogo: (logo: File | null, isLogoRemoved: boolean) => void;
  logo: string | null;
};

export const UserProfileLogo = memo(
  ({ handleSaveLogo, logo }: UserProfileLogoType) => {
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
      <div className="flex items-center">
        {image && (
          <Avatar className="size-20">
            <AvatarImage
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
            />
            <AvatarFallback>LOGO</AvatarFallback>
          </Avatar>
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
        <LogoUploadModal
          handleUploadLogo={handleUploadLogo}
          setOpen={setOpenUploadLogoModal}
          open={openUploadLogoModal}
        />
      </div>
    );
  }
);

UserProfileLogo.displayName = "UserProfileLogo";
