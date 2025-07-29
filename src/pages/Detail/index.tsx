import React from "react";
import Toggle from "../../components/Toggle";
import ColorPicker from "../../components/ColorPicker";
import axios from "../../utils/axios-instance";
import { signal } from "@preact/signals";
import SizePicker from "../../components/SizePicker";
import Toast from "../../components/Toast";
import ImagePicker from "../../components/ImagePicker";
import config from "../../config";
import Modal from "../../components/Modal";
import ListsInModal from "../../components/ListsInModal";
import VideoPicker from "../../components/VideoPicker";

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
  const [mediaTypeName, setMediaTypeName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [reRender, setReRender] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState(false);
  const [copiedPlayerId, setCopiedPlayerId] = React.useState(false);
  const [isLoadingEmbed, setLoadingEmbed] = React.useState(false);
  const [isLoadingPlayerData, setLoadingPlayerData] = React.useState(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [embedUrl, setEmbedUrl] = React.useState("");
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoDescription, setVideoDescription] = React.useState("");
  const [muted, setMuted] = React.useState<boolean>();
  const [token, setToken] = React.useState("");
  const [sourceEmpty, setSourceEmpty] = React.useState(false);
  const [sourceId, setSourceId] = React.useState("");
  const [openModalUpload, setOpenModalUpload] = React.useState<boolean>(false);
  const [media, setMedia] = React.useState([]);
  const [refetch, setRefetch] = React.useState(0);
  const [file, setFile] = React.useState<any>();
  const [videoUrlFromModal, setVideoUrlFromModal] = React.useState<any>();
  const [openUpload, setOpenUpload] = React.useState<boolean>(false);
  const [searchTitle, setSearchTitle] = React.useState("");

  React.useEffect(() => {
    videoUrlExtensionUpdate.value = selectedExtension as string;

    if (selectedExtension === "hls") {
      setMediaTypeName("hls");
    } else {
      setMediaTypeName("mp4");
    }
    // console.log("selectedExtension", selectedExtension);
  }, [selectedExtension]);

  const showToast = () => {
    setShow(true);
  };

  const hideToast = () => {
    setShow(false);
  };

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
      setToken(res.data.token);
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
      const res = await axios.put(`/players/${videoId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      await addSource(sourceId);
      await handleEmbedVideoPlayer();
      setLoadingEmbed(false);
      // console.log('update', res);
      // showToast();
      //webflownotify
    } catch (error) {
      setLoadingEmbed(false);
      console.log("error updating video", error);
    }
  };

  const handleEmbedVideoPlayer = async () => {
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
          `${isLoadingEmbed ? videoTitle : "Video title"}`
        );
        await domElement.setAttribute("width", "100%");
        await domElement.setAttribute("height", "100%");
        await domElement.setAttribute("frameborder", "0");
        await domElement.setAttribute("allowfullscreen", "true");
        await domElement.setTextContent(
          `${isLoadingEmbed ? videoDescription : "Video description"}`
        );
        await domElement.setAttribute("style", "pointer-events: auto;");
      }
    }
  };

  const generateCode = (url: string) => {
    setEmbedUrl(url);
    let snipet = `<iframe
            title="${isLoadingEmbed ? videoTitle : "Video title"}"
            width="100%"
            height="100%"
            loading="lazy"
            frameborder="0"
            allowfullscreen
            src="${url}"
            style="border: none; outline: none; padding: 0; margin: 0;  cursor: pointer;"
        >
         <meta name="description" content="${
           isLoadingEmbed ? videoDescription : "Video description"
         }">
        </iframe>
       `;
    setEmbedCode(snipet);
  };

  const [brandUploading, setBrandUploading] = React.useState(false);
  const [thumbnailUploading, setThumbnailUploading] = React.useState(false);

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

  const handleCopyClipboard = async (val: string) => {
    setCopied(false);
    setCopiedLink(false);
    setCopiedPlayerId(false);
    setCopiedToken(false);
    // hideCopyT()
    console.log("val", val);

    try {
      const element = document.querySelector(`#${val}`);
      console.log("element", element);

      // @ts-ignore
      element?.select();
      // @ts-ignore
      element?.setSelectionRange(0, 99999);
      document.execCommand("copy");
      if (val === "embed-link-code") {
        setCopied(true);
      } else if (val === "embed-token") {
        setCopiedToken(true);
      } else if (val === "embed-player-id") {
        setCopiedPlayerId(true);
      } else {
        setCopiedLink(true);
      }
      // showCopyT()
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopied(false);
      setCopiedLink(false);
      setCopiedPlayerId(false);
      setCopiedToken(false);
      // hideCopyT()
    }
  };

  const handleMediaTypeSelection = (val: string) => {
    if (val === "hls") {
      setSelectedExtension("hls");
    } else {
      setSelectedExtension("mp4");
    }
  };

  const handleAutoPlayToggle = () => {
    videoconfigupdate.value.playersettings.muted =
      !videoconfigupdate.value.playersettings.muted;
    videoconfigupdate.value.playersettings.autoplay =
      !videoconfigupdate.value.playersettings.autoplay;
    setMuted(!muted);
  };

  if (isLoadingPlayerData)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading..</p>
      </div>
    );

  return (
    <div className="detail-main">
      {/* left side */}

      {/* right side */}
      <div className="detail-sub-container-1 hide-scroll">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "absolute",
              top: "2px",
              right: "1rem",
              zIndex: "10",
              boxSizing: "border-box",
            }}
          >
            <button type="submit" className="large-primary-btn">
              Embed
            </button>
          </div>

          <div className="video-player-url-section">
            <div>
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginBottom: "1rem",
                }}
              >
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                  Video Url (only mp4 supported)
                </p>
                <input
                  className="input-main"
                  type={"text"}
                  name={"search"}
                  placeholder={"Paste Video Link here..."}
                  defaultValue={videoUrlUpdate.value}
                  onInput={(e: any) => (videoUrlUpdate.value = e.target.value)}
                />
              </div>
            </div>

            <p className="label">Or</p>
            <button
              type="button"
              className="large-primary-btn"
              style={{ marginTop: "1rem" }}
              onClick={() => setOpenModalUpload(true)}
            >
              Add Video URL
            </button>

            {/* video upload section or choose from the list using modal */}
            <Modal
              isOpen={openModalUpload}
              setOpen={setOpenModalUpload}
              title={`Upload Video or Choose from the List`}
              size="contain"
            >
              <div
                style={{
                  marginTop: "2rem",
                  maxHeight: "32rem",
                  overflowY: "scroll",
                }}
              >
                <div
                  style={{
                    margin: "2rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <div>
                    <input
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
                      type="button"
                      className="large-primary-btn"
                      style={{
                        width: "100%",
                      }}
                      onClick={() => setOpenUpload(true)}
                    >
                      Upload Video
                    </button>
                  </div>
                  <Modal
                    isOpen={openUpload}
                    setOpen={setOpenUpload}
                    title={`Upload Video`}
                    size="sm"
                  >
                    <VideoPicker
                      file={file}
                      setFile={setFile}
                      setVideoUrl={setVideoUrlFromModal}
                      setRefetch={setRefetch}
                      setOpenModalUpload={setOpenUpload}
                    />
                  </Modal>
                </div>

                {media && media.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <td>
                          <p className="subtitle-two">Video Name</p>{" "}
                        </td>

                        <td>
                          <p className="subtitle-two">Copy URL</p>{" "}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {media.map((item: any, index: number) => (
                        <ListsInModal
                          item={item}
                          key={index}
                          setRefetch={setRefetch}
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="body">No media found</p>
                )}
              </div>
            </Modal>
          </div>

          <div
            style={{
              padding: "0rem 1rem 2rem 1rem",
            }}
          >
            <p className="label">Player name</p>

            <input
              style={{ width: "100%" }}
              className="input-main"
              type={"text"}
              name={"videotitle"}
              placeholder="Enter player name"
              defaultValue={playerNameUpdate.value}
              onInput={(e: any) => (playerNameUpdate.value = e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/video_behavior.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Video Behavior</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
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

              {/* <Toggle
                                    name={'use-as-bg-video'}
                                    label={'Use as BG Video'}
                                    checked={videoconfigupdate.value.playersettings.use_as_BG_video}
                                    onChange={(e: any) => { setReRender(Math.random() * 1000); (videoconfigupdate.value.playersettings.use_as_BG_video = e.target.checked) }}
                                /> */}

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

              <ColorPicker
                label={"In-Video Text Color"}
                name={"text-color"}
                value={videoconfigupdate.value.playerstyle.text_color}
                // @ts-ignore
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playerstyle.text_color =
                    e.target.value;
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/player_style.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Player Style - Top level</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
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
                value={videoconfigupdate.value.playerstyle.player_corner_radius}
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
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/big_play_button.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Big Play Button</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
              <Toggle
                name={"center-btn-show"}
                label={"Show"}
                checked={videoconfigupdate.value.playercontrol.center_playpause}
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
                  videoconfigupdate.value.playerstyle.center_icon_button_opacity
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
                  videoconfigupdate.value.playerstyle.center_icon_button_padding
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
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/small_icons.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Small Icons</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
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
                name={"small-icon-vol-show"}
                label={"Volume Button"}
                checked={videoconfigupdate.value.playercontrol.volume}
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playercontrol.volume =
                    e.target.checked;
                }}
              />

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

              <Toggle
                name={"small-icon-fullscreen-show"}
                label={"Fullscreen Button"}
                checked={videoconfigupdate.value.playercontrol.full_screen_icon}
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
                value={videoconfigupdate.value.playerstyle.icon_button_opacity}
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
                value={videoconfigupdate.value.playerstyle.icon_button_padding}
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
                  videoconfigupdate.value.playerstyle.icon_button_corner_radius
                }
                // @ts-ignore
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playerstyle.icon_button_corner_radius =
                    e.target.value;
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/video_progress_bar.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Video Progress Slider</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
              <Toggle
                name={"progress-bar-show"}
                label={"Show"}
                checked={videoconfigupdate.value.playercontrol.progress_bar}
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playercontrol.progress_bar =
                    e.target.checked;
                }}
              />

              <Toggle
                name={"progress-bar-time"}
                label={"Time Stamp"}
                checked={videoconfigupdate.value.playercontrol.time_stamp}
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playercontrol.time_stamp =
                    e.target.checked;
                }}
              />
              <SizePicker
                label={"Spacing from Bottom"}
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
                label={"Height"}
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
                  videoconfigupdate.value.playerstyle.progress_bar_loaded_color
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
                  videoconfigupdate.value.playerstyle.progress_bar_circle_color
                }
                // @ts-ignore
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playerstyle.progress_bar_circle_color =
                    e.target.value;
                }}
              />

              <SizePicker
                label={"Progress Bar Opacity"}
                name={"progress-bar-opacity"}
                // @ts-ignore
                value={videoconfigupdate.value.playerstyle.progress_bar_opacity}
                // @ts-ignore
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playerstyle.progress_bar_opacity =
                    e.target.value;
                }}
              />

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
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/volume_slider.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Volume Slider</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
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
              <ColorPicker
                label={"Volume Bar BG Color"}
                name={"volume-bar-bg-color"}
                value={videoconfigupdate.value.playerstyle.volume_bar_BG_color}
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
                value={videoconfigupdate.value.playerstyle.volume_bar_FG_color}
                // @ts-ignore
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playerstyle.volume_bar_FG_color =
                    e.target.value;
                }}
              />

              <SizePicker
                label={"Volume Slider Opacity"}
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
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/settings_menu.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Settings Menu</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
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
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/branding.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Branding</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
              <Toggle
                name={"branding"}
                label={"Show"}
                checked={videoconfigupdate.value.playercontrol.branding}
                onChange={(e: any) => {
                  setReRender(Math.random() * 1000);
                  videoconfigupdate.value.playercontrol.branding =
                    e.target.checked;
                }}
              />

              <SizePicker
                label={"Opacity"}
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
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                // width: '100%',
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #F0F0F0",
                borderBottom: "1px solid #F0F0F0",
                padding: "1rem",
              }}
            >
              <img
                className="icon_image"
                src="./icon/thumbnail.png"
                alt="no image"
                width="24px"
                height="24px"
              />
              <p className="body">Thumbnail</p>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0 1rem 0 1rem",
                boxSizing: "border-box",
              }}
            >
              <Toggle
                name={"thumbnail"}
                label={"Show"}
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
          </div>
        </form>
      </div>
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
            Player Updated
          </p>
        </div>
      </Toast>
    </div>
  );
};

export default Index;
