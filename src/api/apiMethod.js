import Axios from "axios";
import { auth } from "./serviceUrl";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

export const API_URL = "http://localhost:7003";

const Api = Axios.create({
  baseURL: `${API_URL}`,
  headers: {},
  // timeout: 50000,
});

Api.interceptors.request.use(
  (config) => {
    if (isDevEnvironment) {
      config.headers["Authorization"] = `Bearer ${auth}`;
    } else if (process.env.NODE_ENV === "production") {
      // Set withCredentials to true
      config.withCredentials = true;
    }
    console.log("config", config);
    return config;
  },
  (error) => {
    // console.log(error);
  },
);

export default Api;
