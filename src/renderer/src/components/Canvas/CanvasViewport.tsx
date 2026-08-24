import React, { useMemo, useRef } from "react";
import { useTemplateStore } from "../../store/useTemplateStore";
import { DataType, ILevelLayer } from "@common/types";
import RootLayer from "./Layers/RootLayer";
import AreaLayer from "./Layers/AreaLayer";
import FieldLayer from "./Layers/FieldLayer";
import { Modal, ConfigProvider } from "antd";
import { Calibrate } from "./Layers/Calibrate";
import { useLocalConfigStore } from "../../store/useLocalConfigStore";

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
  overflow: "auto",
  position: "relative"
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
  const canvasLocalScaleToReal = useLocalConfigStore((state) => state.canvasLocalScaleToReal);
  const isCalibrateModalOpen = useLocalConfigStore((state) => state.isCalibrateModalOpen);
  const setIsCalibrateModalOpen = useLocalConfigStore((state) => state.setIsCalibrateModalOpen);

  const layers = useTemplateStore((state) => state.layers);
  const rootFromStore = layers["root"];

  const baseAdjustFactor =
    ((96 / 2.54) * window.devicePixelRatio) / (canvasPPC ?? (canvasPPI ? canvasPPI / 2.54 : 100));

  const finalScaleObject = useMemo<{ x: number; y: number }>(
    () => ({
      x: zoomLevel * baseAdjustFactor * (canvasLocalScaleToReal?.x ?? 1.0),
      y: zoomLevel * baseAdjustFactor * (canvasLocalScaleToReal?.y ?? 1.0)
    }),
    [zoomLevel, baseAdjustFactor, canvasLocalScaleToReal?.x, canvasLocalScaleToReal?.y]
  );

  const layerRef = useRef<HTMLDivElement>(null);

  const renderLayerChildren = (parentId: string): React.ReactNode[] => {
    return Object.values(layers)
      .filter((layer): layer is ILevelLayer => layer.type !== "root" && layer.parentId === parentId)
      .sort((a, b) => a.level - b.level)
      .map((layer) => {
        if (layer.type === "area") {
          return (
            <AreaLayer
              ref={layerRef}
              key={layer.id}
              {...layer}
              scale={finalScaleObject}
              isRoot={false}
            >
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
              scale={finalScaleObject}
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
          style: rootFromStore?.style,
          size: { height: canvasHeight, width: canvasWidth },
          position: { x: 0, y: 0 },
          id: "root",
          name: "Root",
          type: "root",
          ppc: canvasPPC ?? (canvasPPI ?? 254) / 2.54
        }}
        scale={finalScaleObject}
        ref={canvasRef}
      >
        {renderLayerChildren("root")}
      </RootLayer>

      <ConfigProvider
        theme={{
          components: {
            Modal: {
              contentBg: "transparent",
              paddingMD: 0,
              paddingLG: 0,
              boxShadow: "none"
            }
          }
        }}
      >
        <Modal
          open={isCalibrateModalOpen}
          onCancel={() => setIsCalibrateModalOpen(false)}
          footer={null}
          closable={false}
          centered
          destroyOnClose
          width={825}
        >
          <Calibrate onClose={() => setIsCalibrateModalOpen(false)} />
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default CanvasViewport;
