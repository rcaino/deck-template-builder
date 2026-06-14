import { create } from "zustand";
import { IFontInfo } from "@common/types";

interface FontStore {
  fonts: IFontInfo[];
  lastUsedFont?: IFontInfo;
  setLastUsedFont: (path: string) => void;
  loadFonts: () => Promise<void>;
}

export const useFontStore = create<FontStore>((set, get) => ({
  fonts: [],
  setLastUsedFont: (path) => {
    set((store) => {
      const luf = store.fonts.find((f) => f.path == path);
      return { lastUsedFont: luf };
    });
  },
  loadFonts: async () => {
    if (get().fonts.length > 0) return;

    const fonts = await window.api.getAvailableFonts();
    set({ fonts });

    const style = document.createElement("style");
    style.id = "global-dynamic-fonts";

    const fontFaces = fonts
      .map((f) => {
        const cleanPath = f.path.replace(/\\/g, "/");
        const rawUrl = `local-font://${cleanPath}`;
        const safeUrl = encodeURI(rawUrl);

        return `@font-face { 
      font-family: "${f.name}"; 
      src: url("${safeUrl}"); 
      font-display: swap; 
    }`;
      })
      .join("\n");

    style.textContent = fontFaces;
    document.head.appendChild(style);
  }
}));
