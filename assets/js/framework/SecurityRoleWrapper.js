import React from "react";
import { SessionContext } from "../context/SessionContext";

const SecurityRoleWrapper = ({ children, role }) => {
  const { roles } = React.useContext(SessionContext);
  const hasPermission = () => roles.includes("admin") || roles.includes(role);

  return hasPermission ? children : null;
};

export default SecurityRoleWrapper;
