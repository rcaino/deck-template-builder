import React from "react";
import { theme } from "antd";
import { useI18n } from "../../../hooks/useI18n";
import { ModalActions } from "../../Modal/ModalActions";
import { useCalibration } from "./hooks/useCalibration";
import { CalibrationCard } from "./components/CalibrationCard";
import { ZoomSlider } from "./components/ZoomSlider";

interface CalibrateProps {
  onClose: () => void;
}

export const Calibrate: React.FC<CalibrateProps> = ({ onClose }) => {
  const { token } = theme.useToken();
  const { t } = useI18n();
  const {
    cardWidth,
    cardHeight,
    unitLabel,
    widthMultiplier,
    heightMultiplier,
    setWidthMultiplier,
    setHeightMultiplier,
    visualWidth,
    visualHeight,
    maxCardWidth,
    maxCardHeight,
    saveCalibration
  } = useCalibration();

  const handleConfirm = async (): Promise<void> => {
    await saveCalibration();
    onClose();
  };

  const cardAreaWidth = maxCardWidth + token.marginLG * 2;

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

  const gridContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `${cardAreaWidth}px 40px`,
    gridTemplateRows: "auto 40px",
    gap: "16px",
    margin: "0 auto 24px auto"
  };

  const baseSliderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  };

  const verticalSliderStyle: React.CSSProperties = {
    ...baseSliderStyle,
    gridArea: "1 / 2 / 2 / 3",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "12px 0",
    height: "100%"
  };

  const horizontalSliderStyle: React.CSSProperties = {
    ...baseSliderStyle,
    gridArea: "2 / 1 / 3 / 2",
    padding: "0 12px",
    width: `${cardAreaWidth}px`
  };

  return (
    <div style={mainContainerStyle}>
      <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: 500 }}>
        {t("centralPanel.settings.calibrationDialog.title")}
      </h3>

      <p style={{ marginBottom: "24px", fontSize: "12px", color: token.colorTextPlaceholder }}>
        {t("centralPanel.settings.calibrationDialog.instruction")}
      </p>

      <div style={gridContainerStyle}>
        <CalibrationCard
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          visualWidth={visualWidth}
          visualHeight={visualHeight}
          maxCardWidth={maxCardWidth}
          maxCardHeight={maxCardHeight}
          unitLabel={unitLabel}
        />

        <ZoomSlider
          vertical
          value={heightMultiplier}
          onChange={setHeightMultiplier}
          label={t("centralPanel.settings.calibrationDialog.height")}
          style={verticalSliderStyle}
        />

        <ZoomSlider
          value={widthMultiplier}
          onChange={setWidthMultiplier}
          label={t("centralPanel.settings.calibrationDialog.width")}
          style={horizontalSliderStyle}
        />
      </div>

      <ModalActions
        onCancel={onClose}
        onConfirm={handleConfirm}
        cancelText={t("dialogs.cancel")}
        confirmText={t("dialogs.confirm")}
      />
    </div>
  );
};
