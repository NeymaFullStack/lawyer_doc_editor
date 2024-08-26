import { FormData } from "@/components/dashboard/clientPage/ClientPageBody";

export interface InputField {
  key: keyof FormData;
  type: "input";
  placeholder: string;
  label: string;
}

export interface SelectField {
  key: keyof FormData;
  type: "select";
  placeholder: string;
  options: { label: string; value: string }[];
  label: string;
}

export type ClientPageFieldType = InputField | SelectField;
