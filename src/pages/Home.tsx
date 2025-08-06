import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import CreatePlayer from "../components/CreatePlayer";
import axios from "../utils/axios-instance";
import Cookies from "js-cookie";
import { encodeBase64 } from "../utils/base64";
import { config } from "../utils/default-config";
import Modal from "../components/Modal";

const Home = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const [mediaCount, setMediaCount] = React.useState(0);
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data?.subscription?.status === "active") {
        localStorage.setItem(
          "s_subs",
          encodeBase64(res.data.subscription?.plan_id)
        );
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        // navigate({
        //   pathname: "/checkout",
        //   search: `?planid=${res.data.subscription?.plan_id}&s_id=${res.data.subscription?.provider?.subscription_id}`,
        // });
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      // if (error?.response?.status === 404) {
      //   navigate("/plans");
      // }
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
    setLoading(true);
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

  //redirects the user to detail page when interacted with card button.
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

      const res = await axios.post("/players", data, {
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

  return (
    <div className="home-layout">
      <div className="home-data-info-container">
        <div>
          <p className="home-data-info">
            {10 - mediaCount}/10 Video left | 200mb/video
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="/" target="_blank" style={{ textDecoration: "none" }}>
            <p className="home-data-info-cta">Upgrade Plan</p>
          </a>
        </div>
      </div>

      {isLoading ? (
        <p className="body" style={{ marginTop: "0.5rem" }}>
          Loading...
        </p>
      ) : searchData === null || searchData.length === 0 ? (
        <div>
          <p className="body" style={{ textAlign: "center" }}>
            Click on "Create Player" to get started.
          </p>
          <button
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
          <div className="home-card-grid">
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

      <Modal
        isOpen={openModalAdd}
        setOpen={setOpenModalAdd}
        title={`Create New Player`}
        size="contain"
      >
        <div>
          <form onSubmit={createPlayer}>
            <input
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
  );
};

export default Home;
