import { paths } from "@/routes/path";
import axios from "@/lib/axios";

export const WORKPACE_KEY = "workspace_id";

function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) return false;

  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert("Your session has expired. Please log in again.");

    sessionStorage.removeItem("accessToken");

    window.location.href = paths.login;
  }, timeLeft);
};

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    sessionStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const setWorkspaceSession = (workspace: string | null) => {
  if (workspace) {
    axios.defaults.headers.common[WORKPACE_KEY] = workspace;
    sessionStorage.setItem(WORKPACE_KEY, workspace);
  } else {
    delete axios.defaults.headers.common[WORKPACE_KEY];
    sessionStorage.removeItem(WORKPACE_KEY);
  }
};
