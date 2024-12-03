import axios, { AxiosRequestConfig } from "axios";

import { HOST_API } from "@/config-global";

// const axiosInstance = axios.create({ baseURL: HOST_API });
const axiosInstance = axios.create({ baseURL: "http://localhost:7003" });

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
  me: "/user",
  workspace: {
    workspace: (id: string) => `/workspace/${id}`,
    workspaceList: "/workspace/list",
  },
  document: {
    recent: "/document/recent/list",
    document: (id: string) => "/document/" + id,
    save: "/document/version/save",
    currentVersion: (id: string, versionId: string) =>
      `/document/${id}/${versionId}`,
  },
  folder: {
    clients: "/folder/client/all",
    folder: "/folder/",
    folderHierarchy: "/folder/root/hierarchy/",
  },
};
