import React from "react";
import { useNavigate } from "react-router-dom";

const Initial = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const isUserAuthenticated = async () => {
    const localStorageUser = localStorage.getItem("s-user");
    console.log("parseeeeeeeeeeeeeeeeee", localStorageUser);
    if (localStorageUser) {
      const parse = JSON.parse(localStorageUser);
      if (parse) {
        // return true;
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        // return false;
        navigate("/signin");
        setIsAuthenticated(false);
      }
    } else {
      // return false;
      navigate("/signin");
      setIsAuthenticated(false);
    }
  };

  React.useEffect(() => {
    console.log("xxxxx");
    isUserAuthenticated();
  }, []);

  return <div>Initial</div>;
};

export default Initial;
