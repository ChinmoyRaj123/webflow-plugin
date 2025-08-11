import React from "react";
import "./toggle.css";

type ToggleProps = {
  name?: string;
  checked?: boolean;
  onChange: any;
  label?: string;
};

const Toggle = ({ checked, onChange, label, name }: ToggleProps) => {
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

      <label className="toggle-container">
        <input
          aria-label="toggle_input"
          name={name}
          className="toggle-button"
          type="checkbox"
          defaultChecked={checked}
          checked={checked}
          onClick={onChange}
        />
        <span className="toggle-circle"></span>
      </label>
    </div>
  );
};

export default Toggle;
