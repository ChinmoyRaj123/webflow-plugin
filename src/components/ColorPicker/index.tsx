import React from "react";
import "./colorpicker.css";

type ColorPickerProps = {
  name?: string;
  value?: string;
  onChange: any;
  label?: string;
};
const Index = (props: ColorPickerProps) => {
  var { value, onChange, label, name } = props;
  const [newValue, setNewValue] = React.useState(value);

  React.useEffect(() => {
    value = newValue;
  }, [newValue]);

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
        <input
          aria-label="color_picker_input"
          className="color-picker-input"
          type="color"
          id={name}
          name={name}
          value={newValue}
          // onChange={() => { onChange(); setReRender(Math.random() * 1000) }}
          onChange={(e) => {
            setNewValue(e.target.value);
          }}
          defaultValue={newValue}
          onInput={onChange}
        />

        <input
          aria-label="color_hex_input"
          className="color-hex-input"
          id={name}
          name={name}
          value={newValue}
          defaultValue={newValue}
          onInput={onChange}
          onChange={(e) => {
            setNewValue(e.target.value);
          }}
          // value={newValue}
          // defaultValue={newValue}
          // onInput={() => { onChange(); setReRender(Math.random() * 1000) }}
        />
      </div>
    </div>
  );
};

export default Index;
