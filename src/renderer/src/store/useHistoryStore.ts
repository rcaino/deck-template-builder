import { IComponentDefinition } from "@common/types";
import { create } from "zustand";

export type HistoryMutationType = "updateLayer" | "addLayer" | "removeLayer" | "changeOrientation";

export interface HistoryAction {
  id: string;
  type: HistoryMutationType;
  payload: {
    previousValue: IComponentDefinition | null;
    currentValue: IComponentDefinition | null;
  };
  timestamp: number;
}

interface IHistoryStore {
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  recordAction: (
    type: HistoryMutationType,
    id: string,
    previous: IComponentDefinition | null,
    current: IComponentDefinition | null
  ) => void;
  popUndo: () => HistoryAction | null;
  popRedo: () => HistoryAction | null;
  clear: () => void;
}

export const useHistoryStore = create<IHistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],

  recordAction: (type, id, previous, current) => {
    const newAction: HistoryAction = {
      id,
      type,
      payload: { previousValue: previous, currentValue: current },
      timestamp: Date.now()
    };

    set((state) => ({
      undoStack: [...state.undoStack, newAction],
      redoStack: []
    }));
  },

  popUndo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;

    const nextUndoStack = [...undoStack];
    const actionToUndo = nextUndoStack.pop()!;

    set({
      undoStack: nextUndoStack,
      redoStack: [...redoStack, actionToUndo]
    });

    return actionToUndo;
  },

  popRedo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;

    const nextRedoStack = [...redoStack];
    const actionToRedo = nextRedoStack.pop()!;

    set({
      undoStack: [...undoStack, actionToRedo],
      redoStack: nextRedoStack
    });

    return actionToRedo;
  },

  clear: () => {
    set({ undoStack: [], redoStack: [] });
  }
}));
