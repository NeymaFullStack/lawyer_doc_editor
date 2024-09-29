import Axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "http://ec2-35-83-210-143.us-west-2.compute.amazonaws.com:7003"
    : "http://ec2-35-83-210-143.us-west-2.compute.amazonaws.com:7003";
// export const API_URL =
//   "http://ec2-54-201-201-255.us-west-2.compute.amazonaws.com:7003";
// const tokenExpired = "Could not validate credentials";

const Api = Axios.create({
  baseURL: `${API_URL}`,
  headers: {},
  // timeout: 50000,
});

Api.interceptors.request.use(
  (config) => {
    const authToken =
      getCookie("authToken") && JSON.parse(getCookie("authToken"));
    config.headers["Authorization"] = `Bearer ${authToken})}`;
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
    if (response?.data?.detail === tokenExpired) {
      deleteCookie("authToken");
      // history.pushState(null, null, `/login`);
      location.reload();
    }
  },
);

export default Api;
