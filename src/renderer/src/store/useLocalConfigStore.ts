import { create } from "zustand";

interface ScaleObject {
  x: number;
  y: number;
}

interface LocalConfigState {
  canvasLocalScaleToReal: ScaleObject;
  isCalibrateModalOpen: boolean;
  setCanvasLocalScaleToReal: (value: ScaleObject) => Promise<void>;
  setIsCalibrateModalOpen: (isOpen: boolean) => void;
  loadLocalConfig: () => Promise<void>;
}

export const useLocalConfigStore = create<LocalConfigState>((set) => ({
  canvasLocalScaleToReal: { x: 1.0, y: 1.0 },
  isCalibrateModalOpen: false,

  setCanvasLocalScaleToReal: async (value) => {
    set({ canvasLocalScaleToReal: value });

    try {
      await window.api.updateLocalConfig({ canvasLocalScaleToReal: value });
    } catch (error) {
      console.error("[LocalConfig] Update failed:", error);
    }
  },

  setIsCalibrateModalOpen: (isOpen) => set({ isCalibrateModalOpen: isOpen }),

  loadLocalConfig: async () => {
    try {
      const config = await window.api.getLocalConfig();

      const loadedScale = config?.canvasLocalScaleToReal;
      if (typeof loadedScale === "number") {
        set({ canvasLocalScaleToReal: { x: loadedScale, y: loadedScale } });
      } else if (loadedScale && typeof loadedScale === "object") {
        set({ canvasLocalScaleToReal: loadedScale });
      } else {
        set({ canvasLocalScaleToReal: { x: 1.0, y: 1.0 } });
      }
    } catch (error) {
      console.error("[LocalConfig] Load failed:", error);
    }
  }
}));
