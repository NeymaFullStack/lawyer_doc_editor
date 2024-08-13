"use client";
import { useEffect, useState } from "react";

const useUserDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  return user;
};

export default useUserDetails;
