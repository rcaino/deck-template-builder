import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  nativeImage,
  BrowserWindowConstructorOptions
} from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/card-extension.ico?asset";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  const options: BrowserWindowConstructorOptions = {
    fullscreen: true,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(icon),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      zoomFactor: 1
    }
  };

  mainWindow = new BrowserWindow(options);

  mainWindow.on("ready-to-show", () => {
    mainWindow!.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
