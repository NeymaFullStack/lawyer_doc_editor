import LoginForm from "@/components/auth/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    <section className=" bg-gray-50 dark:bg-gray-900">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
