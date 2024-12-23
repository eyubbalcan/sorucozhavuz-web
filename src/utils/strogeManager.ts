import _ from "lodash";

const LOCAL_STROGE_TOKEN: string = "token";
const LOCAL_STROGE_ROLE: string = "role ";
const LOCAL_STROGE_NAME: string = "fullName";
const LOCAL_STROGE_EMAIL: string = "email";
const LOCAL_STROGE_ID: string = "id";
const LOCAL_STROGE_BRANCH: string = "branch";

export const getLocalValue = (key: string): string => {
  const token = localStorage.getItem(key);
  return !_.isNil(token) ? token.trim() : "";
};

export const setLocalToken = (token: string) =>
  localStorage.setItem(LOCAL_STROGE_TOKEN, token ?? "");

export const getLocalToken = (): string => getLocalValue(LOCAL_STROGE_TOKEN);

export const setLocalRole = (role: string) => {
  localStorage.setItem(LOCAL_STROGE_ROLE, role ?? "");
};

export const getLocalRole = (): string => getLocalValue(LOCAL_STROGE_ROLE);

export const setLocalFullName = (fullName: string) => {
  localStorage.setItem(LOCAL_STROGE_NAME, fullName ?? "");
};

export const getLocalFullName = (): string => {
  const name = getLocalValue(LOCAL_STROGE_NAME);
  return !_.isEmpty(name) ? name : "Kullanıcı";
};

export const setLocalEmail = (email: string) => {
  localStorage.setItem(LOCAL_STROGE_EMAIL, email ?? "");
};

export const getLocalEmail = (): string => getLocalValue(LOCAL_STROGE_EMAIL);

export const setLocalId = (id: string) => {
  localStorage.setItem(LOCAL_STROGE_ID, id ?? "");
};

export const getLocalId = (): string => getLocalValue(LOCAL_STROGE_ID);

export const setLocalBranch = (branch: string) => {
  localStorage.setItem(LOCAL_STROGE_BRANCH, branch ?? "");
};

export const getLocalBranch = (): string => getLocalValue(LOCAL_STROGE_BRANCH);

export const removeLocal = () => {
  localStorage.removeItem(LOCAL_STROGE_TOKEN);
  localStorage.removeItem(LOCAL_STROGE_ROLE);
  localStorage.removeItem(LOCAL_STROGE_NAME);
  localStorage.removeItem(LOCAL_STROGE_EMAIL);
  localStorage.removeItem(LOCAL_STROGE_ID);
  localStorage.removeItem(LOCAL_STROGE_BRANCH);
};
