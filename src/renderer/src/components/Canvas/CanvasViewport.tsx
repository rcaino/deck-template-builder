import React from "react";
import RootLayer from "./Layers/RootLayer";
import cardFront from "../../assets/default_project_template/card-front-border.png";

interface CanvasViewportProps {
  zoomLevel: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasPPC?: number;
  canvasPPI?: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

const viewportStyle: React.CSSProperties = {
  backgroundColor: "var(--ant-color-bg-layout)",
  width: "100%",
  height: "100%",
  overflow: "auto"
};

const CanvasViewport: React.FC<CanvasViewportProps> = ({
  zoomLevel,
  canvasWidth,
  canvasHeight,
  canvasPPC,
  canvasPPI,
  canvasRef,
  viewportRef
}) => {
  // --- Render ---
  const viewAdjustFactor =
    (0.95 * 95 * window.devicePixelRatio) / (canvasPPC ? canvasPPC * 2.54 : (canvasPPI ?? 254));

  return (
    <div style={viewportStyle} ref={viewportRef}>
      <RootLayer
        layerProps={{
          style: { backgroundImage: cardFront },
          size: { height: canvasHeight, width: canvasWidth },
          position: { x: 0, y: 0 },
          id: "root",
          name: "Root",
          type: "root",
          ppc: canvasPPC ?? (canvasPPI ?? 254) / 2.54
        }}
        scale={zoomLevel * viewAdjustFactor}
        ref={canvasRef}
      />
    </div>
  );
};

export default CanvasViewport;
