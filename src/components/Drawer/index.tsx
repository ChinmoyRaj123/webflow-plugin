import React, { Dispatch, SetStateAction, useEffect } from "react";
import "./drawer.css";
import ReactPortal from "../ReactPortal";
import packagejson from "../../../package.json";

type DrawerProps = {
  isVisible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
};

const Drawer = (props: DrawerProps) => {
  const { isVisible, onClose, title, children } = props;

  if (!isVisible) return null;

  return (
    <ReactPortal wrapperId="react-portal-drawer">
      <div
        className="drawer"
        style={{
          position: "relative",
        }}
      >
        <div className="drawerHeader">
          <span
            style={{ fontSize: "1rem" }}
            className="material-symbols-outlined white"
            onClick={() => onClose(false)}
          >
            close
          </span>
        </div>

        <div className="drawerContent">{children}</div>

        <div className="get-help-container">
          <div className="large-secondary-btn">
            <a
              style={{ textDecoration: "none" }}
              href={"https://www.skara.app/splay-support"}
              target="_blank"
            >
              <p
                className="body"
                // style={{ fontSize: "1rem", color: "#FFFFFF" }}
              >
                Get Help ?
              </p>
            </a>
          </div>

          <p className="label" style={{ marginTop: "0.5rem" }}>
            Version {packagejson.version}
          </p>
        </div>
      </div>
    </ReactPortal>
  );
};

export default Drawer;
