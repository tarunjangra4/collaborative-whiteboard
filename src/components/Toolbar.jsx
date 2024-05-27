import React from "react";

const Toolbar = ({ onColorChange, onBrushSizeChange, onClearCanvas }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <div>
        <label>Brush Color: </label>
        <input type="color" onChange={(e) => onColorChange(e.target.value)} />
      </div>
      <div>
        <label>Brush Size: </label>
        <input
          type="number"
          min="1"
          max="100"
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
        />
      </div>
      <button onClick={onClearCanvas}>Clear Canvas</button>
    </div>
  );
};

export default Toolbar;
