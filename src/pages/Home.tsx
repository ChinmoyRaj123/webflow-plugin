import React from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import CreatePlayer from "../components/CreatePlayer";
import axios from "../utils/axios-instance";
import Cookies from "js-cookie";
// import { videoUrlUpdate, videoUrlExtensionUpdate } from "./Detail";
import { encodeBase64 } from "../utils/base64";

/**
 * This page will render after login the system(i.e home page).
 * Artists data are listed in this page.
 * Artist data can be search, filter from this page,
 * Card component is used which renders the profile card.
 * Count Card component is used which renders music platform analytics card.
 * Dropdown component is used which renders dropdown to filter the data by gender and country.
 * Error component is used which renders no artist found or error fetching data.
 */

const Home = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState(false);
  const [refetch, setRefetch] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const accessToken = JSON.parse(localStorage.getItem("s-token"));

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`/subscriptions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data?.subscription?.status === "active") {
        localStorage.setItem(
          "s_subs",
          encodeBase64(res.data.subscription?.plan_id)
        );
        Cookies.set("s_subs", encodeBase64(res.data.subscription?.plan_id), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        // navigate({
        //   pathname: "/checkout",
        //   search: `?planid=${res.data.subscription?.plan_id}&s_id=${res.data.subscription?.provider?.subscription_id}`,
        // });
      }
    } catch (error: any) {
      console.log("error in subscription", error);
      // if (error?.response?.status === 404) {
      //   navigate("/plans");
      // }
    }
  };

  const fetchPlayer = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get("/players", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log("error fetching player", error);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  React.useEffect(() => {
    fetchPlayer();
    // videoUrlUpdate.value = "";
    // videoUrlExtensionUpdate.value = "";
  }, [refetch]);

  const searchData =
    data &&
    data.filter((item: any) => {
      if (searchTitle === "") {
        return item;
      } else if (item.name.toLowerCase().includes(searchTitle?.toLowerCase())) {
        return item;
      }
    });

  //redirects the user to detail page when interacted with card button.
  const handleCardClick = (id: string) => {
    navigate({ pathname: "/detail", search: `?video=${id}` });
  };

  // if (isLoading)
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       {/* <Loader
  //         height="64px"
  //         width="64px"
  //         borderColor="#f0f0f0"
  //         borderBottom="#000000"
  //       /> */}
  //       <p>Loader</p>
  //     </div>
  //   );

  // if (error) return <Error errorMessage="Error fetching data" />;

  return (
    <div className="home-layout">
      <div className="home-header">
        <input
          className="input-main"
          type={"text"}
          name={"search"}
          placeholder={"Search"}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      {searchData === null || searchData.length === 0 ? (
        <CreatePlayer width="100%" setRefetch={setRefetch} />
      ) : (
        <div className="home-card-grid">
          {searchData.map((item: any, index: number) => {
            return (
              <div style={{ width: "100%", aspectRatio: "16/9" }} key={index}>
                <VideoCard
                  data={item}
                  setRefetch={setRefetch}
                  handleCardClick={handleCardClick}
                />
              </div>
            );
          })}

          <div style={{ width: "100%", aspectRatio: "16/9" }}>
            <CreatePlayer width="100%" setRefetch={setRefetch} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
