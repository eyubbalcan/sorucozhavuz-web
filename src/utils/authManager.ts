import { jwtDecode, JwtPayload } from "jwt-decode";
import _ from "lodash";
import { getLocalToken } from ".";

export const isTokenExpired = (): boolean => {
  const token = getLocalToken();
  if (_.isEmpty(token)) return true;
  const expire = jwtDecode<JwtPayload>(token).exp! * 1000;
  if (expire > new Date().getTime()) return false;
  return true;
};

export const isAuthenticated = (): boolean => !isTokenExpired();
