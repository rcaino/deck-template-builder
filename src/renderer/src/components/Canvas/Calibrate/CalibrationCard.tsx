import React from "react";
import { theme } from "antd";

interface CalibrationCardProps {
  cardWidth: number;
  cardHeight: number;
  visualWidth: number;
  visualHeight: number;
  maxCardWidth: number;
  maxCardHeight: number;
  unitLabel: string;
}

export const CalibrationCard: React.FC<CalibrationCardProps> = ({
  cardWidth,
  cardHeight,
  visualWidth,
  visualHeight,
  maxCardWidth,
  maxCardHeight,
  unitLabel
}) => {
  const { token } = theme.useToken();

  const cardWrapperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    margin: "0 auto",
    position: "relative",
    backgroundColor: token.colorBgLayout,
    width: `${maxCardWidth + 50}px`,
    height: `${maxCardHeight + 50}px`
  };

  const cardDashedStyle: React.CSSProperties = {
    borderRadius: "4px",
    position: "relative",
    flexShrink: 0,
    transition: "width 0.1s ease, height 0.1s ease",
    border: `1px dashed ${token.colorPrimary}`,
    width: `${visualWidth}px`,
    height: `${visualHeight}px`
  };

  const baseLabelStyle: React.CSSProperties = {
    position: "absolute",
    fontSize: "11px",
    color: token.colorPrimary,
    fontWeight: 500,
    whiteSpace: "nowrap",
    pointerEvents: "none"
  };

  const horizontalLabelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    left: 0,
    right: 0,
    top: "10px"
  };

  const verticalLabelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    writingMode: "vertical-rl"
  };

  return (
    <div style={cardWrapperStyle}>
      <div style={cardDashedStyle}>
        <span style={horizontalLabelStyle}>
          {cardWidth} {unitLabel}
        </span>
        <span style={verticalLabelStyle}>
          {cardHeight} {unitLabel}
        </span>
      </div>
    </div>
  );
};
