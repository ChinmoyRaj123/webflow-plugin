import React from "react";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <p className="body">No plans subscribed. Subscribe a plan to continue.</p>
      <p
        className="home-data-info-cta"
        style={{ display: "block" }}
        onClick={() => {
          localStorage.removeItem("s-token");
          localStorage.removeItem("s-user");
          localStorage.removeItem("splay-token");
          navigate("/signin");
        }}
      >
        Sign In
      </p>
    </div>
  );
};

export default Subscription;
