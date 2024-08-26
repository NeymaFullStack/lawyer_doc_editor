import { ClientPageFieldType } from "@/types/form";

export const ClientPageField: ClientPageFieldType[] = [
  {
    label: "Legal Name",
    key: "legalName",
    type: "input",
    placeholder: "Enter Legal Name",
  },
  {
    label: "Company Type",
    key: "companyType",
    type: "select",
    placeholder: "Select Company Type",
    options: [
      { label: "Corporation", value: "Corporation" },
      { label: "LLC", value: "LLC" },
      { label: "Partnership", value: "Partnership" },
    ],
  },
  {
    label: "Registered Address",
    key: "registeredAddress",
    type: "input",
    placeholder: "Enter Address",
  },
  {
    label: "Company Country",
    key: "companyCountry",
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
    key: "companyRegNumber",
    type: "input",
    placeholder: "Enter Registration Number",
  },
  {
    label: "Tax Identification Number",
    key: "taxIdNumber",
    type: "input",
    placeholder: "Enter Text Id",
  },
  {
    label: "Date of Incorporation",
    key: "incorporationDate",
    type: "input",
    placeholder: "Enter Date",
  },
  {
    label: "Registered Capital",
    key: "registeredCapital",
    type: "input",
    placeholder: "Enter Capital",
  },
  {
    label: "Legal Representative",
    key: "legalRep",
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
