import React, { useState } from "react";
import { Slider, Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useLocalConfigStore } from "../../../store/useLocalConfigStore";

interface CalibrateProps {
  onClose: () => void;
}

export const Calibrate: React.FC<CalibrateProps> = ({ onClose }) => {
  const { canvasLocalScaleToReal, setCanvasLocalScaleToReal } = useLocalConfigStore();
  const [tempMultiplier, setTempMultiplier] = useState<number>(canvasLocalScaleToReal);

  const CARD_WIDTH_CM = 8.56;
  const CARD_HEIGHT_CM = 5.398;
  const CM_TO_PX = 96 / 2.54;

  const visualWidth = CARD_WIDTH_CM * CM_TO_PX * window.devicePixelRatio * tempMultiplier;
  const visualHeight = CARD_HEIGHT_CM * CM_TO_PX * window.devicePixelRatio * tempMultiplier;

  const handleConfirm = async (): Promise<void> => {
    setCanvasLocalScaleToReal(tempMultiplier);
    try {
      await fetch("http://localhost:3000/LocalConfig", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasLocalScaleToReal: tempMultiplier })
      });
    } catch (error) {
      console.error("Error guardando configuración:", error);
    }
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
        border: "1px solid #324e9c"
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
          height: "460px",
          width: "720px",
          margin: "0 auto 24px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          backgroundColor: "#0F1422",
          borderRadius: "4px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: `${visualWidth}px`,
            height: `${visualHeight}px`,
            border: "1px dashed #7367F0",
            borderRadius: "4px",
            position: "relative"
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: "-22px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
              color: "#676D7D"
            }}
          >
            {CARD_WIDTH_CM} cm
          </span>
          <span
            style={{
              position: "absolute",
              right: "-52px",
              top: "50%",
              transform: "translateY(-50%) rotate(90deg)",
              fontSize: "11px",
              color: "#676D7D"
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
