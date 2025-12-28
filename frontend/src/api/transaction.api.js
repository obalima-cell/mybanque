import api from "./axios";

export default {
  getHistory: () => api.get("/accounts/history"),
};
