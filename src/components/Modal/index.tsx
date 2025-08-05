import React, { Dispatch, SetStateAction } from "react";
import ReactPortal from "../ReactPortal";
import "./modal.css";

type ModalProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
  handleClickEvent?: Function;
  size?: "sm" | "md" | "lg" | "contain";
};

const Modal = (props: ModalProps) => {
  const { isOpen, setOpen, title, children, handleClickEvent, size } = props;

  const [width, setWidth] = React.useState("300px");
  const [height, setHeight] = React.useState("180px");

  React.useEffect(() => {
    if (size === "sm") {
      setWidth("450px");
      setHeight("auto");
    }
    if (size == "md") {
      setWidth("750px");
      setHeight("auto");
    }
    if (size == "lg") {
      setWidth("960px");
      setHeight("auto");
    }
    if (size == "contain") {
      setWidth("95%");
      setHeight("auto");
    }
  }, []);

  React.useEffect(() => {
    const closeOnEscapeKey = (e: any) =>
      e.key === "Escape" ? setOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [setOpen]);

  if (!isOpen) return null;

  const handleSubmit = (): void => {
    if (handleClickEvent) handleClickEvent();
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="centered">
        <div className="modal" style={{ width: width, height: height }}>
          <div className="modalHeader">
            <p
              className="body"
              style={{
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "1rem",
              }}
            >
              {title}
            </p>
            <span
              className="material-symbols-outlined white icon_with_hover"
              onClick={() => setOpen(false)}
            >
              close
            </span>
          </div>

          <div className="modalContent hide-scroll">{children}</div>
        </div>
      </div>
    </ReactPortal>
  );
};
export default Modal;
