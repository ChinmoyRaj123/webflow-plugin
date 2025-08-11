import React from "react";
import "./sizepicker.css";

type SizePickerProps = {
  name?: string;
  value?: string;
  onChange?: any;
  label?: string;
};

const Index = (props: SizePickerProps) => {
  const { label, name, value, onChange } = props;

  const rendericon = () => {
    if (name?.includes("margin")) {
      return (
        <button style={{ border: "none", background: "transparent" }}>
          <span className="material-symbols-outlined icon_image">padding</span>
        </button>
      );
    }
    if (name?.includes("opacity")) {
      return (
        <button style={{ border: "none", background: "transparent" }}>
          <span className="material-symbols-outlined icon_image">opacity</span>
        </button>
      );
    }
    if (name?.includes("padding")) {
      return (
        <button style={{ border: "none", background: "transparent" }}>
          <span className="material-symbols-outlined icon_image">padding</span>
        </button>
      );
    }
    if (name?.includes("radius")) {
      return (
        <button style={{ border: "none", background: "transparent" }}>
          <span className="material-symbols-outlined icon_image">
            line_curve
          </span>
        </button>
      );
    }
    if (name?.includes("spacing")) {
      return (
        <button style={{ border: "none", background: "transparent" }}>
          <span className="material-symbols-outlined icon_image">
            format_line_spacing
          </span>
        </button>
      );
    }
  };

  const renderUnit = () => {
    if (name?.includes("scale")) {
      return <p className="label">X</p>;
    } else if (name?.includes("opacity")) {
      return <p className="label">%</p>;
    } else {
      return <p className="label">PX</p>;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: "1rem",
      }}
    >
      <p className="body placeholder">{label}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "0.5rem",
        }}
      >
        {rendericon()}
        <div className="size-input-wrapper" style={{ position: "relative" }}>
          <input
            aria-label="size_picker_input"
            className="size-input"
            type="number"
            name={name}
            defaultValue={value}
            min={"0"}
            max={"100"}
            step={"any"}
            onInput={onChange}
          />
          <div
            className="input-unit"
            style={{
              position: "absolute",
              top: "50%",
              right: "2%",
              transform: "translate(-50%,-50%)",
              zIndex: "-1",
            }}
          >
            {renderUnit()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
