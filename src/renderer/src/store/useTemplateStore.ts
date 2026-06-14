import { Dictionary } from "lodash";
import { create } from "zustand";
import { IComponentDefinition, ILevelLayer } from "@common/types";
import { IRootLayer } from "@common/layerTypes";
import { useHistoryStore } from "./useHistoryStore";
import bgImage from "../assets/default_project_template/card-front-back.png";
import cardBorder from "../assets/default_project_template/card-front-border.png";

interface ITemplateStoreData {
  projectId: string;
  projectName: string;
  isLoading: boolean;
  canvasHeight: number;
  canvasWidth: number;
  canvasPPC: number;
  selectedLayer: string;
  layers: Dictionary<IComponentDefinition>;
}

const DEFAULT_TEMPLATE_STATE: ITemplateStoreData = {
  projectId: "default",
  projectName: "New Project",
  isLoading: false,
  canvasHeight: 1350,
  canvasWidth: 750,
  canvasPPC: 150,
  selectedLayer: "root",
  layers: {
    root: {
      id: "root",
      name: "Root",
      position: { x: 0, y: 0 },
      size: { height: 1350, width: 750 },
      ppc: 150,
      type: "root",
      style: {
        backgroundImage: bgImage,
        border: {
          borderImage: cardBorder,
          borderImageRepeat: "round",
          borderImageSlice: "9% 6%",
          borderWidth: 33,
          borderStyle: "solid"
        }
      }
    }
  }
};

interface ITemplateStore extends ITemplateStoreData {
  setProjectName: (name?: string) => void;
  setCanvasDimensions: (width: number, height: number, ppc: number) => void;
  setLoading: (loading: boolean) => void;
  resetStore: () => void;
  swapXY: (bypassHistory?: boolean) => void;
  upsertLayer: (layer: IComponentDefinition, bypassHistory?: boolean) => void;
  removeLayer: (layerId: string, bypassHistory?: boolean) => void;
  setSelectedLayer: (layerId: string) => void;
  executeUndo: () => void;
  executeRedo: () => void;
  updateLayerPosition: (layerId: string, nextX: number, nextY: number) => void;
}

export const useTemplateStore = create<ITemplateStore>((set, get) => ({
  ...DEFAULT_TEMPLATE_STATE,

  setProjectName: (name) => set({ projectName: name }),
  setCanvasDimensions: (width, height, ppc) =>
    set({ canvasWidth: width, canvasHeight: height, canvasPPC: ppc }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetStore: () => {
    useHistoryStore.getState().clear();
    set({ ...DEFAULT_TEMPLATE_STATE });
  },
  swapXY: (bypassHistory = false) => {
    const state = get();
    const updatedLayers = { ...state.layers };

    Object.keys(updatedLayers).forEach((id) => {
      const layer = updatedLayers[id];

      const newSize = { width: layer.size.height, height: layer.size.width };

      const newPosition =
        layer.type !== "root" ? { x: layer.position.y, y: layer.position.x } : { x: 0, y: 0 };

      updatedLayers[id] = {
        ...layer,
        size: newSize,
        position: newPosition
      } as IComponentDefinition;
    });

    set((state) => ({
      canvasWidth: state.canvasHeight,
      canvasHeight: state.canvasWidth,
      layers: updatedLayers
    }));

    if (!bypassHistory) {
      useHistoryStore.getState().recordAction("changeOrientation", "canvas", null, null);
    }
  },
  setSelectedLayer: (layerId: string) => {
    if (layerId == "" || layerId == null) layerId = "root";
    set({ selectedLayer: layerId });
  },
  upsertLayer: (layer, bypassHistory = false) => {
    if (layer.type == "root") {
      const { size } = layer as IRootLayer;
      get().setCanvasDimensions(size.width, size.height, layer.ppc);
    }

    const dictIndex = layer.id;
    const previous = get().layers[dictIndex] ? { ...get().layers[dictIndex]! } : null;

    set((state) => ({
      layers: {
        ...state.layers,
        [dictIndex]: layer
      }
    }));

    if (!bypassHistory) {
      const actionType = previous ? "updateLayer" : "addLayer";
      useHistoryStore.getState().recordAction(actionType, layer.id, previous, layer);
    }
  },
  removeLayer: (layerId, bypassHistory = false) => {
    if (layerId == "root") return;

    const previous = get().layers[layerId] ? { ...get().layers[layerId]! } : null;
    if (!previous) return;

    set((state) => {
      const newLayers = { ...state.layers };
      const parentId = (newLayers[layerId] as ILevelLayer).parentId;
      delete newLayers[layerId];
      Object.keys(newLayers).forEach((id) => {
        const _layer = newLayers[id] as ILevelLayer;
        if (_layer.parentId == layerId) {
          _layer.parentId = parentId;
        }
      });
      get().setSelectedLayer(parentId);
      return { layers: newLayers };
    });

    if (!bypassHistory) {
      useHistoryStore.getState().recordAction("removeLayer", layerId, previous, null);
    }
  },
  executeUndo: () => {
    const action = useHistoryStore.getState().popUndo();
    if (!action) return;

    const { type, id, payload } = action;

    switch (type) {
      case "addLayer":
        get().removeLayer(id, true);
        break;
      case "updateLayer":
        if (payload.previousValue) get().upsertLayer(payload.previousValue, true);
        break;
      case "removeLayer":
        if (payload.previousValue) get().upsertLayer(payload.previousValue, true);
        break;
      case "changeOrientation":
        get().swapXY(true);
        break;
      default:
        break;
    }
  },
  executeRedo: () => {
    const action = useHistoryStore.getState().popRedo();
    if (!action) return;

    const { type, id, payload } = action;
    switch (type) {
      case "addLayer":
        if (payload.currentValue) get().upsertLayer(payload.currentValue, true);
        break;
      case "updateLayer":
        if (payload.currentValue) get().upsertLayer(payload.currentValue, true);
        break;
      case "removeLayer":
        get().removeLayer(id, true);
        break;
      case "changeOrientation":
        get().swapXY(true);
        break;
      default:
        break;
    }
  },
  updateLayerPosition: (layerId: string, nextX: number, nextY: number) => {
    if (layerId === "root") return;

    const state = get();
    const currentLayer = state.layers[layerId];
    if (!currentLayer) return;

    let parentWidth = state.canvasWidth;
    let parentHeight = state.canvasHeight;

    if (currentLayer.type !== "root") {
      const parentLayer = state.layers[currentLayer.parentId];
      if (parentLayer && parentLayer.type !== "root") {
        parentWidth = parentLayer.size.width;
        parentHeight = parentLayer.size.height;
      }
    }

    const validatedX = Math.max(0, Math.min(nextX, parentWidth - currentLayer.size.width));
    const validatedY = Math.max(0, Math.min(nextY, parentHeight - currentLayer.size.height));
    const updatedLayer = {
      ...currentLayer,
      position: { x: validatedX, y: validatedY }
    } as ILevelLayer;

    // only call updateLayerPosition  (onStop/onDragEnd)
    get().upsertLayer(updatedLayer);
  }
}));
