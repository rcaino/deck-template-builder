import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs";

const CONFIG_PATH = path.join(app.getPath("userData"), "local-config.json");

const ensureConfigFile = (): void => {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify({ canvasLocalScaleToReal: { x: 1.0, y: 1.0 } }, null, 2)
    );
  }
};

class AppConfigApi {
  static registerAppConfigApiHandlers = (): void => {
    ipcMain.handle("update-local-config", async (_event, config): Promise<{ success: boolean }> => {
      try {
        ensureConfigFile();

        const currentData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

        const updatedData = {
          ...currentData,
          canvasLocalScaleToReal: config.canvasLocalScaleToReal
        };

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
        console.log("Configuración guardada en:", CONFIG_PATH);

        return { success: true };
      } catch (error) {
        console.error("Error al guardar la configuración desde fonts.ts:", error);
        throw error;
      }
    });

    ipcMain.handle(
      "get-local-config",
      async (): Promise<{ canvasLocalScaleToReal: { x: number; y: number } }> => {
        try {
          ensureConfigFile();
          const currentData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

          let scale = currentData.canvasLocalScaleToReal;

          if (typeof scale === "number") {
            scale = { x: scale, y: scale };
          } else if (!scale || typeof scale !== "object") {
            scale = { x: 1.0, y: 1.0 };
          }

          return {
            canvasLocalScaleToReal: scale
          };
        } catch (error) {
          console.error("Error al leer la configuración desde fonts.ts:", error);
          return { canvasLocalScaleToReal: { x: 1.0, y: 1.0 } }; // Fallback seguro
        }
      }
    );
  };
}

export default AppConfigApi;
