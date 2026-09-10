import { create } from "zustand";

export interface ScaleObject {
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

const DEFAULT_SCALE: Readonly<ScaleObject> = { x: 1.0, y: 1.0 };

export const useLocalConfigStore = create<LocalConfigState>((set, get) => ({
  canvasLocalScaleToReal: DEFAULT_SCALE,
  isCalibrateModalOpen: false,

  setCanvasLocalScaleToReal: async (value: ScaleObject): Promise<void> => {
    const previousScale = get().canvasLocalScaleToReal;
    set({ canvasLocalScaleToReal: value });

    try {
      await window.api.updateLocalConfig({ canvasLocalScaleToReal: value });
    } catch (error) {
      console.error("[LocalConfig] Update failed:", error);
      set({ canvasLocalScaleToReal: previousScale });
    }
  },

  setIsCalibrateModalOpen: (isOpen: boolean): void => {
    set({ isCalibrateModalOpen: isOpen });
  },

  loadLocalConfig: async (): Promise<void> => {
    try {
      const config = await window.api.getLocalConfig();
      const loadedScale = config?.canvasLocalScaleToReal;

      if (typeof loadedScale === "number") {
        set({ canvasLocalScaleToReal: { x: loadedScale, y: loadedScale } });
      } else if (
        loadedScale !== null &&
        typeof loadedScale === "object" &&
        typeof loadedScale.x === "number" &&
        typeof loadedScale.y === "number"
      ) {
        set({ canvasLocalScaleToReal: loadedScale });
      } else {
        set({ canvasLocalScaleToReal: DEFAULT_SCALE });
      }
    } catch (error) {
      console.error("[LocalConfig] Load failed:", error);
      set({ canvasLocalScaleToReal: DEFAULT_SCALE });
    }
  }
}));
