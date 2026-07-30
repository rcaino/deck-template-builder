import React, { useState } from "react";
import { Slider, Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useLocalConfigStore } from "../../../store/useLocalConfigStore";

interface CalibrateProps {
  onClose: () => void;
}

export const Calibrate: React.FC<CalibrateProps> = ({ onClose }) => {
  const canvasLocalScaleToReal = useLocalConfigStore((state) => state.canvasLocalScaleToReal);
  const setCanvasLocalScaleToReal = useLocalConfigStore((state) => state.setCanvasLocalScaleToReal);

  const [tempMultiplier, setTempMultiplier] = useState<number>(canvasLocalScaleToReal);

  const CARD_WIDTH_CM = 8.56;
  const CARD_HEIGHT_CM = 5.398;
  const CM_TO_PX = 96 / 2.54;

  const visualWidth = CARD_WIDTH_CM * CM_TO_PX * window.devicePixelRatio * tempMultiplier;
  const visualHeight = CARD_HEIGHT_CM * CM_TO_PX * window.devicePixelRatio * tempMultiplier;

  const handleConfirm = async (): Promise<void> => {
    await setCanvasLocalScaleToReal(tempMultiplier);
    onClose();
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#161D31",
        color: "#B4B7BD",
        padding: "30px",
        borderRadius: "1px",
        border: "1px solid #324e9c",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <h3 style={{ color: "#FFFFFF", margin: "0 0 8px 0", fontSize: "16px", fontWeight: 500 }}>
        Ajuste de Calibración
      </h3>

      <p style={{ fontSize: "12px", color: "#676D7D", marginBottom: "24px", lineHeight: "1.4" }}>
        Coloque su tarjeta física sobre la pantalla y mueva la barra hasta que la silueta coincida.
      </p>

      <div
        style={{
          height: "70vh",
          maxHeight: "460px",
          width: "100%",
          maxWidth: "720px",
          margin: "0 auto 24px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F1422",
          borderRadius: "4px",
          boxSizing: "border-box",
          overflow: "auto",
          padding: "40px"
        }}
      >
        <div
          style={{
            width: `${visualWidth}px`,
            height: `${visualHeight}px`,
            border: "1px dashed #7367F0",
            borderRadius: "4px",
            position: "relative",
            flexShrink: 0
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "-25px",
              left: "0",
              right: "0",
              textAlign: "center",
              fontSize: "11px",
              color: "#676D7D",
              whiteSpace: "nowrap"
            }}
          >
            {CARD_WIDTH_CM} cm
          </span>

          <span
            style={{
              position: "absolute",
              right: "-10px",
              top: "50%",
              transform: "translate(100%, -50%) rotate(90deg)",
              transformOrigin: "left center",
              fontSize: "11px",
              color: "#676D7D",
              whiteSpace: "nowrap"
            }}
          >
            {CARD_HEIGHT_CM} cm
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px" }}>
          <ZoomOutOutlined
            style={{
              color: tempMultiplier <= 0.5 ? "#3d4251" : "#676D7D",
              fontSize: "16px",
              cursor: tempMultiplier <= 0.5 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (tempMultiplier > 0.5) {
                setTempMultiplier(Number((tempMultiplier - 0.01).toFixed(2)));
              }
            }}
          />
          <Slider
            min={0.5}
            max={2}
            step={0.01}
            value={tempMultiplier}
            onChange={(value) => setTempMultiplier(value as number)}
            style={{ flex: 1, margin: "10px 0" }}
            tooltip={{ formatter: (v) => `x${v?.toFixed(2)}` }}
          />
          <ZoomInOutlined
            style={{
              color: tempMultiplier >= 2.0 ? "#3d4251" : "#676D7D",
              fontSize: "16px",
              cursor: tempMultiplier >= 2.0 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (tempMultiplier < 2.0) {
                setTempMultiplier(Number((tempMultiplier + 0.01).toFixed(2)));
              }
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <Button
          onClick={onClose}
          style={{
            flex: 1,
            backgroundColor: "#283046",
            color: "#B4B7BD",
            border: "1px solid #404656",
            borderRadius: "4px",
            height: "36px"
          }}
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleConfirm}
          style={{
            flex: 1,
            backgroundColor: "#7367F0",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontWeight: 500,
            height: "36px"
          }}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};
