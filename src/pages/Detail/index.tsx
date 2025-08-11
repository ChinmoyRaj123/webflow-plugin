import React from "react";
import Toggle from "../../components/Toggle";
import ColorPicker from "../../components/ColorPicker";
import axios from "../../utils/axios-instance";
import { signal } from "@preact/signals";
import SizePicker from "../../components/SizePicker";
import ImagePicker from "../../components/ImagePicker";
import config from "../../config";
import Modal from "../../components/Modal";
import VideoPicker from "../../components/VideoPicker";
import Tabs from "../../components/Tabs";
import DemoPlayer from "../../components/DemoPlayer";
import Loader from "../../components/Loader";

export const videoUrlUpdate = signal("");
const playerNameUpdate = signal("");
export const videoUrlExtensionUpdate = signal("");

export const videoconfigupdate = signal({
  videotitle: "",
  videodescription: "",
  playerBrandingImageUrl: "",
  playerThumbnailImageUrl: "",
  playersettings: {
    autoplay: false,
    muted: false,
    loop: false,
    use_as_BG_video: false,
  },
  playerstyle: {
    text_color: "#000000",
    player_brand_color: "#000000",
    icon_button_color: "#4fc922",
    icon_button_opacity: "100",
    icon_button_hover_color: "#4f9934",
    center_icon_button_color: "#4fc922",
    center_icon_button_opacity: "100",
    center_icon_button_hover_color: "#4f9934",
    progress_bar_BG_color: "#4fc922",
    progress_bar_FG_color: "#f00a0a",
    progress_bar_loaded_color: "#f5cbcb",
    progress_bar_circle_color: "#f00a0a",
    progress_bar_opacity: "100",
    settings_menu_BG_color: "#4fc922",
    settings_menu_opacity: "100",
    settings_menu_BG_hover_color: "#4f9934",
    settings_menu_text_color: "#000000",
    tooltip_BG_color: "#4fc922",
    tooltip_opacity: "100",
    tooltip_corner_radius: "0",
    tooltip_text_color: "#000000",
    volume_bar_BG_color: "#4fc922",
    volume_bar_opacity: "100",
    volume_bar_FG_color: "#f00a0a",
    player_corner_radius: "0",
    player_controls_margin: "30",
    bottom_bar_spacing: "12",
    icon_button_padding: "0",
    icon_button_corner_radius: "50",
    icon_button_size: "30",
    center_icon_button_padding: "0",
    center_icon_button_corner_radius: "50",
    center_icon_button_size: "70",
    progress_bar_size: "4",
    progress_bar_hover_scale: "2",
    volume_bar_size: "4",
    branding_opacity: "100",
  },
  playercontrol: {
    branding: true,
    thumbnail: true,
    playpause: true,
    center_playpause: true,
    progress_bar: true,
    time_stamp: true,
    volume: true,
    full_screen_icon: true,
    video_name: true,
    settings_menu: true,
    back_button: false,
    gradient: true,
  },
});

export type VideoConfigType = typeof videoconfigupdate.value;

/**
 * Returns the detail page.
 * URLSearchParams named artist is used to filter the data.
 * DetailTable component is used which renders the music platform analytics card.
 * The entire page renders a profile card, an about card and analytics table.
 */

const Index = () => {
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("video");
  const [selectedExtension, setSelectedExtension] =
    React.useState<string>("mp4");
  const [reRender, setReRender] = React.useState(0);
  const [isLoadingEmbed, setLoadingEmbed] = React.useState(false);
  const [isLoadingPlayerData, setLoadingPlayerData] = React.useState(true);
  const [embedUrl, setEmbedUrl] = React.useState("");
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoDescription, setVideoDescription] = React.useState("");
  const [muted, setMuted] = React.useState<boolean>();
  const [sourceEmpty, setSourceEmpty] = React.useState(false);
  const [sourceId, setSourceId] = React.useState("");
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [refetch, setRefetch] = React.useState(0);
  const [file, setFile] = React.useState<any>();
  const [brandUploading, setBrandUploading] = React.useState(false);
  const [thumbnailUploading, setThumbnailUploading] = React.useState(false);
  const [popupId, setPopupId] = React.useState("");
  const [deleteId, setDeleteId] = React.useState("");
  const [openModalDelete, setOpenModalDelete] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const tabList = [
    { name: "Behavior" },
    { name: "Styling" },
    { name: "Controls" },
    { name: "Progress Bar" },
    { name: "Volume Bar" },
    { name: "Settings Menu" },
    { name: "Metadata" },
    { name: "Branding" },
  ];
  const [activeTab, setActiveTab] = React.useState(tabList[0].name);

  const generateToken = async (player_id: string) => {
    setLoadingEmbed(true);
    try {
      const res = await axios.get(`/players/${player_id}/tokens`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log('token generated', res);
      generateCode(
        `${config.BASE_URL}/players/embed/${player_id}/${res.data.token}`
      );
      setLoadingEmbed(false);
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error", error);
    }
  };

  const fetchPlayer = async () => {
    setLoadingPlayerData(true);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const playerById = res.data.filter((item: any) => item.id === videoId);

      // setSelectedExtension(playerById[0]?.source?.media_type)
      playerNameUpdate.value = playerById[0]?.name;
      // videoUrlUpdate.value = playerById[0]?.source?.url as string;
      // videoUrlExtensionUpdate.value = playerById[0]?.source?.media_type;
      setVideoTitle(playerById[0]?.config?.videotitle);
      setVideoDescription(playerById[0]?.config?.videodescription);

      // setAutoPlay(playerById[0]?.config?.playersettings?.autoplay)
      setMuted(playerById[0]?.config?.playersettings?.muted);

      videoconfigupdate.value = {
        videotitle: playerById[0]?.config?.videotitle,
        videodescription: playerById[0]?.config?.videodescription,
        playerBrandingImageUrl: playerById[0]?.config?.playerBrandingImageUrl,
        playerThumbnailImageUrl: playerById[0]?.config?.playerThumbnailImageUrl,
        playersettings: {
          autoplay: playerById[0]?.config?.playersettings?.autoplay,
          muted: playerById[0]?.config?.playersettings?.muted,
          loop: playerById[0]?.config?.playersettings?.loop,
          use_as_BG_video:
            playerById[0]?.config?.playersettings?.use_as_BG_video,
        },
        playerstyle: {
          text_color: playerById[0]?.config?.playerstyle?.text_color,
          player_brand_color:
            playerById[0]?.config?.playerstyle?.player_brand_color,
          icon_button_color:
            playerById[0]?.config?.playerstyle?.icon_button_color,
          icon_button_opacity:
            playerById[0]?.config?.playerstyle?.icon_button_opacity,
          icon_button_hover_color:
            playerById[0]?.config?.playerstyle?.icon_button_hover_color,
          center_icon_button_color:
            playerById[0]?.config?.playerstyle?.center_icon_button_color,
          center_icon_button_opacity:
            playerById[0]?.config?.playerstyle?.center_icon_button_opacity,
          center_icon_button_hover_color:
            playerById[0]?.config?.playerstyle?.center_icon_button_hover_color,
          progress_bar_BG_color:
            playerById[0]?.config?.playerstyle?.progress_bar_BG_color,
          progress_bar_FG_color:
            playerById[0]?.config?.playerstyle?.progress_bar_FG_color,
          progress_bar_loaded_color:
            playerById[0]?.config?.playerstyle?.progress_bar_loaded_color,
          progress_bar_circle_color:
            playerById[0]?.config?.playerstyle?.progress_bar_circle_color,
          progress_bar_opacity:
            playerById[0]?.config?.playerstyle?.progress_bar_opacity,
          settings_menu_BG_color:
            playerById[0]?.config?.playerstyle?.settings_menu_BG_color,
          settings_menu_opacity:
            playerById[0]?.config?.playerstyle?.settings_menu_opacity,
          settings_menu_BG_hover_color:
            playerById[0]?.config?.playerstyle?.settings_menu_BG_hover_color,
          settings_menu_text_color:
            playerById[0]?.config?.playerstyle?.settings_menu_text_color,
          tooltip_BG_color:
            playerById[0]?.config?.playerstyle?.tooltip_BG_color,
          tooltip_opacity: playerById[0]?.config?.playerstyle?.tooltip_opacity,
          tooltip_text_color:
            playerById[0]?.config?.playerstyle?.tooltip_text_color,
          tooltip_corner_radius:
            playerById[0]?.config?.playerstyle?.tooltip_corner_radius,
          volume_bar_BG_color:
            playerById[0]?.config?.playerstyle?.volume_bar_BG_color,
          volume_bar_opacity:
            playerById[0]?.config?.playerstyle?.volume_bar_opacity,
          volume_bar_FG_color:
            playerById[0]?.config?.playerstyle?.volume_bar_FG_color,
          player_corner_radius:
            playerById[0]?.config?.playerstyle?.player_corner_radius,
          player_controls_margin:
            playerById[0]?.config?.playerstyle?.player_controls_margin,
          bottom_bar_spacing:
            playerById[0]?.config?.playerstyle?.bottom_bar_spacing,
          icon_button_padding:
            playerById[0]?.config?.playerstyle?.icon_button_padding,
          icon_button_corner_radius:
            playerById[0]?.config?.playerstyle?.icon_button_corner_radius,
          icon_button_size:
            playerById[0]?.config?.playerstyle?.icon_button_size,
          center_icon_button_padding:
            playerById[0]?.config?.playerstyle?.center_icon_button_padding,
          center_icon_button_corner_radius:
            playerById[0]?.config?.playerstyle
              ?.center_icon_button_corner_radius,
          center_icon_button_size:
            playerById[0]?.config?.playerstyle?.center_icon_button_size,
          progress_bar_size:
            playerById[0]?.config?.playerstyle?.progress_bar_size,
          progress_bar_hover_scale:
            playerById[0]?.config?.playerstyle?.progress_bar_hover_scale,
          volume_bar_size: playerById[0]?.config?.playerstyle?.volume_bar_size,
          branding_opacity:
            playerById[0]?.config?.playerstyle?.branding_opacity,
        },
        playercontrol: {
          branding: playerById[0]?.config?.playercontrol?.branding,
          thumbnail: playerById[0]?.config?.playercontrol?.thumbnail,
          playpause: playerById[0]?.config?.playercontrol?.playpause,
          center_playpause:
            playerById[0]?.config?.playercontrol?.center_playpause,
          progress_bar: playerById[0]?.config?.playercontrol?.progress_bar,
          time_stamp: playerById[0]?.config?.playercontrol?.time_stamp,
          volume: playerById[0]?.config?.playercontrol?.volume,
          full_screen_icon:
            playerById[0]?.config?.playercontrol?.full_screen_icon,
          video_name: playerById[0]?.config?.playercontrol?.video_name,
          settings_menu: playerById[0]?.config?.playercontrol?.settings_menu,
          back_button: playerById[0]?.config?.playercontrol?.back_button,
          gradient: playerById[0]?.config?.playercontrol?.gradient,
        },
      };

      await generateToken(videoId as string);
      setLoadingPlayerData(false);
    } catch (error) {
      setLoadingPlayerData(false);
      console.log("error fetching player", error);
    }
  };

  const fetchSource = async () => {
    try {
      const res = await axios.get(`/players/${videoId}/sources`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("res source", res.data);
      if (Object.values(res.data).length === 0) {
        setSourceEmpty(true);
        return;
      }
      // console.log('fetching source', res);
      videoUrlUpdate.value = res.data[0]?.url as string;
      videoUrlExtensionUpdate.value = res.data[0]?.media_type;
      setSelectedExtension(res.data[0]?.media_type);
      setSourceId(res.data[0]?.id);
    } catch (error) {
      console.log("error fetching source", error);
      // setSourceEmpty(false)
    }
  };

  React.useEffect(() => {
    fetchPlayer();
    fetchSource();
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
    console.log("refetched data");
    fetchMedia();
  }, [refetch]);

  const [embedCode, setEmbedCode] = React.useState("loading ...");

  const addSource = async (sourceId: string) => {
    const data = {
      url: videoUrlUpdate.value,
      // media_type: videoUrlExtensionUpdate.value,
      media_type: selectedExtension || "mp4",
    };
    try {
      if (sourceEmpty) {
        console.log("adding source", sourceEmpty);

        const res = await axios.post(`/players/${videoId}/sources`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSourceEmpty(false);
        // console.log('source added', res);
      } else {
        const res = await axios.put(
          `/players/${videoId}/sources/${sourceId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log('source updated', res);
      }
    } catch (error) {
      console.log("error adding source", error);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoadingEmbed(true);
    const data = {
      name: playerNameUpdate.value,
      config: videoconfigupdate.value,
      // "media_source": videoUrlUpdate.value,
      // "media_type": videoUrlExtensionUpdate.value
    };
    try {
      await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      await addSource(sourceId);
      await handleEmbedVideoPlayer();
      setLoadingEmbed(false);
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error updating video", error);
    }
  };

  const handleEmbedVideoPlayer = async () => {
    try {
      const divElement = await webflow.getSelectedElement();
      if (divElement?.children) {
        const children = await divElement.getChildren();
        if (children.length > 0) {
          await Promise.all(children.map((child) => child.remove()));
        }
        const domElement = await divElement.append(webflow.elementPresets.DOM);
        if (domElement.type === "DOM") {
          await domElement.setTag("iframe");
          await domElement.setAttribute("class", "splay_videoplayer_iframe");
          await domElement.setAttribute("src", embedUrl);
          await domElement.setAttribute(
            "title",
            `${videoTitle || "Video title"}`
          );
          await domElement.setTextContent("splay_video_player-loading");
          await domElement.setAttribute("width", "100%");
          await domElement.setAttribute("height", "100%");
          await domElement.setAttribute("frameborder", "0");
          await domElement.setAttribute("allowfullscreen", "true");
          await domElement.setAttribute("style", "pointer-events: auto;");
        }
      } else {
        await webflow.notify({
          type: "Error",
          message: "Select an element to embed the videoplayer",
        });
      }
    } catch (error) {
      await webflow.notify({
        type: "Error",
        message: "Select an element to embed the videoplayer",
      });
    }
  };

  const generateCode = (url: string) => {
    setEmbedUrl(url);
  };

  const handlePlayerThumbnailOnChange = (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    console.log("thumb", val);
    videoconfigupdate.value.playerThumbnailImageUrl = image;
    setReRender(Math.random() * 1000);
  };

  const handlePlayerBrandingOnChange = (val: string) => {
    let image = new URL(val, config.IMAGE_CDN_URL).toString();
    console.log("branding", image);
    videoconfigupdate.value.playerBrandingImageUrl = image;
    setReRender(Math.random() * 1000);
  };

  const handlePopupToggle = (item: any, index: number) => {
    if (popupId === item.id) {
      setPopupId("");
    } else {
      setPopupId(item.id);
      const div = document.querySelector(`#more_horiz_${index}`);
      const topOffset = div.getBoundingClientRect().top + window.scrollY;
      const el = document.querySelector(`#media_popup_${index}`);
      console.log("el", el);

      if (el instanceof HTMLElement) {
        el.style.visibility = "visible";
        el.style.zIndex = "9999";
        el.style.opacity = "1";
        el.style.top = `${topOffset - 10}px`;
        el.style.right = "0%";
        el.style.transform = "translate(-32%, -100%)";
      }
    }
  };

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
      const res = await axios.delete(`/videos/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("delete", res);
      setOpenModalDelete(false);
      setDeleteId("");
      await webflow.notify({
        type: "Success",
        message: "Video deleted successfully!",
      });
      setRefetch(`refetch_${Math.random()}`);
    } catch (error) {
      console.log("error deleting asset", error);
    }
  };

  const handleAutoPlayToggle = () => {
    videoconfigupdate.value.playersettings.muted =
      !videoconfigupdate.value.playersettings.muted;
    videoconfigupdate.value.playersettings.autoplay =
      !videoconfigupdate.value.playersettings.autoplay;
    setMuted(!muted);
  };

  React.useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      const length = input.value.length;
      input.setSelectionRange(length, length);
      input.scrollLeft = input.scrollWidth;
      input.focus();
    }
  }, [videoUrlUpdate.value]);

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const truncate = (text: string, maxLength = 40): string =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  if (isLoadingPlayerData)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );

  return (
    <div className="detail-main">
      <div className="detail-sub-container-1 ">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0.5rem 0.5rem 0 0.5rem",
            }}
          >
            <div
              className="back_button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "default",
              }}
              onClick={() => {
                window.history.back();
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                chevron_left
              </span>
              <p className="body">Back</p>
            </div>
            <button type="submit" className="large-primary-btn">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <img
                  style={{ width: "1rem", height: "1rem" }}
                  src={"./icon/embed.svg"}
                  alt="embed_icon"
                />
                <p className="body" style={{ paddingTop: "1px" }}>
                  Embed
                </p>
              </div>
            </button>
          </div>

          <div className="video-player-url-section">
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                className="input-main"
                style={{
                  cursor: "default",
                  borderColor:
                    videoUrlUpdate && videoUrlUpdate.value
                      ? "var(--inputBorder)"
                      : "var(--redBorder)",
                }}
              >
                <p
                  className="body"
                  style={{
                    color:
                      videoUrlUpdate && videoUrlUpdate.value
                        ? "var(--white)"
                        : "var(--tabColor)",
                  }}
                >
                  {videoUrlUpdate?.value
                    ? truncate(getFileName(videoUrlUpdate.value))
                    : "No video is uploaded yet, upload a video now."}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                className="large-secondary-btn"
                onClick={() => setOpenModalUpload(true)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.125rem",
                  }}
                >
                  <img
                    style={{ width: "1rem", height: "1rem" }}
                    src={"./icon/add.svg"}
                    alt="add_icon"
                  />
                  <p className="body" style={{ paddingTop: "1px" }}>
                    Upload Video
                  </p>
                </div>
              </button>
              {/* <p className="label">Or</p> */}
              {/* <p className="body">Paste a MP4 or HLS url</p> */}
            </div>

            <Modal
              isOpen={openModalUpload}
              setOpen={setOpenModalUpload}
              title={`Upload a video and select from media library`}
              size="contain"
            >
              <div>
                <p className="subtitle-three" style={{ padding: "0.5rem" }}>
                  Upload video
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    margin: "0rem 0.5rem 1rem",
                  }}
                >
                  <VideoPicker
                    file={file}
                    setFile={setFile}
                    setVideoUrl={(e) => console.log("xx", e)}
                    setRefetch={(e: string) => setRefetch(e)}
                    setOpenModalUpload={(e) => console.log("yy", e)}
                  />
                </div>

                <div
                  style={{
                    borderTop: "1px solid",
                    borderColor: "var(--stroke)",
                    padding: "0.5rem",
                  }}
                >
                  <p className="subtitle-three">Media Library</p>
                </div>
                <div
                  style={{
                    maxHeight: "16rem",
                    overflowY: "scroll",
                    paddingRight: "0.125rem",
                    margin: "0 0.5rem",
                  }}
                >
                  {media && media.length > 0 ? (
                    media.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          style={{
                            paddingBottom:
                              index === media.length - 1 ? "2px" : "0.25rem",
                            // paddingLeft: "0.25rem",
                          }}
                        >
                          <div
                            className="large-secondary-btn"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                wordBreak: "break-all",
                                paddingRight: "0.25rem",
                              }}
                              onClick={() => {
                                const url = new URL(
                                  item.url,
                                  config.VIDEO_CDN_URL
                                ).toString();
                                console.log("url", url);
                                videoUrlUpdate.value = url;
                                setOpenModalUpload(false);
                              }}
                            >
                              <p className="body">{item.name}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p className="body">No video found</p>
                    </div>
                  )}
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={openModalDelete}
              setOpen={setOpenModalDelete}
              title={`Delete player`}
              size="contain"
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

          <div style={{ margin: "0.5rem" }}>
            <DemoPlayer
              config={videoconfigupdate.value}
              brandUploading={brandUploading}
              thumbnailUploading={thumbnailUploading}
              reRender={reRender}
            />
          </div>

          <div
            style={{
              padding: "0rem 1rem",
              borderBottom: "1px solid var(--stroke)",
              // borderTop: "1px solid var(--stroke)",
            }}
          >
            <Tabs data={tabList} setActiveTab={setActiveTab} />
          </div>

          <div
            style={{
              position: "relative",
              maxHeight: "8.5rem",
              overflowY: "scroll",
            }}
          >
            {activeTab === tabList[0].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"autoplay"}
                  label={"Auto Play"}
                  checked={videoconfigupdate.value.playersettings.autoplay}
                  //checked={autoPlay}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    handleAutoPlayToggle();
                    videoconfigupdate.value.playersettings.autoplay =
                      e.target.checked;
                  }}
                />

                <Toggle
                  name={"muted"}
                  label={"Muted"}
                  checked={muted}
                  onChange={(e: any) => {
                    if (videoconfigupdate.value.playersettings.autoplay) return;
                    setMuted(!muted);
                    videoconfigupdate.value.playersettings.muted =
                      !videoconfigupdate.value.playersettings.muted;
                    setReRender(Math.random() * 1000);
                  }}
                />

                <Toggle
                  name={"loop"}
                  label={"Loop"}
                  checked={videoconfigupdate.value.playersettings.loop}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playersettings.loop =
                      e.target.checked;
                  }}
                />
              </div>
            )}
            {activeTab === tabList[1].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <SizePicker
                  label={"Inner Padding"}
                  name={"inner-padding"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.player_controls_margin
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.player_controls_margin =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Corner Radius"}
                  name={"corner-radius"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.player_corner_radius
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.player_corner_radius =
                      e.target.value;
                  }}
                />

                <Toggle
                  name={"video-gradient"}
                  label={"OsdBar & TopBar Gradient"}
                  checked={videoconfigupdate.value.playercontrol.gradient}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.gradient =
                      e.target.checked;
                  }}
                />
              </div>
            )}

            {activeTab === tabList[2].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"center-btn-show"}
                  label={"Primary Play Button"}
                  checked={
                    videoconfigupdate.value.playercontrol.center_playpause
                  }
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.center_playpause =
                      e.target.checked;
                  }}
                />
                <SizePicker
                  label={"Size"}
                  name={"center-btn-show"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.center_icon_button_size
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_size =
                      e.target.value;
                  }}
                />
                <ColorPicker
                  label={"Color"}
                  name={"center-btn-color"}
                  value={
                    videoconfigupdate.value.playerstyle.center_icon_button_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_color =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Opacity"}
                  name={"center-btn-opacity"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle
                      .center_icon_button_opacity
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_opacity =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Hover Color"}
                  name={"center-btn-hover-color"}
                  value={
                    videoconfigupdate.value.playerstyle
                      .center_icon_button_hover_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_hover_color =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Inner Padding"}
                  name={"center-btn-padding"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle
                      .center_icon_button_padding
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_padding =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Corner Radius"}
                  name={"center-btn-corner-radius"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle
                      .center_icon_button_corner_radius
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.center_icon_button_corner_radius =
                      e.target.value;
                  }}
                />
                <div
                  style={{
                    borderTop: "1px solid var(--border1)",
                    padding: "1rem 0",
                  }}
                >
                  <p className="subtitle-three">Mini Controls Style</p>
                </div>
                <Toggle
                  name={"small-icon-play-show"}
                  label={"Play Button"}
                  checked={videoconfigupdate.value.playercontrol.playpause}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.playpause =
                      e.target.checked;
                  }}
                />

                <Toggle
                  name={"small-icon-fullscreen-show"}
                  label={"Fullscreen Button"}
                  checked={
                    videoconfigupdate.value.playercontrol.full_screen_icon
                  }
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.full_screen_icon =
                      e.target.checked;
                  }}
                />

                <ColorPicker
                  label={"Color"}
                  name={"small-icon-color"}
                  value={videoconfigupdate.value.playerstyle.icon_button_color}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_color =
                      e.target.value;
                  }}
                />
                <SizePicker
                  label={"Opacity"}
                  name={"small-icon-opacity"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.icon_button_opacity
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_opacity =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Hover Color"}
                  name={"small-icon-hover-color"}
                  value={
                    videoconfigupdate.value.playerstyle.icon_button_hover_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_hover_color =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Size"}
                  name={"small-icon-size"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.icon_button_size}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_size =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Inner Padding"}
                  name={"small-icon-padding"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.icon_button_padding
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_padding =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Corner Radius"}
                  name={"small-icon-corner-radius"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle
                      .icon_button_corner_radius
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.icon_button_corner_radius =
                      e.target.value;
                  }}
                />
              </div>
            )}
            {activeTab === tabList[3].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"progress-bar-show"}
                  label={"Progress Bar"}
                  checked={videoconfigupdate.value.playercontrol.progress_bar}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.progress_bar =
                      e.target.checked;
                  }}
                />

                <SizePicker
                  label={"Space from Bottom"}
                  name={"progress-bar-position"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.bottom_bar_spacing}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.bottom_bar_spacing =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Bar Thickness"}
                  name={"progress-bar-height"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.progress_bar_size}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_size =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Opacity"}
                  name={"progress-bar-opacity"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.progress_bar_opacity
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_opacity =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Scale on hover"}
                  name={"progress-bar-scale-on-hover"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.progress_bar_hover_scale
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_hover_scale =
                      e.target.value;
                  }}
                />

                <Toggle
                  name={"progress-bar-time"}
                  label={"Show Time Stamp"}
                  checked={videoconfigupdate.value.playercontrol.time_stamp}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.time_stamp =
                      e.target.checked;
                  }}
                />

                <div
                  style={{
                    borderTop: "1px solid var(--border1)",
                    padding: "1rem 0",
                  }}
                >
                  <p className="subtitle-three">Progress Bar Colors</p>
                </div>

                <ColorPicker
                  label={"Foreground Color"}
                  name={"progress-bar-fg-color"}
                  value={
                    videoconfigupdate.value.playerstyle.progress_bar_FG_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_FG_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Background Color"}
                  name={"progress-bar-bg-color"}
                  value={
                    videoconfigupdate.value.playerstyle.progress_bar_BG_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_BG_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Loaded Color"}
                  name={"progress-bar-loaded-color"}
                  value={
                    videoconfigupdate.value.playerstyle
                      .progress_bar_loaded_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_loaded_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Circle Color"}
                  name={"progress-bar-circle-color"}
                  value={
                    videoconfigupdate.value.playerstyle
                      .progress_bar_circle_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.progress_bar_circle_color =
                      e.target.value;
                  }}
                />

                <div
                  style={{
                    borderTop: "1px solid var(--border1)",
                    padding: "1rem 0",
                  }}
                >
                  <p className="subtitle-three">Tooltip Styles</p>
                </div>

                <ColorPicker
                  label={"Tooltip BG Color"}
                  name={"tooltip-bg-color"}
                  value={videoconfigupdate.value.playerstyle.tooltip_BG_color}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.tooltip_BG_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Tooltip Text Color"}
                  name={"tooltip-text-color"}
                  value={videoconfigupdate.value.playerstyle.tooltip_text_color}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.tooltip_text_color =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Tooltip Opacity"}
                  name={"tooltip-opacity"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.tooltip_opacity}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.tooltip_opacity =
                      e.target.value;
                  }}
                />

                <SizePicker
                  label={"Tooltip Corner Radius"}
                  name={"tooltip-corner-radius"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.tooltip_corner_radius
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.tooltip_corner_radius =
                      e.target.value;
                  }}
                />
              </div>
            )}
            {activeTab === tabList[4].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"small-icon-vol-show"}
                  label={"Volume Button"}
                  checked={videoconfigupdate.value.playercontrol.volume}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.volume =
                      e.target.checked;
                  }}
                />
                <SizePicker
                  label={"Volume Bar Size"}
                  name={"volume-bar-size"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.volume_bar_size}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.volume_bar_size =
                      e.target.value;
                  }}
                />
                <SizePicker
                  label={"Volume Bar Opacity"}
                  name={"volume-bar-opacity"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.volume_bar_opacity}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.volume_bar_opacity =
                      e.target.value;
                  }}
                />
                <ColorPicker
                  label={"Volume Bar BG Color"}
                  name={"volume-bar-bg-color"}
                  value={
                    videoconfigupdate.value.playerstyle.volume_bar_BG_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.volume_bar_BG_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Volume Bar FG Color"}
                  name={"volume-bar-fg-color"}
                  value={
                    videoconfigupdate.value.playerstyle.volume_bar_FG_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.volume_bar_FG_color =
                      e.target.value;
                  }}
                />
              </div>
            )}
            {activeTab === tabList[5].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"small-icon-setting-show"}
                  label={"Settings Button"}
                  checked={videoconfigupdate.value.playercontrol.settings_menu}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.settings_menu =
                      e.target.checked;
                  }}
                />

                <SizePicker
                  label={"Settings menu opacity"}
                  name={"settings-menu-opacity"}
                  // @ts-ignore
                  value={
                    videoconfigupdate.value.playerstyle.settings_menu_opacity
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.settings_menu_opacity =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Background Color"}
                  name={"settting-background-color"}
                  value={
                    videoconfigupdate.value.playerstyle.settings_menu_BG_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.settings_menu_BG_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Hover Color"}
                  name={"settting-hover-color"}
                  value={
                    videoconfigupdate.value.playerstyle
                      .settings_menu_BG_hover_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.settings_menu_BG_hover_color =
                      e.target.value;
                  }}
                />

                <ColorPicker
                  label={"Text Color"}
                  name={"settting-test-color"}
                  value={
                    videoconfigupdate.value.playerstyle.settings_menu_text_color
                  }
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.settings_menu_text_color =
                      e.target.value;
                  }}
                />
              </div>
            )}
            {activeTab === tabList[6].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"video-name"}
                  label={"Video Title"}
                  checked={videoconfigupdate.value.playercontrol.video_name}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.video_name =
                      e.target.checked;
                  }}
                />

                <div
                  style={{
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  <p className="body" style={{ marginBottom: "0.25rem" }}>
                    Title
                  </p>
                  <input
                    className="input-main"
                    type={"text"}
                    defaultValue={videoconfigupdate.value.videotitle}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      setVideoTitle(e.target.value);
                      videoconfigupdate.value.videotitle = e.target.value;
                    }}
                    name={"video_title"}
                    placeholder="Enter video title"
                    autoComplete="off"
                  ></input>
                </div>
                <div
                  style={{
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  <p className="body" style={{ marginBottom: "0.25rem" }}>
                    Description
                  </p>
                  <input
                    className="input-main"
                    type={"text"}
                    defaultValue={videoconfigupdate.value.videodescription}
                    onChange={(e: any) => {
                      setReRender(Math.random() * 1000);
                      setVideoDescription(e.target.value);
                      videoconfigupdate.value.videodescription = e.target.value;
                    }}
                    name={"video_description"}
                    placeholder="Enter video description"
                    autoComplete="off"
                  ></input>
                </div>
                <ColorPicker
                  label={"Text Color"}
                  name={"text-color"}
                  value={videoconfigupdate.value.playerstyle.text_color}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.text_color =
                      e.target.value;
                  }}
                />
                <Toggle
                  name={"thumbnail"}
                  label={"Thumbnail"}
                  checked={videoconfigupdate.value.playercontrol.thumbnail}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.thumbnail =
                      e.target.checked;
                  }}
                />

                <div style={{ width: "100%" }}>
                  <ImagePicker
                    onChange={(val: any) => {
                      handlePlayerThumbnailOnChange(val);
                    }}
                    label="Player Thumbnail"
                    setImageUploading={setThumbnailUploading}
                  />
                </div>
              </div>
            )}
            {activeTab === tabList[7].name && (
              <div
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem 0 1rem",
                  boxSizing: "border-box",
                }}
              >
                <Toggle
                  name={"branding"}
                  label={"Branding"}
                  checked={videoconfigupdate.value.playercontrol.branding}
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playercontrol.branding =
                      e.target.checked;
                  }}
                />

                <SizePicker
                  label={"Branding Opacity"}
                  name={"branding-opacity"}
                  // @ts-ignore
                  value={videoconfigupdate.value.playerstyle.branding_opacity}
                  // @ts-ignore
                  onChange={(e: any) => {
                    setReRender(Math.random() * 1000);
                    videoconfigupdate.value.playerstyle.branding_opacity =
                      e.target.value;
                  }}
                />

                <div style={{ width: "100%" }}>
                  <ImagePicker
                    onChange={(val: any) => {
                      handlePlayerBrandingOnChange(val);
                    }}
                    label="Player Branding"
                    setImageUploading={setBrandUploading}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
