import React from "react";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Toast from "../Toast";
import config from "../../config";

type AssetscardProps = {
  item: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const Assetscard = (props: AssetscardProps) => {
  const { item, setRefetch } = props;
  const { name, created_at, id, url } = item;

  const construct_video_url = new URL(url, config.VIDEO_CDN_URL).toString();

  const [showDeleteTooltip, setShowDeleteTooltip] = React.useState("0");
  const [showCopyTooltip, setShowCopyTooltip] = React.useState("0");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showCopied, setShowCopied] = React.useState(false);

  const showToastDelete = () => {
    setShowDelete(true);
  };
  const hideToastDelete = () => {
    setShowDelete(false);
  };

  const showToastCopied = () => {
    setShowCopied(true);
  };
  const hideToastCopied = () => {
    setShowCopied(false);
  };

  const deleteAssets = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/videos/${id}`, {
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
      console.log("error deleting asset", error);
    }
  };

  return (
    <>
      <tr>
        <td>
          <p className="label">{name}</p>
        </td>
        <td>
          <p className="label">
            {new Date(created_at * 1000).toLocaleDateString("en-IN")}
          </p>
        </td>

        <td>
          <div
            onMouseEnter={() => {
              setShowCopyTooltip("1");
            }}
            onMouseLeave={() => {
              setShowCopyTooltip("0");
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              width: "7rem",
              // aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined "
              onClick={() => {
                const element = document.createElement("textarea");
                element.innerText = construct_video_url;
                document.body.appendChild(element);
                element?.select();
                element?.setSelectionRange(0, 99999);
                document.execCommand("copy");
                element.remove();
                showToastCopied();
                console.log("copied");
              }}
            >
              file_copy
            </span>
            <div
              style={{
                opacity: showCopyTooltip,
                position: "absolute",
                bottom: "-180%",
                transition: "all 0.4s ease-in-out",
                border: "1px solid #f0f0f0",
                padding: "0.25rem 1rem",
                background: "#f9f9f9",
              }}
            >
              <p className="body placeholder">Copy Url</p>
            </div>
          </div>
        </td>

        <td>
          <div
            onMouseEnter={() => {
              setShowDeleteTooltip("1");
            }}
            onMouseLeave={() => {
              setShowDeleteTooltip("0");
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              width: "3rem",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined placeholder"
              onClick={() => {
                setOpenModalDelete(true);
              }}
            >
              delete
            </span>
            <div
              style={{
                opacity: showDeleteTooltip,
                position: "absolute",
                bottom: "-60%",
                transition: "all 0.4s ease-in-out",
                border: "1px solid #f0f0f0",
                padding: "0.25rem 1rem",
                background: "#f9f9f9",
              }}
            >
              <p className="body placeholder">Trash</p>
            </div>
          </div>
        </td>
      </tr>

      <Modal
        isOpen={openModalDelete}
        setOpen={setOpenModalDelete}
        title={`Delete player`}
        size="sm"
      >
        <p className="body">Are you sure want to delete asset ?</p>
        <form onSubmit={deleteAssets}>
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

      <Toast show={showDelete} hideToast={hideToastDelete}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span className="material-symbols-outlined positive">done</span>
          <p className="subtitle-two" style={{ marginLeft: "1rem" }}>
            Asset Deleted
          </p>
        </div>
      </Toast>

      <Toast show={showCopied} hideToast={hideToastCopied}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span className="material-symbols-outlined positive">done</span>
          <p className="subtitle-two" style={{ marginLeft: "1rem" }}>
            Url copied
          </p>
        </div>
      </Toast>
    </>
  );
};

export default Assetscard;
