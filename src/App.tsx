import React from "react";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import Subscription from "./pages/Subscription";

const App = () => {
  const [authStatus, setAuthStatus] = React.useState<
    "loading" | "home" | "login" | "detail" | "subscription"
  >("loading");
  const [videoId, setVideoId] = React.useState("");

  React.useEffect(() => {
    const checkAuth = async () => {
      const localStorageUser = localStorage.getItem("s-user");
      if (localStorageUser) {
        try {
          const parse = JSON.parse(localStorageUser);
          if (parse) {
            setAuthStatus("home");
          } else {
            setAuthStatus("login");
          }
        } catch {
          setAuthStatus("login");
        }
      } else {
        setAuthStatus("login");
      }
    };

    checkAuth();
  }, []);

  if (authStatus === "loading") {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (authStatus === "home") {
    return (
      <Home
        handleVideoCardClick={(e) => {
          setVideoId(e);
          setAuthStatus("detail");
        }}
        handlePageChange={(e) => {
          setAuthStatus(e);
        }}
      />
    );
  }

  if (authStatus === "detail") {
    return (
      <Detail videoId={videoId} handlePageChange={(e) => setAuthStatus(e)} />
    );
  }

  if (authStatus === "subscription") {
    return (
      <Subscription
        handlePageChange={(e) => {
          setAuthStatus(e);
        }}
      />
    );
  }

  return <Login />;
};

export default App;
