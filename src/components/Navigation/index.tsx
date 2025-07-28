import React from "react";
import Cookies from "js-cookie";
import "./navigation.css";
import { useNavigate } from "react-router-dom";
import Drawer from "../Drawer";
import navigation from "../../database/navigation.json";
import { decodeBase64 } from "../../utils/base64";

/**
 * Navigation component is used in home layout
 * This component renders brand title, user name and signout button
 */

const Navigation = () => {
  const navigator = useNavigate();

  const [visible, setVisible] = React.useState(false);
  const user = decodeBase64(Cookies.get("s-user") as string);

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
    navigator("/signin");
  };

  const handleNavigation = (link: string) => {
    navigator(link);
    setVisible(false);
  };

  return (
    <div className="nav-main">
      <div className="nav-container">
        <div className="nav-left-mobile" onClick={() => setVisible(true)}>
          <div
            style={{
              paddingLeft: "1rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              className="icon_image"
              src="./icon/hamburger.svg"
              alt="no image"
              width="24px"
              height="24px"
            />
            {/* <img src="./logo-white.png" alt="no image found" /> */}
          </div>
        </div>

        <Drawer isVisible={visible} onClose={setVisible} title="Splay">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {navigation.map((item, index) => {
              return (
                <div
                  key={index}
                  className="navigation-btn-mobile"
                  onClick={() => handleNavigation(item.link)}
                >
                  <p className="body">{item.title}</p>
                </div>
              );
            })}
            <div
              className="large-primary-btn"
              style={{
                marginTop: "0.5rem",
                // padding: "0.25rem 0.5rem",
                width: "max-content",
              }}
              onClick={() => handleSignOut()}
            >
              <p className="body">Sign Out</p>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Navigation;
