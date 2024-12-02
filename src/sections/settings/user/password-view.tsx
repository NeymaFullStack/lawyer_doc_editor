import React, { Fragment, useCallback, useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance, { endpoints } from "@/lib/axios";
import { LoadingSpinner } from "@/components/loading-spinner";
import { cn } from "@/lib/utils";
import { UserPassword } from "../types";

const passwordSchema = z.object({
  old_password: z.string().min(8, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  confirm_new_password: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
});

function PasswordView() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const resetPassword = useCallback(
    async (passwordParams: UserPassword) => {
      console.log(passwordParams);

      setIsLoading(true);
      try {
        const res = await axiosInstance.put(
          endpoints.settings.user.resetPassword,
          passwordParams,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [axiosInstance]
  );

  const onFormSubmit = useCallback(
    (data: UserPassword) => {
      if (data.new_password !== data.confirm_new_password) {
        // TODO show Error
        return;
      }
      resetPassword({ ...data });
    },
    [resetPassword]
  );

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="inline-block text-xl font-bold">
            Reset Your Password
          </h1>
          <Button
            onClick={() => {
              handleSubmit(onFormSubmit)();
            }}
            variant={"primary-blue"}
            className="transition-all duration-300 ease-in-out flex items-center"
          >
            Save Changes
            {isLoading && <LoadingSpinner className="ml-1 " />}
          </Button>
        </div>
        <p className=" text-sm text-logan-black-foreground">
          Please enter your current password to change your password.
        </p>
      </div>
      <Form {...form}>
        <div className="w-[75%]  grid-rows-3 space-y-4">
          <FormField
            key={"old_password"}
            control={form.control}
            name={"old_password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Current Password"
                    className={cn(
                      "text-sm tracking-widest placeholder:tracking-normal  placeholder:text-sm "
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            key={"new_password"}
            control={form.control}
            name={"new_password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Your new password must be at least 8 characters."
                    className={cn(
                      "text-sm tracking-widest placeholder:tracking-normal  placeholder:text-sm "
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            key={"confirm_new_password"}
            control={form.control}
            name={"confirm_new_password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm New PassWord" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}

export default PasswordView;
