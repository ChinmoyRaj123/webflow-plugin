import React from "react";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";

type TwoFAProps = {
  email: string;
  enabled: boolean;
};

const Index = (props: TwoFAProps) => {
  const { email, enabled } = props;

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [pin, setPin] = React.useState<string>("");
  const [image, setImage] = React.useState("");
  const [error, setError] = React.useState("");

  const reqQR = async () => {
    setError("");
    try {
      const res = await axios.get(`/two-factors/${email}`, {
        responseType: "blob",
      });
      console.log("qr", res.data);
      const dataURI = URL.createObjectURL(res.data);
      console.log("dataURI", dataURI);

      setImage(dataURI);
    } catch (error) {
      console.log("error qr", error);
      setError("");
    }
  };

  const handleVerifyQR = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`/two-factors`, {
        email: email,
        passcode: pin,
      });
      console.log("verify", res);
      setTimeout(() => {
        Cookies.remove("s-token");
        Cookies.remove("splay-token");
        Cookies.remove("user");
        window.location.replace("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response.status === 403) {
        setError("invalid-passcode");
      }
      console.log("error verify", error);
    }
  };
  return (
    <div style={{ padding: "2rem 0" }}>
      <p className="subtitle-one">Two Factor Authentication</p>

      {enabled && (
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid green",
            width: "5.5rem",
            height: "2rem",
            borderRadius: "3rem",
          }}
        >
          <span className="material-symbols-outlined positive">done</span>
          <p className="body positive">Active</p>
        </div>
      )}
      {!enabled && (
        <>
          <p className="body" style={{ marginTop: "1rem" }}>
            Click Enable 2FA. button to see the QR.
          </p>
          <button
            type="submit"
            className="large-primary-btn"
            style={{
              marginTop: "2rem",
            }}
            onClick={() => {
              setOpenModal(true);
              reqQR();
            }}
          >
            Enable 2FA
          </button>
        </>
      )}

      <Modal
        isOpen={openModal}
        setOpen={setOpenModal}
        title={`Enable 2FA`}
        size="sm"
      >
        <p className="body" style={{ marginTop: "1rem" }}>
          Use an authenticator app or browser extension to scan.{" "}
        </p>
        <img src={image} alt="qr" />

        <form onSubmit={handleVerifyQR}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div style={{ marginTop: "2rem" }}>
              <p className="input-title">Enter the code</p>
              <input
                className="input-main"
                style={{ width: "100%" }}
                autoComplete="off"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                name="password"
                placeholder="********"
              />
            </div>

            <div className="error-container">
              {error === "invalid-passcode" && (
                <p className="error-text">Invalid Code!</p>
              )}
            </div>
            <button
              type="submit"
              className="large-primary-btn"
              style={{
                marginTop: "2rem",
              }}
            >
              Verify
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Index;
