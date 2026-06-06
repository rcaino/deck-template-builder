import React, { useRef } from "react";
import { useTemplateStore } from "../../store/useTemplateStore";
import { DataType, ILevelLayer } from "@common/types";
import RootLayer from "./Layers/RootLayer";
import AreaLayer from "./Layers/AreaLayer";
import FieldLayer from "./Layers/FieldLayer";
import cardFront from "../../assets/default_project_template/card-front-border.png";

interface CanvasViewportProps {
  zoomLevel: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasPPC?: number;
  canvasPPI?: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  cardData?: Record<string, DataType>;
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
  viewportRef,
  cardData
}) => {
  const layers = useTemplateStore((state) => state.layers);
  const rootFromStore = layers["root"];
  const viewAdjustFactor =
    (0.95 * 95 * window.devicePixelRatio) / (canvasPPC ? canvasPPC * 2.54 : (canvasPPI ?? 254));

  const finalScale = zoomLevel * viewAdjustFactor;
  const layerRef = useRef<HTMLDivElement>(null);
  const renderLayerChildren = (parentId: string): React.ReactNode[] => {
    return Object.values(layers)
      .filter((layer): layer is ILevelLayer => layer.type !== "root" && layer.parentId === parentId)
      .sort((a, b) => a.level - b.level)
      .map((layer) => {
        if (layer.type === "area") {
          return (
            <AreaLayer ref={layerRef} key={layer.id} {...layer} scale={finalScale} isRoot={false}>
              {renderLayerChildren(layer.id)}
            </AreaLayer>
          );
        }

        if (layer.type === "data") {
          return (
            <FieldLayer
              ref={layerRef}
              key={layer.id}
              {...layer}
              scale={finalScale}
              cardData={cardData}
            />
          );
        }

        return null;
      });
  };

  return (
    <div style={viewportStyle} ref={viewportRef}>
      <RootLayer
        layerProps={{
          style: rootFromStore?.style || { backgroundImage: cardFront },
          size: { height: canvasHeight, width: canvasWidth },
          position: { x: 0, y: 0 },
          id: "root",
          name: "Root",
          type: "root",
          ppc: canvasPPC ?? (canvasPPI ?? 254) / 2.54
        }}
        scale={finalScale}
        ref={canvasRef}
      >
        {renderLayerChildren("root")}
      </RootLayer>
    </div>
  );
};

export default CanvasViewport;
