import { useState } from "react";
import { useLocalConfigStore, usePreferencesStore } from "@renderer/store";

export const MAX_SCALE = 1.5;
export const MIN_SCALE = 0.5;

interface UseCalibrationReturn {
  cardWidth: number;
  cardHeight: number;
  unitLabel: string;
  widthMultiplier: number;
  heightMultiplier: number;
  setWidthMultiplier: React.Dispatch<React.SetStateAction<number>>;
  setHeightMultiplier: React.Dispatch<React.SetStateAction<number>>;
  visualWidth: number;
  visualHeight: number;
  maxCardWidth: number;
  maxCardHeight: number;
  saveCalibration: () => Promise<void>;
}

export const useCalibration = (): UseCalibrationReturn => {
  const unit = usePreferencesStore((state) => state.unit);
  const isInch = unit === "in";

  const cardWidth = isInch ? 3.37 : 8.56;
  const cardHeight = isInch ? 2.125 : 5.398;
  const scaleFactor = isInch ? 96 : 96 / 2.54;
  const unitLabel = isInch ? "in" : "cm";

  const canvasLocalScaleToReal = useLocalConfigStore((state) => state.canvasLocalScaleToReal);
  const setCanvasLocalScaleToReal = useLocalConfigStore((state) => state.setCanvasLocalScaleToReal);

  const [widthMultiplier, setWidthMultiplier] = useState<number>(canvasLocalScaleToReal?.x ?? 1.0);
  const [heightMultiplier, setHeightMultiplier] = useState<number>(
    canvasLocalScaleToReal?.y ?? 1.0
  );

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const visualWidth = cardWidth * scaleFactor * dpr * widthMultiplier;
  const visualHeight = cardHeight * scaleFactor * dpr * heightMultiplier;
  const maxCardWidth = cardWidth * scaleFactor * dpr * MAX_SCALE;
  const maxCardHeight = cardHeight * scaleFactor * dpr * MAX_SCALE;

  const saveCalibration = async (): Promise<void> => {
    await setCanvasLocalScaleToReal({ x: widthMultiplier, y: heightMultiplier });
  };

  return {
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
  };
};
