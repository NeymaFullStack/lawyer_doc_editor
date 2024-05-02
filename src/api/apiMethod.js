import Axios from "axios";
import { auth } from "./serviceUrl";

// const isDevEnvironment = process && process.env.NODE_ENV === "development";

export const API_URL = "http://localhost:7003";

const Api = Axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 50000,
});

Api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${auth}`;
    console.log("config", config);
    return config;
  },
  (error) => {
    // console.log(error);
  },
);

export default Api;
