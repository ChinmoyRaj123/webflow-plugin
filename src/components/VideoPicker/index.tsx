import React, { ChangeEvent } from "react";
import axios from "../../utils/axios-instance";
import "./videopicker.css";
import XMLParser from "../../utils/xmlParser";

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
      await webflow.notify({
        type: "Success",
        message: "Video uploaded successfully!",
      });
      setTimeout(() => {
        setRefetch(`refetch_${Math.random()}`);
      }, 800);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setProgress(0);
      if (error.response.status === 400) {
        if (error.response.data.error) {
          await webflow.notify({
            type: "Error",
            message: `${error.response?.data.error || ""}`,
          });
        }
      }
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
        .catch(async (error) => {
          console.log("error while uploading to s3", error.response.status);
          if (error.response.status === 400) {
            await webflow.notify({
              type: "Error",
              message: `${XMLParser(error.response?.data).message || ""}`,
            });
          }
          reject(error);
        });
    });
  };

  return (
    <div className="video-picker-container">
      <form>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "0.25rem",
            }}
          >
            <div style={{ flex: 2 }}>
              <p className="label" style={{ wordBreak: "break-all" }}>
                {file ? file.name.replace(/\s/g, "_") : "No file selected"}
              </p>
            </div>

            {!file && !loading && (
              <div className="large-secondary-btn" style={{ flex: 1 }}>
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
            )}
            {file && !loading && (
              <div style={{ display: "flex", gap: "0.25rem", flex: 1 }}>
                <button
                  className="large-secondary-btn"
                  style={{
                    width: "100%",
                  }}
                  type="button"
                  onClick={(e) => {
                    setFile(undefined);
                  }}
                >
                  {"Cancel"}
                </button>
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
                  {"Upload"}
                </button>
              </div>
            )}
          </div>
          {loading && (
            <div
              style={{
                width: "100%",
                height: "0.5rem",
                border: "1px solid var(--stroke)",
                borderRadius: "0.25rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "var(--blue)",
                  width: `${progress}%`,
                  height: "100%",
                }}
              ></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default VideoPicker;
