import React from "react";
import "./plancard.css";
import IconButton from "../IconButton";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../utils/axios-instance";
import { decodeBase64 } from "../../utils/base64";

type PlancardProps = {
  id: string;
  title: string;
  planName: string;
  metadata: any;
  usage?: any;
  amout: string;
  currency: string;
  maxStorage: number;
  maxPlays: number;
};

const Index = (props: PlancardProps) => {
  const navigate = useNavigate();

  const {
    id,
    title,
    planName,
    metadata,
    usage,
    amout,
    currency,
    maxPlays,
    maxStorage,
  } = props;
  // const s_subs = decodeBase64(Cookies.get("s_subs") as string);
  const s_subs = decodeBase64(JSON.parse(localStorage.getItem("s_subs")));
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

  const subscriptionToSplay = async () => {
    try {
      const res = await axios.get(`/subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate({
        pathname: "/checkout",
        search: `?planid=${id}&s_id=${res.data.provider_subscription_id}`,
      });
    } catch (error) {
      console.log("error in subscription", error);
    }
  };

  return (
    <div className="plancard-container">
      <p className="label">{title}</p>
      <p className="subtitle-two" style={{ marginTop: "2rem" }}>
        {currency + " " + amout}
      </p>

      <div className="plancard-title">
        <div style={{ width: "20%" }}>
          <IconButton>
            <span className="material-symbols-outlined white">flag</span>
          </IconButton>
        </div>
        <div style={{ width: "80%" }}>
          <p className="subtitle-one" style={{ marginLeft: "2rem" }}>
            {planName}
          </p>
        </div>
      </div>

      <div className="plancard-feature">
        <div style={{ width: "20%" }}>
          <IconButton>
            <span className="material-symbols-outlined white">done</span>
          </IconButton>
        </div>
        <div style={{ width: "80%" }}>
          <p className="body" style={{ marginLeft: "2rem" }}>
            Bandwidth :{metadata?.bandwidth}
          </p>
        </div>
      </div>

      <div className="plancard-feature">
        <div style={{ width: "20%" }}>
          <IconButton>
            <span className="material-symbols-outlined white">done</span>
          </IconButton>
        </div>
        <div style={{ width: "80%" }}>
          <p className="body" style={{ marginLeft: "2rem" }}>
            Plays :{maxPlays}
          </p>
        </div>
      </div>

      <div className="plancard-feature">
        <div style={{ width: "20%" }}>
          <IconButton>
            <span className="material-symbols-outlined white">done</span>
          </IconButton>
        </div>
        <div style={{ width: "80%" }}>
          <p className="body" style={{ marginLeft: "2rem" }}>
            Storage :{maxStorage}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", marginTop: "2rem" }}>
        <button
          className="large-primary-btn"
          style={{
            width: "100%",
          }}
          onClick={subscriptionToSplay}
        >
          {id === s_subs ? "Current Plan" : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default Index;
