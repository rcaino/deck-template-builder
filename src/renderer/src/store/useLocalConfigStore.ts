import { create } from "zustand";

interface LocalConfigState {
  canvasLocalScaleToReal: number;
  isCalibrateModalOpen: boolean;
  setCanvasLocalScaleToReal: (value: number) => void;
  setIsCalibrateModalOpen: (isOpen: boolean) => void;
}

export const useLocalConfigStore = create<LocalConfigState>((set) => ({
  canvasLocalScaleToReal: 1.0,
  isCalibrateModalOpen: false,
  setCanvasLocalScaleToReal: (value) => set({ canvasLocalScaleToReal: value }),
  setIsCalibrateModalOpen: (isOpen) => set({ isCalibrateModalOpen: isOpen })
}));
