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
        <span className="material-symbols-outlined icon_image">padding</span>
      );
    }
    if (name?.includes("opacity")) {
      return (
        <span className="material-symbols-outlined icon_image">opacity</span>
      );
    }
    if (name?.includes("padding")) {
      return (
        <span className="material-symbols-outlined icon_image">padding</span>
      );
    }
    if (name?.includes("radius")) {
      return (
        <span className="material-symbols-outlined icon_image">line_curve</span>
      );
    }
    if (name?.includes("spacing")) {
      return (
        <span className="material-symbols-outlined icon_image">
          format_line_spacing
        </span>
      );
    }
  };

  const renderUnit = () => {
    if (name?.includes("scale")) {
      return <p className="label">x</p>;
    } else if (name?.includes("opacity")) {
      return <p className="label">%</p>;
    } else {
      return <p className="label">px</p>;
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

        <input
          className="size-input"
          type="number"
          name={name}
          defaultValue={value}
          min={"0"}
          max={"100"}
          step={"any"}
          // value={value}
          // onChange={onChange}
          onInput={onChange}
        />

        {renderUnit()}
      </div>
    </div>
  );
};

export default Index;
