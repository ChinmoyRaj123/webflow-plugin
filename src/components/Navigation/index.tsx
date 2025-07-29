import React from "react";
import Cookies from "js-cookie";
import "./navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigator = useNavigate();

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
    navigator("/signin");
  };

  return (
    <div className="nav-main">
      <div className="nav-container">
        <div className="nav-left-mobile">
          <p
            className="tab"
            onClick={() => {
              navigator("/home");
            }}
          >
            Home
          </p>
          <p className="tab" onClick={() => handleSignOut()}>
            Log out
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
