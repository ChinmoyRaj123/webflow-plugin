import React from "react";
import Toast from "../Toast";
import config from "../../config";

type ListsInModalProps = {
  item: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
};

const ListsInModal = (props: ListsInModalProps) => {
  const { item, setRefetch } = props;
  const { name, created_at, id, url } = item;

  const construct_video_url = new URL(url, config.VIDEO_CDN_URL).toString();
  const [showCopyTooltip, setShowCopyTooltip] = React.useState("0");
  const [showCopied, setShowCopied] = React.useState(false);

  const showToastCopied = () => {
    setShowCopied(true);
  };
  const hideToastCopied = () => {
    setShowCopied(false);
  };

  return (
    <>
      <tr>
        <td>
          <p className="body">{name}</p>
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
      </tr>

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

export default ListsInModal;
