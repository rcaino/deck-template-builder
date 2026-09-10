import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs/promises";
import type { IAppConfig } from "../../common/types";

const CONFIG_PATH = path.join(app.getPath("userData"), "local-config.json");
const DEFAULT_CONFIG: Readonly<IAppConfig> = { canvasLocalScaleToReal: { x: 1.0, y: 1.0 } };

const readConfig = async (): Promise<IAppConfig> => {
  try {
    const rawData = await fs.readFile(CONFIG_PATH, "utf-8");
    const data = JSON.parse(rawData) as Partial<IAppConfig>;
    const scale = data?.canvasLocalScaleToReal;

    if (typeof scale === "number") return { canvasLocalScaleToReal: { x: scale, y: scale } };
    if (
      scale &&
      typeof scale === "object" &&
      typeof scale.x === "number" &&
      typeof scale.y === "number"
    ) {
      return { canvasLocalScaleToReal: { x: scale.x, y: scale.y } };
    }
    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
};

class AppConfigApi {
  static registerAppConfigApiHandlers = (): void => {
    ipcMain.handle(
      "update-local-config",
      async (_event, config: Partial<IAppConfig>): Promise<{ success: boolean }> => {
        try {
          const currentData = await readConfig();
          const updatedData: IAppConfig = {
            ...currentData,
            ...config,
            canvasLocalScaleToReal:
              config.canvasLocalScaleToReal ?? currentData.canvasLocalScaleToReal
          };

          await fs.writeFile(CONFIG_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
          return { success: true };
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          console.error("Save config failed:", msg);
          throw error;
        }
      }
    );

    ipcMain.handle("get-local-config", async (): Promise<IAppConfig> => {
      try {
        return await readConfig();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Read config failed:", msg);
        return DEFAULT_CONFIG;
      }
    });
  };
}

export default AppConfigApi;
