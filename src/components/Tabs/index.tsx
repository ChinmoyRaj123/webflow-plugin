import React from "react";
import "./tabs.css";

const Tabs = ({ data, setActiveTab }: any) => {
  const [activeItem, setActiveItem] = React.useState<any>(data[0].name);

  React.useEffect(() => {
    console.log("activeItem", activeItem);
  }, [activeItem]);

  function scrollTabs(amount: number) {
    const tabs = document.querySelector(".tabs");
    tabs.scrollLeft += amount;
  }

  return (
    <div className="tabs-container">
      <span className=" arrow arrow-left">
        <img
          onClick={() => scrollTabs(-150)}
          style={{ width: "100%", height: "100%" }}
          src={"./icon/chevron_left.svg"}
        ></img>
      </span>
      <div className="tabs-wrapper">
        <div className="tabs">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className={`tab ${item.name === activeItem ? "active" : ""}`}
                style={{ paddingBottom: "4px" }}
                onClick={() => {
                  setActiveItem(item.name);
                  setActiveTab(item.name);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
      <span className=" arrow arrow-right">
        <img
          onClick={() => scrollTabs(150)}
          style={{ width: "100%", height: "100%" }}
          src={"./icon/chevron_right.svg"}
        ></img>
      </span>
    </div>
  );
};

export default Tabs;
