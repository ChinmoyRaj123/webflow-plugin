import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import CreatePlayer from "../components/CreatePlayer";
import axios from "../utils/axios-instance";
import Cookies from "js-cookie";
// import { videoUrlUpdate, videoUrlExtensionUpdate } from "./Detail";
import { encodeBase64 } from "../utils/base64";
import ReactDOM from "react-dom";
import Modal from "../components/Modal/index";

/**
 * This page will render after login the system(i.e home page).
 * Artists data are listed in this page.
 * Artist data can be search, filter from this page,
 * Card component is used which renders the profile card.
 * Count Card component is used which renders music platform analytics card.
 * Dropdown component is used which renders dropdown to filter the data by gender and country.
 * Error component is used which renders no artist found or error fetching data.
 */

const Home = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const [popupData, setPopupData] = React.useState<any>();

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
  }, []);

  React.useEffect(() => {
    fetchPlayer();
    // videoUrlUpdate.value = "";
    // videoUrlExtensionUpdate.value = "";
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

  const hideParentPopup = () => {
    setPopupData();
    document.getElementById("media_popup").style.visibility = "hidden";
    document.getElementById("media_popup").style.opacity = "0";
    document.getElementById("media_popup").style.zIndex = "-1";
  };

  const handlePopupToggle = (item: any, tag: string) => {
    const showPopup = (tag: string) => {
      const div = document.querySelector(tag);
      const topOffset = div?.getBoundingClientRect().top ?? 0 + window.scrollY;
      const el = document.querySelector(`#media_popup`);
      if (el instanceof HTMLElement) {
        el.style.visibility = "visible";
        el.style.zIndex = "9999";
        el.style.opacity = "1";
        el.style.top = `${topOffset - 10}px`;
        el.style.right = "0%";
        el.style.transform = "translate(-13%, -100%)";
      }
    };

    const hidePopup = () => {
      const el = document.querySelector(`#media_popup`);
      if (el instanceof HTMLElement) {
        el.style.visibility = "hidden";
        el.style.zIndex = "-1";
        el.style.opacity = "0";
        el.style.top = "0";
        el.style.right = "0%";
        el.style.transform = "translate(0%, 0%)";
      }
    };

    if (!popupData || popupData.id !== item.id) {
      setPopupData(item);
      showPopup(tag);
    } else {
      hidePopup();
      setPopupData(undefined);
    }
  };

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
        // "media_source": data.source.url,
        // "media_type": data.source.media_type
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
    <div className="home-layout">
      <div className="home-data-info-container">
        <div>
          <p className="home-data-info">3/10 Video left | 200mb/video</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="/" target="_blank" style={{ textDecoration: "none" }}>
            <p className="home-data-info-cta">Upgrade Plan</p>
          </a>
        </div>
      </div>
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

      {searchData === null || searchData.length === 0 ? (
        <div>
          <p>No data</p>
        </div>
      ) : (
        <div className="home-card-grid">
          {searchData.map((item: any, index: number) => {
            return (
              <>
                <VideoCard
                  key={index}
                  data={item}
                  handleCardClick={handleCardClick}
                  setRefetch={setRefetch}
                  handlePopupToggle={handlePopupToggle}
                />

                {ReactDOM.createPortal(
                  <div
                    id={`media_popup`}
                    style={{
                      zIndex: "-1",
                      visibility: "hidden",
                      opacity: "0",
                      position: "absolute",
                      minWidth: "7rem",
                      top: "0%",
                      right: "0%",
                      padding: "2px 0",
                      background: "var(--primary)",
                      borderRadius: "0.25rem",
                      gap: "1rem",
                      filter:
                        "drop-shadow(rgba(0, 0, 0, 0.6) 0px 0.5px 0px) drop-shadow(rgba(0, 0, 0, 0.18) 0px 2px 6px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 4px 8px) drop-shadow(rgba(0, 0, 0, 0.08) 0px 8px 16px) drop-shadow(rgba(0, 0, 0, 0.06) 0px 12px 25px)",
                    }}
                  >
                    <div
                      className="navigation-popup-mobile"
                      onClick={() => {
                        hideParentPopup();
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
                      className="navigation-popup-mobile"
                      onClick={() => {
                        hideParentPopup();
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
                      className="navigation-popup-mobile"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        hideParentPopup();
                        // setDeleteId(item.id);
                        // setPopupId("");
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
                  </div>,
                  document.body
                )}

                <Modal
                  isOpen={openDuplicateModal}
                  setOpen={setOpenDuplicateModal}
                  title={`Duplicate player`}
                  size="contain"
                >
                  <p className="body">
                    Are you sure want to duplicate player ?
                  </p>
                  <form onSubmit={duplicatePlayer}>
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
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
