import { ElectronAPI } from "@electron-toolkit/preload";
import type { IFontInfo, IAppConfig } from "@common/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAvailableFonts: () => Promise<IFontInfo[]>;
      updateLocalConfig: (config: Partial<IAppConfig>) => Promise<void>;
      getLocalConfig: () => Promise<IAppConfig>;
    };
  }
}
