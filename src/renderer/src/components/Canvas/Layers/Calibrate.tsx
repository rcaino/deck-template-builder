import React, { useState } from "react";
import { Slider, Button, theme } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useLocalConfigStore } from "../../../store/useLocalConfigStore";
import { usePreferencesStore } from "../../../store/usePreferencesStore"; // Importas tu store de unidades
import { useI18n } from "../../../hooks/useI18n";

interface CalibrateProps {
  onClose: () => void;
}

const MAX_SCALE = 1.5;
const MIN_SCALE = 0.5;

export const Calibrate: React.FC<CalibrateProps> = ({ onClose }) => {
  const { token } = theme.useToken();
  const { t } = useI18n();

  const unit = usePreferencesStore((state) => state.unit);
  const isInch = unit === "in";
  // Size of a standard debit card
  const CARD_WIDTH = isInch ? 3.37 : 8.56;
  const CARD_HEIGHT = isInch ? 2.125 : 5.398;

  const SCALE_FACTOR = isInch ? 96 : 96 / 2.54;
  const unitLabel = isInch ? "in" : "cm";

  const canvasLocalScaleToReal = useLocalConfigStore((state) => state.canvasLocalScaleToReal);
  const setCanvasLocalScaleToReal = useLocalConfigStore((state) => state.setCanvasLocalScaleToReal);
  const [widthMultiplier, setWidthMultiplier] = useState<number>(canvasLocalScaleToReal?.x || 1.0);
  const [heightMultiplier, setHeightMultiplier] = useState<number>(
    canvasLocalScaleToReal?.y || 1.0
  );
  const [showWidthTooltip, setShowWidthTooltip] = useState<boolean>(false);
  const [showHeightTooltip, setShowHeightTooltip] = useState<boolean>(false);

  const visualWidth = CARD_WIDTH * SCALE_FACTOR * window.devicePixelRatio * widthMultiplier;
  const visualHeight = CARD_HEIGHT * SCALE_FACTOR * window.devicePixelRatio * heightMultiplier;
  const maxCardWidth = CARD_WIDTH * SCALE_FACTOR * window.devicePixelRatio * MAX_SCALE;
  const maxCardHeight = CARD_HEIGHT * SCALE_FACTOR * window.devicePixelRatio * MAX_SCALE;

  const mainContainerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "20px",
    width: "fit-content",
    margin: "0 auto",
    boxSizing: "border-box",
    backgroundColor: token.colorBgLayout,
    color: token.colorText,
    border: `1px solid ${token.colorBorder}`
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: 500,
    color: token.colorText
  };

  const descriptionStyle: React.CSSProperties = {
    marginBottom: "24px",
    fontSize: "12px",
    color: token.colorTextPlaceholder
  };

  const gridContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 40px",
    gridTemplateRows: "auto 40px",
    gap: "16px",
    margin: "0 auto 24px auto"
  };

  const cardWrapperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    margin: "0 auto",
    position: "relative",
    backgroundColor: token.colorBgLayout
  };

  const cardDashedStyle: React.CSSProperties = {
    borderRadius: "4px",
    position: "relative",
    flexShrink: 0,
    transition: "width 0.1s ease, height 0.1s ease",
    border: `1px dashed ${token.colorPrimary}`
  };

  const baseLabelStyle: React.CSSProperties = {
    position: "absolute",
    right: "0%",
    left: "0%",
    margin: "10px 0",
    fontSize: "11px",
    color: token.colorPrimary,
    fontWeight: 500,
    whiteSpace: "nowrap",
    pointerEvents: "none"
  };

  const verticalStyle = {
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    writingMode: "vertical-rl" as const
  };

  const verticalSliderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    gridArea: "1 / 2 / 2 / 3",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "12px 0",
    height: "100%"
  };

  const horizontalSliderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    gridArea: "2 / 1 / 3 / 2",
    padding: "0 12px",
    width: `${maxCardWidth + 50}px`
  };

  const handleConfirm = async (): Promise<void> => {
    await setCanvasLocalScaleToReal({ x: widthMultiplier, y: heightMultiplier });
    onClose();
  };

  const getIconStyle = (isDisabled: boolean): React.CSSProperties => ({
    color: isDisabled ? token.colorBorderSecondary : token.colorTextDescription,
    fontSize: "16px",
    cursor: isDisabled ? "not-allowed" : "pointer"
  });

  return (
    <div style={mainContainerStyle}>
      <h3 style={titleStyle}>{t("centralPanel.settings.calibrationDialog.title")}</h3>

      <p style={descriptionStyle}>{t("centralPanel.settings.calibrationDialog.instruction")}</p>

      <div style={{ ...gridContainerStyle, width: `${maxCardWidth + 50 + 40 + 16}px` }}>
        <div
          style={{
            ...cardWrapperStyle,
            width: `${maxCardWidth + 50}px`,
            height: `${maxCardHeight + 50}px`
          }}
        >
          <div
            style={{ ...cardDashedStyle, width: `${visualWidth}px`, height: `${visualHeight}px` }}
          >
            <span style={{ ...baseLabelStyle, left: 0, right: 0 }}>
              {CARD_WIDTH} {unitLabel}
            </span>

            <span style={{ ...baseLabelStyle, ...verticalStyle }}>
              {CARD_HEIGHT} {unitLabel}
            </span>
          </div>
        </div>

        <div
          style={{ ...verticalSliderStyle }}
          onMouseEnter={() => setShowHeightTooltip(true)}
          onMouseLeave={() => setShowHeightTooltip(false)}
        >
          <ZoomInOutlined
            style={getIconStyle(heightMultiplier >= MAX_SCALE)}
            onClick={() => {
              if (heightMultiplier < MAX_SCALE) {
                setHeightMultiplier(Number((heightMultiplier + 0.01).toFixed(2)));
              }
            }}
          />
          <Slider
            vertical
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.01}
            value={heightMultiplier}
            onChange={(value) => setHeightMultiplier(value as number)}
            style={{ flex: 1, margin: "12px 0" }}
            tooltip={{
              formatter: (v) =>
                `${t("centralPanel.settings.calibrationDialog.height")}: x${v?.toFixed(2)}`,
              open: showHeightTooltip
            }}
          />
          <ZoomOutOutlined
            style={getIconStyle(heightMultiplier <= MIN_SCALE)}
            onClick={() => {
              if (heightMultiplier > MIN_SCALE) {
                setHeightMultiplier(Number((heightMultiplier - 0.01).toFixed(2)));
              }
            }}
          />
        </div>

        <div
          style={{ ...horizontalSliderStyle }}
          onMouseEnter={() => setShowWidthTooltip(true)}
          onMouseLeave={() => setShowWidthTooltip(false)}
        >
          <ZoomOutOutlined
            style={getIconStyle(widthMultiplier <= MIN_SCALE)}
            onClick={() => {
              if (widthMultiplier > MIN_SCALE) {
                setWidthMultiplier(Number((widthMultiplier - 0.01).toFixed(2)));
              }
            }}
          />
          <Slider
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.01}
            value={widthMultiplier}
            onChange={(value) => setWidthMultiplier(value as number)}
            style={{ flex: 1, margin: 0 }}
            tooltip={{
              formatter: (v) =>
                `${t("centralPanel.settings.calibrationDialog.width")}: x${v?.toFixed(2)}`,
              open: showWidthTooltip
            }}
          />
          <ZoomInOutlined
            style={getIconStyle(widthMultiplier >= MAX_SCALE)}
            onClick={() => {
              if (widthMultiplier < MAX_SCALE) {
                setWidthMultiplier(Number((widthMultiplier + 0.01).toFixed(2)));
              }
            }}
          />
        </div>
      </div>

      <div style={{ width: `${maxCardWidth + 50 + 40 + 16}px`, display: "flex", gap: "12px" }}>
        <Button
          onClick={onClose}
          style={{ flex: 1, border: `2px solid ${token.colorBorderSecondary}` }}
        >
          {t("dialogs.cancel")}
        </Button>
        <Button type="primary" onClick={handleConfirm} style={{ flex: 1 }}>
          {t("dialogs.confirm")}
        </Button>
      </div>
    </div>
  );
};
