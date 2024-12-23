import React from "react";
import * as CONSTANTS from "../../constants";

const NotFound: React.FC = () => (
  <div className="alert bg-info text-center">
    <h4 className="fw-bold">{CONSTANTS.Strings.NOT_FOUND_PAGE}</h4>
  </div>
);

export default NotFound;
