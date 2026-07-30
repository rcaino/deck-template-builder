import { app, ipcMain } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { IFontInfo } from "../../common/types";

const CONFIG_PATH = path.join(app.getPath("userData"), "local-config.json");

const FONTS_DIR = app.isPackaged
  ? path.join(process.resourcesPath, "fonts")
  : path.join(__dirname, "../../resources/fonts");

const ensureConfigFile = (): void => {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ canvasLocalScaleToReal: 1.0 }, null, 2));
  }
};

const getSystemFontFiles = (): { name: string; path: string }[] => {
  const platform = os.platform();
  let fontDirs: string[] = [];

  if (platform === "win32") {
    fontDirs = [path.join(process.env.WINDIR || "C:\\Windows", "Fonts")];
  } else if (platform === "darwin") {
    fontDirs = [
      "/Library/Fonts",
      "/System/Library/Fonts",
      path.join(os.homedir(), "Library/Fonts")
    ];
  } else if (platform === "linux") {
    fontDirs = ["/usr/share/fonts", path.join(os.homedir(), ".local/share/fonts")];
  }

  const systemFonts: { name: string; path: string }[] = [];

  fontDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        if (file.endsWith(".ttf") || file.endsWith(".otf")) {
          systemFonts.push({
            name: path.parse(file).name,
            path: path.join(dir, file)
          });
        }
      });
    }
  });

  return systemFonts;
};

class FontApi {
  static registerFontApiHandlers = (): void => {
    // 1. Handler existente de fuentes
    ipcMain.handle("get-available-fonts", async (): Promise<IFontInfo[]> => {
      try {
        const localFiles = fs
          .readdirSync(FONTS_DIR)
          .filter((file) => file.endsWith(".ttf") || file.endsWith(".otf"));

        const localFonts = localFiles.map((file) => ({
          name: path.parse(file).name,
          path: path.join(FONTS_DIR, file)
        }));

        const systemFonts = getSystemFontFiles();
        return [
          ...localFonts.map((f) => ({ ...f, type: "local" })),
          ...systemFonts.map((f) => ({ ...f, type: "system" }))
        ] as IFontInfo[];
      } catch (error) {
        console.error("Font read error:", error);
        return [];
      }
    });

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

    ipcMain.handle("get-local-config", async (): Promise<{ canvasLocalScaleToReal: number }> => {
      try {
        ensureConfigFile();
        const currentData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

        return {
          canvasLocalScaleToReal: currentData.canvasLocalScaleToReal ?? 1.0
        };
      } catch (error) {
        console.error("Error al leer la configuración desde fonts.ts:", error);
        return { canvasLocalScaleToReal: 1.0 }; // Sure Fallback
      }
    });
  };
}

export default FontApi;
