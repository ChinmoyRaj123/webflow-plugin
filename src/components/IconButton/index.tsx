import React from "react";
import "./iconbutton.css";

type IconButtonProps = {
  children?: React.ReactElement;
  onClick?: any;
  width?: string;
  height?: string;
  padding?: string;
};

const Index = (props: IconButtonProps) => {
  const { onClick, children, height, width, padding } = props;
  return (
    <div
      className="icon-button-container"
      style={{
        width: width || "2.5rem",
        height: height || "2.5rem",
        padding: padding || "0.25rem",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Index;
