import { app, ipcMain } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { create } from "fontkitten";
import { IFontInfo } from "../../common/types";

const FONTS_DIR = app.isPackaged
  ? path.join(process.resourcesPath, "fonts")
  : path.join(__dirname, "../../resources/fonts");

const validExtensions = new Set([".ttf", ".otf", ".ttc"]);

const checkIsSymbolFont = (buffer: Buffer): boolean => {
  try {
    if (buffer.length < 12) return false;

    const sfntVersion = buffer.toString("hex", 0, 4);
    let numTables = 0;
    let searchOffset = 12;

    // sfntVersion == 74746366 => collection .ttcf:
    if (sfntVersion === "74746366") {
      if (buffer.length < 16) return false;
      const fontOffset = buffer.readUInt32BE(12);
      if (buffer.length < fontOffset + 12) return false;
      numTables = buffer.readUInt16BE(fontOffset + 4);
      searchOffset = fontOffset + 12;
    } else {
      numTables = buffer.readUInt16BE(4);
    }

    let cmapOffset = 0;
    for (let i = 0; i < numTables; i++) {
      const entryOffset = searchOffset + i * 16;
      if (entryOffset + 16 > buffer.length) break;
      const tag = buffer.toString("ascii", entryOffset, entryOffset + 4);
      if (tag === "cmap") {
        cmapOffset = buffer.readUInt32BE(entryOffset + 8);
        break;
      }
    }

    if (cmapOffset === 0 || cmapOffset + 4 > buffer.length) return false;

    const numSubtables = buffer.readUInt16BE(cmapOffset + 2);
    const subtablesOffset = cmapOffset + 4;

    for (let i = 0; i < numSubtables; i++) {
      const subtableEntry = subtablesOffset + i * 8;
      if (subtableEntry + 8 > buffer.length) break;

      const platformID = buffer.readUInt16BE(subtableEntry);
      const encodingID = buffer.readUInt16BE(subtableEntry + 2);

      if (platformID === 3 && encodingID === 0) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
};

const getSystemFontFiles = (): { name: string; path: string }[] => {
  const platform = os.platform();
  let fontDirs: string[] = [];

  if (platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
    fontDirs = [
      path.join(process.env.WINDIR || "C:\\Windows", "Fonts"),
      path.join(localAppData, "Microsoft\\Windows\\Fonts")
    ];
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
        const ext = path.extname(file).toLowerCase();
        if (validExtensions.has(ext)) {
          try {
            const filePath = path.join(dir, file);
            const buffer = fs.readFileSync(filePath);
            const font = create(buffer);
            const fontObj = font.isCollection ? font.fonts[0] : font;

            const name = checkIsSymbolFont(buffer)
              ? path.parse(file).name
              : fontObj.fullName || path.parse(file).name;

            systemFonts.push({
              name,
              path: filePath
            });
          } catch (e) {
            console.warn(`Fail to load font ${file}, ex:`, e);
          }
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
