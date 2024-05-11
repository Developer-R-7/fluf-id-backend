import * as yup from "yup";

export const userCreateSchema = yup.object().shape({
  name: yup.string().min(1).max(100).required("name is required"),
  walletAddress: yup.string().required("walletAddress is required"),
});

export const userLoginSchema = yup.object().shape({
  walletAddress: yup.string().required("walletAddress is required"),
});
