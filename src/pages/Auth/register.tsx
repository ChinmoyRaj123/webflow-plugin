import axios from "../../utils/axios-instance";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";

type FormDataType = {
  title: string;
  placeholder: string;
  name: string;
  value?: string;
  type: string;
  error: boolean;
};

/**
 * Returns the register page.
 * Renders four input fields(i.e name,email, password and confirmPassword)
 * Renders two buttons(i.e signin and signup)
 */
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [pinId, setPinId] = React.useState("");
  const [error, setError] = React.useState("");
  const [renderElement, setRenderElement] = React.useState("register");
  const [pVisibility, setPVisibility] = React.useState(false);
  const [cPVisibility, setCPVisibility] = React.useState(false);

  const [formData, setFormData] = React.useState<FormDataType[]>([
    {
      title: "Name",
      placeholder: "Ex. John Doe",
      name: "name",
      value: "",
      type: "text",
      error: false,
    },
    {
      title: "Email",
      placeholder: "abc@email.com",
      name: "email",
      value: "",
      type: "email",
      error: false,
    },
    {
      title: "Password",
      placeholder: "********",
      name: "password",
      value: "",
      type: !pVisibility ? "password" : "text",
      error: false,
    },
    {
      title: "Re-enter Password",
      placeholder: "********",
      name: "confirmPassword",
      value: "",
      type: !cPVisibility ? "password" : "text",
      error: false,
    },
  ]);

  /**
   * If "value" key is empty then returns the "error" key value of each object of as true.
   * Otherwise it returns "error" key value as false.
   */
  const checkValidation = () => {
    const validateData = formData.map((item) => {
      if (item.value === "") {
        item.error = true;
        return item;
      } else {
        item.error = false;
        return item;
      }
    });
    return validateData;
  };

  // function runs on change in input value and stores the value in a useState hook called "formData"
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const filteredData = formData.map((item) => {
      if (item.name === event.target.name) {
        item.value = event.target.value;
        return item;
      } else {
        return item;
      }
    });
    setFormData(filteredData);
  };

  const generateOTP = async (email: string) => {
    setOtpSent(false);
    setLoading(true);
    try {
      const res = await axios.post("/otps/generate", {
        email,
        purpose: "register",
      });
      setOtpSent(true);
      setRenderElement("otp-sent");
      setPinId(res.data.id);
      setLoading(false);
      // console.log('success', res);
    } catch (error: any) {
      setOtpSent(false);
      setLoading(false);
      console.log("error generating otp", error);
      if (error.response.status === 409) {
        setError("user-already-exist");
      }
    }
  };

  // const verifyOTP = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   if (pin === "") {
  //     setError("pin-empty");
  //   }
  //   const otpdata = { id: pinId, code: pin };

  //   try {
  //     const res = await axios.post("/otps/verify", otpdata);
  //     // console.log('otp verification', res);
  //     Cookies.set("splay-token", res.data.token, { expires: 7, path: "/" });
  //     await registerUser();
  //   } catch (error: any) {
  //     setLoading(false);
  //     if (error?.response?.status === 401) {
  //       setError("invalid-otp");
  //       console.log("invalid-otp");
  //     }
  //     console.log("error verifying otp", error);
  //   }
  // };

  const registerUser = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const localstorage = localStorage.getItem("testUser");
    const parsedData = JSON.parse(localstorage as string);

    const userdata = {
      email: parsedData.email,
      name: parsedData.name,
      password: parsedData.password,
      otp: pin,
    };
    try {
      const res = await axios.post("/register", userdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("splay-token")}`,
        },
      });
      // console.log('success', res);
      setRenderElement("account-created");
      setOtpSent(false);
      setLoading(false);
      localStorage.removeItem("testUser");
      setTimeout(() => {
        navigate({ pathname: "/signin" });
      }, 800);
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status === 409) {
        setError("exists");
        console.log("exists");
      }
      console.log("error registration", error);
    }
  };

  /**
   * Validates the user input.
   * After validation, stores(registers) the user data in localStorage for later login flows.
   * If Validation fails, sets respective useState hooks with its respective error.
   */
  const handleSignUp = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const values = Object.fromEntries(
      //@ts-ignore
      new FormData(e.target as HTMLFormElement).entries()
    );
    if (values.name === "" || values.email === "" || values.password === "") {
      setFormData(checkValidation());
    } else if (
      values.password !== "" &&
      values.password !== values.confirmPassword
    ) {
      setFormData(checkValidation());
      setIncorrectPassword(true);
    } else {
      setFormData(checkValidation());
      setIncorrectPassword(false);
      await generateOTP(values.email as string);
      localStorage.setItem(
        "testUser",
        JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      );
      // setAccountCreated(true)
    }
  };

  // redirects the user to login page
  const handleSignInClick = () => {
    navigate({
      pathname: "/signin",
    });
  };

  const checkPasswordType = (val: string) => {
    if (val === "password") {
      if (pVisibility === true) {
        return "text";
      } else {
        return "password";
      }
    } else {
      if (cPVisibility === true) {
        return "text";
      } else {
        return "password";
      }
    }
  };

  const renderVisibiltyIcon = (val: string) => {
    if (val === "password") {
      if (pVisibility === true) {
        return "visibility_off";
      } else {
        return "visibility";
      }
    } else {
      if (cPVisibility === true) {
        return "visibility_off";
      } else {
        return "visibility";
      }
    }
  };

  return (
    <div className="auth-form">
      <p className="auth-header">
        {otpSent ? "Verify otp" : "Create an Account"}
      </p>
      <div style={{ maxHeight: "35rem" }}>
        {renderElement === "otp-sent" && (
          <form onSubmit={registerUser}>
            <div>
              <p className="input-title">Enter OTP</p>
              <input
                className="input-main"
                type={"password"}
                value={pin}
                onChange={(e: any) => setPin(e.target.value)}
                name={"pin"}
                placeholder="******"
                autoComplete="off"
              />
            </div>

            <div className="error-container">
              {error === "invalid-otp" && (
                <p className="error-text">Invalid OTP</p>
              )}
              {error === "exists" && (
                <p className="error-text">Email already exists</p>
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
              {loading ? <Loader /> : "Verify otp"}
            </button>
          </form>
        )}

        {renderElement === "account-created" && (
          <>
            <p className="register-success-heading">Account Created</p>
            <button
              className="large-primary-btn"
              style={{
                width: "100%",
              }}
              onClick={handleSignInClick}
            >
              Sign In
            </button>
          </>
        )}
        {renderElement === "register" && (
          <form onSubmit={handleSignUp}>
            {formData.map((item, index) => {
              return (
                <div key={index}>
                  <p className="input-title">{item.title}</p>
                  {item.type === "password" ? (
                    <div className="input-container">
                      <input
                        className="input-main"
                        autoComplete={"off"}
                        type={checkPasswordType(item.name)}
                        defaultValue={item?.value}
                        onChange={handleInputChange}
                        name={item.name}
                        placeholder={item.placeholder}
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
                          if (item.name === "password") {
                            setPVisibility(!pVisibility);
                          } else {
                            setCPVisibility(!cPVisibility);
                          }
                        }}
                        className="material-symbols-outlined"
                      >
                        {renderVisibiltyIcon(item.name)}
                      </span>
                    </div>
                  ) : (
                    <input
                      className="input-main"
                      autoComplete={"off"}
                      type={item.type}
                      defaultValue={item?.value}
                      onChange={handleInputChange}
                      name={item.name}
                      placeholder={item.placeholder}
                    />
                  )}

                  <div className="error-container">
                    {item.error && (
                      <p className="error-text required-error-text-space">
                        Required field!
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="error-container">
              {incorrectPassword && (
                <p className="error-text">Password doesn't match</p>
              )}
              {error === "user-already-exist" && (
                <p className="error-text">Email already exists</p>
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
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                className="large-secondary-btn"
                style={{
                  width: "100%",
                }}
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
