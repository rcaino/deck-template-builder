import { ElectronAPI } from "@electron-toolkit/preload";
import type { FontInfo } from "@common/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAvailableFonts: () => Promise<FontInfo[]>;
      // 👇 Actualizado de 'number' a un objeto con coordenadas X e Y
      updateLocalConfig: (config: {
        canvasLocalScaleToReal: { x: number; y: number };
      }) => Promise<void>;
      getLocalConfig: () => Promise<{ canvasLocalScaleToReal: { x: number; y: number } }>;
    };
  }
}
