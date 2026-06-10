import React from "react";
import { ColorPicker } from "antd";
import { converter, formatHex } from "culori";
import { AggregationColor } from "antd/es/color-picker/color";

const toLch = converter("lch");

export interface ISafeColor {
  originalColor: string;
  printSafeColor: string;
}

interface SmartColorPickerProps {
  isForPrint: boolean;
  value?: ISafeColor;
  onChange?: (value: ISafeColor) => void;
}

const getPrintSafeColor = (hex: string): string => {
  const color = toLch(hex);
  if (!color) return hex;

  const MAX_CHROMA = 70;
  const MIN_L = 10;
  const MAX_L = 90;

  const safeColor = {
    ...color,
    l: Math.max(MIN_L, Math.min(color.l, MAX_L)),
    c: Math.min(color.c, MAX_CHROMA)
  };

  if (safeColor.l < 20 && safeColor.c > 30) {
    safeColor.c = 20;
  }

  return formatHex(safeColor);
};

export const SmartColorPicker: React.FC<SmartColorPickerProps> = ({
  isForPrint,
  value,
  onChange
}) => {
  const currentOriginal = value?.originalColor;
  const currentPrintSafe = value?.printSafeColor;

  const handleChange: (colorValue: AggregationColor) => void = (colorValue) => {
    const hexSelected = colorValue.toHexString();
    if (onChange) {
      onChange({
        originalColor: hexSelected,
        printSafeColor: getPrintSafeColor(hexSelected)
      });
    }
  };

  return isForPrint ? (
    <ColorPicker
      value={currentPrintSafe}
      onChangeComplete={handleChange}
      disabledAlpha={true}
      allowClear
    />
  ) : (
    <ColorPicker
      value={currentOriginal}
      onChangeComplete={handleChange}
      disabledAlpha={false}
      allowClear
    />
  );
};
