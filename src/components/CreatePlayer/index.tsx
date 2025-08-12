import React from "react";
import "./create-player.css";
import { config } from "../../utils/default-config";
import axios from "../../utils/axios-instance";
import Modal from "../Modal";

type CreatePlayerProps = {
  width?: string;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const Index = (props: CreatePlayerProps) => {
  const [openModalAdd, setOpenModalAdd] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState("");
  const [error, setError] = React.useState("");
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

  const createPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (playerName === "") return setError("emtpy-player-name");
    try {
      const data = {
        name: playerName,
        config: config,
      };

      await axios.post("/players", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOpenModalAdd(false);
      webflow.notify({
        type: "Success",
        message: "Player created successfully!",
      });
    } catch (error) {
      webflow.notify({
        type: "Error",
        message: "Error creating player!",
      });
      console.log("error creating player", error);
      setError("");
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Create_player"
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
        <div style={{ margin: "0.5rem" }}>
          <form onSubmit={createPlayer}>
            <input
              aria-label="modal_input"
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
    </>
  );
};

export default Index;
