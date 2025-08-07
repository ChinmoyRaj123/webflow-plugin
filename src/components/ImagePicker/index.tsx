import React from "react";
import "./imagepicker.css";
import axios from "../../utils/axios-instance";
import { Buffer } from "buffer";
import SparkMd5 from "spark-md5";

type ImagePickerType = {
  onChange: (val: string) => void;
  label: string;
  setImageUploading: any;
};

const ImagePicker = ({
  onChange,
  label,
  setImageUploading,
}: ImagePickerType) => {
  const accessToken = JSON.parse(localStorage.getItem("s-token"));
  const [fileName, setFileName] = React.useState("Choose File");
  const [pickerId, setPickerId] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const image_id =
      "image_" +
      Math.floor(Math.random() * 10000) +
      "_" +
      Math.floor(Math.random() * 10000000);
    setPickerId(image_id);
  }, []);

  const uploadToS3 = async (file: File, url: any, md5: string) => {
    return new Promise(async (resolve, reject) => {
      const buffer = await file.arrayBuffer();
      const blob = Buffer.from(buffer);
      axios
        .put(url, blob, {
          headers: {
            "Content-MD5": btoa(md5),
            "Content-Type": file.type,
          },
        })
        .then((response) => {
          setImageUploading(false);
          resolve(response);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  };

  async function calculateMd5(file: File) {
    const reader = new FileReader();
    const chunkSize = 1024 * 1024; // 1 MB chunks
    let currChunk = 0;
    const chunks = Math.ceil(file.size / chunkSize);
    const hasher = new SparkMd5.ArrayBuffer();

    function readNextChunk() {
      const start = currChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;

      reader.readAsArrayBuffer(file.slice(start, end));
    }

    reader.onload = async function (event) {
      //@ts-ignore
      hasher.append(event.target?.result);
      currChunk++;

      if (currChunk < chunks) {
        readNextChunk();
      } else {
        const md5 = hasher.end(true);
        console.log(md5);

        let payload = {
          file_name: file.name,
          content_md5: btoa(md5),
        };

        // store in database with md5 hash
        const res = await axios.post("/images", payload, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log("res", res);
        setFileName(file.name);
        onChange(res.data.key);

        // upload image to s3 bucket
        await uploadToS3(file, res.data?.upload_url, md5);
        Promise.resolve();
      }
    };
    readNextChunk();
  }

  const handleImageApiCall = async (file: File) => {
    let imageFile = new FormData();
    imageFile.append("file", file);
    setLoading(true);
    try {
      //calculate md5
      await calculateMd5(file);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleImageSelection = async (
    e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    setImageUploading(true);
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    const imgSize = chosenFiles[0].size;
    const fileReader = new FileReader();
    let imgwidth, imgheight, ratio;
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imgwidth = img.width;
        imgheight = img.height;
        ratio = imgwidth / imgheight;
        // if (validationRequired) {
        //   if (ratio >= (lowerRange as number) && ratio <= (upperRange as number) && imgSize <= (requiredSize as number)) {
        //     handleImageApiCall(chosenFiles[0])
        //     setValidationError && setValidationError(false)
        //   } else {
        //     setValidationError && setValidationError(true)
        //   }
        // } else {
        //   handleImageApiCall(chosenFiles[0])
        //   setValidationError && setValidationError(false)
        // }

        handleImageApiCall(chosenFiles[0]);
      };
      img.src = fileReader.result as string;
    };
    if (chosenFiles[0]) {
      fileReader.readAsDataURL(chosenFiles[0]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ width: "50%" }}>
        <p className="body placeholder">{label}</p>
      </div>

      <div className="imageUpload-main">
        <p className="label">{fileName}</p>
        <label style={{ width: "100%" }} htmlFor={pickerId}>
          <div
            className="large-secondary-btn"
            style={{
              width: "100%",
              padding: "0.25rem",
              textAlign: "center",
            }}
          >
            {isLoading ? "Loading.." : "Upload"}
          </div>
        </label>
        <input
          type="file"
          id={pickerId}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleImageSelection(e)}
        />
      </div>
    </div>
  );
};

export default ImagePicker;
