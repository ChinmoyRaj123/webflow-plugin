import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * This layout returns two spaces divided horizontally.
 * Navigation component is used which will render the topbar in top space.
 * Dynamic pages (i.e list view page and detail page) will be rendered in bottom space.
 */
const Index = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // removes the cookie and redirects to login page
  const handleSignOut = () => {
    console.log("handleSignOut");
    Cookies.remove("s-token");
    Cookies.remove("splay-token");
    Cookies.remove("s-user");
    Cookies.remove("s_subs");
    localStorage.removeItem("s-token");
    localStorage.removeItem("s-user");
    localStorage.removeItem("splay-token");
    // navigator({ pathname: '/signin' })
    navigate("/signin");
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <Navigation /> */}
      <Outlet />
    </div>
  );
};

export default Index;
