import React, { JSX } from "react";
import * as CONSTANTS from "../constants";
import { isAuthenticated } from "../utils";
import { checkRoles } from "../utils";

interface IPrivateRoute {
  children: JSX.Element;
  roles?: CONSTANTS.Roles[];
}

const PrivateRoute: React.FC<IPrivateRoute> = ({ children, roles }) => {
  if (!isAuthenticated()) {
    window.location.href = window.location.pathname;
    return <></>;
  }

  let control: boolean = false;

  if (roles && Array.isArray(roles) && roles.length > 0) {
    for (const role of roles) {
      if (checkRoles(role)) {
        control = true;
        break;
      }
    }
  }

  if (roles && !control)
    return (
      <div color="danger" className="alert bg-danger text-center">
        <h5 className="fw-bold">{CONSTANTS.Strings.NOT_AUTHORIZATION}</h5>
      </div>
    );

  return children;
};

export default PrivateRoute;
