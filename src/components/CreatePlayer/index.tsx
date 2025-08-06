import React from "react";
import "./create-player.css";
import { useNavigate } from "react-router-dom";
import { config } from "../../utils/default-config";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
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
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

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
      showToast();
    } catch (error) {
      setLoading(false);
      console.log("error creating player", error);
      setError("");
    }
  };

  return (
    <>
      <button
        className="large-primary-btn"
        style={{
          width: "100%",
          padding: "0.25rem",
          // margin: "2rem 0",
        }}
        onClick={() => {
          setOpenModalAdd(true);
        }}
      >
        Create Player
      </button>

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
