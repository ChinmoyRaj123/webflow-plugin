import React from "react";
import { useNavigate } from "react-router-dom";
import topbarData from "../database/topbarData.json";
import Popover from "../components/Popover";
import mainconfig from "../config/index";

const Subscription = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("s-user"));

  const handleSignOut = () => {
    localStorage.removeItem("s-token");
    localStorage.removeItem("s-user");
    localStorage.removeItem("splay-token");
    navigate("/signin");
  };

  const handleTopbarClick = (name: string) => {
    switch (name) {
      case "Documents":
        window.open("https://www.skara.app/video-player/splay", "_blank");
        break;
      case "Get Help":
        window.open("https://www.skara.app/video-player/splay", "_blank");
        break;
      case "Terms & Conditions":
        window.open("https://www.skara.app/video-player/splay", "_blank");
        break;
      case "Privacy Policy":
        window.open("https://www.skara.app/video-player/splay", "_blank");
        break;
      case "Logout":
        handleSignOut();
        break;
    }
  };

  return (
    <div className="home-layout">
      <div
        className="home-topbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.5rem 0",
        }}
      >
        <p className="body-dark">
          {user.name.charAt(0).toUpperCase() + user.name.slice(1)}'s Dashboard
        </p>
        <div className="media-options">
          <Popover
            position={"bottom"}
            trigger={
              <div
                className="media-option-image"
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  boxSizing: "border-box",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "default",
                }}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={"./icon/hamburger.svg"}
                  alt="nav_menu"
                ></img>
              </div>
            }
            content={
              <div>
                {topbarData.map((item, index) => {
                  return (
                    <TopbarContent
                      key={index}
                      handleOnClick={(e) => handleTopbarClick(e)}
                      contentName={item.name}
                    />
                  );
                })}
              </div>
            }
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "0.25rem",
          marginTop: "0.5rem",
        }}
      >
        <p
          className="body"
          style={{ color: "var(--redText)", textAlign: "center" }}
        >
          It looks like you haven't subscribed to any of our plans.
        </p>
        <p className="body" style={{ textAlign: "center" }}>
          Choose a plan and sign in here to start customizing the video player.
        </p>
        <div
          style={{ marginTop: "0.25rem" }}
          className="large-primary-btn"
          onClick={() => {
            window.open(`${mainconfig.HOSTED_URL}/plans`, "_blank");
          }}
        >
          Choose a plan
        </div>
      </div>
    </div>
  );
};

export default Subscription;

type TopbarContentType = {
  handleOnClick: (val: string) => void;
  contentName: string;
};

const TopbarContent = ({ handleOnClick, contentName }: TopbarContentType) => {
  return (
    <div
      className="navigation-popup-mobile text-with-hover"
      onClick={() => {
        handleOnClick(contentName);
      }}
    >
      <p className={`${contentName === "Logout" ? "logout-text" : "body"}`}>
        {contentName || "Duplicate"}
      </p>
    </div>
  );
};
