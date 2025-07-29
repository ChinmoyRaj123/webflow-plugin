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
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

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
      const res = await axios.post(
        "/videos",
        {
          filename: file?.name.replace(/\s/g, "_"),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("upload", res.data);
      await uploadToS3(file, res.data);
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

  const uploadToS3 = async (file: File, presignedPostData: any) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      //@ts-ignore
      Object.keys(presignedPostData.fields).forEach((key) => {
        const value = presignedPostData.fields[key];
        if (value !== undefined && value !== null && value !== "") {
          // @ts-ignore
          formData.append(key, value);
        }
      });
      formData.append("file", file);

      axios
        //@ts-ignore
        .post(presignedPostData.upload_url, formData, {
          onUploadProgress: (progressEvent) => {
            setLoading(true);
            const percentCompleted = Math.round(
              Number(progressEvent.loaded * 100) / Number(progressEvent?.total)
            );
            setProgress(percentCompleted);
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("error while uploading", error);
          reject(error);
        });
    });
  };

  return (
    <div className="video-picker-container">
      <form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* <div className="videoUpload-main"> */}
          <div className="large-secondary-btn" style={{ width: "100%" }}>
            <label style={{ width: "100%" }} htmlFor={pickerId}>
              <p className="body" style={{ textAlign: "center" }}>
                Choose file
              </p>
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
            type="button"
            onClick={(e) => {
              uploadFile(e);
            }}
          >
            {loading ? progress + "%" : "Upload Video"}
          </button>
        </div>
      </form>
      <p className="label">{file?.name.replace(/\s/g, "_")}</p>
    </div>
  );
};

export default VideoPicker;
