import React, { useState } from "react";
import { Slider, Button, theme } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useLocalConfigStore } from "../../../store/useLocalConfigStore";

interface CalibrateProps {
  onClose: () => void;
}

export const Calibrate: React.FC<CalibrateProps> = ({ onClose }) => {
  const { token } = theme.useToken();

  const canvasLocalScaleToReal = useLocalConfigStore((state) => state.canvasLocalScaleToReal);
  const setCanvasLocalScaleToReal = useLocalConfigStore((state) => state.setCanvasLocalScaleToReal);

  const [widthMultiplier, setWidthMultiplier] = useState<number>(canvasLocalScaleToReal?.x || 1.0);
  const [heightMultiplier, setHeightMultiplier] = useState<number>(
    canvasLocalScaleToReal?.y || 1.0
  );

  const [showWidthTooltip, setShowWidthTooltip] = useState<boolean>(false);
  const [showHeightTooltip, setShowHeightTooltip] = useState<boolean>(false);

  const CARD_WIDTH_CM = 8.56;
  const CARD_HEIGHT_CM = 5.398;
  const CM_TO_PX = 96 / 2.54;
  const MAX_SCALE = 1.5;

  const visualWidth = CARD_WIDTH_CM * CM_TO_PX * window.devicePixelRatio * widthMultiplier;
  const visualHeight = CARD_HEIGHT_CM * CM_TO_PX * window.devicePixelRatio * heightMultiplier;

  const maxCardWidth = CARD_WIDTH_CM * CM_TO_PX * window.devicePixelRatio * MAX_SCALE;
  const maxCardHeight = CARD_HEIGHT_CM * CM_TO_PX * window.devicePixelRatio * MAX_SCALE;

  const handleConfirm = async (): Promise<void> => {
    await setCanvasLocalScaleToReal({
      x: widthMultiplier,
      y: heightMultiplier
    });
    onClose();
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: token.colorBgLayout,
        color: token.colorText,
        padding: "20px",
        borderRadius: "1px",
        border: `1px solid ${token.colorBorder}`,
        width: "fit-content",
        margin: "0 auto",
        boxSizing: "border-box"
      }}
    >
      <h3
        style={{ color: token.colorText, margin: "0 0 8px 0", fontSize: "16px", fontWeight: 500 }}
      >
        Ajuste de Calibración
      </h3>

      <p
        style={{
          fontSize: "12px",
          color: token.colorTextPlaceholder,
          marginBottom: "24px",
          lineHeight: "1.4"
        }}
      >
        Coloque su tarjeta física sobre la pantalla y mueva las barras hasta que la silueta
        coincida.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 40px",
          gridTemplateRows: "auto 40px",
          gap: "16px",
          width: `${maxCardWidth + 50 + 40 + 16}px`,
          margin: "0 auto 24px auto",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            gridArea: "1 / 1 / 2 / 2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: token.colorBgLayout,
            borderRadius: "4px",
            boxSizing: "border-box",
            width: `${maxCardWidth + 50}px`,
            height: `${maxCardHeight + 50}px`,
            margin: "0 auto",
            position: "relative"
          }}
        >
          <div
            style={{
              width: `${visualWidth}px`,
              height: `${visualHeight}px`,
              border: `1px dashed ${token.colorPrimary}`,
              borderRadius: "4px",
              position: "relative",
              flexShrink: 0,
              transition: "width 0.1s ease, height 0.1s ease"
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: "8px",
                left: "0",
                right: "0",
                textAlign: "center",
                fontSize: "11px",
                color: token.colorPrimary,
                fontWeight: "500",
                whiteSpace: "nowrap",
                pointerEvents: "none"
              }}
            >
              {CARD_WIDTH_CM} cm
            </span>

            <span
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "11px",
                color: token.colorPrimary,
                fontWeight: "500",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                writingMode: "vertical-rl"
              }}
            >
              {CARD_HEIGHT_CM} cm
            </span>
          </div>
        </div>

        <div
          style={{
            gridArea: "1 / 2 / 2 / 3",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            boxSizing: "border-box",
            height: "100%"
          }}
          onMouseEnter={() => setShowHeightTooltip(true)}
          onMouseLeave={() => setShowHeightTooltip(false)}
        >
          <ZoomInOutlined
            style={{
              color:
                heightMultiplier >= 1.5 ? token.colorBorderSecondary : token.colorTextDescription,
              fontSize: "16px",
              cursor: heightMultiplier >= 1.5 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (heightMultiplier < 1.5) {
                setHeightMultiplier(Number((heightMultiplier + 0.01).toFixed(2)));
              }
            }}
          />
          <Slider
            vertical
            min={0.5}
            max={1.5}
            step={0.01}
            value={heightMultiplier}
            onChange={(value) => setHeightMultiplier(value as number)}
            style={{ flex: 1, margin: "12px 0" }}
            tooltip={{
              formatter: (v) => `Alto: x${v?.toFixed(2)}`,
              open: showHeightTooltip
            }}
          />
          <ZoomOutOutlined
            style={{
              color:
                heightMultiplier <= 0.5 ? token.colorBorderSecondary : token.colorTextDescription,
              fontSize: "16px",
              cursor: heightMultiplier <= 0.5 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (heightMultiplier > 0.5) {
                setHeightMultiplier(Number((heightMultiplier - 0.01).toFixed(2)));
              }
            }}
          />
        </div>

        <div
          style={{
            gridArea: "2 / 1 / 3 / 2",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 12px",
            width: `${maxCardWidth + 50}px`,
            margin: "0 auto",
            boxSizing: "border-box"
          }}
          onMouseEnter={() => setShowWidthTooltip(true)}
          onMouseLeave={() => setShowWidthTooltip(false)}
        >
          <ZoomOutOutlined
            style={{
              color:
                widthMultiplier <= 0.5 ? token.colorBorderSecondary : token.colorTextDescription,
              fontSize: "16px",
              cursor: widthMultiplier <= 0.5 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (widthMultiplier > 0.5) {
                setWidthMultiplier(Number((widthMultiplier - 0.01).toFixed(2)));
              }
            }}
          />
          <Slider
            min={0.5}
            max={1.5}
            step={0.01}
            value={widthMultiplier}
            onChange={(value) => setWidthMultiplier(value as number)}
            style={{ flex: 1, margin: 0 }}
            tooltip={{
              formatter: (v) => `Ancho: x${v?.toFixed(2)}`,
              open: showWidthTooltip
            }}
          />
          <ZoomInOutlined
            style={{
              color:
                widthMultiplier >= 1.5 ? token.colorBorderSecondary : token.colorTextDescription,
              fontSize: "16px",
              cursor: widthMultiplier >= 1.5 ? "not-allowed" : "pointer"
            }}
            onClick={() => {
              if (widthMultiplier < 1.5) {
                setWidthMultiplier(Number((widthMultiplier + 0.01).toFixed(2)));
              }
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          width: `${maxCardWidth + 50 + 40 + 16}px`,
          margin: "0 auto"
        }}
      >
        <Button
          onClick={onClose}
          style={{
            flex: 1,
            border: "none",
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
