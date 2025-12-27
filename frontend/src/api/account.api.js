import api from "./axios";

export const getAccounts = () =>
  api.get("/accounts");

export const getTransactions = () =>
  api.get("/accounts/history");

export const downloadStatement = (id) =>
  api.get(`/accounts/${id}/statement/pdf`, {
    responseType: "blob",
  });
