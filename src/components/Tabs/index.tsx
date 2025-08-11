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
      <button
        type="button"
        aria-label="arrow left"
        className="arrow arrow-left"
      >
        <img
          onClick={() => scrollTabs(-150)}
          style={{ width: "100%", height: "100%" }}
          src={"./icon/chevron_left.svg"}
          alt="left_arrow"
        ></img>
      </button>
      <div className="tabs-wrapper">
        <div className="tabs">
          {data.map((item, index) => {
            return (
              <button
                type="button"
                aria-label={item.name}
                key={index}
                className={`tab ${item.name === activeItem ? "active" : ""}`}
                style={{ paddingBottom: "4px", background: "transparent" }}
                onClick={() => {
                  setActiveItem(item.name);
                  setActiveTab(item.name);
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        aria-label="arrow right"
        className="arrow arrow-right"
      >
        <img
          onClick={() => scrollTabs(150)}
          style={{ width: "100%", height: "100%" }}
          src={"./icon/chevron_right.svg"}
          alt="right_arrow"
        ></img>
      </button>
    </div>
  );
};

export default Tabs;
