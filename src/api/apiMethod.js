import Axios from "axios";
import { auth } from "./serviceUrl";
import { deleteCookie, getCookie, getCookies } from "cookies-next";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

export const API_URL = "http://localhost:7003";
const tokenExpired = "Could not validate credentials";
const Api = Axios.create({
  baseURL: `${API_URL}`,
  headers: {},
  // timeout: 50000,
});

Api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const authToken =
        getCookie("authToken") && JSON.parse(getCookie("authToken"));
      config.headers["Authorization"] = `Bearer ${authToken})}`;
      // if (isDevEnvironment && authToken) {
      // } else if (process.env.NODE_ENV === "production") {
      //    config.withCredentials = true;
      // }
    }
    return config;
  },
  (error) => {
    // console.log(error);
  },
);

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    // console.log(response);
    if (response?.data?.detail === tokenExpired) {
      deleteCookie("authToken");
      // if (typeof window !== "undefined") {
      //   window.location.href("/login");
      // }
      // Router.push("/login");
    }
  },
);

export default Api;
