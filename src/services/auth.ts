import { AxiosResponse } from "axios";
import api from "./api";
import { removeLocal } from "../utils";
import { ILoginUser, IToken } from "../models";
import { Routes } from "../route";

export const Login = async (login: ILoginUser) => {
  const response: AxiosResponse<IToken> = await api.post(`/login`, login);
  return response;
};

export const Logout = async () => {
  removeLocal();
  window.location.href = Routes.ROOT;
};
