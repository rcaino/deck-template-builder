import { create } from "zustand";

interface ScaleObject {
  x: number;
  y: number;
}

interface LocalConfigState {
  // 1. Cambiado de number a ScaleObject
  canvasLocalScaleToReal: ScaleObject;
  isCalibrateModalOpen: boolean;
  // 2. Cambiado el argumento de number a ScaleObject
  setCanvasLocalScaleToReal: (value: ScaleObject) => Promise<void>;
  setIsCalibrateModalOpen: (isOpen: boolean) => void;
  loadLocalConfig: () => Promise<void>;
}

export const useLocalConfigStore = create<LocalConfigState>((set) => ({
  // Valor inicial por defecto para ambos ejes
  canvasLocalScaleToReal: { x: 1.0, y: 1.0 },
  isCalibrateModalOpen: false,

  setCanvasLocalScaleToReal: async (value) => {
    // Actualizamos el estado local en Zustand
    set({ canvasLocalScaleToReal: value });

    try {
      // Guardamos el objeto mediante tu API de Electron / Backend
      await window.api.updateLocalConfig({ canvasLocalScaleToReal: value });
    } catch (error) {
      console.error("Error al guardar canvasLocalScaleToReal mediante window.api:", error);
    }
  },

  setIsCalibrateModalOpen: (isOpen) => set({ isCalibrateModalOpen: isOpen }),

  loadLocalConfig: async () => {
    try {
      const config = await window.api.getLocalConfig();

      // Controlamos si la config vieja traía un número o si ya trae el nuevo formato de objeto
      const loadedScale = config?.canvasLocalScaleToReal;
      if (typeof loadedScale === "number") {
        set({ canvasLocalScaleToReal: { x: loadedScale, y: loadedScale } });
      } else if (loadedScale && typeof loadedScale === "object") {
        set({ canvasLocalScaleToReal: loadedScale });
      } else {
        set({ canvasLocalScaleToReal: { x: 1.0, y: 1.0 } });
      }
    } catch (error) {
      console.error("Error al cargar la configuración inicial:", error);
    }
  }
}));
