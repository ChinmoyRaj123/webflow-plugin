import React from "react";
import "./medialibrary.css";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import VideoPicker from "../../components/VideoPicker";
import { decodeBase64, encodeBase64 } from "../../utils/base64";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import config from "../../config";

const MediaLibrary = () => {
  const navigate = useNavigate();
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

  const [media, setMedia] = React.useState([]);
  const [searchTitle, setSearchTitle] = React.useState("");
  const [refetch, setRefetch] = React.useState(0);
  const [popupId, setPopupId] = React.useState("");
  const [file, setFile] = React.useState<any>();
  const [videoUrl, setVideoUrl] = React.useState<any>();

  // const construct_video_url = new URL(url, config.VIDEO_CDN_URL).toString();

  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);

  const copyAssets = async (item: any) => {
    // const element = document.createElement("textarea");
    // element.innerText = new URL(item.url, config.VIDEO_CDN_URL).toString();
    // document.body.appendChild(element);
    // element?.select();
    // element?.setSelectionRange(0, 99999);
    // document.execCommand("copy");
    // element.remove();
    // await webflow.notify({
    //   type: "Success",
    //   message: "Video URL Copied!",
    // });
    // setPopupId("");
    // console.log("copied");
  };

  const deleteAssets = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/videos/${popupId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("delete", res);
      setOpenModalDelete(false);
      // await webflow.notify({
      //   type: "Success",
      //   message: "Video deleted successfully!",
      // });
      // setPopupId("");
      // setTimeout(() => {
      //   setRefetch(Math.random());
      // }, 800);
    } catch (error) {
      console.log("error deleting asset", error);
    }
  };

  const s_pay = decodeBase64(Cookies.get("s-pay") as string);

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("success subscriptions fetch", res.data);
      if (res.data?.subscription?.status === "created" && s_pay === "success") {
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else if (res.data?.subscription?.status === "active") {
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        navigate({
          pathname: "/checkout",
          search: `?planid=${res.data.subscription?.plan_id}&s_id=${res.data.subscription?.provider?.subscription_id}`,
        });
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      if (error?.response?.status === 404) {
        navigate("/plans");
      }
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get("/videos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMedia(res.data);
    } catch (error) {
      console.log("error fetching media", error);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, [refetch]);

  const handlePopupToggle = (item: any) => {
    if (popupId === item.id) {
      setPopupId("");
    } else {
      setPopupId(item.id);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <p className="subtitle-one">Media Libary</p>

      <div
        style={{
          margin: "0.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <input
            autoComplete="off"
            className="input-main"
            type={"text"}
            name={"search"}
            placeholder={"Search"}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div>
          <button
            className="large-primary-btn"
            onClick={() => setOpenModalUpload(true)}
          >
            Upload Video
          </button>
        </div>
        <Modal
          isOpen={openModalUpload}
          setOpen={setOpenModalUpload}
          title={`Upload Video`}
          size="sm"
        >
          <VideoPicker
            file={file}
            setFile={setFile}
            setVideoUrl={setVideoUrl}
            setRefetch={setRefetch}
            setOpenModalUpload={setOpenModalUpload}
          />
        </Modal>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        {media && media.length > 0 ? (
          media?.map((item: any, index: number) => {
            return (
              <div key={index} className="media-wrapper">
                <div className="media-content">
                  <p style={{ cursor: "pointer" }} className="body">
                    {item.name}
                  </p>
                </div>
                <div className="media-options">
                  <span
                    className="material-symbols-outlined white media-option-image"
                    style={{ fontSize: "18px" }}
                    onClick={() => handlePopupToggle(item)}
                  >
                    more_horiz
                  </span>
                  <div
                    className="media-options-popup"
                    style={{ display: item.id === popupId ? "block" : "none" }}
                  >
                    <div
                      className="navigation-popup-mobile"
                      onClick={() => copyAssets(item)}
                    >
                      <span
                        className="material-symbols-outlined white"
                        style={{ fontSize: "14px" }}
                      >
                        file_copy
                      </span>
                      <p className="body">Copy Link</p>
                    </div>
                    <div
                      className="navigation-popup-mobile"
                      onClick={() => {
                        setOpenModalDelete(true);
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
                </div>
              </div>
            );
          })
        ) : (
          <p className="body">No media found</p>
        )}
      </div>

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
              margin: "0.5rem 0",
            }}
          >
            Yes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MediaLibrary;
