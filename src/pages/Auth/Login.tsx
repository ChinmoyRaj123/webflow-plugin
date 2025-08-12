import axios from "../../utils/axios-instance";
import React from "react";
import { useNavigate } from "react-router-dom";
import { encodeBase64 } from "../../utils/base64";
import config from "../../config";

/**
 * Returns the login page.
 * Renders two input fields(i.e email and password)
 * Renders two buttons(i.e signin and register)
 */
const Login = () => {
  const [renderElement, setRenderElement] = React.useState("login");
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);

  const loginWithout2FA = async () => {
    setError("");
    setLoading(true);
    const userdata = {
      email: inputEmail,
      password: inputPassword,
    };
    try {
      const res = await axios.post("/login", userdata);
      console.log("success login", res.data);
      localStorage.setItem("s-token", JSON.stringify(res.data.token));
      localStorage.setItem("s-user", JSON.stringify(res.data.user));
      window.location.replace("/");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 404) {
        setError("user-not-found");
      }
      console.log("msss", error?.response?.data?.error);
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "Invalid authentication information"
      ) {
        setError("invalid-credentials");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "tow factor authentication token is required"
      ) {
        setRenderElement("otp-sent");
      }
      console.log("error login", error);
    }
  };

  const loginWith2FA = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (pin === "") {
      setError("pin-empty");
      setLoading(false);
    }
    try {
      await internalLoging();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 403) {
        setError("invalid-passcode");
      }
      console.log("error 2FA", error);
    }
  };

  const internalLoging = async () => {
    const userdata = {
      email: inputEmail,
      password: inputPassword,
      otp: pin,
    };
    try {
      const res = await axios.post("/login", userdata);
      // console.log('internal login success', res);
      localStorage.setItem("s-token", JSON.stringify(res.data.token));
      localStorage.setItem("s-user", JSON.stringify(res.data.user));
      window.location.replace("/");
    } catch (error) {
      console.log("login error", error);
    }
  };

  const handleLoginApiCall = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (inputEmail === "" || inputPassword === "") {
      if (inputEmail === "") {
        setError("empty-email");
      } else {
        setError("empty-password");
      }
    } else {
      await loginWithout2FA();
      // window.location.replace("/")
    }
  };

  // this function redirects a user to register page
  const handleAccountCreateClick = () => {
    window.open(`${config.HOSTED_URL}/register`, "_blank");
  };

  return (
    <div className="auth-form">
      <p className="auth-header">Sign in</p>

      {renderElement === "otp-sent" && (
        <form onSubmit={loginWith2FA}>
          <div>
            <p className="input-title">Enter OTP</p>
            <input
              aria-label="otp_input"
              className="input-main"
              type={"password"}
              value={pin}
              onChange={(e: any) => setPin(e.target.value)}
              name={"pin"}
              placeholder="******"
              autoComplete="off"
            ></input>
          </div>

          <div className="error-container">
            {error === "invalid-passcode" && (
              <p className="error-text">Invalid OTP</p>
            )}
            {error === "pin-empty" && (
              <p className="error-text">Pin cannot be empty</p>
            )}
          </div>

          <button
            aria-label="Verify OTP"
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              margin: "2rem 0",
            }}
          >
            Verify otp
          </button>

          <div style={{ marginTop: "0.5rem" }}>
            <a
              href={`${config.HOSTED_URL}/account-recovery`}
              style={{
                color: "#FFFFFF",
              }}
              target="_blank"
            >
              <p className="body">Recover your account</p>
            </a>
          </div>
        </form>
      )}

      {/* login-form */}
      {renderElement === "login" && (
        <form onSubmit={handleLoginApiCall}>
          <p className="input-title">Email</p>
          <input
            aria-label="email_input"
            className="input-main"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            name="email"
            placeholder="abc@email.com"
            autoComplete="off"
          />
          <div style={{ minHeight: "1rem" }}>
            {error === "empty-email" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>

          <p className="input-title">Password</p>
          <div className="input-container">
            <input
              aria-label="password_input"
              className="input-main"
              autoComplete="off"
              type={!visibility ? "password" : "text"}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              name="password"
              placeholder="********"
            />

            <span
              style={{
                position: "absolute",
                top: "50%",
                right: "0.5rem",
                transform: "translate(0,-50%)",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => {
                setVisibility(!visibility);
              }}
              className="material-symbols-outlined"
            >
              {visibility ? "visibility" : "visibility_off"}
            </span>
          </div>
          <div className="error-container">
            {error === "empty-password" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>

          <div className="error-container">
            {error === "user-not-found" && (
              <p className="error-text">User not found!</p>
            )}
            {error === "invalid-credentials" && (
              <p className="error-text">Invalid Credentials!</p>
            )}
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <button
              aria-label="Sign In"
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
              }}
            >
              {loading ? "Loading.." : "Sign In"}
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <a
              href={`${config.HOSTED_URL}/forgot-password`}
              style={{
                color: "#FFFFFF",
              }}
              target="_blank"
            >
              <p className="body">Forgot password ?</p>
            </a>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <button
              type="button"
              aria-label="No account"
              className="large-secondary-btn"
              style={{
                width: "100%",
              }}
              onClick={handleAccountCreateClick}
            >
              I don't have an account
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
