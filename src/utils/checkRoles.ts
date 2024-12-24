import * as CONSTANTS from "../constants";
import { getLocalRole } from "./strogeManager";

interface ICheckRole {
  (role: CONSTANTS.Roles): boolean;
}

interface ICheckRoles {
  (...roles: CONSTANTS.Roles[]): boolean;
}

const checkRole: ICheckRole = (role: CONSTANTS.Roles): boolean => {
  const userRole = getLocalRole().toLocaleLowerCase() ?? "";
  if (userRole === CONSTANTS.Roles.ADMIN.toLocaleLowerCase()) return true;
  if (userRole.toLocaleLowerCase() === role.toLocaleLowerCase()) return true;
  return false;
};

export const checkRoles: ICheckRoles = (
  ...roles: CONSTANTS.Roles[]
): boolean => {
  if (roles.length <= 0) return false;

  for (const role of roles) {
    if (checkRole(role)) return true;
  }

  return false;
};
