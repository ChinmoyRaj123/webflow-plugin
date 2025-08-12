import React from "react";
import { useNavigate } from "react-router-dom";

const Initial = () => {
  const navigate = useNavigate();

  const isUserAuthenticated = async () => {
    const localStorageUser = localStorage.getItem("s-user");
    if (localStorageUser) {
      const parse = JSON.parse(localStorageUser);
      if (parse) {
        navigate("/home");
      } else {
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  };

  React.useEffect(() => {
    isUserAuthenticated();
  }, []);

  return <div>Initial</div>;
};

export default Initial;
