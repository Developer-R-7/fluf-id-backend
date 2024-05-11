import * as yup from "yup";

export const updateContractAddressSchema = yup.object().shape({
  contractAddress: yup.string().required("contractAddress is required"),
});

export const userRegisterAppSchema = yup.object().shape({
  appId: yup.number().required("appId is required"),
});
