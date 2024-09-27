import { ClientPageFieldType } from "@/types/form";

export const ClientPageField: ClientPageFieldType[] = [
  {
    label: "Legal Name",
    key: "legal_name",
    type: "input",
    placeholder: "Enter Legal Name",
  },
  {
    label: "Company Type",
    key: "company_type",
    type: "input",
    placeholder: "Enter Company Type",
  },
  {
    label: "Registered Address",
    key: "registered_address",
    type: "input",
    placeholder: "Enter Address",
  },
  {
    label: "Company Country",
    key: "company_country",
    type: "select",
    placeholder: "Select Country",
    options: [
      { label: "USA", value: "USA" },
      { label: "Canada", value: "Canada" },
      { label: "UK", value: "UK" },
    ],
  },
  {
    label: "Company Registration Number",
    key: "company_registration_number",
    type: "input",
    placeholder: "Enter Registration Number",
  },
  {
    label: "Tax Identification Number",
    key: "tax_identification_number",
    type: "input",
    placeholder: "Enter Text Id",
  },
  {
    label: "Date of Incorporation",
    key: "date_of_incorporation",
    type: "input",
    placeholder: "Enter Date",
  },
  {
    label: "Registered Capital",
    key: "registered_capital",
    type: "input",
    placeholder: "Enter Capital",
  },
  {
    label: "Legal Representative",
    key: "legal_representative",
    type: "input",
    placeholder: "Enter Representative Name",
  },
  {
    label: "Activity",
    key: "activity",
    type: "input",
    placeholder: "Enter Activity",
  },
  {
    label: "Website",
    key: "website",
    type: "input",
    placeholder: "Enter Website",
  },
];
