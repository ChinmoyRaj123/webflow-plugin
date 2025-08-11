import React from "react";
import "./videocard.css";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import { timeAgo } from "../../utils/helper";
import Popover from "../Popover";

type VideoCardProps = {
  handleCardClick: (id: string) => void;
  indexValue: number;
  data?: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const Index = (props: VideoCardProps) => {
  const { handleCardClick, data, setRefetch, indexValue } = props;
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const [openDuplicateModal, setOpenDuplicateModal] =
    React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [openRenameModal, setOpenRenameModal] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState(data.name);

  const duplicatePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newdata = {
        name: data.name.concat("_copy"),
        config: data.config,
      };
      const res = await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOpenDuplicateModal(false);
      webflow.notify({ type: "Success", message: "Player duplicated!" });
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
      console.log("duplicate player", res);
    } catch (error) {
      webflow.notify({ type: "Error", message: "Player duplication failed!" });
      console.log("error", error);
    }
  };

  const deletePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/players/${data.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("delete", res);
      setOpenDeleteModal(false);
      webflow.notify({ type: "Success", message: "Player deleted!" });
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      webflow.notify({ type: "Error", message: "Player deletion failed!" });
      console.log("error deleting player", error);
    }
  };

  const renamePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const modifiedData = { ...data, name: playerName };
    try {
      const res = await axios.put(`/players/${data.id}`, modifiedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOpenRenameModal(false);
      webflow.notify({
        type: "Success",
        message: "Player renamed successfully!",
      });
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      webflow.notify({ type: "Error", message: "Player rename failed!" });
      console.log("error deleting player", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        paddingTop: indexValue === 0 ? "0" : "0.25rem",
        paddingLeft: "0.25rem",
      }}
    >
      <button
        aria-label="video card"
        className="large-secondary-btn"
        style={{
          padding: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flex: 1,
          }}
          onClick={() => {
            handleCardClick(data.id);
          }}
        >
          <div
            style={{
              width: "5rem",
              aspectRatio: "16/9",
              borderRadius: "0.25rem",
              backgroundImage: `url(${
                data.config.playerThumbnailImageUrl ||
                "https://skara-imagecontent-staging.b-cdn.net/b14652d6-1e0c-4716-85f4-9fa9d53d8d25/d61b4510-224c-437d-bcdd-577701e9cec5/splaycover.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            style={{
              flex: 1,
              wordBreak: "break-all",
            }}
          >
            <p className="videocard-name">{data.name}</p>
            <p className="videocard-timeline">
              last edit {timeAgo(data.updated_at)}
            </p>
          </div>
        </div>
        <button aria-label="more_icon" className="media-options">
          <Popover
            position={indexValue === 0 ? "bottom" : "top"}
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
                  src={"./icon/More.svg"}
                  alt="more_icon"
                ></img>
              </div>
            }
            content={
              <div>
                <div
                  className="navigation-popup-mobile text-with-hover"
                  onClick={() => {
                    setOpenDuplicateModal(true);
                  }}
                >
                  <span
                    className="material-symbols-outlined white"
                    style={{ fontSize: "14px" }}
                  >
                    file_copy
                  </span>
                  <p className="body">Duplicate</p>
                </div>
                <div
                  className="navigation-popup-mobile text-with-hover"
                  onClick={() => {
                    setOpenRenameModal(true);
                  }}
                >
                  <span
                    className="material-symbols-outlined white"
                    style={{ fontSize: "14px" }}
                  >
                    edit
                  </span>
                  <p className="body">Rename</p>
                </div>
                <div
                  className="navigation-popup-mobile text-with-hover"
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                >
                  <span
                    className="material-symbols-outlined white"
                    style={{ fontSize: "14px" }}
                  >
                    delete
                  </span>
                  <p className="body">Delete</p>
                </div>
              </div>
            }
          />
        </button>
      </button>

      <Modal
        isOpen={openDuplicateModal}
        setOpen={setOpenDuplicateModal}
        title={`Duplicate player`}
        size="contain"
      >
        <div style={{ margin: "0.5rem" }}>
          <p className="body">Are you sure want to duplicate player ?</p>
          <form onSubmit={duplicatePlayer}>
            <button
              aria-label="Yes"
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "0.5rem 0",
              }}
            >
              Yes
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title={`Delete player`}
        size="contain"
      >
        <div style={{ margin: "0.5rem" }}>
          <p className="body">Are you sure want to delete player ?</p>
          <form onSubmit={deletePlayer}>
            <button
              aria-label="Yes"
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "0.5rem 0",
              }}
            >
              Yes
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={openRenameModal}
        setOpen={setOpenRenameModal}
        title={`Rename the player`}
        size="contain"
      >
        <div style={{ margin: "0.5rem" }}>
          <p className="body">Player Name</p>
          <form onSubmit={renamePlayer}>
            <input
              aria-label="player_name_input"
              className="input-main"
              style={{ marginTop: "0.25rem" }}
              type={"text"}
              defaultValue={playerName}
              onChange={(e: any) => {
                setPlayerName(e.target.value);
              }}
              name={"player_name"}
              placeholder="Enter player name"
              autoComplete="off"
            ></input>
            <button
              aria-label="Rename"
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "0.5rem 0",
              }}
            >
              Rename
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
