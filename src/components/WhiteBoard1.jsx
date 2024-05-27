import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import Toolbar from "./Toolbar";

const WhiteBoard1 = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      selection: true,
      hoverCursor: "pointer",
      height: 800,
      width: 800,
      backgroundColor: "pink",
    });

    canvasInstance.freeDrawingBrush.width = 3;
    canvasInstanceRef.current = canvasInstance;

    canvasInstance.on("object:added", handleObjectAdded);
    canvasInstance.on("after:render", handleAfterRender);

    socket.on("message", handleMessage);
    socket.on("error", handleError);

    return cleanupCanvas;
  }, [socket, roomId]);

  const handleMessage = (message) => {
    const canvasInstance = canvasInstanceRef.current;
    if (!canvasInstance || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    canvasInstance.clear();
    canvasInstance.loadFromJSON(message?.message, () => {
      canvasInstance.renderAll();
      isUpdatingRef.current = false;
    });
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const cleanupCanvas = () => {
    const canvasInstance = canvasInstanceRef.current;
    if (!canvasInstance) return;

    socket.off("message", handleMessage);
    socket.off("error", handleError);

    canvasInstance.off("object:added", handleObjectAdded);
    canvasInstance.off("after:render", handleAfterRender);

    canvasInstance.clear();
    canvasInstance.dispose();
    canvasInstanceRef.current = null;
  };

  const handleObjectAdded = () => {
    if (!isUpdatingRef.current) {
      saveDrawing();
    }
  };

  const handleAfterRender = () => {
    if (!isUpdatingRef.current) {
      saveDrawing();
    }
  };

  const saveDrawing = () => {
    const canvasInstance = canvasInstanceRef.current;
    if (!canvasInstance) return;

    const json = canvasInstance.toJSON();
    socket.emit("canvas", {
      username: "User",
      room: roomId,
      message: json,
    });
  };

  const handleColorChange = (color) => {
    const canvasInstance = canvasInstanceRef.current;
    if (canvasInstance) {
      canvasInstance.freeDrawingBrush.color = color;
    }
  };

  const handleBrushSizeChange = (size) => {
    const canvasInstance = canvasInstanceRef.current;
    if (canvasInstance) {
      canvasInstance.freeDrawingBrush.width = size;
    }
  };

  const handleClearCanvas = () => {
    const canvasInstance = canvasInstanceRef.current;
    if (canvasInstance) {
      canvasInstance.clear();
      canvasInstance.backgroundColor = "pink";
      saveDrawing();
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Toolbar
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onClearCanvas={handleClearCanvas}
      />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard1;
