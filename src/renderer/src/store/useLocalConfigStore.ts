import { create } from "zustand";

interface LocalConfigState {
  canvasLocalScaleToReal: number;
  isCalibrateModalOpen: boolean;
  setCanvasLocalScaleToReal: (value: number) => Promise<void>; // 1. Cambiado a Promise<void>
  setIsCalibrateModalOpen: (isOpen: boolean) => void;
  loadLocalConfig: () => Promise<void>;
}

export const useLocalConfigStore = create<LocalConfigState>((set) => ({
  canvasLocalScaleToReal: 1.0,
  isCalibrateModalOpen: false,

  setCanvasLocalScaleToReal: async (value) => {
    // Primero actualizamos el estado local de Zustand de forma inmediata
    set({ canvasLocalScaleToReal: value });

    try {
      await window.api.updateLocalConfig({ canvasLocalScaleToReal: value });
    } catch (error) {
      console.error("Error al guardar canvasLocalScaleToReal mediante window.api:", error);
    }
  },

  setIsCalibrateModalOpen: (isOpen) => set({ isCalibrateModalOpen: isOpen }),

  loadLocalConfig: async () => {
    try {
      const config = await window.api.getLocalConfig();
      set({ canvasLocalScaleToReal: config.canvasLocalScaleToReal });
    } catch (error) {
      console.error("Error al cargar la configuración inicial:", error);
    }
  }
}));
