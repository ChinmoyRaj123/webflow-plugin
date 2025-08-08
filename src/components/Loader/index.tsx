import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <p className="body loader">
      Loading<span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </p>
  );
};

export default Loader;
