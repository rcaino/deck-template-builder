import { app, ipcMain } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { IFontInfo } from "../../common/types";

const FONTS_DIR = app.isPackaged
  ? path.join(process.resourcesPath, "fonts")
  : path.join(__dirname, "../../resources/fonts");

const getSystemFontFiles = (): { name: string; path: string }[] => {
  const platform = os.platform();
  let fontDirs: string[] = [];

  if (platform === "win32") {
    fontDirs = [path.join(process.env.WINDIR || "C:\\Windows", "Fonts")];
  } else if (platform === "darwin") {
    // macOS
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
  };
}

export default FontApi;
