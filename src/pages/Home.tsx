import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import CreatePlayer from "../components/CreatePlayer";
import axios from "../utils/axios-instance";
import { encodeBase64 } from "../utils/base64";
import { config } from "../utils/default-config";
import Modal from "../components/Modal";
import Popover from "../components/Popover";
import mainconfig from "../config/index";
import { videoUrlExtensionUpdate, videoUrlUpdate } from "./Detail";
import Loader from "../components/Loader";

const Home = () => {
  const navigate = useNavigate();
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const user = JSON.parse(localStorage.getItem("s-user"));
  const [searchTitle, setSearchTitle] = React.useState("");
  const [activePlan, setActivePlan] = React.useState(false);
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);
  const [isSubsLoading, setSubsLoading] = React.useState(true);
  const [mediaCount, setMediaCount] = React.useState(0);
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");

  const topbarData = [
    { name: "Documents" },
    { name: "Get Help" },
    { name: "Terms & Conditions" },
    { name: "Privacy Policy" },
    { name: "Logout" },
  ];

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const allPlans = await axios.get("/plans", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const planDetails = allPlans.data.find(
        (item: any) => item.id === res.data.subscription.plan_id
      );
      setActivePlan(planDetails);

      if (res.data?.subscription?.status === "active") {
        localStorage.setItem(
          "s_subs",
          encodeBase64(res.data.subscription?.plan_id)
        );
      } else {
        navigate("/subscription");
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      if (error?.response?.status === 404) {
        navigate("/subscription");
      }
    } finally {
      setSubsLoading(false);
    }
  };

  const fetchMediaList = async () => {
    try {
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMediaCount(res.data.length);
    } catch (error) {
      console.log("error fetching media", error);
    }
  };

  const fetchPlayer = async () => {
    setError(false);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log("error fetching player", error);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
    fetchMediaList();
  }, []);

  React.useEffect(() => {
    fetchPlayer();
    videoUrlUpdate.value = "";
    videoUrlExtensionUpdate.value = "";
  }, [refetch]);

  const searchData =
    data &&
    data.filter((item: any) => {
      if (searchTitle === "") {
        return item;
      } else if (item.name.toLowerCase().includes(searchTitle?.toLowerCase())) {
        return item;
      }
    });

  const handleCardClick = (id: string) => {
    navigate({ pathname: "/detail", search: `?video=${id}` });
  };

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "") return setError("emtpy-player-name");
    try {
      setLoading(true);
      const data = {
        name: playerName,
        config: config,
      };

      await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoading(false);
      setOpenModalAdd(false);
      setTimeout(() => {
        setRefetch(Math.random());
      }, 500);
      webflow.notify({
        type: "Success",
        message: "Player Created Successfully!",
      });
    } catch (error) {
      setLoading(false);
      console.log("error creating player", error);
      setError("");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("s-token");
    localStorage.removeItem("splay-token");
    localStorage.removeItem("s-user");
    localStorage.removeItem("s_subs");
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
    <div>
      {isSubsLoading ? (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className="home-layout">
          <div>
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
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}'s
                Dashboard
              </p>
              <button aria-label="more_icon" className="media-options">
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
              </button>
            </div>
            {activePlan && activePlan.amount === 0 && (
              <div className="home-data-info-container">
                <div>
                  <p
                    className="subtitle-three"
                    style={{ display: "inline-block" }}
                  >
                    Usage:&nbsp;
                  </p>
                  <p
                    className="home-data-info"
                    style={{ display: "inline-block" }}
                  >
                    {mediaCount}/{activePlan.total_video_upload_limit} Video |{" "}
                    {activePlan.per_video_upload_limit}mb/video
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href={`${mainconfig.HOSTED_URL}/forgot-password`}
                    target="_blank"
                    style={{ textDecoration: "none", cursor: "default" }}
                  >
                    <p className="home-data-info-cta">Upgrade Plan</p>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 1, marginTop: "0.25rem" }}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Loader />
              </div>
            ) : searchData === null || searchData.length === 0 ? (
              <div>
                <p className="body" style={{ textAlign: "center" }}>
                  Click on "Create Player" to get started.
                </p>
                <button
                  aria-label="Create Player"
                  className="large-primary-btn"
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    padding: "0.25rem",
                  }}
                  onClick={() => {
                    setOpenModalAdd(true);
                  }}
                >
                  Create Player
                </button>
              </div>
            ) : (
              <>
                <div className="home-header">
                  <input
                    aria-label="search_input"
                    className="input-main"
                    type={"text"}
                    name={"search"}
                    placeholder={"Search"}
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <CreatePlayer width="100%" setRefetch={setRefetch} />
                  </div>
                </div>
                <div
                  className="home-card-grid"
                  style={{
                    height:
                      activePlan && activePlan.amount === 0
                        ? "20.5rem"
                        : "23.2rem",
                  }}
                >
                  {searchData.map((item: any, index: number) => {
                    return (
                      <VideoCard
                        key={index}
                        indexValue={index}
                        data={item}
                        handleCardClick={handleCardClick}
                        setRefetch={setRefetch}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <Modal
            isOpen={openModalAdd}
            setOpen={setOpenModalAdd}
            title={`Create New Player`}
            size="contain"
          >
            <div>
              <form onSubmit={createPlayer}>
                <input
                  aria-label="player_name_input"
                  className="input-main"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  value={playerName}
                  onChange={(e: any) => setPlayerName(e.target.value)}
                  name={"player-name"}
                  placeholder="Enter player name"
                />

                <div className="error-container">
                  {error === "emtpy-player-name" && (
                    <p
                      style={{
                        marginBottom: "0.5rem",
                      }}
                      className="error-text required-error-text-space"
                    >
                      Required field!
                    </p>
                  )}
                </div>

                <button
                  aria-label="Continue"
                  type="submit"
                  className="large-primary-btn"
                  style={{
                    width: "100%",
                  }}
                >
                  Continue
                </button>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Home;

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
