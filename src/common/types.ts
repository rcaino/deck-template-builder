import type { CSSProperties } from "react";
import type { IAreaLayer, IDataLayer, IRootLayer } from "./layerTypes";

export const GRID_SNAP = 10;

export type DataType = "text" | "numeric" | "image" | "sprite";
export type IComponentDefinition = IRootLayer | IAreaLayer | IDataLayer;
export type ILevelLayer = IAreaLayer | IDataLayer;

export interface IComponentStyle {
  backgroundImage?: CSSProperties["backgroundImage"];
  backgroundColor?: CSSProperties["backgroundColor"];
  borderConfig?:
    | {
        borderWidth: number;
        borderStyle: CSSProperties["borderStyle"];
        borderColor: CSSProperties["borderColor"];
        borderImage?: never;
        borderImageSlice: never;
        borderImageRepeat: never;
      }
    | {
        borderStyle: "solid";
        borderWidth: number;
        borderImage: CSSProperties["borderImage"];
        borderImageSlice: CSSProperties["borderImageSlice"];
        borderImageRepeat: "round";
        borderColor?: never;
      };
}

export interface ICardProject {
  id: string;
  name: string;
  components: IComponentDefinition[];
}

export type FontType = "local" | "system";

export interface IFontInfo {
  name: string;
  path: string;
  type: FontType;
}

export interface IVector2D {
  x: number;
  y: number;
}

export interface IAppConfig {
  canvasLocalScaleToReal: IVector2D;
}
