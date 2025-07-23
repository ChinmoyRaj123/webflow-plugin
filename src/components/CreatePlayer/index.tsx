import React from "react";
import "./create-player.css";
import { useNavigate } from "react-router-dom";
import { config } from "../../utils/default-config";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../Loader";
import Toast from "../Toast";
import Modal from "../Modal";

type CreatePlayerProps = {
  width?: string;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const Index = (props: CreatePlayerProps) => {
  const { width, setRefetch } = props;
  const navigate = useNavigate();
  const [isLoading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [error, setError] = React.useState("");

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "") return setError("emtpy-player-name");
    try {
      setLoading(true);
      const data = {
        name: playerName,
        config: config,
        // "media_source": 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        // "media_type": 'm3u8',
      };

      const res = await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setLoading(false);
      setOpenModalAdd(false);
      setTimeout(() => {
        setRefetch(Math.random());
      }, 500);
      showToast();
    } catch (error) {
      setLoading(false);
      console.log("error creating player", error);
      setError("");
    }
  };

  return (
    <>
      <div
        className="create-player-container"
        style={{ width: width || "100%" }}
        onClick={() => {
          setOpenModalAdd(true);
        }}
      >
        <div className="create-player-btn-container">
          {isLoading ? (
            <Loader />
          ) : (
            <span
              className="material-symbols-outlined placeholder"
              style={{ fontSize: "48px" }}
            >
              add
            </span>
          )}
        </div>

        <div className="create-player-text-container">
          <p className="body">Create New Player</p>
        </div>
      </div>

      <Modal
        isOpen={openModalAdd}
        setOpen={setOpenModalAdd}
        title={`Create Player`}
        size="sm"
      >
        <div style={{ marginTop: "2rem" }}>
          <form onSubmit={createPlayer}>
            <p className="body">Player name</p>
            <input
              className="input-main"
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: "0.5rem",
              }}
              value={playerName}
              onChange={(e: any) => setPlayerName(e.target.value)}
              name={"player-name"}
              placeholder="Enter player name"
            />

            <div className="error-container">
              {error === "emtpy-player-name" && (
                <p className="error-text required-error-text-space">
                  Required field!
                </p>
              )}
            </div>

            <button
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                marginTop: "2rem",
              }}
            >
              Create
            </button>
          </form>
        </div>
      </Modal>

      <Toast show={show} hideToast={hideToast}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span className="material-symbols-outlined positive">done</span>
          <p className="subtitle-two" style={{ marginLeft: "1rem" }}>
            Player Created
          </p>
        </div>
      </Toast>
    </>
  );
};

export default Index;
