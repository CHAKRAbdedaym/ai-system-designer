import api from "../../shared/api/axios";

export const loginUser = (data) => {
  return api.post("token/", data);
};

export const registerUser = (data) => {
  return api.post("register/", data); 
};
