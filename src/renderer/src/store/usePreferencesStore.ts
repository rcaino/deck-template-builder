import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MeasurementUnit = "cm" | "in";

interface PreferencesState {
  unit: MeasurementUnit;
  setUnit: (unit: MeasurementUnit) => void;
}

const DEFAULT_UNIT: MeasurementUnit = "cm";

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      unit: DEFAULT_UNIT,

      setUnit: (unit: MeasurementUnit): void => {
        set({ unit });
      }
    }),
    {
      name: "user-preferences"
    }
  )
);
