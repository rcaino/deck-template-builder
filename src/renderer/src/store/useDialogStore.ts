import { create } from "zustand";

export type DialogType =
  | "canvasConfig"
  | "fieldsWizard"
  | "componentDialog"
  | "assetImport"
  | "projectSettings";

interface IDialogStore {
  openDialogs: { [key in DialogType]?: boolean };
  openDialog: (type: DialogType) => void;
  closeDialog: (type: DialogType) => void;
  closeAll: () => void;
  isOpen: (type: DialogType) => boolean;
}

export const useDialogStore = create<IDialogStore>((set, get) => ({
  openDialogs: {},

  openDialog: (type) =>
    set((state) => ({
      openDialogs: { ...state.openDialogs, [type]: true }
    })),

  closeDialog: (type) =>
    set((state) => ({
      openDialogs: { ...state.openDialogs, [type]: false }
    })),

  closeAll: () => set({ openDialogs: {} }),

  isOpen: (type) => get().openDialogs[type] === true
}));
