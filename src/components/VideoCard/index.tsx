import React from "react";
import "./videocard.css";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Toast from "../Toast";
import config from "../../config";
import ReactDOM from "react-dom";
import { timeAgo } from "../../utils/helper";

type VideoCardProps = {
  handleCardClick: (id: string) => void;
  handlePopupToggle: (data: any, tag: string) => void;
  data?: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const Index = (props: VideoCardProps) => {
  const { handleCardClick, handlePopupToggle, data, setRefetch } = props;
  const [popupId, setPopupId] = React.useState("");
  const [popupShow, setPopupShow] = React.useState(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
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
        // "media_source": data.source.url,
        // "media_type": data.source.media_type
      };
      const res = await axios.post("/players", newdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      setOpenModal(false);
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
      setOpenModalDelete(false);
      showToastDelete();
      setTimeout(() => {
        setRefetch(Math.random());
      }, 800);
    } catch (error) {
      console.log("error deleting player", error);
    }
  };

  return (
    // <div className="videocard">
    //   <div
    //     style={{
    //       height: "85%",
    //       position: "relative",
    //       cursor: "pointer",
    //     }}
    //     onClick={() => handleCardClick(data.id as string)}
    //   >
    //     <img
    //       src={
    //         data.config.playerThumbnailImageUrl.replace(
    //           "skara-imagecontent-alpha.s3.ap-south-1.amazonaws.com/",
    //           "skara-imagecontent-staging.b-cdn.net/"
    //         ) ||
    //         "https://skara-imagecontent-staging.b-cdn.net/a1822d0b-afa0-40c3-b865-0b91e4ee2ceb/911fca6e-c923-4af1-b8fc-6f4475b3c313/Cover%20Image.png"
    //       }
    //       // src={`${new URL(
    //       //       data.config.playerThumbnailImageUrl,
    //       //       config.IMAGE_CDN_URL
    //       //     ).toString()}` || "https://skara-imagecontent-staging.b-cdn.net/a1822d0b-afa0-40c3-b865-0b91e4ee2ceb/911fca6e-c923-4af1-b8fc-6f4475b3c313/Cover%20Image.png"}
    //       alt="no image found"
    //       style={{ width: "100%", height: "100%" }}
    //     />
    //     <div className="videocard-player-style">
    //       <div className="videocard-playbtn-container">
    //         <span
    //           className="material-symbols-outlined"
    //           style={{
    //             color: data.config.playerstyle.center_icon_button_color,
    //             fontSize: "64px",
    //           }}
    //         >
    //           play_arrow
    //         </span>
    //       </div>

    //       <div
    //         className="videocard-progressbar"
    //         style={{
    //           background: data.config.playerstyle.progress_bar_FG_color,
    //         }}
    //       ></div>
    //     </div>
    //   </div>
    //   <div
    //     style={{
    //       height: "15%",
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       padding: "0.5rem",
    //     }}
    //   >
    //     <p className="body">{data.name}</p>
    //     <div
    //       style={{
    //         width: "20%",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       <div
    //         onMouseEnter={() => {
    //           setShowDeleteTooltip("1");
    //         }}
    //         onMouseLeave={() => {
    //           setShowDeleteTooltip("0");
    //         }}
    //         style={{
    //           cursor: "pointer",
    //           position: "relative",
    //           width: "3rem",
    //           aspectRatio: "1/1",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <span
    //           className="material-symbols-outlined placeholder"
    //           onClick={() => {
    //             setOpenModalDelete(true);
    //           }}
    //         >
    //           delete
    //         </span>
    //         <div
    //           style={{
    //             opacity: showDeleteTooltip,
    //             position: "absolute",
    //             bottom: "-140%",
    //             transition: "all 0.4s ease-in-out",
    //             border: "1px solid #f0f0f0",
    //             padding: "0.25rem 1rem",
    //             background: "#f9f9f9",
    //           }}
    //         >
    //           <p className="body placeholder">Trash</p>
    //         </div>
    //       </div>

    //       <div
    //         onMouseEnter={() => {
    //           setShowDuplicateTooltip("1");
    //         }}
    //         onMouseLeave={() => {
    //           setShowDuplicateTooltip("0");
    //         }}
    //         style={{
    //           cursor: "pointer",
    //           position: "relative",
    //           width: "3rem",
    //           aspectRatio: "1/1",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <span
    //           className="material-symbols-outlined "
    //           onClick={() => {
    //             setOpenModal(true);
    //           }}
    //         >
    //           file_copy
    //         </span>
    //         <div
    //           style={{
    //             opacity: showDuplicateTooltip,
    //             position: "absolute",
    //             bottom: "-140%",
    //             transition: "all 0.4s ease-in-out",
    //             border: "1px solid #f0f0f0",
    //             padding: "0.25rem 1rem",
    //             background: "#f9f9f9",
    //           }}
    //         >
    //           <p className="body placeholder">Duplicate</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <Modal
    //     isOpen={openModal}
    //     setOpen={setOpenModal}
    //     title={`Duplicate player`}
    //     size="sm"
    //   >
    //     <p className="body">Are you sure want to duplicate player ?</p>
    //     <form onSubmit={duplicatePlayer}>
    //       <button
    //         type="submit"
    //         className="large-primary-btn"
    //         style={{
    //           width: "100%",
    //           margin: "2rem 0",
    //         }}
    //       >
    //         Yes
    //       </button>
    //     </form>
    //   </Modal>

    //   <Toast show={show} hideToast={hideToast}>
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "flex-start",
    //       }}
    //     >
    //       <span className="material-symbols-outlined positive">done</span>
    //       <p className="subtitle-two" style={{ marginLeft: "1rem" }}>
    //         Player Copied
    //       </p>
    //     </div>
    //   </Toast>

    //   <Modal
    //     isOpen={openModalDelete}
    //     setOpen={setOpenModalDelete}
    //     title={`Delete player`}
    //     size="sm"
    //   >
    //     <p className="body">Are you sure want to delete player ?</p>
    //     <form onSubmit={deletePlayer}>
    //       <button
    //         type="submit"
    //         className="large-primary-btn"
    //         style={{
    //           width: "100%",
    //           margin: "2rem 0",
    //         }}
    //       >
    //         Yes
    //       </button>
    //     </form>
    //   </Modal>

    //   <Toast show={showDelete} hideToast={hideToastDelete}>
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "flex-start",
    //       }}
    //     >
    //       <span className="material-symbols-outlined positive">done</span>
    //       <p className="subtitle-two" style={{ marginLeft: "1rem" }}>
    //         Player Deleted
    //       </p>
    //     </div>
    //   </Toast>
    // </div>

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
              backgroundImage: `url(${
                data.config.playerThumbnailImageUrl ||
                "https://skara-imagecontent-staging.b-cdn.net/a1822d0b-afa0-40c3-b865-0b91e4ee2ceb/911fca6e-c923-4af1-b8fc-6f4475b3c313/Cover%20Image.png"
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
          <span
            id={`more_horiz_${data.id}`}
            className="material-symbols-outlined white media-option-image"
            style={{ fontSize: "18px", zIndex: 10 }}
            onClick={() => handlePopupToggle(data, `#more_horiz_${data.id}`)}
          >
            more_horiz
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
