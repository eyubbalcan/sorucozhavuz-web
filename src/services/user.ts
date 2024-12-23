import { AxiosResponse } from "axios";
import api from "./api";
import { IUserRes } from "../models";
import _ from "lodash";

export const GetUser = async () => {
  const response: AxiosResponse<IUserRes> = await api.get(`/user/me`);
  return response;
};

export const GetFullName = (user?: IUserRes | null) => {
  if (_.isNil(user)) return "";
  return `${user.firstName} ${user.lastName}`;
};
