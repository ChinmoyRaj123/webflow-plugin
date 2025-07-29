import React from "react";

/**
 * This layout returns two spaces divided vertically.
 * South Asian Musicians along with a default profile photo is rendered in left space.
 * Dynamic pages (i.e signin and signup page) will be rendered in right space.
 */
const AuthLayout = ({ children }: any) => {
  return <div>{children}</div>;
};

export default AuthLayout;
