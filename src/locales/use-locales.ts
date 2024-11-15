"use client";

import { useTranslation } from "react-i18next";

import { localStorageGetItem } from "@/utils/storage-available";

import { allLangs, defaultLang } from "./config-lang";

export const useLocales = () => {
  const langStorage = localStorageGetItem("i18nextLng");

  const currentLang =
    allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  return {
    allLangs,
    currentLang,
  };
};

export const useTranslate = () => {
  const { t, i18n, ready } = useTranslation();

  return { t, i18n, ready };
};
