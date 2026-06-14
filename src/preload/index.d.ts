import { ElectronAPI } from "@electron-toolkit/preload";
import type { FontInfo } from "@common/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAvailableFonts: () => Promise<FontInfo[]>;
    };
  }
}
