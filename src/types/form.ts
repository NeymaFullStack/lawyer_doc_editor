import { ClientFormData } from "@/components/dashboard/clientPage/ClientPageBody";

export interface InputField {
  key: keyof ClientFormData;
  type: "input";
  placeholder: string;
  label: string;
}

export interface SelectField {
  key: keyof ClientFormData;
  type: "select";
  placeholder: string;
  options: { label: string; value: string }[];
  label: string;
}

export type ClientPageFieldType = InputField | SelectField;
