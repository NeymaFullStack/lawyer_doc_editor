"use client";
import React, { useEffect } from "react";
import { getUserDetails } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useDispatch } from "react-redux";
import { appAction } from "@/redux/appSlice";

function UserDetailsProvider({ children }) {
  const appDispatch = useDispatch();
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return <>{children}</>;

  async function fetchUserDetails() {
    const userRes = await getUserDetails();
    userRes.id && appDispatch(appAction.setUserDetails(userRes));
  }
}

export default UserDetailsProvider;
