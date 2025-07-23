import React, { ChangeEvent } from "react";
import axios from "../../utils/axios-instance";
import axiosOriginal from "axios";
import Cookies from "js-cookie";
import "./videopicker.css";

type VideoPickerProps = {
  file: any;
  setFile: React.Dispatch<React.SetStateAction<any>>;
  setVideoUrl: React.Dispatch<React.SetStateAction<any>>;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  setOpenModalUpload?: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoPicker = (props: VideoPickerProps) => {
  const { file, setFile, setVideoUrl, setRefetch, setOpenModalUpload } = props;

  const [pickerId, setPickerId] = React.useState<string>();
  const [progress, setProgress] = React.useState<number>();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const video_id =
      "video_" +
      Math.floor(Math.random() * 10000) +
      "_" +
      Math.floor(Math.random() * 10000000);
    setPickerId(video_id);
  }, []);

  const handleFileChange = (e: any) => {
    const files = e.target.files[0];
    setFile(files);
  };

  const uploadFile = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let presigned_URL;

      const res = await axios.post(
        "/videos",
        {
          filename: file?.name.replace(/\s/g, "_"),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        }
      );
      console.log("upload", res.data);
      presigned_URL = res.data.upload_url;
      setVideoUrl(res.data.key);

      const uplaodToS3 = await axiosOriginal.put(presigned_URL, file, {
        onUploadProgress: (progressEvent) => {
          setLoading(true);
          const percentCompleted = Math.round(
            Number(progressEvent.loaded * 100) / Number(progressEvent?.total)
          );
          setProgress(percentCompleted);
        },
        headers: {
          "Content-Type": file.type,
        },
      });
      // console.log("successs", uplaodToS3);
      setLoading(false);
      setFile(null);
      setProgress(0);
      setTimeout(() => {
        setRefetch(Math.random() + Math.random());
        setOpenModalUpload && setOpenModalUpload(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="video-picker-container">
      <form onSubmit={uploadFile}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div className="videoUpload-main">
            <label style={{ width: "100%" }} htmlFor={pickerId}>
              <div className="videoUpload-button">Choose file</div>
            </label>
            <input
              type="file"
              id={pickerId}
              style={{ display: "none" }}
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>
          <button
            className="large-primary-btn"
            style={{
              width: "100%",
            }}
            type="submit"
          >
            {loading ? progress + "%" : "Upload"}
          </button>
        </div>
      </form>
      <p className="label">{file?.name.replace(/\s/g, "_")}</p>
    </div>
  );
};

export default VideoPicker;
