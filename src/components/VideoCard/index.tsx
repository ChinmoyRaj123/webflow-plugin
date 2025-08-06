import React from "react";
import "./videocard.css";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Toast from "../Toast";
import config from "../../config";
import ReactDOM from "react-dom";
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
  const [popupId, setPopupId] = React.useState("");
  const [popupShow, setPopupShow] = React.useState(false);

  const [openDuplicateModal, setOpenDuplicateModal] =
    React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [show, setShow] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  const [showDuplicateTooltip, setShowDuplicateTooltip] = React.useState("0");
  const [showDeleteTooltip, setShowDeleteTooltip] = React.useState("0");

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    console.log("hideToast");

    setShow(false);
  };

  const showToastDelete = () => {
    setShowDelete(true);
  };

  const hideToastDelete = () => {
    setShowDelete(false);
  };

  const duplicatePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newdata = {
        name: data.name.concat("_copy"),
        config: data.config,
      };
      const res = await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenDuplicateModal(false);
      showToast();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
      console.log("duplicate player", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const deletePlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/players/${data.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      console.log("delete", res);
      setOpenDeleteModal(false);
      showToastDelete();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting player", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "0.25rem 0",
        paddingLeft: "0.25rem",
      }}
    >
      <div
        className="large-secondary-btn"
        style={{
          padding: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              last edit {timeAgo(data.created_at)}
            </p>
          </div>
        </div>
        <div className="media-options">
          <Popover
            position={indexValue === 0 ? "bottom" : "top"}
            trigger={
              <span
                className="material-symbols-outlined white media-option-image"
                style={{ fontSize: "18px" }}
              >
                more_horiz
              </span>
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
                  onClick={() => {}}
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
        </div>
      </div>

      <Modal
        isOpen={openDuplicateModal}
        setOpen={setOpenDuplicateModal}
        title={`Duplicate player`}
        size="contain"
      >
        <p className="body">Are you sure want to duplicate player ?</p>
        <form onSubmit={duplicatePlayer}>
          <button
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
      </Modal>

      <Modal
        isOpen={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title={`Delete player`}
        size="contain"
      >
        <p className="body">Are you sure want to delete player ?</p>
        <form onSubmit={deletePlayer}>
          <button
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              margin: "2rem 0",
            }}
          >
            Yes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Index;
