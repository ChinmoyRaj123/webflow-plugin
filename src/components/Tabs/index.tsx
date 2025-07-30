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
      <span
        className="material-symbols-outlined arrow arrow-left"
        style={{ cursor: "default", fontSize: "1.45rem" }}
        onClick={() => scrollTabs(-150)}
      >
        keyboard_arrow_left
      </span>
      <div className="tabs-wrapper">
        <div className="tabs">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className={`tab ${item.name === activeItem ? "active" : ""}`}
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
      <span
        className="material-symbols-outlined arrow arrow-right"
        style={{ cursor: "default", fontSize: "1.45rem" }}
        onClick={() => scrollTabs(150)}
      >
        keyboard_arrow_right
      </span>
    </div>
  );
};

export default Tabs;
