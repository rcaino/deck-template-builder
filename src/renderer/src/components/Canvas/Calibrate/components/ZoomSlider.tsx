import React, { useState } from "react";
import { Slider, theme } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { MAX_SCALE, MIN_SCALE } from "../hooks/useCalibration";

interface ZoomSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  vertical?: boolean;
  style?: React.CSSProperties;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({
  value,
  onChange,
  label,
  vertical = false,
  style
}) => {
  const { token } = theme.useToken();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const step = 0.01;

  const handleStep = (delta: number): void => {
    const nextValue = Number((value + delta).toFixed(2));
    if (nextValue >= MIN_SCALE && nextValue <= MAX_SCALE) {
      onChange(nextValue);
    }
  };

  const getIconStyle = (isDisabled: boolean): React.CSSProperties => ({
    color: isDisabled ? token.colorBorderSecondary : token.colorTextDescription,
    fontSize: "16px",
    cursor: isDisabled ? "not-allowed" : "pointer"
  });

  const isMin = value <= MIN_SCALE;
  const isMax = value >= MAX_SCALE;

  const zoomOutIcon = (
    <ZoomOutOutlined style={getIconStyle(isMin)} onClick={() => !isMin && handleStep(-step)} />
  );

  const zoomInIcon = (
    <ZoomInOutlined style={getIconStyle(isMax)} onClick={() => !isMax && handleStep(step)} />
  );

  return (
    <div
      style={style}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {vertical ? zoomInIcon : zoomOutIcon}

      <Slider
        vertical={vertical}
        min={MIN_SCALE}
        max={MAX_SCALE}
        step={step}
        value={value}
        onChange={(val: number) => onChange(val)}
        style={{ flex: 1, margin: vertical ? "12px 0" : 0 }}
        tooltip={{
          formatter: (v?: number) => `${label}: x${v?.toFixed(2) ?? "1.00"}`,
          open: showTooltip
        }}
      />

      {vertical ? zoomOutIcon : zoomInIcon}
    </div>
  );
};
