import * as yup from "yup";

export const updateContractAddressSchema = yup.object().shape({
  contractAddress: yup.string().required("contractAddress is required"),
});

export const registerAppSchema = yup.object().shape({
  name: yup.string().required("name is required"),
  description: yup.string().required("description is required"),
});
