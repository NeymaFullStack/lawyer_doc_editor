import axios, { AxiosRequestConfig } from "axios";

import { HOST_API } from "@/config-global";

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    ),
);

export default axiosInstance;

export const endpoints = {
  login: "/auth/login",
  me: "/auth/me",
};
