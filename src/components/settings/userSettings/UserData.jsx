import React, { use, useEffect } from "react";
import { useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/ui/card";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import { Separator } from "@/components/shadcn-components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import { Label } from "@/components/shadcn-components/ui/label";
import FileUploadModal from "@/components/generic/FileUploadModal";
import { cn } from "@/utils/shadcn-utils";
import Image from "next/image";
import RemSizeImage from "../../generic/RemSizeImage";
import { countryCodeOptions, countryOptions } from "@/constants/list";
import { useSelector } from "react-redux";
import { updateUserDetails } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { appAction } from "@/redux/appSlice";
import { useDispatch } from "react-redux";

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

function UserData() {
  const appDispatch = useDispatch();
  const [file, setFile] = useState(null);
  const isFileRemoved = useRef(false);
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "",
      legal_specialty: "",
      country: "",
      language: "",
      country_code: "+44",
    },
  });

  //   useEffect(() => {
  //     fetchUserDetails();
  //   }, []);

  useEffect(() => {
    if (userDetails && form) {
      let autoFillDetails = {};
      for (let key in userDetails) {
        autoFillDetails[key] = userDetails[key] || "";
      }

      if ("profile_logo" in userDetails && userDetails["profile_logo"]) {
        setFile(userDetails["profile_logo"]);
      }
      form.reset(autoFillDetails);
    }
  }, [userDetails, form]);

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data) => {
    let submitClientFormData = { ...data };
    if (file && typeof file === "object") {
      submitClientFormData["profile_logo"] = file;
    }
    if (isFileRemoved.current) {
      submitClientFormData.is_profile_logo_deleted = true;
    }
    saveUserDetails(submitClientFormData);
  };
  return (
    <>
      <FileUploadModal
        onClickSave={(file) => {
          setFile(file);
          isFileRemoved.current = false;
        }}
        isOpen={isFileUploadModalOpen}
        onClose={() => {
          setIsFileUploadModalOpen(false);
        }}
      />
      <Card className="h-full border-none px-1 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5 pt-4">
          <CardTitle className=" inline-block">Avatar</CardTitle>
          <Button
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            variant={"primary-blue"}
          >
            Save Changes
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center border-b-[1px] border-b-six pb-6">
            {file && (
              <div
                className="relative border-secondary-blue"
                style={{ width: "5rem", height: "5rem" }}
              >
                <Image
                  src={
                    typeof file === "string" ? file : URL.createObjectURL(file)
                  }
                  alt={"User Avatar"}
                  fill
                  // objectFit="cover "
                  className="rounded-full bg-cover" // Add a class if you want rounded corners
                  quality={100} // Set the quality of the image
                />
              </div>
            )}
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
                  file &&
                    typeof file === "string" &&
                    (isFileRemoved.current = true);
                  setFile(null);
                }}
                size={"sm"}
                variant={"normal"}
              >
                Remove
              </Button>
            </div>
          </div>
          <Form {...form}>
            {/* Profile Section */}
            <h3 className="font-semibold leading-none tracking-tight ">
              Profile
            </h3>
            <div className="!mt-3 grid grid-cols-1 gap-x-10 gap-y-5 md:row-auto  md:grid-cols-2">
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
                    {errors.first_name && (
                      <FormMessage>{errors.first_name?.message}</FormMessage>
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
                      <FormMessage>{errors.last_name?.message}</FormMessage>
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
                          delete field?.ref;
                          return field;
                        })()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Your Role"} />
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
                          delete field?.ref;
                          return field;
                        })()}
                      >
                        <SelectTrigger>
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
            <Separator className="bg-six" />
            <h3 className="font-semibold leading-none tracking-tight ">
              Contact
            </h3>
            <div className="!mt-3 grid grid-cols-1 gap-x-10 gap-y-6 md:row-auto  md:grid-cols-2">
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
                      <FormMessage>{errors.email?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div aria-describedby="phone" className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div
                  tabIndex={0}
                  className="flex h-9 w-full gap-1 rounded-md border border-secondary-blue bg-white py-1 pl-2 pr-3  text-xs  transition-colors  placeholder:text-primary-gray  focus-within:border-primary-blue focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                >
                  <FormField
                    key={"country_code"}
                    control={form.control}
                    name={"country_code"}
                    render={({ field }) => (
                      <FormItem className="w-[25%] ">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            {...(() => {
                              delete field?.ref;
                              return field;
                            })()}
                          >
                            <SelectTrigger
                              className="h-[1.6rem] border-none bg-six p-1 px-2 outline-none ring-0 focus:ring-0"
                              dropDownicon={
                                <RemSizeImage
                                  imagePath={
                                    "/assets/icons/arrow-down-gray.svg"
                                  }
                                  remWidth={0.7}
                                  remHeight={0.7}
                                  alt={"dropdown"}
                                  className="translate-x-0.5"
                                />
                              }
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="min-w-fit">
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
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Phone Number"
                            className={
                              "h-[1.6rem] border-none outline-none ring-0 focus-visible:ring-0"
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <Separator className="bg-six" />
            <h3 className="font-semibold leading-none tracking-tight ">
              General
            </h3>
            <div className="!mt-3 grid grid-cols-1 gap-x-10 gap-y-6 md:row-auto  md:grid-cols-2">
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
                          delete field?.ref;
                          return field;
                        })()}
                      >
                        <SelectTrigger>
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
                      <FormMessage>{errors.country_code?.message}</FormMessage>
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
                          delete field?.ref;
                          return field;
                        })()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Select Language"} />
                        </SelectTrigger>

                        <SelectContent>
                          {[
                            { label: "French", value: "french" },
                            { label: "English (UK)", value: "english(uk)" },
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
                    {errors.language && (
                      <FormMessage>{errors.language?.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  );

  async function saveUserDetails(userData) {
    console.log("userData", userData);
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    const updateRes = await updateUserDetails(formData);
    if (updateRes?.id) {
      appDispatch(appAction.setUserDetails(updateRes));
    }
  }
}

export default UserData;
