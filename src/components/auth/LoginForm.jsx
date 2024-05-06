"use client";
import { userLogin } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { dashboardRoute } from "@/constants/routes";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginForm() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const router = useRouter();
  // console.log("login", loginData);
  return (
    <form
      className="w-[22rem] space-y-4 md:space-y-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
          }}
          value={loginData?.email}
          autoComplete="off"
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="name@company.com"
          required=""
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value });
          }}
          value={loginData?.password}
          autoComplete="off"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          required=""
        />
      </div>

      <button
        onClick={login}
        className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Sign in
      </button>
    </form>
  );
  async function login() {
    const res = await userLogin({
      username: loginData?.email,
      password: loginData?.password,
    });
    if (res?.access_token) {
      setCookie("authToken", JSON.stringify(res.access_token));
      router.push("/dashboard");
    }
  }
}

export default LoginForm;
