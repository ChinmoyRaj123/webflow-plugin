import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { encodeBase64 } from "../../utils/base64";
import Loader from "../../components/Loader";
import config from "../../config";

/**
 * Returns the login page.
 * Renders two input fields(i.e email and password)
 * Renders two buttons(i.e signin and register)
 */
const Login = () => {
  const navigate = useNavigate();

  const [renderElement, setRenderElement] = React.useState("login");
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);

  const loginWith2FA = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (pin === "") {
      setError("pin-empty");
      setLoading(false);
    }
    const twoFAchallenge = {
      email: inputEmail,
      code: pin,
    };
    try {
      const res = await axios.post("/two-factor", twoFAchallenge);
      // console.log('2fa success', res);
      Cookies.set("splay-token", res.data.token, { expires: 7, path: "/" });
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

  const loginWithout2FA = async () => {
    setError("");
    setLoading(true);
    const userdata = {
      email: inputEmail,
      password: inputPassword,
    };
    try {
      const res = await axios.post("/login", userdata);
      localStorage.setItem("s-token", JSON.stringify(res.data.token));
      Cookies.set("s-token", res.data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      localStorage.setItem("s-user", JSON.stringify(res.data.user));
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      console.log("success login", res.data);
      navigate("/home");
      // window.location.replace("/home");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 404) {
        setError("user-not-found");
      }
      if (error.response.status === 401) {
        setError("invalid-credentials");
      }
      // if (error.response.status === 401) {
      //   setRenderElement("otp-sent");
      // }
      console.log("error login", error);
    }
  };

  const internalLoging = async () => {
    const userdata = {
      email: inputEmail,
      password: inputPassword,
    };
    try {
      const res = await axios.post("/login", userdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("splay-token")}`,
        },
      });
      // console.log('internal login success', res);
      Cookies.set("s-token", res.data.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      window.location.replace("/");
    } catch (error) {
      console.log("login error", error);
    }
  };

  /**
   * Validates the user input.
   * Compares input values with localStorage values.
   * After validation, sets a cookie and then redirects to list view page.
   * If Validation fails, sets respective useState hooks with its respective error.
   */
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
    navigate({
      pathname: "/register",
    });
  };

  return (
    <div className="auth-form">
      <p className="auth-header">Sign in</p>

      {renderElement === "otp-sent" && (
        <form onSubmit={loginWith2FA}>
          <div>
            <p className="input-title">Enter OTP</p>
            <input
              className="input-main"
              type={"password"}
              value={pin}
              onChange={(e: any) => setPin(e.target.value)}
              name={"pin"}
              placeholder="******"
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
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              margin: "2rem 0",
            }}
          >
            Verify otp
          </button>
        </form>
      )}

      {/* login-form */}
      {renderElement === "login" && (
        <form onSubmit={handleLoginApiCall}>
          <p className="input-title">Email</p>
          <input
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
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
              }}
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
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
