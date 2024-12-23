import * as CONSTANTS from "../constants";

interface ICheckRole {
  (role: CONSTANTS.Roles): boolean;
}

interface ICheckRoles {
  (...roles: CONSTANTS.Roles[]): boolean;
}

const checkRole: ICheckRole = (role: CONSTANTS.Roles): boolean => {
  const userRole = localStorage.getItem(CONSTANTS.LOCAL_STROGE_ROLE_NAME) ?? "";
  if (userRole === CONSTANTS.Roles.ADMIN) return true;
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
