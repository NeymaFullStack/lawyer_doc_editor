import React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/utils/shadcn-utils";
import { resetPassword } from "@/api/clientSideServiceActions/dashboardServiceActions";

const passwordSchema = z.object({
  old_password: z.string().min(8, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  confirm_new_password: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
});

function Password() {
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

  const onSubmit = async (data) => {
    console.log(data);
    if (
      !data.old_password ||
      !data.new_password ||
      !data.confirm_new_password
    ) {
      return;
    }
    await resetPassword({ ...data });
  };
  return (
    <Card className="h-full space-y-2 border-none px-1 py-2 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5 pt-4">
        <div className="space-y-2">
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription className="text-xs font-normal text-primary-gray">
            Please enter your current password to change your password.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          variant={"primary-blue"}
        >
          Save Changes
        </Button>
      </CardHeader>
      <CardContent className=" h-full space-y-5">
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
                      style={{ fontFamily: "verdana" }}
                      className={cn(
                        "placeholder:font-system-ui text-sm tracking-[0.18rem] placeholder:text-[0.69rem] placeholder:font-normal placeholder:tracking-normal ",
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
                      placeholder="Your new password must be at least 8 characters."
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
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export default Password;
