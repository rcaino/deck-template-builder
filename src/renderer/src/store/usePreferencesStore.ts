import { create } from "zustand";

export type MeasurementUnit = "cm" | "in";

interface PreferencesState {
  unit: MeasurementUnit;
  setUnit: (unit: MeasurementUnit) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  unit: "cm",
  setUnit: (unit) => set({ unit })
}));
